import { NextRequest, NextResponse } from "next/server";
import { IPTV_ADMIN_COOKIE, isValidAdminToken } from "@/lib/iptv-auth";

type CheckResult = {
  ok: boolean;
  status?: number;
  isHls?: boolean;
  error?: string;
};

export async function POST(req: NextRequest) {
  if (!isValidAdminToken(req.cookies.get(IPTV_ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json().catch(() => ({ url: "" }));
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url.trim());
  } catch {
    return NextResponse.json<CheckResult>({ ok: false, error: "Not a valid URL" });
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json<CheckResult>({ ok: false, error: "URL must be http(s)" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(target.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; IPTV-Checker/1.0)" },
    });

    if (!res.ok) {
      return NextResponse.json<CheckResult>({
        ok: false,
        status: res.status,
        error: `Server responded ${res.status}`,
      });
    }

    const contentType = res.headers.get("content-type") || "";
    const looksLikeHlsType =
      contentType.includes("mpegurl") || contentType.includes("octet-stream");

    let isHls = looksLikeHlsType;
    if (!isHls) {
      const text = await res.text();
      isHls = text.trim().startsWith("#EXTM3U");
    }

    if (!isHls) {
      return NextResponse.json<CheckResult>({
        ok: false,
        status: res.status,
        error: "Reachable, but doesn't look like an HLS (.m3u8) stream",
      });
    }

    return NextResponse.json<CheckResult>({ ok: true, status: res.status, isHls: true });
  } catch (e) {
    const message =
      e instanceof Error && e.name === "AbortError"
        ? "Timed out"
        : e instanceof Error
          ? e.message
          : "Failed to reach URL";
    return NextResponse.json<CheckResult>({ ok: false, error: message });
  } finally {
    clearTimeout(timeout);
  }
}
