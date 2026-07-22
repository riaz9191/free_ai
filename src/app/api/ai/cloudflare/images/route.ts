import { NextRequest } from "next/server";

export const runtime = "nodejs";

const DEFAULT_MODEL = "@cf/black-forest-labs/flux-1-schnell";

export async function POST(req: NextRequest) {
  const apiKey = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!apiKey || !accountId) {
    return Response.json(
      { error: "Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID" },
      { status: 500 }
    );
  }

  let body: { prompt?: string; model?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const model = body.model || DEFAULT_MODEL;

  const upstream = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      signal: req.signal,
    }
  );

  const contentType = upstream.headers.get("content-type") || "";

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    let apiMessage = "";
    try {
      apiMessage = JSON.parse(text)?.errors?.[0]?.message || "";
    } catch {
      apiMessage = text.slice(0, 300);
    }
    if (upstream.status === 401 || upstream.status === 403) {
      apiMessage = `Invalid CLOUDFLARE_API_TOKEN or account ID. ${apiMessage}`.trim();
    } else if (upstream.status === 429) {
      apiMessage = `Rate limited by Cloudflare. ${apiMessage}`.trim();
    }
    return Response.json(
      {
        error: apiMessage || `Cloudflare Workers AI error (${upstream.status})`,
        detail: text.slice(0, 500),
      },
      { status: upstream.status || 502 }
    );
  }

  // Some models (SDXL, Dreamshaper) return raw image/png bytes; others
  // (Flux) return { result: { image: <base64 no prefix> } } JSON.
  if (contentType.includes("application/json")) {
    const data = await upstream.json();
    const b64 = data.result?.image;
    if (!b64) {
      return Response.json({ error: "No image returned by model" }, { status: 502 });
    }
    return Response.json({ imageUrl: `data:image/jpeg;base64,${b64}` });
  }

  const buffer = Buffer.from(await upstream.arrayBuffer());
  const b64 = buffer.toString("base64");
  return Response.json({ imageUrl: `data:image/png;base64,${b64}` });
}
