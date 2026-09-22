"use client";

import { useMemo } from "react";
import { NavBar } from "@/components/nav-bar";
import { FocusTimer } from "@/components/focus-timer";
import { Button } from "@/components/ui/button";
import {
  Check,
  RotateCcw,
  Moon,
  Target,
  Clock,
  Cloud,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoutine, type SyncStatus } from "@/lib/routine-sync";

type Task = {
  id: string;
  date: string;
  time: string;
  title: string;
  duration: string;
  note?: string;
};

const TASKS: Task[] = [
  {
    id: "m01",
    date: "21 Sep",
    time: "9:00–10:30 AM",
    title: "Module 01: Linear Equation",
    duration: "1h 26m",
  },
  {
    id: "m02",
    date: "22 Sep",
    time: "9:00–10:30 AM",
    title: "Module 02: Scalars & Vectors",
    duration: "1h 17m",
  },
  {
    id: "m03",
    date: "23 Sep",
    time: "9:00–10:30 AM",
    title: "Module 03: Matrices",
    duration: "1h 08m",
  },
  {
    id: "m04",
    date: "24 Sep",
    time: "9:00–10:30 AM",
    title: "Module 04: Derivative from Scratch",
    duration: "1h 02m",
  },
  {
    id: "rev1",
    date: "25 Sep",
    time: "9:00–10:30 AM",
    title: "🔁 Math Revision + Practice",
    duration: "1h 30m",
  },
  {
    id: "m05",
    date: "26 Sep",
    time: "9:00–10:30 AM",
    title: "Module 05: Advanced Derivative",
    duration: "1h 17m",
  },
  {
    id: "m06",
    date: "27 Sep",
    time: "9:00–10:30 AM",
    title: "Module 06: Gradient Descent",
    duration: "58m",
  },
  {
    id: "m07",
    date: "28 Sep",
    time: "9:00–10:30 AM",
    title: "Module 07: Statistics Intro",
    duration: "56m",
  },
  {
    id: "m08",
    date: "29 Sep",
    time: "9:00–10:30 AM",
    title: "Module 08: Probability",
    duration: "58m",
  },
  {
    id: "p01",
    date: "30 Sep",
    time: "9:00–10:30 AM",
    title: "Python 01: Python Basics",
    duration: "1h 15m",
  },
  {
    id: "p02",
    date: "1 Oct",
    time: "9:00–10:30 AM",
    title: "Python 02: Control Flow + Module 04 Practice",
    duration: "1h 44m",
    note: "রাতে String & List-এর ১ ঘণ্টা এগিয়ে নিলে ২ অক্টোবর হালকা হবে",
  },
  {
    id: "p03",
    date: "2 Oct",
    time: "9:00–10:30 AM + 10:30–12:30 PM",
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

  const doneCount = useMemo(
    () => TASKS.filter((t) => progress[t.id]).length,
    [progress],
  );
  const pct = Math.round((doneCount / TASKS.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8">
          <p className="text-sm font-medium text-muted-foreground">
            Job 1 PM–10 PM · Morning study plan
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            AI / ML Routine
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            ২১ সেপ্টেম্বর থেকে ২ অক্টোবর — Math, Statistics, Python এবং Intro to ML.
            প্রতিটা module শেষ করে tick দাও, পাশে শেষ করার সময় বসে যাবে।
          </p>
        </header>

        {/* Progress */}
        <section className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">Progress</p>
                {mounted && <SyncBadge status={status} />}
              </div>
              <p className="text-2xl font-semibold tabular-nums">
                {mounted ? doneCount : 0}
                <span className="text-muted-foreground"> / {TASKS.length}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold tabular-nums">
                {mounted ? pct : 0}%
              </span>
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
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-linear-to-r from-violet-500 to-blue-500 transition-[width] duration-500"
              style={{ width: `${mounted ? pct : 0}%` }}
            />
          </div>
        </section>

        <FocusTimer />

        {/* Main routine */}
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">📘 Daily Study Plan</h2>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {TASKS.map((task) => {
              const completedAt = progress[task.id];
              const done = mounted && Boolean(completedAt);

              return (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => toggle(task.id)}
                    aria-pressed={done}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/50",
                      done && "bg-emerald-500/5",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                        done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-border",
                      )}
                    >
                      {done && <Check className="size-3.5" strokeWidth={3} />}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold">{task.date}</span>
                        <span className="text-xs text-muted-foreground">
                          {task.time}
                        </span>
                        <span className="ml-auto shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                          {task.duration}
                        </span>
                      </span>

                      <span
                        className={cn(
                          "mt-1 block text-[15px]",
                          done && "text-muted-foreground line-through",
                        )}
                      >
                        {task.title}
                      </span>

                      {task.note && !done && (
                        <span className="mt-1 block text-xs text-amber-600 dark:text-amber-400">
                          💡 {task.note}
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
          </ul>
        </section>

        {/* Night routine */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Moon className="size-4.5" />
            প্রতিদিন রাতে
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {NIGHT_ROUTINE.map((row) => (
              <div
                key={row.time}
                className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="shrink-0 text-sm font-semibold sm:w-36">
                  {row.time}
                </span>
                <span className="text-[15px] text-muted-foreground">{row.work}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Targets */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Target className="size-4.5" />
            Target
          </h2>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {TARGETS.map((t) => {
              const hit = mounted && t.taskIds.every((id) => progress[id]);
              return (
                <li
                  key={t.date}
                  className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="shrink-0 text-sm font-semibold sm:w-20">
                    {t.date}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-2 text-[15px]",
                      hit
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {hit ? "✅" : "⬜"} {t.target}
                  </span>
                </li>
              );
            })}
            <li className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
              <span className="shrink-0 text-sm font-semibold sm:w-20">3 Oct</span>
              <span className="text-[15px] text-muted-foreground">
                🚀 Class শুরু — প্রস্তুত
              </span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
