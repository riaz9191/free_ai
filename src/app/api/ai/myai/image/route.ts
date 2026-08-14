import { NextRequest } from "next/server";

export const runtime = "nodejs";

const POLLINATIONS_IMAGE_URL = "https://image.pollinations.ai/prompt";

function isAuthorized(req: NextRequest): boolean {
  const required = process.env.MYAI_ACCESS_CODE;
  if (!required) return true;
  return req.headers.get("x-access-code") === required;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Invalid or missing access code." }, { status: 401 });
  }

  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Missing POLLINATIONS_API_KEY. Add it to your environment variables." },
      { status: 500 }
    );
  }

  let body: { prompt?: string; width?: number; height?: number; model?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const width = Math.min(1536, Math.max(256, body.width || 1024));
  const height = Math.min(1536, Math.max(256, body.height || 1024));
  const model = body.model || "flux";
  const seed = Math.floor(Math.random() * 1_000_000);

  const url =
    `${POLLINATIONS_IMAGE_URL}/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&model=${encodeURIComponent(model)}&seed=${seed}&nologo=true`;

  const upstream = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: req.signal,
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      { error: `Pollinations API error (${upstream.status})`, detail: text.slice(0, 500) },
      { status: upstream.status || 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await upstream.arrayBuffer());
  const dataUrl = `data:${contentType};base64,${buffer.toString("base64")}`;

  return Response.json({ imageUrl: dataUrl, prompt });
}
