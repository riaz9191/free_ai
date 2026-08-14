import { NextRequest } from "next/server";

export const runtime = "nodejs";

const GROQ_TRANSCRIBE_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

function isAuthorized(req: NextRequest): boolean {
  const required = process.env.MYAI_ACCESS_CODE;
  if (!required) return true;
  return req.headers.get("x-access-code") === required;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Invalid or missing access code." }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Missing GROQ_API_KEY. Add it to your environment variables." },
      { status: 500 }
    );
  }

  const incomingForm = await req.formData().catch(() => null);
  const audio = incomingForm?.get("audio");
  if (!audio || !(audio instanceof Blob)) {
    return Response.json({ error: "audio file is required" }, { status: 400 });
  }

  const upstreamForm = new FormData();
  upstreamForm.append("file", audio, "audio.webm");
  upstreamForm.append("model", "whisper-large-v3-turbo");
  upstreamForm.append("response_format", "json");

  const upstream = await fetch(GROQ_TRANSCRIBE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: upstreamForm,
    signal: req.signal,
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      { error: `Groq transcription error (${upstream.status})`, detail: text.slice(0, 500) },
      { status: upstream.status || 502 }
    );
  }

  const data = await upstream.json();
  return Response.json({ text: data.text || "" });
}
