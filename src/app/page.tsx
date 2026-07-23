"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  ArrowUp,
  Check,
  Search,
  Wrench,
  Sparkles,
  Star,
  Zap,
  GitFork,
  FolderGit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/nav-bar";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const upcomingIntegrations = [
  {
    name: "whisper.cpp",
    owner: "ggml-org",
    description:
      "Fast, on-device speech-to-text. Planned for real-time voice input.",
    href: "https://github.com/ggml-org/whisper.cpp",
    stars: "39k",
    accent: "#a78bfa",
  },
  {
    name: "llama.cpp",
    owner: "ggml-org",
    description:
      "Local LLM inference in pure C/C++. Candidate backend for offline chat.",
    href: "https://github.com/ggml-org/llama.cpp",
    stars: "78k",
    accent: "#60a5fa",
  },
  {
    name: "ComfyUI",
    owner: "comfyanonymous",
    description:
      "Node-based image generation pipeline. Under evaluation for image studio.",
    href: "https://github.com/comfyanonymous/ComfyUI",
    stars: "62k",
    accent: "#f472b6",
  },
  {
    name: "open-webui",
    owner: "open-webui",
    description:
      "Self-hosted AI chat UI reference. Studying its plugin architecture.",
    href: "https://github.com/open-webui/open-webui",
    stars: "58k",
    accent: "#2dd4bf",
  },
  {
    name: "LangChain",
    owner: "langchain-ai",
    description:
      "Agent + tool-orchestration framework. Likely backbone for workflows.",
    href: "https://github.com/langchain-ai/langchainjs",
    stars: "15k",
    accent: "#fb923c",
  },
  {
    name: "LocalAI",
    owner: "mudler",
    description:
      "Drop-in OpenAI-compatible API for local models. Free-tier backend candidate.",
    href: "https://github.com/mudler/LocalAI",
    stars: "29k",
    accent: "#4ade80",
  },
];

const features = [
  {
    n: "01",
    icon: Check,
    title: "Unlimited free chat",
    body: "Talk to a capable assistant with no daily caps or usage tiers, ever.",
  },
  {
    n: "02",
    icon: Search,
    title: "Research & citations",
    body: "Ask questions and get sourced, verifiable answers instantly.",
  },
  {
    n: "03",
    icon: Wrench,
    title: "Build with agents",
    body: "Automate real tasks with tool-calling agents, free to run at scale.",
  },
];

const stats = [
  { value: "0", label: "cost, ever" },
  { value: "150k+", label: "people chatting" },
  { value: "24/7", label: "uptime" },
  { value: "6", label: "open models queued" },
];

const marqueeWords = [
  "Free forever",
  "Open source",
  "No credit card",
  "No rate limits",
  "Built in public",
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function GlowCard({
  accent,
  className,
  children,
}: {
  accent: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState({ x: 50, y: 0 });

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      style={
        {
          "--spot-x": `${pos.x}%`,
          "--spot-y": `${pos.y}%`,
        } as React.CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-muted/20 p-7 transition-colors duration-300 hover:border-foreground/20",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500 before:content-[''] group-hover:before:opacity-100",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at var(--spot-x) var(--spot-y), ${accent}14, transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function GradientOrb() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-blue-500/40 blur-[90px]" />
      <div
        className="animate-spin-slow absolute inset-8 rounded-full opacity-80 blur-sm"
        style={{
          background:
            "conic-gradient(from 90deg, #a78bfa, #60a5fa, #f472b6, #a78bfa)",
        }}
      />
      <div
        className="absolute inset-8 rounded-full opacity-90"
        style={{
          background:
            "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.5), transparent 45%), radial-gradient(circle at 65% 75%, rgba(0,0,0,0.35), transparent 55%)",
        }}
      />
    </div>
  );
}

function ChatMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      whileHover={{ rotate: 0, y: -4 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-blue-500/30 blur-2xl" />
      <div className="relative rounded-2xl border border-white/10 bg-neutral-950/80 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-500/70" />
          <span className="size-2.5 rounded-full bg-yellow-500/70" />
          <span className="size-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-neutral-500">myai.chat</span>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/5 px-4 py-2.5 text-sm text-neutral-300">
            Can you help me plan a free AI-powered study group tool?
          </div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-500 to-blue-500 px-4 py-2.5 text-sm text-white shadow-lg shadow-violet-500/20">
            Absolutely — free, no limits. Let&apos;s start with agent roles
            and a shared knowledge base.
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
              <Sparkles className="size-3 text-white" />
            </div>
            <div className="flex gap-1">
              <span className="size-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-neutral-500" />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 1, ease: EASE }}
        className="absolute -bottom-5 -left-8 flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-900/90 px-3 py-2 shadow-xl backdrop-blur-xl"
      >
        <div className="flex -space-x-2">
          {["#a78bfa", "#60a5fa", "#f472b6"].map((c) => (
            <span
              key={c}
              className="size-6 rounded-full border-2 border-neutral-900"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-neutral-300">
          150k+ chatting free
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 1.15, ease: EASE }}
        className="absolute -top-5 -right-6 flex items-center gap-1.5 rounded-xl border border-white/10 bg-neutral-900/90 px-3 py-2 shadow-xl backdrop-blur-xl"
      >
        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-medium text-neutral-300">$0 / mo</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.3, ease: EASE }}
        className="absolute top-1/3 -right-10 hidden items-center gap-2 rounded-xl border border-white/10 bg-neutral-900/90 px-3 py-2 shadow-xl backdrop-blur-xl sm:flex"
      >
        <span className="flex size-6 items-center justify-center rounded-md bg-violet-500/20">
          <Zap className="size-3.5 text-violet-300" />
        </span>
        <span className="text-xs font-medium text-neutral-300">
          Zero cost, ever
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.45, ease: EASE }}
        className="absolute bottom-1/4 -left-10 hidden items-center gap-2 rounded-xl border border-white/10 bg-neutral-900/90 px-3 py-2 shadow-xl backdrop-blur-xl sm:flex"
      >
        <span className="flex size-6 items-center justify-center rounded-md bg-blue-500/20">
          <GitFork className="size-3.5 text-blue-300" />
        </span>
        <span className="text-xs font-medium text-neutral-300">
          Open source
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
      {/* Ambient backdrop — spans the full page height, not just the viewport */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid opacity-[0.25] [mask-image:radial-gradient(ellipse_70%_35%_at_50%_0%,black,transparent)]" />
        <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />

        {/* Hero */}
        <div className="animate-blob absolute -top-40 left-1/4 size-[36rem] rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="animate-blob absolute top-32 -right-32 size-[32rem] rounded-full bg-fuchsia-600/20 blur-[120px] [animation-delay:5s]" />
        <div className="animate-blob absolute top-96 left-1/2 size-[28rem] rounded-full bg-blue-600/20 blur-[120px] [animation-delay:9s]" />

        {/* Features */}
        <div className="animate-blob absolute top-[27%] -left-20 size-[30rem] rounded-full bg-violet-600/40 blur-[110px] [animation-delay:3s]" />

        {/* Integrations */}
        <div className="animate-blob absolute top-[44%] -right-20 size-[32rem] rounded-full bg-blue-600/40 blur-[110px] [animation-delay:7s]" />
        <div className="animate-blob absolute top-[50%] left-16 size-[24rem] rounded-full bg-fuchsia-600/30 blur-[110px] [animation-delay:11s]" />

        {/* CTA */}
        <div className="animate-blob absolute top-[60%] left-1/3 size-[30rem] rounded-full bg-violet-600/35 blur-[110px] [animation-delay:2s]" />
      </div>

      <NavBar />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-20 pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <div className="flex flex-col items-start gap-7 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center gap-2 rounded-full border border-border bg-muted/20 py-1 pr-3 pl-1 text-xs text-foreground/80"
            >
              <span className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-2 py-0.5 font-medium text-white">
                New
              </span>
              100% free, forever — no catch
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
              className="text-[2.75rem] leading-[1.04] font-extrabold tracking-tight sm:text-6xl"
            >
              The AI website
              <br />
              that never charges
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                you a cent.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
              className="max-w-md text-lg text-muted-foreground"
            >
              Chat, code, and create with AI — no subscription, no credit
              card. Built in the open, powered by open-source models.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                className="rounded-full bg-foreground px-7 text-background hover:opacity-90"
                onClick={() => scrollToId("get-started")}
              >
                Start chatting free
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full px-5 text-foreground/80 hover:bg-white/5 hover:text-foreground"
                onClick={() => scrollToId("integrations")}
              >
                See open-source repos
                <ArrowUpRight className="size-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 sm:grid-cols-4"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative flex items-center justify-center">
            <GradientOrb />
            <ChatMockup />
          </div>
        </section>

        {/* Marquee */}
        <div className="relative overflow-hidden border-y border-border bg-muted/20 py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-12">
            {[...marqueeWords, ...marqueeWords, ...marqueeWords].map(
              (word, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 text-xs font-medium tracking-widest text-muted-foreground uppercase"
                >
                  <Sparkles className="size-3 text-violet-400" />
                  {word}
                </span>
              )
            )}
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-28">
          <div className="mb-14 flex flex-col gap-3">
            <span className="text-xs font-medium tracking-widest text-violet-400 uppercase">
              Why MyAi
            </span>
            <h2 className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need.{" "}
              <span className="text-muted-foreground">Nothing behind a paywall.</span>
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="group bg-background p-8 transition-colors hover:bg-muted/40"
              >
                <span className="text-xs font-mono text-muted-foreground/50">
                  {f.n}
                </span>
                <f.icon className="mt-6 size-5 text-violet-400" />
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Upcoming integrations */}
        <section id="integrations" className="mx-auto max-w-6xl px-6 py-28">
          <div className="mb-14 flex flex-col gap-3">
            <span className="text-xs font-medium tracking-widest text-violet-400 uppercase">
              Roadmap · public shortlist
            </span>
            <h2 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
              Open-source AI, ready to plug in
            </h2>
            <p className="max-w-xl text-muted-foreground">
              One integration is already live — the rest are GitHub repos
              we&apos;re evaluating for what&apos;s next.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <GlowCard accent="34, 197, 94" className="h-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-400">
                    <span className="size-1.5 rounded-full bg-green-400" />
                    Live now
                  </span>
                  <a
                    href="https://github.com/sixfingerdev/sixfinger-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open sixfingerdev/sixfinger-api on GitHub"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <FolderGit2 className="size-4" />
                  </a>
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  SixFinger AI Gateway
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  25+ models behind one free, OpenAI-compatible API. Wired
                  into MyAi&apos;s chat right now — try it live.
                </p>
                <Link
                  href="/ai/sixfinger"
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80"
                >
                  Try the live demo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            >
              <GlowCard accent="245, 158, 11" className="h-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    Live now
                  </span>
                  <a
                    href="https://github.com/Free-AI-Things/g4f-working"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Free-AI-Things/g4f-working on GitHub"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <FolderGit2 className="size-4" />
                  </a>
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  Free Provider Catalog
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  113+ no-auth gpt4free providers, tested and republished
                  daily. Browse what&apos;s working right now.
                </p>
                <Link
                  href="/ai/g4f"
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80"
                >
                  Browse the catalog
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            >
              <GlowCard accent="236, 72, 153" className="h-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-pink-500/15 px-2 py-0.5 text-xs font-medium text-pink-400">
                    <span className="size-1.5 rounded-full bg-pink-400" />
                    Live now
                  </span>
                  <a
                    href="https://github.com/lamwon/hermes-image-generation-skill"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open lamwon/hermes-image-generation-skill on GitHub"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <FolderGit2 className="size-4" />
                  </a>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Image Studio</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  DeepSeek engineers the prompt, free FLUX.1-schnell paints
                  it. Describe an idea, get an image.
                </p>
                <Link
                  href="/ai/hermes"
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80"
                >
                  Try the live demo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            >
              <GlowCard accent="6, 182, 212" className="h-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs font-medium text-cyan-400">
                    <span className="size-1.5 rounded-full bg-cyan-400" />
                    Live now
                  </span>
                  <a
                    href="https://github.com/Free-The-Ai/free-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Free-The-Ai/free-ai on GitHub"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <FolderGit2 className="size-4" />
                  </a>
                </div>
                <h3 className="mt-4 text-lg font-semibold">FreeTheAi Chat</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  60+ models behind one free, OpenAI-compatible API. Zero
                  billing, ever.
                </p>
                <Link
                  href="/ai/freetheai"
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80"
                >
                  Try the live demo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            >
              <GlowCard accent="249, 115, 22" className="h-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-400">
                    <span className="size-1.5 rounded-full bg-orange-400" />
                    Live now
                  </span>
                  <a
                    href="https://bazaarlink.ai/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open BazaarLink docs"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
                <h3 className="mt-4 text-lg font-semibold">BazaarLink Chat</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Hundreds of models, one gateway. DeepSeek V4 Flash runs
                  completely free.
                </p>
                <Link
                  href="/ai/bazaarlink"
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80"
                >
                  Try the live demo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
            >
              <GlowCard accent="118, 185, 0" className="h-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-lime-500/15 px-2 py-0.5 text-xs font-medium text-lime-400">
                    <span className="size-1.5 rounded-full bg-lime-400" />
                    Live now
                  </span>
                  <a
                    href="https://build.nvidia.com/models"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open NVIDIA build catalog"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
                <h3 className="mt-4 text-lg font-semibold">NVIDIA NIM Chat</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Llama, DeepSeek, Mistral, Qwen, and Nemotron — hundreds of
                  models via NVIDIA&apos;s free API catalog.
                </p>
                <Link
                  href="/ai/nvidia"
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80"
                >
                  Try the live demo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            >
              <GlowCard accent="99, 102, 241" className="h-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-400">
                    <span className="size-1.5 rounded-full bg-indigo-400" />
                    Live now
                  </span>
                  <a
                    href="https://openrouter.ai/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open OpenRouter docs"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
                <h3 className="mt-4 text-lg font-semibold">OpenRouter Chat</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Every major model, one API. Free-tier models sorted first
                  in the live catalog.
                </p>
                <Link
                  href="/ai/openrouter"
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80"
                >
                  Try the live demo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            >
              <GlowCard accent="163, 163, 163" className="h-full">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-neutral-500/15 px-2 py-0.5 text-xs font-medium text-neutral-400">
                    <span className="size-1.5 rounded-full bg-neutral-400" />
                    Live now
                  </span>
                  <a
                    href="https://docs.github.com/en/github-models"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open GitHub Models docs"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
                <h3 className="mt-4 text-lg font-semibold">GitHub Models</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  GPT, DeepSeek, Llama, Mistral, Phi — free with rate limits,
                  tied to your GitHub account.
                </p>
                <Link
                  href="/ai/github-models"
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80"
                >
                  Try the live demo
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </GlowCard>
            </motion.div>

            {upcomingIntegrations.map((repo, i) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
              >
                <Link
                  href={repo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${repo.owner}/${repo.name} on GitHub`}
                  className="block h-full"
                >
                  <GlowCard accent={repo.accent} className="h-full">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-xs"
                        style={{ color: repo.accent }}
                      >
                        {repo.owner}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ArrowUp className="size-3" />
                        {repo.stars}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      {repo.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {repo.description}
                    </p>
                    <span className="mt-5 flex items-center gap-1 text-sm font-medium text-foreground/80">
                      View repository
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </GlowCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="get-started" className="mx-auto max-w-6xl px-6 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative overflow-hidden rounded-2xl border border-border px-8 py-20 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/25 via-background to-blue-600/25" />
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
            <div className="relative flex flex-col items-center gap-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Free AI, no strings attached
              </h2>
              <p className="max-w-md text-muted-foreground">
                Create an account in seconds and start using MyAi today.
              </p>
              <Button
                size="lg"
                className="rounded-full bg-foreground px-8 text-background hover:opacity-90"
              >
                Get started — it&apos;s free
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © 2026 MyAi. Built free, for everyone.
      </footer>
    </div>
  );
}
