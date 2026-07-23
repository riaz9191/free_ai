"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Zap,
  Infinity as InfinityIcon,
  Eye,
  KeyRound,
  ShieldCheck,
  Search,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/nav-bar";

const EASE = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    icon: InfinityIcon,
    title: "No more rate limits",
    description:
      "Every integration — Groq, Mistral, Cohere, Cloudflare, Morph, all of them — stops hitting daily/monthly caps. Chat as much as you want.",
  },
  {
    icon: Zap,
    title: "Priority model routing",
    description:
      "Morph's Auto mode and every model picker default to the strongest tier available (GLM-5.2 744B, MiniMax M3 428B) instead of the cheapest.",
  },
  {
    icon: Eye,
    title: "Vision + audio everywhere",
    description:
      "Image input, speech, and transcription unlock across every chat page, not just the providers that happen to support it today.",
  },
  {
    icon: Search,
    title: "WarpGrep on private repos",
    description:
      "Search your own private GitHub repositories in plain English, not just public ones.",
  },
  {
    icon: KeyRound,
    title: "No setup required",
    description:
      "Every provider's API key is pre-wired for you — skip the .env.local dance entirely.",
  },
  {
    icon: ShieldCheck,
    title: "No Reflex/Router overhead",
    description:
      "Skip the ~90ms Reflex safety check and Router classification hop on every Morph message.",
  },
];

export default function PremiumPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 size-[36rem] rounded-full bg-amber-500/20 blur-[120px]" />
        <div className="absolute top-32 -right-32 size-[32rem] rounded-full bg-orange-600/15 blur-[120px]" />
      </div>

      <NavBar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-12 flex flex-col gap-3"
        >
          <span className="text-xs font-medium tracking-widest text-amber-400 uppercase">
            What you'd actually get
          </span>
          <h1 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
            Here&apos;s what the Premium segment covers
          </h1>
          <p className="max-w-xl text-muted-foreground">
            MyAi itself is free, forever — the setup-instructions lock you
            just ran into is a demo of what a real paid tier on top of these
            free integrations could unlock.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/10 p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15">
                <f.icon className="size-5 text-amber-400" />
              </span>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
{/* 
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-6"
        >
          <p className="text-sm text-amber-200">
            <strong className="font-medium text-amber-100">
              No real payment here.
            </strong>{" "}
            This is a demo app — there&apos;s no billing wired up. The setup
            instructions on any tool page unlock instantly with{" "}
            <kbd className="rounded border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 font-mono text-amber-100">
              Ctrl
            </kbd>
            +
            <kbd className="rounded border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 font-mono text-amber-100">
              J
            </kbd>{" "}
            on that page — no purchase needed.
          </p>
          <Link href="/ai">
            <Button className="rounded-full bg-foreground text-background hover:opacity-90">
              <Check className="size-4" />
              Back to AI Tools
            </Button>
          </Link>
        </motion.div> */}
      </main>
    </div>
  );
}
