import { NextRequest, NextResponse } from "next/server";
import { IPTV_ADMIN_COOKIE, isValidAdminToken } from "@/lib/iptv-auth";
import { createChannels } from "@/lib/iptv-store";

export async function POST(req: NextRequest) {
  if (!isValidAdminToken(req.cookies.get(IPTV_ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const category = typeof body?.category === "string" ? body.category.trim() : "";
  const published = Boolean(body?.published);
  const items = Array.isArray(body?.channels) ? body.channels : [];

  if (!category) {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }

  const inputs = items
    .map((item: unknown) => {
      const name = typeof (item as { name?: unknown })?.name === "string"
        ? (item as { name: string }).name.trim()
        : "";
      const url = typeof (item as { url?: unknown })?.url === "string"
        ? (item as { url: string }).url.trim()
        : "";
      const logo = typeof (item as { logo?: unknown })?.logo === "string"
        ? (item as { logo: string }).logo.trim() || undefined
        : undefined;
      return { name, url, logo };
    })
    .filter((item: { name: string; url: string }) => item.name && item.url)
    .map((item: { name: string; url: string; logo?: string }) => ({
      name: item.name,
      url: item.url,
      logo: item.logo,
      category,
      published,
    }));

  if (!inputs.length) {
    return NextResponse.json({ error: "No valid channels provided" }, { status: 400 });
  }

  const channels = await createChannels(inputs);
  return NextResponse.json({ channels }, { status: 201 });
}
