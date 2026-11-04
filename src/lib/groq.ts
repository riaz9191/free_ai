// Server-only helper for one-shot (non-streaming) Groq calls.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_MODEL = "openai/gpt-oss-120b";

export class GroqError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function groqComplete(opts: {
  system: string;
  user: string;
  maxTokens: number;
  json?: boolean;
  temperature?: number;
}): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new GroqError("Missing GROQ_API_KEY in .env", 500);

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      temperature: opts.temperature ?? 0.7,
      max_completion_tokens: opts.maxTokens,
      // Reasoning tokens count against the 8k/min free limit — keep them short.
      reasoning_effort: "low",
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      const wait = Math.ceil(Number(res.headers.get("retry-after")) || 60);
      throw new GroqError(`Groq-এর free limit শেষ — ${wait} সেকেন্ড পরে আবার চেষ্টা করো।`, 429);
    }
    if (res.status === 401) throw new GroqError("Invalid GROQ_API_KEY.", 401);
    const detail = await res.text().catch(() => "");
    console.error("groq error", res.status, detail.slice(0, 500));
    throw new GroqError(`Groq API error (${res.status})`, 502);
  }

  const data = await res.json();
  const text: string | undefined = data.choices?.[0]?.message?.content;
  if (!text) throw new GroqError("AI কোনো উত্তর দেয়নি, আবার চেষ্টা করো।", 502);
  return text;
}
