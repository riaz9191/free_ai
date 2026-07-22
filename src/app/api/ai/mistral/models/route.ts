export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Missing MISTRAL_API_KEY" }, { status: 500 });
  }

  const res = await fetch("https://api.mistral.ai/v1/models", {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `Mistral API error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const data = await res.json();
  return Response.json(data);
}
