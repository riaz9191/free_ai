import { NextRequest, NextResponse } from "next/server";
import { readRoutine, saveRoutine } from "@/lib/routine-store";

// Progress is per-request state, never cached.
export const dynamic = "force-dynamic";

export async function GET() {
  const doc = await readRoutine();
  return NextResponse.json(doc, {
    headers: { "cache-control": "no-store" },
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const doc = await saveRoutine(body);
  return NextResponse.json(doc, { headers: { "cache-control": "no-store" } });
}
