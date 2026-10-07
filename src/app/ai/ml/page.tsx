"use client";

import { useMemo } from "react";
import Link from "next/link";
import { NavBar } from "@/components/nav-bar";
import { FocusTimer } from "@/components/focus-timer";
import { Button } from "@/components/ui/button";
import {
  Check,
  RotateCcw,
  Moon,
  Clock,
  Cloud,
  CloudOff,
  RefreshCw,
  NotebookText,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoutine, type SyncStatus } from "@/lib/routine-sync";

type PhaseId = "math" | "stats" | "python";

type Task = {
  id: string;
  phase: PhaseId;
  date: string;
  time: string;
  title: string;
  duration: string;
  note?: string;
};

// Class names are spelled out in full so Tailwind can see them.
const PHASES: {
  id: PhaseId;
  name: string;
  blurb: string;
  bar: string;
  dot: string;
  text: string;
  soft: string;
}[] = [
  {
    id: "math",
    name: "Math",
    blurb: "Linear equation থেকে gradient descent পর্যন্ত",
    bar: "bg-indigo-500",
    dot: "bg-indigo-500 ring-indigo-500/25",
    text: "text-indigo-600 dark:text-indigo-400",
    soft: "bg-indigo-500/10",
  },
  {
    id: "stats",
    name: "Statistics & Probability",
    blurb: "Data বোঝার ভাষা",
    bar: "bg-amber-500",
    dot: "bg-amber-500 ring-amber-500/25",
    text: "text-amber-600 dark:text-amber-400",
    soft: "bg-amber-500/10",
  },
  {
    id: "python",
    name: "Python + Intro to ML",
    blurb: "Code লেখা শুরু, তারপর প্রথম ML ধারণা",
    bar: "bg-teal-500",
    dot: "bg-teal-500 ring-teal-500/25",
    text: "text-teal-600 dark:text-teal-400",
    soft: "bg-teal-500/10",
  },
];

const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p])) as Record<
  PhaseId,
  (typeof PHASES)[number]
>;

const TASKS: Task[] = [
  {
    id: "m01",
    phase: "math",
    date: "21 Sep",
    time: "9:00–10:30 AM",
    title: "Module 01: Linear Equation",
    duration: "1h 26m",
  },
  {
    id: "m02",
    phase: "math",
    date: "22 Sep",
    time: "9:00–10:30 AM",
    title: "Module 02: Scalars & Vectors",
    duration: "1h 17m",
  },
  {
    id: "m03",
    phase: "math",
    date: "23 Sep",
    time: "9:00–10:30 AM",
    title: "Module 03: Matrices",
    duration: "1h 08m",
  },
  {
    id: "m04",
    phase: "math",
    date: "24 Sep",
    time: "9:00–10:30 AM",
    title: "Module 04: Derivative from Scratch",
    duration: "1h 02m",
  },
  {
    id: "rev1",
    phase: "math",
    date: "25 Sep",
    time: "9:00–10:30 AM",
    title: "Math Revision + Practice",
    duration: "1h 30m",
  },
  {
    id: "m05",
    phase: "math",
    date: "26 Sep",
    time: "9:00–10:30 AM",
    title: "Module 05: Advanced Derivative",
    duration: "1h 17m",
  },
  {
    id: "m06",
    phase: "math",
    date: "27 Sep",
    time: "9:00–10:30 AM",
    title: "Module 06: Gradient Descent",
    duration: "58m",
  },
  {
    id: "m07",
    phase: "stats",
    date: "28 Sep",
    time: "9:00–10:30 AM",
    title: "Module 07: Statistics Intro",
    duration: "56m",
  },
  {
    id: "m08",
    phase: "stats",
    date: "29 Sep",
    time: "9:00–10:30 AM",
    title: "Module 08: Probability",
    duration: "58m",
  },
  {
    id: "p01",
    phase: "python",
    date: "30 Sep",
    time: "9:00–10:30 AM",
    title: "Python 01: Python Basics",
    duration: "1h 15m",
  },
  {
    id: "p02",
    phase: "python",
    date: "1 Oct",
    time: "9:00–10:30 AM",
    title: "Python 02: Control Flow + Module 04 Practice",
    duration: "1h 44m",
    note: "রাতে String & List-এর ১ ঘণ্টা এগিয়ে নিলে ২ অক্টোবর হালকা হবে",
  },
  {
    id: "p03",
    phase: "python",
    date: "2 Oct",
    time: "9:00 AM–12:30 PM",
    title: "Python 03: String & List + 05: Tuple/Set/Dictionary + 06: Intro to ML",
    duration: "~4h 30m",
  },
];

const NIGHT_ROUTINE = [
  {
    time: "10:30–11:00 PM",
    work: "সকালে যা পড়েছো সেটা revise + 2–3টা ছোট problem",
  },
];

const TARGETS = [
  { date: "25 Sep", target: "Basic Math Complete", taskIds: ["m01", "m02", "m03", "m04", "rev1"] },
  {
    date: "29 Sep",
    target: "Math + Statistics + Probability Complete",
    taskIds: ["m05", "m06", "m07", "m08"],
  },
  { date: "1 Oct", target: "Python Basics + Control Flow Complete", taskIds: ["p01", "p02"] },
  { date: "2 Oct", target: "পুরো Python + Intro to ML Complete", taskIds: ["p03"] },
];

const CLASS_START = new Date(2026, 9, 3);

function formatStamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function classCountdown() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((CLASS_START.getTime() - today.getTime()) / 86_400_000);
  if (days > 1) return `Class শুরু ${days} দিন পর`;
  if (days === 1) return "Class শুরু আগামীকাল";
  if (days === 0) return "Class আজ শুরু";
  return "Class শুরু হয়ে গেছে";
}

function SyncBadge({ status }: { status: SyncStatus }) {
  if (status === "offline") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
        <CloudOff className="size-3.5" />
        Offline — এই device-এ সেভ আছে
      </span>
    );
  }
  if (status === "saving" || status === "loading") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <RefreshCw className="size-3.5 animate-spin" />
        Syncing…
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
      <Cloud className="size-3.5" />
      সব device-এ সেভ
    </span>
  );
}

function CheckMark({ done, className }: { done: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-background transition-colors",
        done ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/35",
        className,
      )}
    >
      {done && (
        <Check
          className="size-3.5 motion-safe:animate-in motion-safe:zoom-in-50"
          strokeWidth={3}
        />
      )}
    </span>
  );
}

export default function MlRoutinePage() {
  const { doc, status, setProgress } = useRoutine();
  const mounted = doc !== null;
  const progress = useMemo(() => doc?.progress ?? {}, [doc]);

  function toggle(id: string) {
    const next = { ...progress };
    if (next[id]) delete next[id];
    else next[id] = new Date().toISOString();
    setProgress(next);
  }

  function resetAll() {
    if (confirm("সব tick মুছে যাবে। নিশ্চিত?")) setProgress({});
  }

  const isDone = (id: string) => mounted && Boolean(progress[id]);
  const doneCount = TASKS.filter((t) => isDone(t.id)).length;
  const pct = Math.round((doneCount / TASKS.length) * 100);
  const nextTask = mounted ? TASKS.find((t) => !progress[t.id]) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        {/* Hero: the whole sprint as one strip, one segment per study day */}
        <header className="relative overflow-hidden rounded-3xl border border-border bg-card px-5 py-7 sm:px-8 sm:py-9">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-indigo-500/10 blur-3xl"
          />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-sm text-muted-foreground">
                সকালের study plan, job 1 PM–10 PM-এর আগে
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                AI / ML Routine
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                ২১ সেপ্টেম্বর থেকে ২ অক্টোবর — Math, Statistics, Python এবং Intro
                to ML. প্রতিটা module শেষ করে tick দাও, পাশে শেষ করার সময় বসে যাবে।
              </p>
            </div>
            <Link
              href="/ai/ml/lessons"
              className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <NotebookText className="size-4" />
              Lesson notes
            </Link>
          </div>

          <div className="relative mt-9">
            <div className="flex gap-3 sm:gap-4">
              {PHASES.map((phase) => {
                const tasks = TASKS.filter((t) => t.phase === phase.id);
                return (
                  <div
                    key={phase.id}
                    className="min-w-0"
                    style={{ flexGrow: tasks.length, flexBasis: 0 }}
                  >
                    <p className={cn("truncate text-xs font-medium", phase.text)}>
                      {phase.name}
                    </p>
                    <div className="mt-2 flex gap-1">
                      {tasks.map((t, i) => {
                        const done = isDone(t.id);
                        return (
                          <a
                            key={t.id}
                            href={`#${t.id}`}
                            title={`${t.date} · ${t.title}`}
                            aria-label={`${t.title}${done ? " (done)" : ""}`}
                            className="group flex-1 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
                          >
                            <span className="relative block h-10 overflow-hidden rounded-md bg-muted sm:h-12">
                              <span
                                className={cn(
                                  "absolute inset-0 origin-bottom transition-transform duration-700 ease-out motion-reduce:transition-none",
                                  phase.bar,
                                  done ? "scale-y-100" : "scale-y-0",
                                )}
                                style={{ transitionDelay: `${i * 60}ms` }}
                              />
                              {nextTask?.id === t.id && (
                                <span className="absolute inset-0 rounded-md ring-2 ring-inset ring-foreground/60" />
                              )}
                            </span>
                            <span className="mt-1.5 hidden text-center text-[11px] tabular-nums text-muted-foreground group-hover:text-foreground sm:block">
                              {t.date.split(" ")[0]}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border pt-5">
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <p className="text-3xl font-semibold tabular-nums tracking-tight">
                  {doneCount}
                  <span className="text-lg text-muted-foreground"> of {TASKS.length} done</span>
                </p>
                <p className="text-sm text-muted-foreground">{pct}% complete</p>
                {mounted && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Flag className="size-3.5" />
                    {classCountdown()} (3 Oct)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {mounted && <SyncBadge status={status} />}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAll}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {/* Next up */}
            {mounted && (
              <section className="mb-8">
                {nextTask ? (
                  <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            PHASE_BY_ID[nextTask.phase].bar,
                          )}
                        />
                        এরপর পড়বে · {nextTask.date}
                      </p>
                      <p className="mt-1.5 text-lg font-semibold leading-snug">
                        {nextTask.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {nextTask.time} · {nextTask.duration}
                      </p>
                    </div>
                    <Button onClick={() => toggle(nextTask.id)} className="shrink-0">
                      <Check className="size-4" />
                      Mark done
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                    <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                      সব module শেষ — class-এর জন্য প্রস্তুত
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      রাতের revision চালিয়ে যাও, আর lesson notes থেকে practice করো।
                    </p>
                  </div>
                )}
              </section>
            )}

            <FocusTimer />

            {/* Study plan, grouped by phase on a single timeline rail */}
            <section>
              <h2 className="mb-5 text-xl font-semibold tracking-tight">Daily study plan</h2>
              <div className="space-y-8">
                {PHASES.map((phase) => {
                  const tasks = TASKS.filter((t) => t.phase === phase.id);
                  const phaseDone = tasks.filter((t) => isDone(t.id)).length;
                  return (
                    <div key={phase.id}>
                      <div className="mb-3 flex items-baseline justify-between gap-3">
                        <div>
                          <h3 className={cn("text-base font-semibold", phase.text)}>
                            {phase.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{phase.blurb}</p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums",
                            phase.soft,
                            phase.text,
                          )}
                        >
                          {phaseDone}/{tasks.length}
                        </span>
                      </div>

                      <ol className="overflow-hidden rounded-2xl border border-border bg-card">
                        {tasks.map((task, i) => {
                          const completedAt = progress[task.id];
                          const done = isDone(task.id);
                          const [day, month] = task.date.split(" ");
                          const isNext = nextTask?.id === task.id;

                          return (
                            <li
                              key={task.id}
                              id={task.id}
                              className={cn("scroll-mt-24", i > 0 && "border-t border-border")}
                            >
                              <button
                                type="button"
                                onClick={() => toggle(task.id)}
                                aria-pressed={done}
                                className={cn(
                                  "group flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none sm:px-5",
                                  done && "bg-emerald-500/4",
                                )}
                              >
                                <span className="w-10 shrink-0 text-center">
                                  <span className="block text-xl font-semibold leading-none tabular-nums">
                                    {day}
                                  </span>
                                  <span className="mt-1 block text-xs text-muted-foreground">
                                    {month}
                                  </span>
                                </span>

                                <CheckMark
                                  done={done}
                                  className={cn(
                                    "mt-0.5",
                                    !done && "group-hover:border-foreground/40",
                                    isNext && !done && "border-foreground/60",
                                  )}
                                />

                                <span className="min-w-0 flex-1">
                                  <span
                                    className={cn(
                                      "block text-[15px] font-medium leading-snug",
                                      done && "text-muted-foreground line-through decoration-muted-foreground/50",
                                    )}
                                  >
                                    {task.title}
                                  </span>
                                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                    <span>{task.time}</span>
                                    <span className="tabular-nums">{task.duration}</span>
                                  </span>

                                  {task.note && !done && (
                                    <span className="mt-2 block rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-300">
                                      {task.note}
                                    </span>
                                  )}

                                  {done && completedAt && (
                                    <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                      <Clock className="size-3" />
                                      শেষ হয়েছে — {formatStamp(completedAt)}
                                    </span>
                                  )}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Side column: milestones and the nightly habit */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold">Milestones</h2>
              <ol className="relative mt-4 space-y-5 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-border">
                {TARGETS.map((t) => {
                  const hitCount = t.taskIds.filter(isDone).length;
                  const hit = hitCount === t.taskIds.length;
                  return (
                    <li key={t.date} className="relative flex gap-3">
                      <CheckMark done={hit} />
                      <div className="min-w-0 pt-0.5">
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                        <p
                          className={cn(
                            "text-sm font-medium leading-snug",
                            hit && "text-emerald-700 dark:text-emerald-400",
                          )}
                        >
                          {t.target}
                        </p>
                        {!hit && (
                          <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                            {hitCount} of {t.taskIds.length} modules
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
                <li className="relative flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                    <Flag className="size-3" />
                  </span>
                  <div className="pt-0.5">
                    <p className="text-xs text-muted-foreground">3 Oct</p>
                    <p className="text-sm font-medium">Class শুরু</p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="mt-6 rounded-2xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Moon className="size-4" />
                প্রতিদিন রাতে
              </h2>
              {NIGHT_ROUTINE.map((row) => (
                <div key={row.time} className="mt-3">
                  <p className="text-sm font-medium tabular-nums">{row.time}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {row.work}
                  </p>
                </div>
              ))}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
