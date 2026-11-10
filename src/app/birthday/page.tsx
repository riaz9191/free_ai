"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Cake,
  ChevronLeft,
  ChevronRight,
  Gift,
  Lock,
  LogOut,
  Mail,
  PartyPopper,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Employee = { id: string; name: string; department: string; birthday: string };
type Office = { name: string; notifyEmail: string };

// ---------- date helpers (browser local time) ----------
const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const parts = (b: string) => {
  const [y, m, d] = b.split("-").map(Number);
  return { y, m: m - 1, d };
};
/** Birthday within a given year; Feb 29 falls back to Feb 28 in non-leap years. */
const bdayIn = (b: string, year: number) => {
  const { m, d } = parts(b);
  return m === 1 && d === 29 && !isLeap(year) ? new Date(year, 1, 28) : new Date(year, m, d);
};
const nextBday = (b: string, from: Date) => {
  const t = startOfDay(from);
  const n = bdayIn(b, t.getFullYear());
  return n < t ? bdayIn(b, t.getFullYear() + 1) : n;
};
const daysUntil = (b: string, from: Date) => Math.round((nextBday(b, from).getTime() - startOfDay(from).getTime()) / 864e5);
const ageOn = (b: string, d: Date) => d.getFullYear() - parts(b).y;
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-GB", o);
const firstName = (n: string) => n.trim().split(/\s+/)[0];
const initials = (n: string) =>
  n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const AVATAR_COLORS = [
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-purple-500",
  "from-sky-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-fuchsia-500 to-pink-500",
  "from-indigo-500 to-violet-500",
  "from-cyan-500 to-sky-500",
];
const colorFor = (s: string) =>
  AVATAR_COLORS[[...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % AVATAR_COLORS.length];

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
        colorFor(name),
        className
      )}
    >
      {initials(name)}
    </span>
  );
}

async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(path, {
    method: init?.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json as T;
}

// ---------- confetti ----------
function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fire = useCallback((count = 280) => {
    const cv = canvasRef.current;
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ["#ec4899", "#f59e0b", "#fde047", "#34d399", "#60a5fa", "#a78bfa", "#ffffff"];
    let pieces = Array.from({ length: count }, (_, i) => {
      const left = i % 2 === 0;
      return {
        x: left ? 0 : W,
        y: H * 0.75,
        vx: (left ? 1 : -1) * (4 + Math.random() * 10),
        vy: -(10 + Math.random() * 13),
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        r: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.4,
        c: colors[i % colors.length],
        t: 0,
      };
    });
    const step = () => {
      ctx.clearRect(0, 0, W, H);
      pieces = pieces.filter((p) => p.y < H + 40 && p.t < 420);
      for (const p of pieces) {
        p.t++;
        p.vy += 0.28;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.t / 8)));
        ctx.restore();
      }
      if (pieces.length) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, W, H);
    };
    requestAnimationFrame(step);
  }, []);
  return { canvasRef, fire };
}

// ---------- page ----------
export default function BirthdayPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [office, setOffice] = useState<Office>({ name: "", notifyEmail: "" });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [smtp, setSmtp] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Employee | "new" | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { canvasRef, fire } = useConfetti();
  const celebratedKey = useRef<string | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 3500);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const d = await api<{ isAdmin: boolean; office: Office; employees: Employee[]; smtpConfigured: boolean }>("/api/birthday");
      setAdmin(d.isAdmin);
      setOffice(d.office);
      setEmployees(d.employees);
      setSmtp(d.smtpConfigured);
    } catch (err) {
      notify((err as Error).message);
    } finally {
      setLoaded(true);
    }
  }, [notify]);

  useEffect(() => {
    const first = setTimeout(() => {
      setNow(new Date());
      refresh();
    }, 0);
    const tick = setInterval(() => setNow(new Date()), 1000);
    const poll = setInterval(refresh, 5 * 60 * 1000);
    return () => {
      clearTimeout(first);
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [refresh]);

  const today = now ? startOfDay(now) : null;
  const todayKey = today?.toDateString();

  const todays = useMemo(
    () => (today ? employees.filter((e) => sameDay(bdayIn(e.birthday, today.getFullYear()), today)) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [employees, todayKey]
  );

  const upcoming = useMemo(
    () =>
      today
        ? employees
            .map((e) => ({ e, days: daysUntil(e.birthday, today) }))
            .filter((x) => x.days <= 60)
            .sort((a, b) => a.days - b.days)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [employees, todayKey]
  );

  // Fire confetti once per day when someone has a birthday.
  useEffect(() => {
    if (todays.length && todayKey && celebratedKey.current !== todayKey) {
      celebratedKey.current = todayKey;
      const t = setTimeout(() => fire(320), 400);
      return () => clearTimeout(t);
    }
  }, [todays.length, todayKey, fire]);

  const filteredTeam = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees
      .filter((e) => !q || e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q))
      .sort((a, b) => {
        const A = parts(a.birthday);
        const B = parts(b.birthday);
        return A.m - B.m || A.d - B.d;
      });
  }, [employees, query]);

  async function logout() {
    await fetch("/api/iptv-admin/login", { method: "DELETE" }).catch(() => {});
    notify("Signed out");
    refresh();
  }

  async function removeEmployee(e: Employee) {
    if (!confirm(`Remove ${e.name} from the birthday calendar?`)) return;
    try {
      await api(`/api/birthday/employees/${e.id}`, { method: "DELETE" });
      notify(`Removed ${e.name}`);
      refresh();
    } catch (err) {
      notify((err as Error).message);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[100] size-full" aria-hidden />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 size-[36rem] rounded-full bg-pink-600/15 blur-[130px]" />
        <div className="absolute top-32 -right-32 size-[32rem] rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      <NavBar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="flex flex-col gap-4">
            <span className="flex w-fit items-center gap-2 rounded-full border border-border bg-muted/20 py-1 pr-3.5 pl-1.5 text-xs font-medium text-foreground/80">
              <span className="flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-amber-500">
                <Cake className="size-3 text-white" />
              </span>
              {office.name || "Your office"}
            </span>
            <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl">
              Birthday{" "}
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                Calendar
              </span>
            </h1>
            {admin && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEditing("new")}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:brightness-110"
              >
                <Plus className="size-4" /> Add birthday
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/20 px-4 py-2 text-sm font-semibold transition hover:bg-muted/40"
              >
                <Settings className="size-4" /> Office & email
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-muted/[0.07] px-6 py-4 md:text-right">
            <div className="text-3xl font-bold tracking-tight tabular-nums">
              {now ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
            </div>
            <div className="text-sm text-muted-foreground">
              {now ? fmt(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : " "}
            </div>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          className="mt-8"
        >
          {today && loaded && (
            <Hero today={today} todays={todays} upcoming={upcoming} office={office} onCelebrate={() => fire(280)} onAdd={admin ? () => setEditing("new") : undefined} empty={!employees.length} />
          )}
          {!loaded && <div className="h-56 animate-pulse rounded-3xl border border-border bg-muted/20" />}
        </motion.div>

        {/* Calendar + upcoming */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]"
        >
          <section className="rounded-2xl border border-border bg-muted/[0.07] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {fmt(view, { month: "long", year: "numeric" })}
              </h2>
              <div className="flex items-center gap-1">
                <IconBtn label="Previous month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>
                  <ChevronLeft className="size-4" />
                </IconBtn>
                <button
                  onClick={() => setView(new Date())}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted/40"
                >
                  Today
                </button>
                <IconBtn label="Next month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>
                  <ChevronRight className="size-4" />
                </IconBtn>
              </div>
            </div>
            <MonthGrid view={view} today={today} employees={employees} onPick={(d, ppl) =>
              notify(`🎂 ${fmt(d, { day: "numeric", month: "long" })}: ${ppl.map((p) => `${p.name} (turns ${ageOn(p.birthday, d)})`).join(", ")}`)
            } />
          </section>

          <section className="rounded-2xl border border-border bg-muted/[0.07] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Coming up</h2>
              <span className="text-xs text-muted-foreground">Next 60 days</span>
            </div>
            <div className="flex flex-col gap-2">
              {upcoming.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No birthdays in the next 60 days.</p>
              )}
              {today &&
                upcoming.slice(0, 10).map(({ e, days }) => {
                  const nd = nextBday(e.birthday, today);
                  return (
                    <div key={e.id} className="flex items-center gap-3 rounded-xl bg-muted/20 p-2.5">
                      <Avatar name={e.name} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{e.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {fmt(nd, { weekday: "short", day: "numeric", month: "short" })} · turns {ageOn(e.birthday, nd)}
                        </div>
                      </div>
                      <DaysPill days={days} />
                    </div>
                  );
                })}
            </div>
          </section>
        </motion.div>

        {/* Team */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-6 rounded-2xl border border-border bg-muted/[0.07] p-4 sm:p-5"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Team <span className="font-normal text-muted-foreground">· {employees.length}</span>
            </h2>
            <label className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or department"
                className="w-full rounded-xl border border-border bg-background/50 py-2 pr-3 pl-9 text-sm outline-none focus:border-pink-500/60"
              />
            </label>
          </div>
          {filteredTeam.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {query ? "No matches." : admin ? "No employees yet. Click “Add birthday” to start." : "No birthdays added yet."}
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTeam.map((e) => (
                <div key={e.id} className="group flex items-center gap-3 rounded-xl bg-muted/20 p-2.5">
                  <Avatar name={e.name} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{e.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {fmt(bdayIn(e.birthday, 2024), { day: "numeric", month: "long" })}
                      {e.department && ` · ${e.department}`}
                    </div>
                  </div>
                  {admin && (
                  <div className="flex opacity-60 transition group-hover:opacity-100">
                    <IconBtn label={`Edit ${e.name}`} onClick={() => setEditing(e)} ghost>
                      <Pencil className="size-3.5" />
                    </IconBtn>
                    <IconBtn label={`Delete ${e.name}`} onClick={() => removeEmployee(e)} ghost>
                      <Trash2 className="size-3.5" />
                    </IconBtn>
                  </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 {office.name || "PEN Global Limited"}.
        {loaded && !admin && (
          <button
            onClick={() => setLoginOpen(true)}
            className="ml-3 inline-flex items-center gap-1 text-xs text-muted-foreground/60 transition hover:text-foreground"
          >
            <Lock className="size-3" /> Admin
          </button>
        )}
      </footer>

      <AnimatePresence>
        {loginOpen && (
          <LoginModal
            key="login"
            onClose={() => setLoginOpen(false)}
            onDone={() => {
              setLoginOpen(false);
              notify("Signed in as admin");
              refresh();
            }}
          />
        )}
        {admin && editing && (
          <EmployeeModal
            key="emp"
            employee={editing === "new" ? null : editing}
            onClose={() => setEditing(null)}
            onSaved={(name) => {
              setEditing(null);
              notify(`Saved ${name} 🎈`);
              celebratedKey.current = null;
              refresh();
            }}
          />
        )}
        {admin && settingsOpen && (
          <SettingsModal
            key="settings"
            office={office}
            smtp={smtp}
            notify={notify}
            onClose={() => setSettingsOpen(false)}
            onSaved={() => {
              setSettingsOpen(false);
              notify("Office settings saved");
              refresh();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 z-[120] max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- pieces ----------

function IconBtn({ label, onClick, children, ghost }: { label: string; onClick: () => void; children: React.ReactNode; ghost?: boolean }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:text-foreground",
        ghost ? "hover:bg-muted/40" : "border border-border hover:bg-muted/40"
      )}
    >
      {children}
    </button>
  );
}

function DaysPill({ days }: { days: number }) {
  if (days === 0)
    return <span className="rounded-full bg-gradient-to-r from-pink-500 to-amber-500 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-white">🎉 Today</span>;
  if (days === 1)
    return <span className="rounded-full bg-pink-500 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-white">Tomorrow</span>;
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap tabular-nums",
        days <= 7 ? "bg-amber-500/15 text-amber-500" : "bg-muted/40 text-muted-foreground"
      )}
    >
      in {days} days
    </span>
  );
}

const BALLOONS = ["#fde047", "#f9a8d4", "#a5f3fc", "#ffffff", "#c4b5fd", "#fdba74", "#86efac", "#fecdd3"];

function Hero({
  today, todays, upcoming, office, onCelebrate, onAdd, empty,
}: {
  today: Date;
  todays: Employee[];
  upcoming: { e: Employee; days: number }[];
  office: Office;
  onCelebrate: () => void;
  onAdd?: () => void;
  empty: boolean;
}) {
  if (todays.length) {
    const names = todays.map((e) => firstName(e.name));
    const nameStr = names.length > 1 ? `${names.slice(0, -1).join(", ")} & ${names.at(-1)}` : names[0];
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 p-6 text-white shadow-2xl shadow-pink-500/20 sm:p-10">
        {BALLOONS.map((c, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute -bottom-32 h-16 rounded-[50%_50%_48%_48%] opacity-80"
            style={{ left: `${6 + i * 12}%`, background: c, width: 52 }}
            animate={{ y: [0, -520], rotate: [-4, 4, -4] }}
            transition={{ duration: 8 + (i % 3) * 2, delay: i * 1.1, repeat: Infinity, ease: "easeIn" }}
          >
            <span className="absolute top-full left-1/2 h-14 w-px bg-white/60" />
          </motion.span>
        ))}
        <motion.div
          aria-hidden
          className="absolute top-1/2 right-8 hidden -translate-y-1/2 text-[120px] md:block"
          animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          🎂
        </motion.div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase opacity-90">
            <PartyPopper className="size-4" /> Today we celebrate
          </div>
          <h2 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
            Happy Birthday, {nameStr}!
          </h2>
          <p className="mt-3 text-base opacity-95 sm:text-lg">
            Wishing you a wonderful year ahead from everyone at {office.name}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {todays.map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-full bg-white/20 py-2 pr-5 pl-2 backdrop-blur">
                <Avatar name={e.name} className="size-11 border-2 border-white/80" />
                <div>
                  <div className="font-semibold">{e.name}</div>
                  <div className="text-xs opacity-90">
                    {e.department && `${e.department} · `}turns {ageOn(e.birthday, today)} today
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onCelebrate}
            className="mt-6 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-rose-600 transition hover:scale-[1.03]"
          >
            <PartyPopper className="size-4" /> Celebrate again
          </button>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="rounded-3xl border border-border bg-gradient-to-br from-pink-600/10 via-transparent to-amber-600/10 p-6 sm:p-10">
        <div className="text-xs font-bold tracking-[0.14em] text-pink-400 uppercase">Welcome</div>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Let&apos;s never miss a birthday.</h2>
        <p className="mt-2 max-w-lg text-muted-foreground">
          {onAdd
            ? "Add your team’s birthdays and you’ll get an email the day before each one."
            : "Birthdays will appear here once the admin adds them."}
        </p>
        {onAdd && (
        <button
          onClick={onAdd}
          className="mt-6 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="size-4" /> Add the first birthday
        </button>
        )}
      </div>
    );
  }

  const next = upcoming[0] ?? null;
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-gradient-to-br from-pink-600/10 via-transparent to-amber-600/10 p-6 sm:flex-row sm:items-center sm:p-10">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500">
        <Gift className="size-7 text-white" />
      </span>
      <div className="flex-1">
        <div className="text-xs font-bold tracking-[0.14em] text-pink-400 uppercase">No birthdays today</div>
        {next ? (
          <>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Next up:{" "}
              {upcoming.filter((u) => u.days === next.days).map((u) => u.e.name).join(" & ")}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {fmt(nextBday(next.e.birthday, today), { weekday: "long", day: "numeric", month: "long" })}
              {next.days === 1 && " · tomorrow!"}
            </p>
          </>
        ) : (
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Nothing in the next 60 days</h2>
        )}
      </div>
      {next && (
        <div className="text-left sm:text-right">
          <div className="bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-6xl leading-none font-extrabold text-transparent tabular-nums">
            {next.days}
          </div>
          <div className="text-sm text-muted-foreground">day{next.days === 1 ? "" : "s"} to go</div>
        </div>
      )}
    </div>
  );
}

function MonthGrid({
  view, today, employees, onPick,
}: {
  view: Date;
  today: Date | null;
  employees: Employee[];
  onPick: (d: Date, people: Employee[]) => void;
}) {
  const y = view.getFullYear();
  const m = view.getMonth();
  const first = new Date(y, m, 1);
  const weeks = Math.ceil((first.getDay() + new Date(y, m + 1, 0).getDate()) / 7);
  const cells = Array.from({ length: weeks * 7 }, (_, i) => new Date(y, m, 1 - first.getDay() + i));

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
        <div key={d} className="pb-1 text-center text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          {d}
        </div>
      ))}
      {cells.map((d) => {
        const people = employees.filter((e) => sameDay(bdayIn(e.birthday, d.getFullYear()), d));
        const isToday = today && sameDay(d, today);
        const inMonth = d.getMonth() === m;
        return (
          <button
            key={d.toISOString()}
            type="button"
            disabled={!people.length}
            onClick={() => onPick(d, people)}
            title={people.map((p) => p.name).join(", ") || undefined}
            className={cn(
              "flex min-h-14 flex-col gap-1 rounded-xl border-2 border-transparent bg-muted/20 p-1.5 text-left transition sm:min-h-20",
              !inMonth && "opacity-30",
              people.length && "cursor-pointer bg-gradient-to-br from-pink-500/20 to-amber-500/10 hover:-translate-y-0.5",
              isToday && "border-pink-500"
            )}
          >
            <span className={cn("text-xs font-semibold tabular-nums", isToday ? "text-pink-400" : "text-muted-foreground")}>
              {d.getDate()}
            </span>
            <span className="flex flex-wrap gap-0.5">
              {people.map((p) => (
                <span
                  key={p.id}
                  className={cn(
                    "max-w-full truncate rounded-md bg-gradient-to-r px-1.5 text-[11px] font-semibold text-white",
                    colorFor(p.name),
                    "max-sm:size-2 max-sm:p-0 max-sm:text-[0px]"
                  )}
                >
                  {firstName(p.name)}
                </span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal
        aria-label={title}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <IconBtn label="Close" onClick={onClose} ghost>
            <X className="size-4" />
          </IconBtn>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-sm outline-none focus:border-pink-500/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

function EmployeeModal({ employee, onClose, onSaved }: { employee: Employee | null; onClose: () => void; onSaved: (name: string) => void }) {
  const [name, setName] = useState(employee?.name ?? "");
  const [department, setDepartment] = useState(employee?.department ?? "");
  const [birthday, setBirthday] = useState(employee?.birthday ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = { name, department, birthday };
      if (employee) await api(`/api/birthday/employees/${employee.id}`, { method: "PUT", body });
      else await api("/api/birthday/employees", { method: "POST", body });
      onSaved(name);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <Modal title={employee ? "Edit birthday" : "Add birthday"} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Name">
          <input className={inputCls} required maxLength={80} autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha Rahman" />
        </Field>
        <Field label="Department (optional)">
          <input className={inputCls} maxLength={60} value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Engineering" />
        </Field>
        <Field label="Date of birth">
          <input className={inputCls} type="date" required value={birthday} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setBirthday(e.target.value)} />
        </Field>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button disabled={busy} className="rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function LoginModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/iptv-admin/login", { method: "POST", body: { password } });
      onDone();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <Modal title="Admin sign in" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Admin password">
          <input className={inputCls} type="password" required autoFocus value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button disabled={busy} className="rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function SettingsModal({
  office, smtp, notify, onClose, onSaved,
}: {
  office: Office;
  smtp: boolean;
  notify: (m: string) => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(office.name);
  const [email, setEmail] = useState(office.notifyEmail);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [testing, setTesting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/birthday", { method: "PUT", body: { name, notifyEmail: email } });
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  async function test() {
    setTesting(true);
    try {
      const r = await api<{ to: string }>("/api/birthday/test-email", { method: "POST" });
      notify(`Test email sent to ${r.to}`);
    } catch (err) {
      notify((err as Error).message);
    } finally {
      setTesting(false);
    }
  }

  return (
    <Modal title="Office & email" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Office name">
          <input className={inputCls} required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Send reminders to">
          <input className={inputCls} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <div
          className={cn(
            "flex gap-2 rounded-xl px-3 py-2.5 text-xs leading-relaxed",
            smtp ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
          )}
        >
          <Mail className="mt-0.5 size-3.5 shrink-0" />
          {smtp
            ? "Email is set up. A reminder goes out the day before each birthday. Changes to the address above apply after you save."
            : "Email isn't set up yet. Add SMTP_USER and SMTP_PASS (a Gmail App Password) to .env and restart the server."}
        </div>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <div className="mt-2 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={test}
            disabled={testing || !smtp}
            className="mr-auto rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/40 disabled:opacity-50"
          >
            {testing ? "Sending…" : "Send test email"}
          </button>
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button disabled={busy} className="rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
