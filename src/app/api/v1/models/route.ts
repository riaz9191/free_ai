import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Keep in sync with MODELS in src/app/myai/page.tsx
const MODEL_IDS = [
  "nvidia/nemotron-3-nano-30b-a3b",
  "stepfun-ai/step-3.7-flash",
  "nvidia/nemotron-3-super-120b-a12b",
  "nvidia/nemotron-3.5-lightning-30b-a3b",
  "z-ai/glm-5.2",
  "minimaxai/minimax-m2.7",
  "minimaxai/minimax-m3",
  "nvidia/llama-3.3-nemotron-super-49b-v1.5",
  "nvidia/nemotron-mini-4b-instruct",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "meta/llama-3.1-70b-instruct",
  "mistralai/mistral-nemotron",
  "moonshotat/kimi-k3",
];

function isAuthorized(req: NextRequest): boolean {
  const required = process.env.MYAI_ACCESS_CODE;
  if (!required) return true;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return token === required;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json(
      { error: { message: "Invalid API key.", type: "invalid_request_error" } },
      { status: 401 }
    );
  }

  return Response.json({
    object: "list",
    data: MODEL_IDS.map((id) => ({
      id,
      object: "model",
      created: 0,
      owned_by: id.split("/")[0] || "myai",
    })),
  });
}
