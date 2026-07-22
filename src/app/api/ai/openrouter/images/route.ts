export const runtime = "nodejs";

const OPENROUTER_IMAGES_URL = "https://openrouter.ai/api/v1/images";
const DEFAULT_MODEL = "black-forest-labs/flux.2-klein-4b";

function friendlyError(status: number, rawBody: string): string {
  let upstreamMessage = "";
  try {
    upstreamMessage = JSON.parse(rawBody)?.error?.message || "";
  } catch {
    // rawBody wasn't JSON
  }
  if (status === 402 || /credits/i.test(upstreamMessage)) {
    return "This model needs more credits than your OpenRouter account has. Image generation is never free on OpenRouter — add credits at openrouter.ai/settings/credits.";
  }
  if (status === 401) {
    return "OpenRouter rejected the API key. Check OPENROUTER_API_KEY in .env.local.";
  }
  return upstreamMessage || `OpenRouter API error (${status})`;
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Missing OPENROUTER_API_KEY. Add it to .env.local." },
      { status: 500 }
    );
  }

  let body: { prompt?: string; model?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const res = await fetch(OPENROUTER_IMAGES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "MyAi",
    },
    body: JSON.stringify({
      model: body.model || DEFAULT_MODEL,
      prompt,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: friendlyError(res.status, text), detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const json = await res.json();
  const item = json.data?.[0];
  const imageUrl = item?.b64_json
    ? `data:image/png;base64,${item.b64_json}`
    : item?.url;

  if (!imageUrl) {
    return Response.json({ error: "No image returned" }, { status: 502 });
  }

  return Response.json({ imageUrl, cost: json.usage?.cost });
}
