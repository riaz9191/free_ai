"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowUpRight,
  Send,
  Sparkles,
  KeyRound,
  Square,
  Trash2,
  Copy,
  Check,
  SlidersHorizontal,
  ChevronDown,
  MessageCircle,
  ImageIcon,
  Loader2,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInfo } from "@/components/ai/floating-info";
import { cn } from "@/lib/utils";

const DOCS_URL = "https://developers.cloudflare.com/workers-ai/";
const CHAT_STORAGE_KEY = "myai.cloudflare.chat";
const DEFAULT_CHAT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const DEFAULT_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const BEST_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const BEST_FAST_MODEL = "@cf/meta/llama-3.2-3b-instruct";

const FALLBACK_MODELS = [
  { id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast", vision: false },
  { id: "@cf/openai/gpt-oss-120b", vision: false },
  { id: "@cf/meta/llama-3.2-11b-vision-instruct", vision: true },
  { id: "@cf/meta/llama-3.2-3b-instruct", vision: false },
  { id: "@cf/mistralai/mistral-small-3.1-24b-instruct", vision: false },
];

const FALLBACK_IMAGE_MODELS = [
  { id: "@cf/black-forest-labs/flux-1-schnell" },
  { id: "@cf/bytedance/stable-diffusion-xl-lightning" },
  { id: "@cf/lykon/dreamshaper-8-lcm" },
  { id: "@cf/leonardo/phoenix-1.0" },
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm running on Cloudflare Workers AI — Llama, GPT-OSS, and Mistral models served from Cloudflare's global edge network. Some models see images too. Ask me anything, or open **Options** to switch models.",
};

type Message = { role: "user" | "assistant"; content: string };
type ModelOption = { id: string; label: string; vision: boolean };
type Tab = "chat" | "image";

function loadStoredChat(): Message[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Copy message"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ErrorBanner({ error }: { error: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
      {error}
    </div>
  );
}

/* ---------------- Chat ---------------- */

function ChatTab() {
  const [models, setModels] = useState<ModelOption[]>(
    FALLBACK_MODELS.map((m) => ({ id: m.id, label: m.id, vision: m.vision }))
  );
  const [model, setModel] = useState(DEFAULT_CHAT_MODEL);
  const [temperature, setTemperature] = useState(1);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = loadStoredChat();
    if (stored) setMessages(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    fetch("/api/ai/cloudflare/models")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return;
        const items: ModelOption[] = (data.data || [])
          .map((m: { id: string; vision: boolean }) => ({ id: m.id, label: m.id, vision: m.vision }))
          .sort((a: ModelOption, b: ModelOption) => a.id.localeCompare(b.id));
        if (items.length) setModels(items);
      })
      .catch(() => {
        // keep fallback list
      });
  }, []);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    setError(null);
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/cloudflare/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          model,
          temperature,
          system: systemPrompt,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          const line = event.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            // ignore malformed SSE chunk
          }
        }
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        // stopped by user — keep partial text
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  const activeModel = models.find((m) => m.id === model);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowOptions((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs transition-colors",
            showOptions
              ? "bg-foreground text-background"
              : "bg-muted/20 text-muted-foreground hover:text-foreground"
          )}
        >
          <SlidersHorizontal className="size-3.5" />
          Options
        </button>
        <button
          type="button"
          onClick={() => {
            setMessages([WELCOME]);
            setError(null);
            window.localStorage.removeItem(CHAT_STORAGE_KEY);
          }}
          className="flex items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Trash2 className="size-3.5" />
          Clear
        </button>
      </div>

      {showOptions && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/10 p-4 sm:flex-row sm:flex-wrap">
          <label className="flex flex-1 min-w-[220px] flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Model</span>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-muted/20 px-3 py-2 pr-8 text-sm outline-none"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                    {m.vision ? " — Vision" : ""}
                    {m.id === BEST_MODEL ? " ★ Best overall" : ""}
                    {m.id === BEST_FAST_MODEL ? " ★ Fastest" : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </label>
          <label className="flex w-full flex-col gap-1.5 sm:w-48">
            <span className="text-xs font-medium text-muted-foreground">
              Temperature — {temperature.toFixed(1)}
            </span>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="accent-orange-500"
            />
          </label>
          <label className="flex flex-[2] min-w-[260px] flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              System prompt (optional)
            </span>
            <input
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="e.g. Answer concisely, like a senior engineer."
              className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <p className="w-full text-xs text-muted-foreground">
            Every model bills per-token against Cloudflare&apos;s Workers AI
            free daily neuron allowance (generous for personal use, no card
            required to start).{" "}
            <Eye className="mr-1 inline size-3.5 text-orange-400" />
            Vision models (e.g.{" "}
            <code>llama-3.2-11b-vision-instruct</code>) accept images — try
            the Image tab for generation instead.
          </p>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-border bg-muted/10 p-5"
      >
        <div className="flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "group max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              m.role === "user"
                ? "ml-auto rounded-tr-sm bg-gradient-to-br from-orange-500 to-amber-600 text-white"
                : "rounded-tl-sm bg-muted/40 text-foreground"
            )}
          >
            {m.content ? (
              m.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-pre:my-2 prose-pre:rounded-lg prose-pre:bg-black/40 prose-code:text-orange-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              ) : (
                m.content
              )
            ) : (
              <span className="flex gap-1 py-1">
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </span>
            )}
            {m.role === "assistant" && m.content && (
              <div className="mt-2 opacity-0 transition-opacity group-hover:opacity-100">
                <CopyButton text={m.content} />
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      {error && <ErrorBanner error={error} />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex shrink-0 items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${activeModel?.label ?? "Cloudflare"} anything…`}
          disabled={isStreaming}
          className="flex-1 rounded-full border border-border bg-muted/20 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
        />
        {isStreaming ? (
          <Button
            type="button"
            size="icon"
            onClick={() => abortRef.current?.abort()}
            className="rounded-full bg-red-500/15 text-red-400 hover:bg-red-500/25"
            aria-label="Stop generating"
          >
            <Square className="size-3.5 fill-current" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            className="rounded-full bg-foreground text-background hover:opacity-90"
            aria-label="Send message"
          >
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  );
}

/* ---------------- Image ---------------- */

function ImageTab() {
  const [models, setModels] = useState<{ id: string }[]>(FALLBACK_IMAGE_MODELS);
  const [model, setModel] = useState(DEFAULT_IMAGE_MODEL);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ imageUrl: string } | null>(null);

  useEffect(() => {
    fetch("/api/ai/cloudflare/models?images=1")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return;
        const items = (data.data || []).map((m: { id: string }) => ({ id: m.id }));
        if (items.length) setModels(items);
      })
      .catch(() => {
        // keep fallback list
      });
  }, []);

  async function generate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/cloudflare/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), model }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setResult({ imageUrl: data.imageUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
        <span>
          <strong className="font-medium">Free to start.</strong> Image
          generation draws from the same free daily neuron allowance as
          chat — no separate billing, just usage limits.
        </span>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-muted/10 p-5 lg:w-1/2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Model</span>
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-muted/20 px-3 py-2 pr-8 text-sm outline-none"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                generate();
              }
            }}
            placeholder="e.g. a red panda astronaut floating in space, studio lighting (Enter to generate, Shift+Enter for a new line)"
            rows={3}
            disabled={loading}
            className="w-full resize-none rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
          />
          <Button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="w-fit rounded-full bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90"
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
          {error && <ErrorBanner error={error} />}
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-1/2">
          <div
            className={cn(
              "flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border bg-muted/10",
              result || loading ? "border-border" : "border-dashed border-border/60"
            )}
          >
            {loading && !result ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : result ? (
              <Image
                src={result.imageUrl}
                alt={prompt}
                width={1024}
                height={1024}
                unoptimized
                className="size-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="size-8" />
                <span className="text-xs">Your image will appear here</span>
              </div>
            )}
          </div>
          {result && (
            <a
              href={result.imageUrl}
              download="cloudflare-image.png"
              className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40"
            >
              <Download className="size-3.5" />
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function CloudflarePage() {
  const [tab, setTab] = useState<Tab>("chat");

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
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-amber-600">
              <Sparkles className="size-3.5 text-white" />
            </span>
            Cloudflare Workers AI
          </div>
          <div className="w-24" />
        </div>
        <div className="mx-auto flex max-w-4xl gap-1 px-6 pb-3">
          {(
            [
              { id: "chat", label: "Chat", icon: MessageCircle },
              { id: "image", label: "Image", icon: ImageIcon },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                tab === t.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon className="size-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 min-h-0 flex-col px-6 py-4">
        {tab === "chat" ? (
          <ChatTab />
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ImageTab />
          </div>
        )}
      </main>

      <FloatingInfo accentClassName="text-orange-400">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-foreground">Run this yourself</p>
          <ol className="flex flex-col gap-2.5">
            <li>
              1. Sign up free at{" "}
              <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer">
                dash.cloudflare.com
              </a>{" "}
              and create an API token with{" "}
              <strong className="text-foreground">Workers AI Read/Edit</strong>{" "}
              permission.
            </li>
            <li>
              2. <KeyRound className="mr-1 inline size-3.5" />
              Add the token and your Account ID (dashboard sidebar) to{" "}
              <code>.env.local</code>:
              <pre>{"CLOUDFLARE_API_TOKEN=cfut_xxx\nCLOUDFLARE_ACCOUNT_ID=xxx"}</pre>
            </li>
            <li>
              3. Restart <code>npm run dev</code>, then switch between Chat
              and Image above. Both draw from the same free daily neuron
              allowance — no card required to start.
            </li>
          </ol>
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex w-fit items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium"
          >
            <Sparkles className="size-3.5" />
            developers.cloudflare.com/workers-ai
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </FloatingInfo>
    </div>
  );
}
