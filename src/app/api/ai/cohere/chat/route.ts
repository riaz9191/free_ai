import { NextRequest } from "next/server";

export const runtime = "nodejs";

const COHERE_URL = "https://api.cohere.com/v2/chat";
const DEFAULT_MODEL = "command-a-03-2025";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string | ContentPart[];
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.COHERE_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing COHERE_API_KEY. Add it to .env.local — see the setup instructions on /ai/cohere.",
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
      ? Math.min(2, Math.max(0, body.temperature))
      : undefined;

  const upstream = await fetch(COHERE_URL, {
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
    let friendly = `Cohere API error (${upstream.status})`;
    if (upstream.status === 401) friendly = "Invalid COHERE_API_KEY — check the key in .env.local.";
    if (upstream.status === 429) friendly = "Rate limited by Cohere — wait a moment and try again.";
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
