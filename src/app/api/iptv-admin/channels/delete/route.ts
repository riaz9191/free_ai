import { NextRequest, NextResponse } from "next/server";
import { IPTV_ADMIN_COOKIE, isValidAdminToken } from "@/lib/iptv-auth";
import { deleteChannels } from "@/lib/iptv-store";

export async function POST(req: NextRequest) {
  if (!isValidAdminToken(req.cookies.get(IPTV_ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ids = body?.ids === "all" ? "all" : Array.isArray(body?.ids) ? body.ids : null;

  if (!ids) {
    return NextResponse.json({ error: "ids must be an array or \"all\"" }, { status: 400 });
  }

  const deleted = await deleteChannels(ids);
  return NextResponse.json({ deleted });
}
