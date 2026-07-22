import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const wantsImages = req.nextUrl.searchParams.get("images") === "1";
  const url = wantsImages
    ? "https://openrouter.ai/api/v1/models?output_modalities=image"
    : "https://openrouter.ai/api/v1/models";

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `OpenRouter API error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const data = await res.json();

  if (wantsImages && Array.isArray(data.data)) {
    data.data = [...data.data].sort((a: { pricing?: Record<string, string> }, b: { pricing?: Record<string, string> }) => {
      const costOf = (m: { pricing?: Record<string, string> }) =>
        parseFloat(m.pricing?.image_output ?? m.pricing?.image_token ?? "0");
      return costOf(a) - costOf(b);
    });
  }

  return Response.json(data);
}
