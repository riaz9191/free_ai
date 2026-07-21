"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, ArrowUpRight, ArrowUp, Check, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const upcomingIntegrations = [
  {
    name: "whisper.cpp",
    owner: "ggml-org",
    description:
      "Fast, on-device speech-to-text. Planned for real-time voice input into MyAi.",
    href: "https://github.com/ggml-org/whisper.cpp",
    stars: "39k",
    color:
      "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
  },
  {
    name: "llama.cpp",
    owner: "ggml-org",
    description:
      "Local LLM inference in pure C/C++. Candidate backend for offline chat.",
    href: "https://github.com/ggml-org/llama.cpp",
    stars: "78k",
    color:
      "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900",
    badge:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  },
  {
    name: "ComfyUI",
    owner: "comfyanonymous",
    description:
      "Node-based image generation pipeline. Under evaluation for the image studio tab.",
    href: "https://github.com/comfyanonymous/ComfyUI",
    stars: "62k",
    color:
      "bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900",
    badge:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300",
  },
  {
    name: "open-webui",
    owner: "open-webui",
    description:
      "Self-hosted AI chat UI reference. Studying its plugin architecture for MyAi.",
    href: "https://github.com/open-webui/open-webui",
    stars: "58k",
    color:
      "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900",
    badge:
      "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300",
  },
  {
    name: "LangChain",
    owner: "langchain-ai",
    description:
      "Agent + tool-orchestration framework. Likely backbone for multi-step workflows.",
    href: "https://github.com/langchain-ai/langchainjs",
    stars: "15k",
    color:
      "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900",
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
  },
  {
    name: "LocalAI",
    owner: "mudler",
    description:
      "Drop-in OpenAI-compatible API for local models. Considered for the free-tier backend.",
    href: "https://github.com/mudler/LocalAI",
    stars: "29k",
    color:
      "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-900",
    badge:
      "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300",
  },
];

const features = [
  {
    icon: Check,
    title: "Unlimited free chat",
    body: "Talk to a capable assistant with no daily caps or usage tiers.",
  },
  {
    icon: Search,
    title: "Research & citations",
    body: "Ask questions and get sourced, verifiable answers instantly.",
  },
  {
    icon: Wrench,
    title: "Build with agents",
    body: "Automate real tasks with tool-calling agents, free to run.",
  },
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && (isDark ? <Sun /> : <Moon />)}
    </Button>
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <Check className="size-5 text-primary" />
            MyAi
          </div>
          <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#integrations" className="hover:text-foreground">
              Integrations
            </a>
            <a href="#get-started" className="hover:text-foreground">
              Get started
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="secondary"
              onClick={() => scrollToId("integrations")}
            >
              Integrations
            </Button>
            <Button onClick={() => scrollToId("get-started")}>
              Start free
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center">
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
            100% free, forever
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            The AI website that never charges you a cent
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            MyAi gives everyone free access to chat, code, and creative AI
            tools — no subscription, no credit card, no catch. Built in the
            open, powered by open-source models.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => scrollToId("get-started")}>
              Start chatting free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToId("integrations")}
            >
              See open-source repos
              <ArrowUpRight />
            </Button>
          </div>
        </section>

        <Separator />

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything you need. Nothing behind a paywall.
            </h2>
            <p className="max-w-lg text-muted-foreground">
              One free account unlocks the full toolkit.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="bg-muted/40">
                <CardHeader>
                  <f.icon className="size-6 text-primary" />
                  <CardTitle className="pt-2">{f.title}</CardTitle>
                  <CardDescription>{f.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Upcoming integrations */}
        <section id="integrations" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex flex-col items-center gap-2 text-center">
            <Badge variant="secondary">Coming soon</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Open-source AI, ready to plug in
            </h2>
            <p className="max-w-xl text-muted-foreground">
              These are the GitHub repos we&apos;re evaluating for future
              integrations into MyAi. Nothing here is wired up yet — this is
              our public shortlist.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingIntegrations.map((repo) => (
              <Link
                key={repo.name}
                href={repo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${repo.owner}/${repo.name} on GitHub`}
                className="block"
              >
                <Card
                  className={cn(
                    "h-full transition-transform hover:-translate-y-0.5 hover:shadow-md",
                    repo.color
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          repo.badge
                        )}
                      >
                        {repo.owner}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ArrowUp className="size-3" />
                        {repo.stars}
                      </span>
                    </div>
                    <CardTitle className="pt-2">{repo.name}</CardTitle>
                    <CardDescription>{repo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="flex items-center gap-1 text-sm font-medium">
                      View repository
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* CTA */}
        <section
          id="get-started"
          className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-20 text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Free AI, no strings attached
          </h2>
          <p className="text-muted-foreground">
            Create an account in seconds and start using MyAi today.
          </p>
          <Button size="lg">Get started — it&apos;s free</Button>
        </section>
      </main>
    </div>
  );
}
