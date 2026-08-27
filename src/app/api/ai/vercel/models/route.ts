import { gateway } from "ai";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return Response.json({ error: "Missing AI_GATEWAY_API_KEY" }, { status: 500 });
  }

  try {
    const { models } = await gateway.getAvailableModels();
    const chatModels = models.map((m) => ({
      id: m.id,
      name: m.name,
      free:
        !m.pricing ||
        (Number(m.pricing.input) === 0 && Number(m.pricing.output) === 0),
    }));
    return Response.json({ data: chatModels });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Failed to load models" },
      { status: 502 }
    );
  }
}
