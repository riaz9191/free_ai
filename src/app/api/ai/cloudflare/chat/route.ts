import { NextRequest } from "next/server";

export const runtime = "nodejs";

const DEFAULT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiKey || !accountId) {
    return Response.json(
      {
        error:
          "Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID. Add both to .env.local — see the setup instructions on /ai/cloudflare.",
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

  const upstream = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1/chat/completions`,
    {
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
    }
  );

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    let friendly = `Cloudflare Workers AI error (${upstream.status})`;
    if (upstream.status === 401 || upstream.status === 403)
      friendly = "Invalid CLOUDFLARE_API_TOKEN or account ID — check .env.local.";
    if (upstream.status === 429) friendly = "Rate limited by Cloudflare — wait a moment and try again.";
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
