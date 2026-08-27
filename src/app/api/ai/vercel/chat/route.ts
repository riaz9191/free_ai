import { NextRequest } from "next/server";
import { streamText } from "ai";

export const runtime = "nodejs";
const DEFAULT_MODEL = "openai/gpt-4o-mini";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return Response.json(
      {
        error:
          "Missing AI_GATEWAY_API_KEY. Add it to .env.local — see the setup instructions on /ai/gateway.",
      },
      { status: 500 }
    );
  }

  let body: { messages?: ChatMessage[]; model?: string; system?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }

  const result = streamText({
    model: body.model || DEFAULT_MODEL,
    system: body.system?.trim() || undefined,
    messages,
    abortSignal: req.signal,
    onError: ({ error }) => {
      console.error("AI Gateway stream error:", error);
    },
  });

  return result.toTextStreamResponse();
}
