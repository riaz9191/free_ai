import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type Employee = {
  id: string;
  name: string;
  department: string;
  birthday: string; // YYYY-MM-DD
};

export type Office = { name: string; notifyEmail: string };

type BirthdayData = {
  office: Office;
  employees: Employee[];
  sentReminders: string[]; // "<YYYY-MM-DD>:<employeeId>"
};

const DATA_FILE = path.join(process.cwd(), "data", "birthdays.json");
const BLOB_PATHNAME = "birthday/data.json";
// Same storage strategy as iptv-store: Vercel Blob in production, local JSON file otherwise.
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

// Office time zone used to decide what "today" and "tomorrow" mean for reminders.
export const OFFICE_TZ = process.env.BIRTHDAY_TZ || "Asia/Dhaka";

const DEFAULT_DATA: BirthdayData = {
  office: { name: "PEN Global Limited", notifyEmail: "riaz91a@gmail.com" },
  employees: [],
  sentReminders: [],
};

async function readAll(): Promise<BirthdayData> {
  let raw: string | null = null;
  try {
    if (useBlob) {
      const { get } = await import("@vercel/blob");
      const result = await get(BLOB_PATHNAME, { access: "private", useCache: false });
      if (result) raw = await new Response(result.stream).text();
    } else {
      raw = await fs.readFile(DATA_FILE, "utf-8");
    }
  } catch {
    raw = null;
  }
  if (!raw) return structuredClone(DEFAULT_DATA);
  const d = JSON.parse(raw) as Partial<BirthdayData>;
  return {
    office: { ...DEFAULT_DATA.office, ...d.office },
    employees: d.employees ?? [],
    sentReminders: d.sentReminders ?? [],
  };
}

async function writeAll(data: BirthdayData): Promise<void> {
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATHNAME, JSON.stringify(data), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
    });
    return;
  }
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ---------- public data API ----------

export async function getBirthdayData() {
  const { office, employees } = await readAll();
  return { office, employees, smtpConfigured: isMailConfigured() };
}

export async function updateOffice(patch: Partial<Office>): Promise<Office> {
  const d = await readAll();
  d.office = { ...d.office, ...patch };
  await writeAll(d);
  return d.office;
}

export function parseEmployee(body: unknown): Omit<Employee, "id"> {
  const b = (body ?? {}) as Record<string, unknown>;
  const name = String(b.name ?? "").trim().slice(0, 80);
  const birthday = String(b.birthday ?? "").trim();
  const department = String(b.department ?? "").trim().slice(0, 60);
  if (!name) throw new Error("Name is required");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday) || Number.isNaN(Date.parse(birthday))) {
    throw new Error("Birthday must be a valid date (YYYY-MM-DD)");
  }
  return { name, birthday, department };
}

export async function createEmployee(input: Omit<Employee, "id">): Promise<Employee> {
  const d = await readAll();
  const emp = { id: crypto.randomUUID(), ...input };
  d.employees.push(emp);
  await writeAll(d);
  return emp;
}

export async function updateEmployee(id: string, input: Omit<Employee, "id">) {
  const d = await readAll();
  const i = d.employees.findIndex((e) => e.id === id);
  if (i === -1) return undefined;
  d.employees[i] = { id, ...input };
  await writeAll(d);
  return d.employees[i];
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const d = await readAll();
  const next = d.employees.filter((e) => e.id !== id);
  if (next.length === d.employees.length) return false;
  d.employees = next;
  await writeAll(d);
  return true;
}

// ---------- dates ----------

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Calendar date (y, m 1-12, d) in the office time zone, offset by `addDays`. */
function officeDate(addDays = 0) {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: OFFICE_TZ }).format(new Date());
  const [y, m, d] = ymd.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + addDays));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), key: t.toISOString().slice(0, 10) };
}

/** Feb 29 birthdays are celebrated on Feb 28 in non-leap years. */
function isBirthdayOn(birthday: string, date: { y: number; m: number; d: number }) {
  const [, bm, bd] = birthday.split("-").map(Number);
  if (bm === 2 && bd === 29 && !isLeap(date.y)) return date.m === 2 && date.d === 28;
  return bm === date.m && bd === date.d;
}

// ---------- email ----------

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function reminderHtml(office: Office, people: Pick<Employee, "name" | "department">[], heading: string, sub: string) {
  const rows = people
    .map(
      (p) => `<tr><td style="padding:14px 20px;border-bottom:1px solid #f1e4ea">
        <div style="font-size:17px;font-weight:600;color:#2b1d24">🎂 ${esc(p.name)}</div>
        <div style="font-size:13px;color:#7a6470">${esc(p.department || "")}</div></td></tr>`
    )
    .join("");
  return `<div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;background:#fdf6f9;padding:24px">
    <table style="max-width:520px;width:100%;margin:auto;background:#fff;border-radius:14px;overflow:hidden;border-collapse:collapse">
      <tr><td style="background:linear-gradient(135deg,#ec4899,#f59e0b);padding:24px 20px;color:#fff">
        <div style="font-size:13px;opacity:.9">${esc(office.name)}</div>
        <div style="font-size:22px;font-weight:700;margin-top:4px">${heading}</div>
        <div style="font-size:14px;margin-top:4px">${sub}</div>
      </td></tr>
      ${rows}
      <tr><td style="padding:16px 20px;font-size:13px;color:#7a6470">Don't forget the cake, card and wishes!</td></tr>
    </table></div>`;
}

async function sendMail(to: string, subject: string, html: string) {
  if (!isMailConfigured()) throw new Error("Email is not set up. Add SMTP_USER and SMTP_PASS to .env");
  const nodemailer = (await import("nodemailer")).default;
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({ from: `"Birthday Calendar" <${process.env.SMTP_USER}>`, to, subject, html });
}

export async function sendTestEmail() {
  const { office } = await readAll();
  await sendMail(
    office.notifyEmail,
    "✅ Birthday Calendar test email",
    reminderHtml(office, [{ name: "Test Person", department: "This is a test reminder" }], "Email is working 🎉", "You'll get reminders like this one day before each birthday.")
  );
  return office.notifyEmail;
}

/**
 * Sends one email listing everyone whose birthday is tomorrow (office time zone).
 * Safe to call repeatedly: each person/day is only emailed once.
 */
export async function sendDueReminders(): Promise<{ sent: string[]; to?: string }> {
  const d = await readAll();
  const tomorrow = officeDate(1);
  const due = d.employees.filter(
    (e) => isBirthdayOn(e.birthday, tomorrow) && !d.sentReminders.includes(`${tomorrow.key}:${e.id}`)
  );
  if (!due.length || !isMailConfigured()) return { sent: [] };

  const dateStr = new Date(Date.UTC(tomorrow.y, tomorrow.m - 1, tomorrow.d)).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });
  const names = due.map((e) => e.name).join(", ");
  await sendMail(d.office.notifyEmail, `🎂 Tomorrow: ${names}'s birthday`, reminderHtml(d.office, due, "Birthday tomorrow 🎉", dateStr));

  const fresh = await readAll();
  fresh.sentReminders = [...fresh.sentReminders, ...due.map((e) => `${tomorrow.key}:${e.id}`)].slice(-500);
  await writeAll(fresh);
  return { sent: due.map((e) => e.name), to: d.office.notifyEmail };
}
