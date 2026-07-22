import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const apiKey = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!apiKey || !accountId) {
    return Response.json(
      { error: "Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID" },
      { status: 500 }
    );
  }

  const wantsImages = req.nextUrl.searchParams.get("images") === "1";

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/models/search?per_page=100`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `Cloudflare API error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const data = await res.json();
  const taskName = wantsImages ? "Text-to-Image" : "Text Generation";
  const items = (data.result || [])
    .filter((m: { task?: { name?: string } }) => m.task?.name === taskName)
    .filter((m: { name: string }) =>
      // img2img/inpainting models need an input image, and Flux-2 requires
      // a multipart/form-data body — this page only sends a JSON prompt.
      wantsImages
        ? !/img2img|inpainting|flux-2/i.test(m.name)
        : true
    )
    .map((m: { name: string; properties?: { property_id: string; value: unknown }[] }) => ({
      id: m.name,
      vision: (m.properties || []).some(
        (p) => p.property_id === "vision" || p.property_id === "image_understanding"
      ),
    }));

  return Response.json({ data: items });
}
