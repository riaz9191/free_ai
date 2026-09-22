"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type LogEntry = { at: string; minutes: number };

export type RoutineDoc = {
  /** task id -> ISO completion timestamp */
  progress: Record<string, string>;
  /** completed focus sessions, newest first */
  log: LogEntry[];
  /** epoch ms of the last local edit; drives last-write-wins on the server */
  updatedAt: number;
};

export type SyncStatus = "loading" | "synced" | "saving" | "offline";

const API = "/api/ai/ml/routine";
const LOCAL_KEY = "ai-ml-routine-doc-v1";
const LEGACY_PROGRESS_KEY = "ai-ml-routine-progress-v1";
const LEGACY_LOG_KEY = "ai-ml-focus-log-v1";
const POLL_MS = 15_000;
const PUSH_DEBOUNCE_MS = 600;

const EMPTY: RoutineDoc = { progress: {}, log: [], updatedAt: 0 };

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const listeners = new Set<() => void>();
let doc: RoutineDoc | undefined; // undefined = not hydrated from localStorage yet
let status: SyncStatus = "loading";
let started = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;

function emit() {
  listeners.forEach((fn) => fn());
}

function readLocal(): RoutineDoc {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as RoutineDoc) };
  } catch {
    // unreadable storage — fall through to the legacy keys, then to empty
  }

  // Ticks recorded before the server sync existed still count.
  const legacy: RoutineDoc = { ...EMPTY };
  try {
    const p = localStorage.getItem(LEGACY_PROGRESS_KEY);
    if (p) legacy.progress = JSON.parse(p) as Record<string, string>;
    const l = localStorage.getItem(LEGACY_LOG_KEY);
    if (l) legacy.log = JSON.parse(l) as LogEntry[];
  } catch {
    // ignore malformed legacy data
  }
  if (Object.keys(legacy.progress).length || legacy.log.length) legacy.updatedAt = Date.now();
  return legacy;
}

function writeLocal(next: RoutineDoc) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  } catch {
    // storage blocked or full — the server copy is still the source of truth
  }
}

function current(): RoutineDoc {
  if (doc === undefined) doc = readLocal();
  return doc;
}

function setStatus(next: SyncStatus) {
  if (status === next) return;
  status = next;
  emit();
}

/** Apply a local edit: stamp it, cache it, and schedule a push. */
function commit(patch: Partial<RoutineDoc>) {
  doc = { ...current(), ...patch, updatedAt: Date.now() };
  writeLocal(doc);
  emit();
  schedulePush();
}

/** Accept a server document only when it is newer than what we hold. */
function adopt(incoming: RoutineDoc) {
  if (incoming.updatedAt <= current().updatedAt) return;
  doc = { ...EMPTY, ...incoming };
  writeLocal(doc);
  emit();
}

// ---------------------------------------------------------------------------
// Network
// ---------------------------------------------------------------------------

async function pull() {
  try {
    const res = await fetch(API, { cache: "no-store" });
    if (!res.ok) throw new Error(`GET ${res.status}`);
    adopt((await res.json()) as RoutineDoc);
    setStatus("synced");
  } catch {
    setStatus("offline");
  }
}

async function push() {
  const sending = current();
  setStatus("saving");
  try {
    const res = await fetch(API, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(sending),
    });
    if (!res.ok) throw new Error(`PUT ${res.status}`);
    // The server returns whichever document won; adopt it if it is ahead of ours.
    adopt((await res.json()) as RoutineDoc);
    setStatus("synced");
  } catch {
    setStatus("offline");
  }
}

function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void push();
  }, PUSH_DEBOUNCE_MS);
}

/** Idempotent: the first mounted consumer starts polling for the whole page. */
function startSync() {
  if (started) return;
  started = true;

  void pull();

  pollTimer = setInterval(() => {
    if (document.visibilityState === "visible" && !pushTimer) void pull();
  }, POLL_MS);

  const onVisible = () => {
    if (document.visibilityState === "visible") void pull();
  };
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("online", onVisible);
  window.addEventListener("storage", () => {
    doc = undefined; // another tab wrote — re-read the cache
    emit();
  });
}

// ---------------------------------------------------------------------------
// React binding
// ---------------------------------------------------------------------------

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** null during SSR and hydration, so the server HTML and first render agree. */
function getServerSnapshot(): null {
  return null;
}

export function useRoutine() {
  const snapshot = useSyncExternalStore(subscribe, current, getServerSnapshot);
  const syncStatus = useSyncExternalStore(
    subscribe,
    () => status,
    () => "loading" as SyncStatus,
  );

  useEffect(() => {
    startSync();
    return () => {
      // Keep the poller alive while any consumer is mounted; both consumers live
      // on the same page, so tearing it down on one unmount would be wrong.
      if (listeners.size === 0 && pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
        started = false;
      }
    };
  }, []);

  const setProgress = useCallback((progress: Record<string, string>) => {
    commit({ progress });
  }, []);

  const addLogEntry = useCallback((entry: LogEntry) => {
    commit({ log: [entry, ...current().log].slice(0, 500) });
  }, []);

  return {
    /** null until mounted on the client */
    doc: snapshot,
    status: syncStatus,
    setProgress,
    addLogEntry,
  };
}
