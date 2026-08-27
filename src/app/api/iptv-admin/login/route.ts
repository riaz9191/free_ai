import { NextRequest, NextResponse } from "next/server";
import { checkPassword, IPTV_ADMIN_COOKIE, IPTV_ADMIN_TOKEN } from "@/lib/iptv-auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));

  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(IPTV_ADMIN_COOKIE, IPTV_ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(IPTV_ADMIN_COOKIE);
  return res;
}
