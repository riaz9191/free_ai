import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/birthday-auth";
import { createEmployee, parseEmployee } from "@/lib/birthday-store";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const input = parseEmployee(await req.json().catch(() => null));
    return NextResponse.json({ employee: await createEmployee(input) }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
