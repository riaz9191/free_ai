export const runtime = "nodejs";

export async function GET() {
  const res = await fetch("https://integrate.api.nvidia.com/v1/models", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return Response.json(
      { error: `NVIDIA API error (${res.status})`, detail: text.slice(0, 500) },
      { status: res.status }
    );
  }

  const data = await res.json();
  return Response.json(data);
}
