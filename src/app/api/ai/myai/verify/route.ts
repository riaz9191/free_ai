import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const required = process.env.MYAI_ACCESS_CODE;
  if (!required) return Response.json({ ok: true });

  const code = req.headers.get("x-access-code");
  if (code === required) return Response.json({ ok: true });

  return Response.json({ ok: false }, { status: 401 });
}
