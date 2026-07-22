"use client";

import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInfo } from "@/components/ai/floating-info";
import { cn } from "@/lib/utils";

const DOCS_URL = "https://docs.github.com/en/github-models";
const STORAGE_KEY = "myai.github-models.chat";
const DEFAULT_MODEL = "openai/gpt-4.1-mini";

const FALLBACK_MODELS = [
  { id: "openai/gpt-4.1-mini", label: "OpenAI GPT-4.1-mini" },
  { id: "openai/gpt-5-mini", label: "OpenAI gpt-5-mini" },
  { id: "deepseek/deepseek-v3-0324", label: "DeepSeek-V3-0324" },
  { id: "meta/llama-3.3-70b-instruct", label: "Llama-3.3-70B-Instruct" },
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm running on GitHub Models — free, rate-limited access to GPT, DeepSeek, Llama, Mistral, and Phi models through your GitHub account. Ask me anything, or open **Options** to switch models.",
};

type Message = { role: "user" | "assistant"; content: string };
type ModelOption = { id: string; label: string };

function loadStoredChat(): Message[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
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

export default function GitHubModelsPage() {
  const [models, setModels] = useState<ModelOption[]>(FALLBACK_MODELS);
  const [model, setModel] = useState(DEFAULT_MODEL);
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    fetch("/api/ai/github-models/models")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return;
        const items: ModelOption[] = (data.data || [])
          .filter((m: { id?: string }) => m.id && !m.id.includes("embedding"))
          .map((m: { id: string; name?: string }) => ({
            id: m.id,
            label: m.name || m.id,
          }))
          .sort((a: ModelOption, b: ModelOption) => a.label.localeCompare(b.label));
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
      const res = await fetch("/api/ai/github-models/chat", {
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

  function stopGenerating() {
    abortRef.current?.abort();
  }

  function clearChat() {
    setMessages([WELCOME]);
    setError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const activeModel = models.find((m) => m.id === model);

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
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-neutral-700 to-neutral-900">
              <Sparkles className="size-3.5 text-white" />
            </span>
            GitHub Models
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearChat}
              className="flex items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Trash2 className="size-3.5" />
              Clear
            </button>
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
          </div>
        </div>

        {showOptions && (
          <div className="border-t border-border bg-background/95 px-6 py-4">
            <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:flex-wrap">
              <label className="flex flex-1 min-w-[220px] flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Model
                </span>
                <div className="relative">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-border bg-muted/20 px-3 py-2 pr-8 text-sm outline-none"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
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
                  className="accent-neutral-500"
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
            </div>
            <p className="mx-auto mt-3 max-w-4xl text-xs text-muted-foreground">
              Free with simple rate limits, tied to your GitHub account. Model
              list refreshes live from the GitHub Models catalog.
            </p>
          </div>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 min-h-0 flex-col px-6 py-4">
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
                  ? "ml-auto rounded-tr-sm bg-gradient-to-br from-neutral-700 to-neutral-900 text-white"
                  : "rounded-tl-sm bg-muted/40 text-foreground"
              )}
            >
              {m.content ? (
                m.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-pre:my-2 prose-pre:rounded-lg prose-pre:bg-black/40 prose-code:text-neutral-300">
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

        {error && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="mt-3 flex shrink-0 items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${activeModel?.label ?? "GitHub Models"} anything…`}
            disabled={isStreaming}
            className="flex-1 rounded-full border border-border bg-muted/20 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
          />
          {isStreaming ? (
            <Button
              type="button"
              size="icon"
              onClick={stopGenerating}
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

      </main>

      <FloatingInfo accentClassName="text-neutral-400">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-foreground">Run this yourself</p>
          <ol className="flex flex-col gap-2.5">
            <li>
              1. Create a GitHub personal access token with{" "}
              <code>models:read</code> permission at{" "}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/settings/tokens
              </a>
              .
            </li>
            <li>
              2. <KeyRound className="mr-1 inline size-3.5" />
              Add it to <code>.env.local</code>:
              <pre>GITHUB_MODELS_TOKEN=github_pat_xxx</pre>
            </li>
            <li>
              3. Restart <code>npm run dev</code>, then chat. Every model is
              free with rate limits — no billing required unless you want
              higher limits.
            </li>
          </ol>
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex w-fit items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium"
          >
            <Sparkles className="size-3.5" />
            docs.github.com/en/github-models
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </FloatingInfo>
    </div>
  );
}
