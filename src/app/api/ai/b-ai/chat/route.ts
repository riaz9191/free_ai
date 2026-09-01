import { NextRequest } from "next/server";

export const runtime = "nodejs";

const B_AI_URL = "https://api.b.ai/v1/chat/completions";
const DEFAULT_MODEL = "deepseek-v4-flash";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.B_AI_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing B_AI_API_KEY. Add it to .env.local — see the setup instructions on /ai/b-ai.",
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

  const upstream = await fetch(B_AI_URL, {
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
    let friendly = `B.AI API error (${upstream.status})`;
    if (upstream.status === 401) friendly = "Invalid B_AI_API_KEY — check the key in .env.local.";
    if (upstream.status === 429) friendly = "Rate limited by B.AI — wait a moment and try again.";
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
