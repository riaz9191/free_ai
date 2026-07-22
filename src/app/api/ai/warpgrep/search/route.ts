import { NextRequest } from "next/server";
import { createGitHubSearchTool } from "@morphllm/morphsdk/tools/warp-grep/openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.MORPH_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "Missing MORPH_API_KEY. Add it to .env.local — see the setup instructions on /ai/warpgrep.",
      },
      { status: 500 }
    );
  }

  let body: { repoUrl?: string; query?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const repoUrl = body.repoUrl?.trim();
  const query = body.query?.trim();
  if (!repoUrl || !query) {
    return Response.json({ error: "repoUrl and query are both required" }, { status: 400 });
  }

  try {
    const tool = createGitHubSearchTool({ morphApiKey: apiKey });
    const result = await tool.execute({ search_term: query, github_url: repoUrl });

    // The SDK resolves (doesn't throw) even on upstream failures, returning
    // { success: false, error } instead — surface that real message directly.
    if (!result?.success) {
      const message = result?.error || "WarpGrep search did not complete.";
      let friendly = message;
      if (/401|unauthorized/i.test(message)) friendly = `Invalid MORPH_API_KEY. ${message}`;
      if (/429|rate.?limit/i.test(message)) friendly = `Rate limited by Morph. ${message}`;
      if (/402|quota|payment/i.test(message)) friendly = `Morph account issue: ${message}`;
      return Response.json({ error: friendly }, { status: 502 });
    }

    return Response.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    let friendly = `WarpGrep error: ${message}`;
    if (/401|unauthorized/i.test(message)) friendly = "Invalid MORPH_API_KEY — check the key in .env.local.";
    if (/429|rate.?limit/i.test(message)) friendly = "Rate limited by Morph — wait a moment and try again.";
    return Response.json({ error: friendly }, { status: 502 });
  }
}
