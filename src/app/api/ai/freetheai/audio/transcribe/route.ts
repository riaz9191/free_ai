export const runtime = "nodejs";

const DEFAULT_MODEL = "mim/mimo-v2.5-asr";

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

  const file = form.get("file");
  const model = form.get("model");

  if (!(file instanceof Blob)) {
    return Response.json({ error: "audio file is required" }, { status: 400 });
  }

  const upstreamForm = new FormData();
  upstreamForm.set("file", file, "audio.webm");
  upstreamForm.set("model", typeof model === "string" && model ? model : DEFAULT_MODEL);
  upstreamForm.set("response_format", "json");

  const res = await fetch("https://api.freetheai.xyz/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: upstreamForm,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `FreeTheAi transcription error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const json = await res.json();
  return Response.json({ text: json.text || "" });
}
