export const runtime = "nodejs";

const DEFAULT_MODEL = "eve/gpt-image-2";

export async function POST(req: Request) {
  const apiKey = process.env.FREETHEAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Missing FREETHEAI_API_KEY. Add it to .env.local." },
      { status: 500 }
    );
  }

  let body: { prompt?: string; model?: string; size?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const res = await fetch("https://api.freetheai.xyz/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: body.model || DEFAULT_MODEL,
      prompt,
      size: body.size || "1024x1024",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `FreeTheAi image error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const json = await res.json();
  const image = json.data?.[0];
  const imageUrl = image?.url
    ? image.url
    : image?.b64_json
      ? `data:image/png;base64,${image.b64_json}`
      : null;

  if (!imageUrl) {
    return Response.json({ error: "No image returned" }, { status: 502 });
  }

  return Response.json({ imageUrl });
}
