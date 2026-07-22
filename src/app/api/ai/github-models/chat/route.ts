import { NextRequest } from "next/server";

export const runtime = "nodejs";

const GITHUB_MODELS_URL = "https://models.github.ai/inference/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4.1-mini";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

function friendlyError(status: number, rawBody: string): string {
  if (status === 429 || /too many requests/i.test(rawBody)) {
    return "Rate limited by GitHub Models' free tier — wait a moment and try again, or enable paid usage for higher limits.";
  }
  if (status === 401 || status === 403) {
    return "GitHub rejected the token. Check GITHUB_MODELS_TOKEN in .env.local has models:read permission.";
  }
  let upstreamMessage = "";
  try {
    upstreamMessage = JSON.parse(rawBody)?.error?.message || "";
  } catch {
    // rawBody wasn't JSON
  }
  return upstreamMessage || `GitHub Models API error (${status})`;
}

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_MODELS_TOKEN;

  if (!token) {
    return Response.json(
      {
        error:
          "Missing GITHUB_MODELS_TOKEN. Add it to .env.local — see the setup instructions on /ai/github-models.",
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

  const upstream = await fetch(GITHUB_MODELS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
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
    return Response.json(
      { error: friendlyError(upstream.status, text), detail: text.slice(0, 500) },
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
