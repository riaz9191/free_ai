import { NextRequest } from "next/server";

export const runtime = "nodejs";

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-v4-flash";
const SILICONFLOW_URL = "https://api.siliconflow.cn/v1/images/generations";
const SILICONFLOW_MODEL = "black-forest-labs/FLUX.1-schnell";

const SUPPORTED_SIZES = [
  "1024x1024",
  "512x512",
  "768x768",
  "1024x768",
  "768x1024",
  "1280x720",
  "720x1280",
];

export async function POST(req: NextRequest) {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const siliconflowKey = process.env.SILICONFLOW_API_KEY;

  if (!deepseekKey || !siliconflowKey) {
    return Response.json(
      {
        error:
          "Missing DEEPSEEK_API_KEY and/or SILICONFLOW_API_KEY. Add both to .env.local — see the setup instructions on /ai/hermes.",
      },
      { status: 500 }
    );
  }

  let body: { prompt?: string; size?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userPrompt = body.prompt?.trim();
  if (!userPrompt) {
    return Response.json({ error: "prompt is required" }, { status: 400 });
  }

  const size = SUPPORTED_SIZES.includes(body.size || "")
    ? body.size!
    : "1024x1024";

  try {
    const promptRes = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${deepseekKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: "user",
            content:
              `You are an expert AI image prompt engineer. User wants: ${userPrompt}\n` +
              `Write a detailed English prompt for the FLUX.1-schnell model. ` +
              `Include: subject, environment, lighting, style, color palette, composition, mood. ` +
              `Output ONLY the prompt, no explanation.`,
          },
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    });

    if (!promptRes.ok) {
      const text = await promptRes.text().catch(() => "");
      return Response.json(
        { error: `DeepSeek error (${promptRes.status})`, detail: text.slice(0, 500) },
        { status: 502 }
      );
    }

    const promptJson = await promptRes.json();
    const enginedPrompt: string = promptJson.choices?.[0]?.message?.content?.trim();
    if (!enginedPrompt) {
      return Response.json({ error: "DeepSeek returned no prompt" }, { status: 502 });
    }

    const imageRes = await fetch(SILICONFLOW_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${siliconflowKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: SILICONFLOW_MODEL,
        prompt: enginedPrompt,
        n: 1,
        size,
      }),
    });

    if (!imageRes.ok) {
      const text = await imageRes.text().catch(() => "");
      return Response.json(
        { error: `SiliconFlow error (${imageRes.status})`, detail: text.slice(0, 500) },
        { status: 502 }
      );
    }

    const imageJson = await imageRes.json();
    const image = imageJson.data?.[0];
    const imageUrl: string | undefined = image?.url
      ? image.url
      : image?.b64_json
        ? `data:image/png;base64,${image.b64_json}`
        : undefined;

    if (!imageUrl) {
      return Response.json(
        { error: "SiliconFlow returned no image data" },
        { status: 502 }
      );
    }

    return Response.json({ prompt: enginedPrompt, imageUrl });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
