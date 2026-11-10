import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/birthday-auth";
import { sendTestEmail } from "@/lib/birthday-store";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, to: await sendTestEmail() });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
