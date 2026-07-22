"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  ImageIcon,
  Compass,
  Zap,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Category = "chat" | "image" | "search" | "catalog";

const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All tools" },
  { id: "chat", label: "Chat" },
  { id: "image", label: "Image" },
  { id: "search", label: "Search" },
  { id: "catalog", label: "Catalog" },
];

// Lower rank = shown first. Ranked by (1) model quality available for free,
// (2) how generous the free rate limit is. Tools without a `rank` (catalog/
// image/search utilities, not general chat models) sort to the end.
const integrations = [
  {
    name: "Groq Chat",
    description:
      "Llama, GPT-OSS, and Qwen at very high inference speed — Groq's free developer tier, no card required.",
    icon: MessageSquare,
    href: "/ai/groq",
    accent: "249, 115, 22",
    status: "live" as const,
    category: "chat" as const,
    badge: "Best free",
    limit: "1,000 req/day · 12k tok/min",
    rank: 1,
  },
  {
    name: "OpenRouter Chat",
    description:
      "Every major model, one API. Live catalog with free-tier models sorted first.",
    icon: MessageSquare,
    href: "/ai/openrouter",
    accent: "99, 102, 241",
    status: "live" as const,
    category: "chat" as const,
    badge: "Best models",
    limit: "`:free` models · ~20 req/min",
    rank: 2,
  },
  {
    name: "Cloudflare Workers AI",
    description:
      "Llama, GPT-OSS, and Mistral chat plus Flux/SDXL image generation on Cloudflare's edge — free daily allowance.",
    icon: MessageSquare,
    href: "/ai/cloudflare",
    accent: "249, 115, 22",
    status: "live" as const,
    category: "chat" as const,
    limit: "10,000 neurons/day",
    rank: 3,
  },
  {
    name: "Mistral Chat",
    description:
      "Mistral Small/Large, Codestral, Pixtral, and Ministral — one API key, live model catalog.",
    icon: MessageSquare,
    href: "/ai/mistral",
    accent: "237, 106, 60",
    status: "live" as const,
    category: "chat" as const,
    limit: "50 req/min · 50k tok/min",
    rank: 4,
  },
  {
    name: "NVIDIA NIM Chat",
    description:
      "Llama, DeepSeek, Mistral, Qwen, and Nemotron models via NVIDIA's free API catalog.",
    icon: MessageSquare,
    href: "/ai/nvidia",
    accent: "118, 185, 0",
    status: "live" as const,
    category: "chat" as const,
    limit: "Generous rate-limited credits",
    rank: 5,
  },
  {
    name: "GitHub Models",
    description:
      "GPT, DeepSeek, Llama, Mistral, and Phi — free with rate limits, tied to your GitHub account.",
    icon: MessageSquare,
    href: "/ai/github-models",
    accent: "163, 163, 163",
    status: "live" as const,
    category: "chat" as const,
    limit: "Tied to GitHub account limits",
    rank: 6,
  },
  {
    name: "Cohere Chat",
    description:
      "Command A/R and Aya models, with image-input (vision) support on select models. Free trial key, rate-limited.",
    icon: MessageSquare,
    href: "/ai/cohere",
    accent: "217, 70, 239",
    status: "live" as const,
    category: "chat" as const,
    limit: "Trial · ~20 req/min, ~1,000/mo",
    rank: 7,
    isNew: true,
  },
  {
    name: "SixFinger AI Chat",
    description:
      "25+ models behind one free, OpenAI-compatible API. Streaming chat with model picker, temperature, and system prompt.",
    icon: MessageSquare,
    href: "/ai/sixfinger",
    accent: "34, 197, 94",
    status: "live" as const,
    category: "chat" as const,
    limit: "Community gateway",
    rank: 8,
  },
  {
    name: "FreeTheAi Chat",
    description:
      "60+ models behind one free, OpenAI-compatible API. Model list refreshes live from the catalog.",
    icon: MessageSquare,
    href: "/ai/freetheai",
    accent: "6, 182, 212",
    status: "live" as const,
    category: "chat" as const,
    limit: "Daily check-in required",
    rank: 9,
  },
  {
    name: "BazaarLink Chat",
    description:
      "Hundreds of models through one OpenAI-compatible gateway. DeepSeek V4 Flash runs free.",
    icon: MessageSquare,
    href: "/ai/bazaarlink",
    accent: "249, 115, 22",
    status: "live" as const,
    category: "chat" as const,
    limit: "Only DeepSeek V4 Flash is free",
    rank: 10,
  },
  {
    name: "Morph Chat",
    description:
      "GLM-5.2, DeepSeek V4 Flash, MiniMax, and Qwen at up to 200 tok/s. Auto mode routes to the cheapest model per prompt; every message is Reflex-screened.",
    icon: Zap,
    href: "/ai/morph",
    accent: "20, 184, 166",
    status: "live" as const,
    category: "chat" as const,
    badge: "No free tier",
    limit: "Pay-per-token · no $0 tier",
    rank: 11,
    isNew: true,
  },
  {
    name: "Image Studio",
    description:
      "DeepSeek writes the prompt, FLUX.1-schnell (free via SiliconFlow) paints it. Describe an idea, get an image.",
    icon: ImageIcon,
    href: "/ai/hermes",
    accent: "236, 72, 153",
    status: "live" as const,
    category: "image" as const,
    limit: "Free via SiliconFlow credit",
  },
  {
    name: "WarpGrep Code Search",
    description:
      "Search any public GitHub repo in plain English — no embeddings, no indexing, no cloning.",
    icon: Search,
    href: "/ai/warpgrep",
    accent: "139, 92, 246",
    status: "live" as const,
    category: "search" as const,
    isNew: true,
  },
  {
    name: "Free Provider Catalog",
    description:
      "Daily-updated directory of no-auth gpt4free providers and models — 113+ working right now. Catalog only, not wired to chat.",
    icon: Compass,
    href: "/ai/g4f",
    accent: "245, 158, 11",
    status: "live" as const,
    category: "catalog" as const,
  },
];

const stats = [
  { value: String(integrations.length), label: "Live tools" },
  { value: "$0", label: "Cost to try" },
  { value: "40+", label: "Underlying models" },
  { value: "200 tok/s", label: "Fastest free tier" },
];

export default function AiHubPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return integrations.filter((tool) => {
      const matchesCategory = category === "all" || tool.category === category;
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 size-[36rem] rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute top-32 -right-32 size-[32rem] rounded-full bg-blue-600/15 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to MyAi
          </Link>
          <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-blue-500">
              <Sparkles className="size-3.5 text-white" />
            </span>
            AI Tools
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col items-start gap-6"
          >
            <span className="flex items-center gap-2 rounded-full border border-border bg-muted/20 py-1 pr-3 pl-1 text-xs text-foreground/80">
              <span className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-2 py-0.5 font-medium text-white">
                {integrations.length} tools
              </span>
              100% free to try, no catch
            </span>

            <h1 className="text-[2.5rem] leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
              Every AI tool
              <br />
              MyAi offers,{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                in one place.
              </span>
            </h1>

            <p className="max-w-lg text-lg text-muted-foreground">
              One consistent interface across every provider. Pick a category
              or search to find the right one.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="grid grid-cols-2 divide-x divide-y divide-border rounded-2xl border border-border"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 px-6 py-6">
                <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="mt-12 flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  category === c.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              className="w-full rounded-full border border-border bg-muted/20 py-2 pr-9 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
            />
            {!query && (
              <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                /
              </kbd>
            )}
          </div>
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => {
            const isLive = tool.status === "live";
            const isTopPick = "rank" in tool && tool.rank === 1;
            const CardInner = (
              <div
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty("--mx", `${x}%`);
                  e.currentTarget.style.setProperty("--my", `${y}%`);
                }}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-muted/[0.07] p-6 transition-all duration-300",
                  isLive
                    ? "hover:border-foreground/20 hover:bg-muted/10"
                    : "cursor-default opacity-60"
                )}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 0%), rgba(${tool.accent}, 0.1), transparent 70%)`,
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className="flex size-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `rgba(${tool.accent}, 0.12)` }}
                  >
                    <tool.icon
                      className="size-5"
                      style={{ color: `rgb(${tool.accent})` }}
                    />
                  </span>
                  <div className="flex items-center gap-1.5">
                    {"isNew" in tool && tool.isNew && (
                      <span className="rounded-full border border-cyan-500/25 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
                        New
                      </span>
                    )}
                    {isLive ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-green-400" />
                        Live
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative mt-4 flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{tool.name}</h3>
                  {"badge" in tool && tool.badge && (
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: `rgb(${tool.accent})` }}
                    >
                      {isTopPick ? "★ " : ""}
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
                <div className="relative mt-auto flex items-center justify-between border-t border-border/60 pt-4">
                  {"limit" in tool && tool.limit ? (
                    <span className="font-mono text-[11px] text-muted-foreground/70">
                      {tool.limit}
                    </span>
                  ) : (
                    <span />
                  )}
                  {isLive && (
                    <span className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-transform duration-300 group-hover:translate-x-0.5">
                      Open
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  )}
                </div>
              </div>
            );

            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05, ease: EASE }}
              >
                {isLive ? (
                  <Link href={tool.href} className="block h-full">
                    {CardInner}
                  </Link>
                ) : (
                  CardInner
                )}
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
              <Search className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No tools match &ldquo;{query}&rdquo;.
              </p>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mt-20 overflow-hidden rounded-2xl border border-border px-8 py-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-background to-blue-600/20" />
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-20 mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
          <div className="relative flex flex-col items-center gap-5">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Want more than free gives you?
            </h2>
            <p className="max-w-md text-muted-foreground">
              See what a real premium tier on top of these integrations could
              unlock — no rate limits, priority models, vision everywhere.
            </p>
            <Link href="/premium">
              <Button
                size="lg"
                className="rounded-full bg-foreground px-8 text-background hover:opacity-90"
              >
                Explore Premium
                <ArrowUpRight className="size-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
