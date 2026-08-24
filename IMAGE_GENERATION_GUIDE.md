# Image Generation in MyAI — Full Guide

`/myai` supports two independent image-generation backends behind the same
chat UI: **Pollinations** and a **Cloudflare Worker**. Both are wired up the
same way — a gated Next.js API route that proxies the request server-side
(so API keys never reach the browser) and returns the image as a base64
data URL, which the chat renders inline.

This doc covers both, plus how to lift this into another project.

## How it fits together

```
User types a prompt
        ↓
classify(text) detects image intent  (or user explicitly picks
        ↓                             "Image Generation" from the model picker)
sendMessage() sees category === "image"
        ↓
generateImage(prompt, endpoint) → POST to the model's imageEndpoint
        ↓
API route proxies to the real image provider (server-side, key hidden)
        ↓
Route returns { imageUrl: "data:image/jpeg;base64,..." }
        ↓
Chat renders <img src={imageUrl} />
```

Two `ModelOption` entries share `category: "image"` but point at different
`imageEndpoint` values — everything else (routing, rendering, error
handling) is shared code.

---

## Provider 1: Pollinations

**Get a key**: [enter.pollinations.ai](https://enter.pollinations.ai/keys) →
generates an `sk_...` secret key (backend-only, never expose to the browser).

```bash
POLLINATIONS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Route** — `src/app/api/ai/myai/image/route.ts`:
```ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const POLLINATIONS_IMAGE_URL = "https://image.pollinations.ai/prompt";

function isAuthorized(req: NextRequest): boolean {
  const required = process.env.MYAI_ACCESS_CODE;
  if (!required) return true;
  return req.headers.get("x-access-code") === required;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Invalid or missing access code." }, { status: 401 });
  }

  const apiKey = process.env.POLLINATIONS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Missing POLLINATIONS_API_KEY. Add it to your environment variables." },
      { status: 500 }
    );
  }

  let body: { prompt?: string; width?: number; height?: number; model?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const width = Math.min(1536, Math.max(256, body.width || 1024));
  const height = Math.min(1536, Math.max(256, body.height || 1024));
  const model = body.model || "flux";
  const seed = Math.floor(Math.random() * 1_000_000);

  const url =
    `${POLLINATIONS_IMAGE_URL}/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&model=${encodeURIComponent(model)}&seed=${seed}&nologo=true`;

  const upstream = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: req.signal,
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    const message =
      upstream.status === 429
        ? "Image generation is rate-limited right now — wait a few seconds and try again."
        : `Pollinations API error (${upstream.status})`;
    return Response.json({ error: message, detail: text.slice(0, 500) }, { status: upstream.status || 502 });
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await upstream.arrayBuffer());
  const dataUrl = `data:${contentType};base64,${buffer.toString("base64")}`;

  return Response.json({ imageUrl: dataUrl, prompt });
}
```

**Note on auth**: Pollinations supports two methods — a `Bearer` token header
for backend calls (what we use here) or a `referrer=yourdomain.com` query
param for direct browser `<img>` embedding. Since we hold a secret `sk_` key,
we proxy server-side rather than ever putting it in a browser-facing URL.

---

## Provider 2: Cloudflare Worker (self-hosted / custom backend)

This is for when you're running your own image-generation backend — a
Cloudflare Worker, or any HTTP service that takes `{ prompt }` and returns
raw image bytes.

```bash
IMAGE_WORKER_URL=https://your-worker.your-subdomain.workers.dev/
IMAGE_WORKER_API_KEY=your-worker-secret
```

**Route** — `src/app/api/ai/myai/image-worker/route.ts`:
```ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";

function isAuthorized(req: NextRequest): boolean {
  const required = process.env.MYAI_ACCESS_CODE;
  if (!required) return true;
  return req.headers.get("x-access-code") === required;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Invalid or missing access code." }, { status: 401 });
  }

  const workerUrl = process.env.IMAGE_WORKER_URL;
  if (!workerUrl) {
    return Response.json(
      { error: "Missing IMAGE_WORKER_URL. Add it to your environment variables." },
      { status: 500 }
    );
  }
  const workerApiKey = process.env.IMAGE_WORKER_API_KEY ?? "";

  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const upstream = await fetch(workerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(workerApiKey ? { Authorization: `Bearer ${workerApiKey}` } : {}),
    },
    body: JSON.stringify({ prompt }),
    signal: req.signal,
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    const message =
      upstream.status === 429
        ? "Image generation is rate-limited right now — wait a few seconds and try again."
        : `Image worker error (${upstream.status})`;
    return Response.json({ error: message, detail: text.slice(0, 500) }, { status: upstream.status || 502 });
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await upstream.arrayBuffer());
  const dataUrl = `data:${contentType};base64,${buffer.toString("base64")}`;

  return Response.json({ imageUrl: dataUrl, prompt });
}
```

Notice this route is nearly identical to the Pollinations one — the only
real differences are the upstream URL and how the auth header is built.
Any HTTP image-generation backend that accepts `POST { prompt }` and returns
raw image bytes drops into this same shape.

---

## Client side — shared by both providers

**Model catalog entries** (each points at its own route):
```ts
type ModelOption = {
  id: string;
  label: string;
  tag: string;
  group: string;
  category: "image" | /* ...other categories... */ string;
  icon: /* lucide icon */ unknown;
  imageEndpoint?: string;
};

const MODELS: ModelOption[] = [
  // ...chat models...
  {
    id: "pollinations/image",
    label: "Image Generation",
    tag: "Text-to-image",
    group: "Image",
    category: "image",
    icon: ImageIcon,
    imageEndpoint: "/api/ai/myai/image",
  },
  {
    id: "worker/image",
    label: "Image Generation (Alt)",
    tag: "Text-to-image (alt)",
    group: "Image",
    category: "image",
    icon: ImageIcon,
    imageEndpoint: "/api/ai/myai/image-worker",
  },
];
```

**Generation call**:
```ts
async function generateImage(
  prompt: string,
  signal: AbortSignal,
  accessCode: string,
  endpoint: string
): Promise<string> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-access-code": accessCode },
    body: JSON.stringify({ prompt }),
    signal,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Image generation failed (${res.status})`);
  return data.imageUrl as string;
}
```

**Branching in the send-message flow** — check `category`, not a specific ID,
so adding a third provider later is just another `MODELS` entry:
```ts
if (modelOption.category === "image") {
  const imageUrl = await generateImage(
    text,
    controller.signal,
    accessCode,
    modelOption.imageEndpoint || "/api/ai/myai/image"
  );
  // ...update the message with { imageUrl } instead of streamed text content
} else {
  // ...existing chat streaming path
}
```

**Rendering**:
```tsx
{message.imageUrl ? (
  <img src={message.imageUrl} alt={userPrompt} className="max-w-full rounded-lg" />
) : (
  // ...normal markdown/text content
)}
```

---

## Auto-routing: detecting "the user wants an image"

A keyword-based classifier decides when to route a message to image
generation automatically, checked with the *highest* priority (before
coding/reasoning/etc. categories) so an explicit image request always wins:

```ts
const IMAGE_GEN_WORDS = [
  "generate an image", "generate a picture", "generate art",
  "draw", "paint", "create an image", "create a picture", "make an image",
  "make a picture", "image of", "picture of", "photo of", "illustration of",
  "text to image", "text-to-image", "render an image", "generate a photo",
  "generate a logo", "design a logo", "create a logo", "wallpaper of",
];

function classify(text: string): Category {
  const t = text.toLowerCase();
  const score = (words: string[]) => words.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
  if (score(IMAGE_GEN_WORDS) > 0) return "image";
  // ...other category checks (coding, reasoning, agentic, etc.)
}

function pickModel(text: string): ModelOption {
  const category = classify(text);
  const candidates = MODELS.filter((m) => m.category === category);
  return candidates[0] ?? DEFAULT_MODEL; // first match = default provider for that category
}
```

Since both image entries share `category: "image"`, `pickModel` always
returns the **first one in the array** (Pollinations) when Auto mode
detects image intent. The second provider is reachable only by explicitly
selecting it in the model picker — Auto mode won't pick it automatically
unless you either reorder the array or add logic to alternate/branch
between them.

**Known limitation**: this is exact-substring keyword matching, not real
NLU — a typo like "**genarate** an image of a cat" won't match "generate an
image" and will silently fall through to a normal chat model instead
(which will describe or write code for an image rather than actually
generating one). Worth knowing if you extend this: either broaden the
keyword list, add fuzzy matching, or accept the tradeoff for simplicity.

---

## Error handling notes

- **429 (rate limited)**: both routes translate this into a friendly
  message — "Image generation is rate-limited right now — wait a few
  seconds and try again." Free tiers on both Pollinations and most
  self-hosted Workers will rate-limit under heavy/rapid testing.
- **On any image-gen failure**, the send flow removes the empty placeholder
  message and restores your typed prompt into the input box, so retrying
  doesn't require retyping.
- **500 (misconfigured)**: both routes fail fast with a clear "Missing
  ..._API_KEY / ..._URL" message if the relevant env var isn't set —
  useful for catching a forgotten Vercel env var immediately rather than
  a mysterious timeout.

## Storage note

Images are returned and stored as base64 **data URLs** (not blob URLs or
external links) specifically so they survive a page reload — conversations
persist to `localStorage`, and blob URLs don't survive that. The tradeoff:
base64 inflates size ~33% over raw bytes, so a chat history with many
images can grow large in localStorage. Fine for personal/moderate use;
would need real object storage (S3, R2, etc.) if you expect heavy
image-generation volume per user.
