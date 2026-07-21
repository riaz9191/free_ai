"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Terminal,
  KeyRound,
  FolderGit2,
  Loader2,
  Download,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REPO_URL = "https://github.com/lamwon/hermes-image-generation-skill";

const SIZES = [
  { value: "1024x1024", label: "Square · 1:1" },
  { value: "1280x720", label: "Landscape · 16:9" },
  { value: "720x1280", label: "Portrait · 9:16" },
  { value: "1024x768", label: "4:3" },
  { value: "768x1024", label: "3:4" },
];

export default function HermesImagePage() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState(SIZES[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    imageUrl: string;
    prompt: string;
  } | null>(null);

  async function generate() {
    const text = prompt.trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai/hermes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, size }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setResult({ imageUrl: data.imageUrl, prompt: data.prompt });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-pink-500 to-orange-400">
              <Sparkles className="size-3.5 text-white" />
            </span>
            Image Studio
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Describe it, DeepSeek writes the prompt, Flux paints it
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Type an idea in plain language (English or Chinese) — DeepSeek
            expands it into a detailed image prompt, then FLUX.1-schnell
            (free tier via SiliconFlow) renders it.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/10 p-5">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. a cyberpunk cat with neon fur in a rainy alley"
            rows={3}
            disabled={loading}
            className="w-full resize-none rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSize(s.value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    size === s.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <Button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <ImageIcon className="size-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {(loading || result) && (
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/10 p-5">
            <div className="flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/20 sm:aspect-video sm:max-w-full">
              {loading && !result ? (
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              ) : result ? (
                <Image
                  src={result.imageUrl}
                  alt={result.prompt}
                  width={1024}
                  height={1024}
                  unoptimized
                  className="size-full object-contain"
                />
              ) : null}
            </div>
            {result && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    DeepSeek&apos;s prompt:
                  </span>{" "}
                  {result.prompt}
                </p>
                <a
                  href={result.imageUrl}
                  download="hermes-image.png"
                  className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40"
                >
                  <Download className="size-3.5" />
                  Download image
                </a>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 flex flex-col gap-6 rounded-2xl border border-border bg-muted/10 p-6">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-pink-400" />
            <h2 className="text-sm font-semibold">
              Run this yourself — setup instructions
            </h2>
          </div>
          <ol className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted/40 text-xs font-medium text-foreground">
                1
              </span>
              Get a DeepSeek API key from{" "}
              <a
                href="https://platform.deepseek.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-2"
              >
                platform.deepseek.com
                <ArrowUpRight className="size-3" />
              </a>
              .
            </li>
            <li className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted/40 text-xs font-medium text-foreground">
                2
              </span>
              Sign up free at{" "}
              <a
                href="https://siliconflow.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-2"
              >
                siliconflow.cn
                <ArrowUpRight className="size-3" />
              </a>{" "}
              for a free Flux.1-schnell credit, then grab your key.
            </li>
            <li className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted/40 text-xs font-medium text-foreground">
                3
              </span>
              <span className="flex flex-wrap items-center gap-1.5">
                <KeyRound className="size-3.5" />
                Add both to{" "}
                <code className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-foreground">
                  .env.local
                </code>
                :
              </span>
              <pre className="mt-1 w-full overflow-x-auto rounded-lg bg-muted/40 p-3 font-mono text-xs text-foreground">
                {"DEEPSEEK_API_KEY=sk-...\nSILICONFLOW_API_KEY=sk-..."}
              </pre>
            </li>
            <li className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted/40 text-xs font-medium text-foreground">
                4
              </span>
              Restart the dev server (
              <code className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-foreground">
                npm run dev
              </code>
              ) so the new env vars load, then generate above.
            </li>
          </ol>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 rounded-full border border-border bg-muted/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/40"
          >
            <FolderGit2 className="size-4" />
            lamwon/hermes-image-generation-skill
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </main>
    </div>
  );
}
