"use client";

import Link from "next/link";
import { motion } from "motion/react";
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
    badge: "★ Best free + limits",
    limit: "Free · 1,000 req/day, 12k tok/min",
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
    badge: "★ Best free models",
    limit: "Free `:free` models · ~20 req/min",
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
    limit: "Free · 10,000 neurons/day (chat + image)",
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
    limit: "Free tier · 50 req/min, 50k tok/min",
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
    limit: "Free · generous rate-limited credits",
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
    limit: "Free · tied to GitHub account limits",
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
    limit: "Trial key · ~20 req/min, ~1,000/mo",
    rank: 7,
  },
  {
    name: "SixFinger AI Chat",
    description:
      "25+ models behind one free, OpenAI-compatible API. Streaming chat with model picker, temperature, and system prompt.",
    icon: MessageSquare,
    href: "/ai/sixfinger",
    accent: "34, 197, 94",
    status: "live" as const,
    limit: "Free · community gateway",
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
    limit: "Free · daily check-in required",
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
    badge: "No free tier",
    limit: "Pay-per-token · no $0 tier",
    rank: 11,
  },
  {
    name: "Image Studio",
    description:
      "DeepSeek writes the prompt, FLUX.1-schnell (free via SiliconFlow) paints it. Describe an idea, get an image.",
    icon: ImageIcon,
    href: "/ai/hermes",
    accent: "236, 72, 153",
    status: "live" as const,
  },
  {
    name: "WarpGrep Code Search",
    description:
      "Search any public GitHub repo in plain English — no embeddings, no indexing, no cloning.",
    icon: Search,
    href: "/ai/warpgrep",
    accent: "139, 92, 246",
    status: "live" as const,
  },
  {
    name: "Free Provider Catalog",
    description:
      "Daily-updated directory of no-auth gpt4free providers and models — 113+ working right now. Catalog only, not wired to chat.",
    icon: Compass,
    href: "/ai/g4f",
    accent: "245, 158, 11",
    status: "live" as const,
  },
];

export default function AiHubPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 size-[36rem] rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute top-32 -right-32 size-[32rem] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-14 flex flex-col gap-3"
        >
          <span className="text-xs font-medium tracking-widest text-violet-400 uppercase">
            Free, forever
          </span>
          <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
            Every AI tool MyAi offers, in one place
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Pick a tool below. Live ones work today — the rest are on the
            public roadmap.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {integrations.map((tool, i) => {
            const isLive = tool.status === "live";
            const CardInner = (
              <div
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-muted/10 p-6 transition-colors",
                  isLive
                    ? "hover:border-foreground/20"
                    : "cursor-default opacity-70"
                )}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgb(${tool.accent}), transparent)`,
                  }}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="flex size-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `rgba(${tool.accent}, 0.15)` }}
                  >
                    <tool.icon
                      className="size-5"
                      style={{ color: `rgb(${tool.accent})` }}
                    />
                  </span>
                  {isLive ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-400">
                      <span className="size-1.5 rounded-full bg-green-400" />
                      Live
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      Coming soon
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{tool.name}</h3>
                  {"badge" in tool && tool.badge && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        backgroundColor: `rgba(${tool.accent}, 0.15)`,
                        color: `rgb(${tool.accent})`,
                      }}
                    >
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
                {"limit" in tool && tool.limit && (
                  <p className="mt-2 text-xs text-muted-foreground/70">{tool.limit}</p>
                )}
                {isLive && (
                  <span className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80">
                    Open
                    <ArrowUpRight className="size-3.5" />
                  </span>
                )}
              </div>
            );

            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
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
        </div>
      </main>
    </div>
  );
}
