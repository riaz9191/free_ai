"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  ClipboardPaste,
  Timer,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Result = {
  reachable: boolean;
  status?: number;
  statusText?: string;
  ok?: boolean;
  finalUrl?: string;
  timeMs: number;
  error?: string;
};

// Matches bare domains and http(s) URLs embedded anywhere in free-form text,
// while excluding things like "e.g." / "i.e." whose "TLD" is a single letter.
const URL_PATTERN =
  /\b(?:https?:\/\/[^\s<>"')]+|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\/[^\s<>"')]*)?)/g;

function extractCandidates(text: string): string[] {
  const matches = text.match(URL_PATTERN) ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of matches) {
    const cleaned = raw.replace(/[.,;:!?)]+$/, "");
    const normalized = /^https?:\/\//i.test(cleaned) ? cleaned : `http://${cleaned}`;
    try {
      const u = new URL(normalized);
      const key = u.host.toLowerCase() + u.pathname;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(cleaned);
    } catch {
      // not a valid URL once assembled — skip
    }
  }
  return out;
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>
) {
  let index = 0;
  async function next(): Promise<void> {
    const i = index++;
    if (i >= items.length) return;
    await worker(items[i]);
    return next();
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
}

export default function BdixPage() {
  const [url, setUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [bulkText, setBulkText] = useState("");
  const [bulkResults, setBulkResults] = useState<Record<string, Result | null>>({});
  const [bulkRunning, setBulkRunning] = useState(false);

  const candidates = useMemo(() => extractCandidates(bulkText), [bulkText]);

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      // clipboard permission denied — ignore
    }
  }

  async function testSite() {
    const target = url.trim();
    if (!target || checking) return;

    setChecking(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/bdix/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      setResult(data as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setChecking(false);
    }
  }

  async function checkOne(target: string): Promise<Result> {
    try {
      const res = await fetch("/api/bdix/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { reachable: false, timeMs: 0, error: data?.error || `Request failed (${res.status})` };
      }
      return data as Result;
    } catch (e) {
      return { reachable: false, timeMs: 0, error: e instanceof Error ? e.message : "Something went wrong" };
    }
  }

  async function testAll() {
    if (!candidates.length || bulkRunning) return;
    setBulkRunning(true);
    setBulkResults(Object.fromEntries(candidates.map((c) => [c, null])));

    await runWithConcurrency(candidates, 5, async (target) => {
      const r = await checkOne(target);
      setBulkResults((prev) => ({ ...prev, [target]: r }));
    });

    setBulkRunning(false);
  }

  const isUp = result?.reachable;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/3 size-[28rem] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute bottom-0 -right-24 size-[24rem] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <header className="shrink-0 border-b border-border bg-background/70 px-6 py-3.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
          <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-cyan-500">
              <Globe className="size-3.5 text-white" />
            </span>
            BDIX Site Test
          </div>
          <div className="w-[72px]" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Is this website up?
          </h1>
          <p className="text-sm text-muted-foreground">
            Paste a URL and check whether it responds — status code, and response time.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            testSite();
          }}
          className="mt-6 flex items-center gap-2 rounded-full border border-border bg-muted/[0.07] p-1.5 pl-4 transition-colors focus-within:border-blue-500/40"
        >
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. example.com or https://example.com"
            disabled={checking}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={pasteFromClipboard}
            disabled={checking}
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground disabled:opacity-40"
            aria-label="Paste from clipboard"
          >
            <ClipboardPaste className="size-3.5" />
            Paste
          </button>
          <Button
            type="submit"
            disabled={!url.trim() || checking}
            className="rounded-full bg-foreground px-4 text-background hover:opacity-90"
          >
            {checking ? <Loader2 className="size-4 animate-spin" /> : "Test"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div
            className={cn(
              "mt-6 rounded-2xl border p-5",
              isUp
                ? "border-emerald-500/25 bg-emerald-500/[0.06]"
                : "border-red-500/25 bg-red-500/[0.06]"
            )}
          >
            <div className="flex items-center gap-3">
              {isUp ? (
                <CheckCircle2 className="size-8 shrink-0 text-emerald-400" />
              ) : (
                <XCircle className="size-8 shrink-0 text-red-400" />
              )}
              <div className="flex flex-col">
                <span className="text-lg font-semibold">
                  {isUp ? "Site is reachable" : "Site is not reachable"}
                </span>
                {result.finalUrl && (
                  <span className="max-w-md truncate text-xs text-muted-foreground">
                    {result.finalUrl}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {typeof result.status === "number" && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={cn(
                      "font-medium",
                      result.ok ? "text-emerald-400" : "text-amber-400"
                    )}
                  >
                    {result.status} {result.statusText}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Timer className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Response time:</span>
                <span className="font-medium">{result.timeMs}ms</span>
              </div>
            </div>

            {result.error && (
              <p className="mt-3 text-sm text-red-400">{result.error}</p>
            )}
          </div>
        )}

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex items-center gap-2">
            <ListChecks className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold tracking-tight">Bulk check</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste anything — a list, notes, chat logs — and every website
            mentioned in it gets pulled out and validated.
          </p>

          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"Paste mixed text here, e.g.\nCheck this out example.com and also https://another-site.org, thanks!"}
            rows={6}
            disabled={bulkRunning}
            className="mt-4 w-full resize-y rounded-2xl border border-border bg-muted/[0.07] p-4 text-sm outline-none placeholder:text-muted-foreground focus:border-blue-500/40"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {candidates.length
                ? `${candidates.length} website${candidates.length === 1 ? "" : "s"} found`
                : "No websites detected yet"}
            </span>
            <Button
              type="button"
              onClick={testAll}
              disabled={!candidates.length || bulkRunning}
              className="rounded-full bg-foreground px-4 text-background hover:opacity-90"
            >
              {bulkRunning ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Testing…
                </span>
              ) : (
                "Extract & Test All"
              )}
            </Button>
          </div>

          {candidates.length > 0 && (
            <div className="mt-5 flex flex-col gap-2">
              {candidates.map((c) => {
                const r = bulkResults[c];
                return (
                  <div
                    key={c}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/5 px-4 py-3"
                  >
                    <span className="min-w-0 truncate text-sm">{c}</span>
                    <div className="flex shrink-0 items-center gap-3 text-xs">
                      {r === undefined ? null : r === null ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : r.reachable ? (
                        <>
                          <span className="text-muted-foreground">{r.timeMs}ms</span>
                          <span
                            className={cn(
                              "font-medium",
                              r.ok ? "text-emerald-400" : "text-amber-400"
                            )}
                          >
                            {r.status}
                          </span>
                          <CheckCircle2 className="size-4 text-emerald-400" />
                        </>
                      ) : (
                        <>
                          <span className="max-w-56 truncate text-red-400">
                            {r.error || "Unreachable"}
                          </span>
                          <XCircle className="size-4 text-red-400" />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
