import { NextRequest } from "next/server";

export const runtime = "nodejs";

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b";

function isAuthorized(req: NextRequest): boolean {
  const required = process.env.MYAI_ACCESS_CODE;
  if (!required) return true;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return token === required;
}

// OpenAI-compatible chat completions endpoint, so any tool that lets you
// configure a custom "OpenAI base URL" + API key (Cline, Continue, Cursor,
// LM Studio-style clients, etc.) can talk to this NVIDIA-backed router.
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return Response.json(
      { error: { message: "Invalid API key.", type: "invalid_request_error" } },
      { status: 401 }
    );
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: { message: "Server is missing NVIDIA_API_KEY.", type: "server_error" } },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: { message: "Invalid JSON body.", type: "invalid_request_error" } },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json(
      { error: { message: "messages is required.", type: "invalid_request_error" } },
      { status: 400 }
    );
  }

  const wantsStream = body.stream !== false;

  const upstream = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      model: (body.model as string) || DEFAULT_MODEL,
      stream: wantsStream,
    }),
    signal: req.signal,
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      { error: { message: `NVIDIA API error (${upstream.status}): ${text.slice(0, 500)}`, type: "upstream_error" } },
      { status: upstream.status || 502 }
    );
  }

  if (!wantsStream) {
    const json = await upstream.json();
    return Response.json(json);
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
