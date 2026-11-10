import { NextRequest, NextResponse } from "next/server";
import { getBirthdayData, updateOffice } from "@/lib/birthday-store";
import { isAdmin } from "@/lib/birthday-auth";

export async function GET(req: NextRequest) {
  const admin = isAdmin(req);
  const { office, employees, smtpConfigured } = await getBirthdayData();
  // Visitors only see the calendar; the reminder address and email status are admin-only.
  // Unless the admin opts in to showing ages, visitors don't receive birth years at all.
  const hideYears = !admin && !office.showAges;
  return NextResponse.json({
    isAdmin: admin,
    office: admin ? office : { name: office.name, notifyEmail: "", showAges: office.showAges },
    employees: hideYears ? employees.map((e) => ({ ...e, birthday: `0000${e.birthday.slice(4)}` })) : employees,
    smtpConfigured: admin ? smtpConfigured : false,
  });
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
  const notifyEmail = typeof body?.notifyEmail === "string" ? body.notifyEmail.trim() : "";
  if (!name) return NextResponse.json({ error: "Office name is required" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  const showAges = body?.showAges === true;
  return NextResponse.json({ office: await updateOffice({ name, notifyEmail, showAges }) });
}
