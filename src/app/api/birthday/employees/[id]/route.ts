import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/birthday-auth";
import { deleteEmployee, parseEmployee, updateEmployee } from "@/lib/birthday-store";

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/birthday/employees/[id]">) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  try {
    const employee = await updateEmployee(id, parseEmployee(await req.json().catch(() => null)));
    if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ employee });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/birthday/employees/[id]">) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  if (!(await deleteEmployee(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
