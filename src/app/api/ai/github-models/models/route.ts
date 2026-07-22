export const runtime = "nodejs";

export async function GET() {
  const token = process.env.GITHUB_MODELS_TOKEN;

  if (!token) {
    return Response.json({ error: "Missing GITHUB_MODELS_TOKEN" }, { status: 500 });
  }

  const res = await fetch("https://models.github.ai/catalog/models", {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `GitHub Models API error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const data = await res.json();
  return Response.json({ data });
}
