import { NextRequest, NextResponse } from "next/server";
import { IPTV_ADMIN_COOKIE, isValidAdminToken } from "@/lib/iptv-auth";

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
    return NextResponse.json({ error: "Not a valid URL" }, { status: 400 });
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return NextResponse.json({ error: "URL must be http(s)" }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(target.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; IPTV-Admin/1.0)" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Server responded ${res.status}` },
        { status: 502 }
      );
    }

    const text = await res.text();
    if (!text.trim()) {
      return NextResponse.json({ error: "Playlist was empty" }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (e) {
    const message =
      e instanceof Error && e.name === "AbortError"
        ? "Timed out fetching playlist"
        : e instanceof Error
          ? e.message
          : "Failed to fetch playlist";
    return NextResponse.json({ error: message }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
