export const runtime = "nodejs";

const DEFAULT_MODEL = "mim/mimo-v2.5-tts";

export async function POST(req: Request) {
  const apiKey = process.env.FREETHEAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Missing FREETHEAI_API_KEY. Add it to .env.local." },
      { status: 500 }
    );
  }

  let body: { input?: string; model?: string; voice?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = body.input?.trim();
  if (!input) {
    return Response.json({ error: "input text is required" }, { status: 400 });
  }

  const res = await fetch("https://api.freetheai.xyz/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: body.model || DEFAULT_MODEL,
      input,
      voice: body.voice || "default",
      response_format: "mp3",
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `FreeTheAi speech error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status || 502 }
    );
  }

  return new Response(res.body, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
