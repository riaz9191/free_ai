import { NextRequest } from "next/server";

export const runtime = "nodejs";

const CHAT_URL = "https://api.morphllm.com/v1/chat/completions";
const REFLEX_URL = "https://api.morphllm.com/v1/reflex/predict";
const ROUTER_URL = "https://api.morphllm.com/v1/router/classify";
const DEFAULT_MODEL = "morph-qwen36-27b";

// Router's /classify only returns a difficulty/domain classification, not a
// callable model id (its multimodel recommendation can point at models we
// don't have access to, e.g. Claude/GPT — Morph's router is provider-agnostic
// advisory, not scoped to Morph's own catalog). So "Auto" maps difficulty to
// one of our own hosted models ourselves instead of trusting an external name.
const DIFFICULTY_TO_MODEL: Record<string, string> = {
  easy: "morph-dsv4flash",
  medium: "morph-qwen36-27b",
  hard: "morph-glm52-744b",
  needs_info: "morph-qwen36-27b",
};

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.MORPH_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing MORPH_API_KEY. Add it to .env.local — see the setup instructions on /ai/morph.",
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

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  // Reflex jailbreak pre-check — scoped to Morph only (not retrofitted onto
  // the other providers) since it's the concrete live demo of the product.
  if (lastUserMessage?.content) {
    try {
      const reflexRes = await fetch(REFLEX_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "jailbreak", text: lastUserMessage.content }),
      });
      if (reflexRes.ok) {
        const reflex = await reflexRes.json();
        const flagged = reflex.classes?.find(
          (c: { label: string; selected: boolean }) =>
            c.label === "jailbreak" && c.selected
        );
        if (flagged) {
          return Response.json(
            {
              error:
                "Message blocked — flagged as a possible jailbreak attempt by Morph's Reflex classifier.",
            },
            { status: 400 }
          );
        }
      }
    } catch {
      // Reflex is a safety add-on, not a hard dependency — fail open if it errors.
    }
  }

  let model = body.model || DEFAULT_MODEL;
  let routedModel: string | null = null;

  if (model === "morph-auto" && lastUserMessage?.content) {
    try {
      const routerRes = await fetch(ROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: lastUserMessage.content }),
      });
      if (routerRes.ok) {
        const router = await routerRes.json();
        const difficulty = router.classifications?.difficulty?.label;
        routedModel = DIFFICULTY_TO_MODEL[difficulty] || DEFAULT_MODEL;
      }
    } catch {
      // fall through to default below
    }
    model = routedModel || DEFAULT_MODEL;
  }

  const fullMessages: ChatMessage[] = body.system?.trim()
    ? [{ role: "system", content: body.system.trim() }, ...messages]
    : messages;

  const temperature =
    typeof body.temperature === "number"
      ? Math.min(2, Math.max(0, body.temperature))
      : undefined;

  const upstream = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: fullMessages,
      temperature,
      stream: true,
    }),
    signal: req.signal,
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    let apiMessage = "";
    try {
      const parsed = JSON.parse(text);
      apiMessage = parsed?.detail || parsed?.error?.message || "";
    } catch {
      apiMessage = text.slice(0, 300);
    }
    if (upstream.status === 401) {
      apiMessage = `Invalid MORPH_API_KEY. ${apiMessage}`.trim();
    } else if (upstream.status === 429) {
      apiMessage = `Rate limited by Morph. ${apiMessage}`.trim();
    }
    return Response.json(
      {
        error: apiMessage || `Morph API error (${upstream.status})`,
        detail: text.slice(0, 500),
      },
      { status: upstream.status || 502 }
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...(routedModel ? { "X-Morph-Routed-Model": routedModel } : {}),
    },
  });
}
