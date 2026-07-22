"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  KeyRound,
  Search,
  Loader2,
  FolderGit2,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInfo } from "@/components/ai/floating-info";

const DOCS_URL = "https://docs.morphllm.com/sdk/components/warp-grep";

type SearchResult = { file: string; content: string };

export default function WarpGrepPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[] | null>(null);

  async function search() {
    if (!repoUrl.trim() || !query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/ai/warpgrep/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim(), query: query.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setResults(data.contexts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="shrink-0 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
          <Link
            href="/ai"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to AI Tools
          </Link>
          <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
              <Search className="size-3.5 text-white" />
            </span>
            WarpGrep Code Search
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 min-h-0 flex-col gap-4 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Search any public GitHub repo in plain English
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Morph&apos;s WarpGrep finds relevant code without embeddings or
            indexing — describe what you&apos;re looking for and it returns
            the matching files directly from the repo.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/10 p-5"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              GitHub repo URL
            </span>
            <div className="relative">
              <FolderGit2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/vercel/next.js"
                disabled={loading}
                className="w-full rounded-lg border border-border bg-muted/20 py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
              />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              What are you looking for?
            </span>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  search();
                }
              }}
              placeholder="e.g. authentication middleware (Enter to search, Shift+Enter for a new line)"
              rows={2}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
            />
          </label>
          <Button
            type="submit"
            disabled={loading || !repoUrl.trim() || !query.trim()}
            className="w-fit rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Searching…
              </>
            ) : (
              <>
                <Search className="size-4" />
                Search
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {results && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              {results.length
                ? `${results.length} match${results.length === 1 ? "" : "es"}`
                : "No matches found."}
            </p>
            {results.map((r, i) => (
              <div
                key={`${r.file}-${i}`}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/10 p-4"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-violet-400">
                  <FileCode className="size-3.5 shrink-0" />
                  <span className="truncate font-mono">{r.file}</span>
                </div>
                <pre className="max-h-72 overflow-auto rounded-lg bg-black/40 p-3 font-mono text-xs whitespace-pre-wrap text-foreground/90">
                  {r.content}
                </pre>
              </div>
            ))}
          </div>
        )}
      </main>

      <FloatingInfo accentClassName="text-violet-400">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-foreground">Run this yourself</p>
          <ol className="flex flex-col gap-2.5">
            <li>
              1. Sign up at{" "}
              <a href="https://morphllm.com" target="_blank" rel="noopener noreferrer">
                morphllm.com
              </a>{" "}
              and create an API key.
            </li>
            <li>
              2. <KeyRound className="mr-1 inline size-3.5" />
              Add it to <code>.env.local</code>:
              <pre>MORPH_API_KEY=sk-xxx</pre>
            </li>
            <li>
              3. Restart <code>npm run dev</code>, then paste any public
              GitHub repo URL and describe what you&apos;re looking for —
              no cloning or indexing needed.
            </li>
          </ol>
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex w-fit items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium"
          >
            <Sparkles className="size-3.5" />
            WarpGrep docs
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </FloatingInfo>
    </div>
  );
}
