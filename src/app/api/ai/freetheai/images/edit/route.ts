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

  const form = await req.formData().catch(() => null);
  if (!form) {
    return Response.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const image = form.get("image");
  const prompt = form.get("prompt");
  const model = form.get("model");

  if (!(image instanceof Blob) || typeof prompt !== "string" || !prompt.trim()) {
    return Response.json({ error: "image and prompt are required" }, { status: 400 });
  }

  const upstreamForm = new FormData();
  upstreamForm.set("image", image, "image.png");
  upstreamForm.set("prompt", prompt);
  upstreamForm.set("model", typeof model === "string" && model ? model : DEFAULT_MODEL);

  const res = await fetch("https://api.freetheai.xyz/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: upstreamForm,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `FreeTheAi image edit error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const json = await res.json();
  const result = json.data?.[0];
  const imageUrl = result?.url
    ? result.url
    : result?.b64_json
      ? `data:image/png;base64,${result.b64_json}`
      : null;

  if (!imageUrl) {
    return Response.json({ error: "No image returned" }, { status: 502 });
  }

  return Response.json({ imageUrl });
}
