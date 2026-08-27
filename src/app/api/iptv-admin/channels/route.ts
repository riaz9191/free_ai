import { NextRequest, NextResponse } from "next/server";
import { IPTV_ADMIN_COOKIE, isValidAdminToken } from "@/lib/iptv-auth";
import { createChannel, getAllChannels } from "@/lib/iptv-store";

function requireAuth(req: NextRequest) {
  return isValidAdminToken(req.cookies.get(IPTV_ADMIN_COOKIE)?.value);
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const channels = await getAllChannels();
  return NextResponse.json({ channels });
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const category = typeof body?.category === "string" ? body.category.trim() : "";
  const logo = typeof body?.logo === "string" ? body.logo.trim() : undefined;
  const published = Boolean(body?.published);

  if (!name || !url || !category) {
    return NextResponse.json(
      { error: "name, url, and category are required" },
      { status: 400 }
    );
  }

  const channel = await createChannel({ name, url, category, logo, published });
  return NextResponse.json({ channel }, { status: 201 });
}
