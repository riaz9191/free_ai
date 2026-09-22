"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const TIMER_KEY = "ai-ml-focus-timer-v1";
const LOG_KEY = "ai-ml-focus-log-v1";

const PRESETS = [
  { label: "30 min", ms: 30 * 60_000 },
  { label: "1 hour", ms: 60 * 60_000 },
  { label: "2 hours", ms: 120 * 60_000 },
];

const DEFAULT_MS = 60 * 60_000;
const DAILY_GOAL_MS = 120 * 60_000; // office-এর ফাঁকে দিনে ২ ঘণ্টা

/** Running: counts down to `endsAt`. Paused: holds `remaining`. */
type TimerState =
  | { status: "idle"; duration: number }
  | { status: "running"; duration: number; endsAt: number }
  | { status: "paused"; duration: number; remaining: number };

type LogEntry = { at: string; minutes: number };

/**
 * localStorage is outside React, so it is read through an external store:
 * `server()` returns null, which keeps the server HTML and the hydration render
 * identical, and the saved timer appears on the first client render.
 */
function makeStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  let value: T | undefined;

  function read(): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      // unreadable or blocked storage — fall back to a fresh value
    }
    return fallback;
  }

  return {
    subscribe(onChange: () => void) {
      const onStorage = () => {
        value = read();
        onChange();
      };
      listeners.add(onChange);
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    get(): T {
      if (value === undefined) value = read();
      return value;
    },
    server(): null {
      return null;
    },
    set(next: T) {
      value = next;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // storage full or blocked — the session still runs, it just won't survive a reload
      }
      listeners.forEach((fn) => fn());
    },
  };
}

const timerStore = makeStore<TimerState>(TIMER_KEY, {
  status: "idle",
  duration: DEFAULT_MS,
});
const logStore = makeStore<LogEntry[]>(LOG_KEY, []);

function fmt(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/** Short chime, so the end of a session is noticeable even if notifications are off. */
function chime() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    osc.start();
    osc.stop(ctx.currentTime + 1.25);
    osc.onended = () => void ctx.close();
  } catch {
    // audio unavailable (autoplay policy, no device) — the notification still fires
  }
}

export function FocusTimer() {
  // null until mounted, so the server HTML and the hydration render match.
  const timer = useSyncExternalStore(
    timerStore.subscribe,
    timerStore.get,
    timerStore.server,
  );
  const log = useSyncExternalStore(logStore.subscribe, logStore.get, logStore.server);
  const [now, setNow] = useState(() => Date.now());
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    () => (typeof Notification === "undefined" ? "unsupported" : Notification.permission),
  );
  const firedFor = useRef<number | null>(null);
  const mounted = timer !== null;

  // One ticker drives the display; remaining time is always derived from the
  // absolute deadline, so a throttled background tab can't drift.
  useEffect(() => {
    if (timer?.status !== "running") return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [timer?.status]);

  const update = useCallback((next: TimerState) => timerStore.set(next), []);

  const remaining =
    timer == null
      ? DEFAULT_MS
      : timer.status === "running"
        ? timer.endsAt - now
        : timer.status === "paused"
          ? timer.remaining
          : timer.duration;

  const duration = timer?.duration ?? DEFAULT_MS;
  const running = timer?.status === "running";

  const complete = useCallback(
    (finished: TimerState & { status: "running" }) => {
      const entry: LogEntry = {
        at: new Date().toISOString(),
        minutes: Math.round(finished.duration / 60_000),
      };
      logStore.set([entry, ...logStore.get()].slice(0, 200));
      update({ status: "idle", duration: finished.duration });

      chime();
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("⏰ পড়া শেষ — office-এর কাজে ফিরে যাও", {
          body: `${entry.minutes} মিনিট focus session শেষ হয়েছে। Break নাও, তারপর কাজ।`,
          tag: "ai-ml-focus",
        });
      }
    },
    [update],
  );

  // Fire once per deadline, including when the tab was closed and reopened later.
  useEffect(() => {
    if (timer?.status !== "running") return;
    if (timer.endsAt - now > 0) return;
    if (firedFor.current === timer.endsAt) return;
    firedFor.current = timer.endsAt;
    complete(timer);
  }, [timer, now, complete]);

  // Countdown in the tab title, so a background tab still shows progress.
  useEffect(() => {
    if (!running) return;
    const previous = document.title;
    document.title = `${fmt(remaining)} · Focus`;
    return () => {
      document.title = previous;
    };
  }, [running, remaining]);

  async function askPermission() {
    if (typeof Notification === "undefined") return "denied" as const;
    if (Notification.permission !== "default") return Notification.permission;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }

  async function start() {
    await askPermission();
    firedFor.current = null;
    const ms = timer?.status === "paused" ? timer.remaining : duration;
    setNow(Date.now());
    update({ status: "running", duration, endsAt: Date.now() + ms });
  }

  function pause() {
    if (timer?.status !== "running") return;
    update({
      status: "paused",
      duration: timer.duration,
      remaining: Math.max(0, timer.endsAt - Date.now()),
    });
  }

  function reset() {
    firedFor.current = null;
    update({ status: "idle", duration });
  }

  function pickPreset(ms: number) {
    firedFor.current = null;
    update({ status: "idle", duration: ms });
  }

  const todayLog = (log ?? []).filter((e) => isToday(e.at));
  const todayMs = todayLog.reduce((sum, e) => sum + e.minutes * 60_000, 0);
  const todayPct = Math.min(100, Math.round((todayMs / DAILY_GOAL_MS) * 100));
  const elapsedPct = Math.min(
    100,
    Math.max(0, Math.round(((duration - remaining) / duration) * 100)),
  );

  const lastToday = todayLog[0];

  return (
    <section className="mb-10 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Timer className="size-4.5" />
          Focus Timer
        </h2>
        {!mounted ? null : permission === "granted" ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <Bell className="size-3.5" />
            Notification on
          </span>
        ) : permission === "denied" || permission === "unsupported" ? (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BellOff className="size-3.5" />
            Notification বন্ধ
          </span>
        ) : (
          <Button variant="ghost" size="sm" onClick={askPermission}>
            <Bell className="size-3.5" />
            Notification চালু করো
          </Button>
        )}
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        Office-এর ফাঁকে ২ ঘণ্টা। Start করলে সময় শেষে browser notification আসবে —
        তারপর office-এর কাজে ফিরে যাও।
      </p>

      <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className={cn(
              "text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl",
              running && remaining <= 60_000 && "text-amber-500",
            )}
          >
            {fmt(remaining)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {timer?.status === "running"
              ? `শেষ হবে ${new Date(timer.endsAt).toLocaleTimeString("en-GB", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}-এ`
              : timer?.status === "paused"
                ? "Paused"
                : `${Math.round(duration / 60_000)} মিনিট session`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p.ms}
              variant={duration === p.ms ? "secondary" : "ghost"}
              size="sm"
              disabled={running}
              onClick={() => pickPreset(p.ms)}
            >
              {p.label}
            </Button>
          ))}
          <Button size="sm" onClick={running ? pause : start}>
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            {running ? "Pause" : timer?.status === "paused" ? "Resume" : "Start"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            disabled={timer?.status === "idle"}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-linear-to-r from-violet-500 to-blue-500 transition-[width] duration-300"
          style={{ width: `${timer == null ? 0 : elapsedPct}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-sm">
        <span className="text-muted-foreground">
          আজ পড়া হয়েছে{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {Math.round(todayMs / 60_000)} মিনিট
          </span>{" "}
          / 120 — <span className="tabular-nums">{todayPct}%</span>
        </span>
        {lastToday && (
          <span className="text-xs text-muted-foreground">
            শেষ session:{" "}
            {new Date(lastToday.at).toLocaleTimeString("en-GB", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        )}
      </div>
    </section>
  );
}
