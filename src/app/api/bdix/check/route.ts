import { NextRequest } from "next/server";

export const runtime = "nodejs";

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = body.url?.trim();
  if (!raw) {
    return Response.json({ error: "url is required" }, { status: 400 });
  }

  let url: string;
  try {
    url = normalizeUrl(raw);
    new URL(url);
  } catch {
    return Response.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const started = Date.now();

  try {
    let res: Response;
    try {
      res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; BDIX-Checker/1.0)" },
      });
    } catch {
      // Some servers reject HEAD — retry with GET.
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; BDIX-Checker/1.0)" },
      });
    }

    const timeMs = Date.now() - started;
    return Response.json({
      reachable: true,
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      finalUrl: res.url || url,
      timeMs,
    });
  } catch (e) {
    const timeMs = Date.now() - started;
    const timedOut = e instanceof DOMException && e.name === "AbortError";
    return Response.json({
      reachable: false,
      timeMs,
      error: timedOut
        ? "Timed out — the site didn't respond within 8 seconds."
        : e instanceof Error
          ? e.message
          : "Could not reach the site.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
