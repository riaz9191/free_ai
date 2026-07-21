export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.BAZAARLINK_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "Missing BAZAARLINK_API_KEY" }, { status: 500 });
  }

  const res = await fetch("https://bazaarlink.ai/api/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `BazaarLink API error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const data = await res.json();
  return Response.json(data);
}
