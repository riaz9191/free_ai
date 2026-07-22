import { NextRequest } from "next/server";

export const runtime = "nodejs";

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const DEFAULT_MODEL = "mistral-small-latest";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing MISTRAL_API_KEY. Add it to .env.local — see the setup instructions on /ai/mistral.",
      },
      { status: 500 }
    );
  }

  let body: {
    messages?: ChatMessage[];
    model?: string;
    temperature?: number;
    system?: string;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }

  const fullMessages: ChatMessage[] = body.system?.trim()
    ? [{ role: "system", content: body.system.trim() }, ...messages]
    : messages;

  const temperature =
    typeof body.temperature === "number"
      ? Math.min(1.5, Math.max(0, body.temperature))
      : undefined;

  const upstream = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: body.model || DEFAULT_MODEL,
      messages: fullMessages,
      temperature,
      stream: true,
    }),
    signal: req.signal,
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    let friendly = `Mistral API error (${upstream.status})`;
    if (upstream.status === 401) friendly = "Invalid MISTRAL_API_KEY — check the key in .env.local.";
    if (upstream.status === 429) friendly = "Rate limited by Mistral — wait a moment and try again.";
    return Response.json(
      { error: friendly, detail: text.slice(0, 500) },
      { status: upstream.status || 502 }
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
