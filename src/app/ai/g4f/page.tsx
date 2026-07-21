"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Search,
  FolderGit2,
  Info,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const REPO_URL = "https://github.com/Free-AI-Things/g4f-working";

type Entry = { provider: string; model: string; type: string };
type Summary = {
  total_tested?: number;
  working_count?: number;
  success_rate?: number;
} | null;

const TYPES = ["all", "text", "image", "audio", "video"] as const;

export default function G4fCatalogPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [summary, setSummary] = useState<Summary>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("all");

  useEffect(() => {
    fetch("/api/ai/g4f")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load catalog");
        setEntries(data.entries || []);
        setSummary(data.summary || null);
        setUpdatedAt(data.updatedAt || null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesType = type === "all" || e.type === type;
      const matchesQuery =
        !q ||
        e.provider.toLowerCase().includes(q) ||
        e.model.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [entries, query, type]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
          <Link
            href="/ai"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to AI Tools
          </Link>
          <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-orange-500">
              <Sparkles className="size-3.5 text-white" />
            </span>
            Free Provider Catalog
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            No-auth AI providers, tested daily
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            A daily-updated directory of{" "}
            <a
              href="https://github.com/xtekky/gpt4free"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              gpt4free
            </a>{" "}
            providers and models confirmed working right now with zero API
            keys, tokens, or cookies — sourced from{" "}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Free-AI-Things/g4f-working
            </a>
            .
          </p>

          <div className="flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-500">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              <strong className="font-medium">Catalog only — not wired up.</strong>{" "}
              This page lists what&apos;s currently working; it doesn&apos;t
              route chat through MyAi. gpt4free works by wrapping other
              companies&apos; free chat products without official
              authorization, and the source repo is licensed CC BY-NC 4.0
              (non-commercial). Use accordingly.
            </span>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border bg-muted/10 p-5">
            <div>
              <div className="text-xl font-bold">{summary.working_count}</div>
              <div className="text-xs text-muted-foreground">
                working right now
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">{summary.total_tested}</div>
              <div className="text-xs text-muted-foreground">
                provider/model pairs tested
              </div>
            </div>
            <div>
              <div className="text-xl font-bold">
                {summary.success_rate?.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">success rate</div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search provider or model…"
              className="w-full rounded-full border border-border bg-muted/20 py-2 pr-4 pl-9 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  type === t
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-2xl border border-border">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading catalog…
            </div>
          ) : error ? (
            <div className="px-5 py-8 text-center text-sm text-red-400">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No matches.
            </div>
          ) : (
            <div className="max-h-[50vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/40 text-xs text-muted-foreground backdrop-blur">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">
                      Provider
                    </th>
                    <th className="px-4 py-2 text-left font-medium">Model</th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => (
                    <tr
                      key={`${e.provider}-${e.model}-${i}`}
                      className="border-t border-border/60 hover:bg-muted/20"
                    >
                      <td className="px-4 py-2 font-mono text-xs text-amber-400">
                        {e.provider}
                      </td>
                      <td className="px-4 py-2">{e.model}</td>
                      <td className="px-4 py-2 text-muted-foreground capitalize">
                        {e.type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {updatedAt
              ? `Last updated ${new Date(updatedAt).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "short", day: "numeric" }
                )} · refreshed daily via GitHub Actions`
              : "Updated daily via GitHub Actions"}
          </span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 font-medium transition-colors hover:bg-muted/40"
          >
            <FolderGit2 className="size-3.5" />
            Free-AI-Things/g4f-working
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </main>
    </div>
  );
}
