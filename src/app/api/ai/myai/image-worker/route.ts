import { NextRequest } from "next/server";

export const runtime = "nodejs";

function isAuthorized(req: NextRequest): boolean {
  const required = process.env.MYAI_ACCESS_CODE;
  if (!required) return true;
  return req.headers.get("x-access-code") === required;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Invalid or missing access code." }, { status: 401 });
  }

  const workerUrl = process.env.IMAGE_WORKER_URL;
  if (!workerUrl) {
    return Response.json(
      { error: "Missing IMAGE_WORKER_URL. Add it to your environment variables." },
      { status: 500 }
    );
  }
  const workerApiKey = process.env.IMAGE_WORKER_API_KEY ?? "";

  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const upstream = await fetch(workerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(workerApiKey ? { Authorization: `Bearer ${workerApiKey}` } : {}),
    },
    body: JSON.stringify({ prompt }),
    signal: req.signal,
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    const message =
      upstream.status === 429
        ? "Image generation is rate-limited right now — wait a few seconds and try again."
        : `Image worker error (${upstream.status})`;
    return Response.json({ error: message, detail: text.slice(0, 500) }, { status: upstream.status || 502 });
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await upstream.arrayBuffer());
  const dataUrl = `data:${contentType};base64,${buffer.toString("base64")}`;

  return Response.json({ imageUrl: dataUrl, prompt });
}
