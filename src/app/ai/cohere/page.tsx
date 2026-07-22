"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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
  Search,
  Star,
  ImagePlus,
  X,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInfo } from "@/components/ai/floating-info";
import { cn } from "@/lib/utils";

const DOCS_URL = "https://docs.cohere.com";
const STORAGE_KEY = "myai.cohere.chat";
const DEFAULT_MODEL = "command-a-03-2025";

const FALLBACK_MODELS = [
  { id: "command-a-03-2025", group: "Command A", vision: false },
  { id: "command-a-vision-07-2025", group: "Command A", vision: true },
  { id: "command-a-reasoning-08-2025", group: "Command A", vision: false },
  { id: "command-r-08-2024", group: "Command R", vision: false },
  { id: "command-r-plus-08-2024", group: "Command R", vision: false },
  { id: "command-r7b-12-2024", group: "Command R", vision: false },
  { id: "c4ai-aya-vision-32b", group: "Aya", vision: true },
  { id: "c4ai-aya-expanse-32b", group: "Aya", vision: false },
];

const EXCLUDE_ENDPOINTS = ["embed", "embed_image", "transcriptions", "rerank", "classify", "summarize"];

const BEST_MODEL = "command-a-03-2025";
const BEST_FAST_MODEL = "command-r7b-12-2024";

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm running on Cohere's Command family — Command A, Command R, and the multilingual Aya models. Some models support image input too — attach a photo and switch to a **Vision** model in **Options** to try it.",
};

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type Message = {
  role: "user" | "assistant";
  content: string;
  image?: string;
};
type ModelOption = { id: string; label: string; tag: string; group: string; vision: boolean };

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

function ModelPicker({
  models,
  value,
  onChange,
}: {
  models: ModelOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const active = models.find((m) => m.id === value);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = models.filter((m) => m.id.toLowerCase().includes(q));
    const byGroup = new Map<string, ModelOption[]>();
    for (const m of filtered) {
      const list = byGroup.get(m.group) || [];
      list.push(m);
      byGroup.set(m.group, list);
    }
    return [...byGroup.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [models, query]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-left text-sm outline-none"
      >
        <span className="flex items-center gap-1.5 truncate">
          {active?.vision && <Eye className="size-3.5 shrink-0 text-fuchsia-400" />}
          <span className="truncate">
            {active?.label ?? value}
            {value === BEST_MODEL ? " ★" : ""}
          </span>
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-30 mt-1.5 w-[min(22rem,80vw)] overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
          <div className="relative border-b border-border">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models…"
              className="w-full bg-transparent py-2.5 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-72 overflow-y-auto p-1.5">
            {groups.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                No matches.
              </p>
            )}
            {groups.map(([group, items]) => (
              <div key={group} className="mb-1 last:mb-0">
                <p className="px-2.5 pt-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {group}
                </p>
                {items.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onChange(m.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-muted/40",
                      m.id === value && "bg-muted/60"
                    )}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {(m.id === BEST_MODEL || m.id === BEST_FAST_MODEL) && (
                        <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
                      )}
                      {m.vision && <Eye className="size-3 shrink-0 text-fuchsia-400" />}
                      <span className="truncate">{m.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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

export default function CoherePage() {
  const [models, setModels] = useState<ModelOption[]>(
    FALLBACK_MODELS.map((m) => ({ id: m.id, label: m.id, tag: "", group: m.group, vision: m.vision }))
  );
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [temperature, setTemperature] = useState(1);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = loadStoredChat();
    if (stored) setMessages(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    fetch("/api/ai/cohere/models")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return;
        const items: ModelOption[] = (data.models || [])
          .filter((m: { endpoints: string[] }) => m.endpoints.includes("chat"))
          .filter(
            (m: { name: string }) =>
              !EXCLUDE_ENDPOINTS.some((p) => m.name.toLowerCase().includes(p))
          )
          .map((m: { name: string; features?: string[] }) => ({
            id: m.name,
            label: m.name,
            tag: "",
            group: m.name.startsWith("command-a")
              ? "Command A"
              : m.name.startsWith("command-r")
              ? "Command R"
              : m.name.startsWith("c4ai-aya")
              ? "Aya"
              : "Other",
            vision: (m.features || []).includes("vision"),
          }))
          .sort((a: ModelOption, b: ModelOption) => a.id.localeCompare(b.id));
        if (items.length) setModels(items);
      })
      .catch(() => {
        // keep fallback list
      });
  }, []);

  const activeModel = models.find((m) => m.id === model);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function sendMessage() {
    const text = input.trim();
    if ((!text && !pendingImage) || isStreaming) return;

    setError(null);
    const userMessage: Message = { role: "user", content: text, image: pendingImage ?? undefined };
    const nextMessages: Message[] = [...messages, userMessage];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setPendingImage(null);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const apiMessages = nextMessages.map((m) => {
        if (m.role === "user" && m.image) {
          const content: ContentPart[] = [
            { type: "text", text: m.content || "Describe this image." },
            { type: "image_url", image_url: { url: m.image } },
          ];
          return { role: m.role, content };
        }
        return { role: m.role, content: m.content };
      });

      const res = await fetch("/api/ai/cohere/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
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
          const dataLine = event
            .split("\n")
            .find((line) => line.startsWith("data:"));
          if (!dataLine) continue;
          const data = dataLine.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            if (json.type === "content-delta") {
              const delta = json.delta?.message?.content?.text;
              if (delta) {
                assistantText += delta;
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: "assistant", content: assistantText };
                  return copy;
                });
              }
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
    setPendingImage(null);
    window.localStorage.removeItem(STORAGE_KEY);
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
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-600 to-purple-600">
              <Sparkles className="size-3.5 text-white" />
            </span>
            Cohere Chat
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
                <ModelPicker models={models} value={model} onChange={setModel} />
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
                  className="accent-fuchsia-500"
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
              The model list is fetched live from your Cohere account&apos;s
              catalog — embedding, rerank, classify, and transcription models
              are filtered out since this page is chat only.{" "}
              <Eye className="mr-1 inline size-3.5 text-fuchsia-400" />
              models marked with an eye icon accept image input — attach a
              photo below to use them.{" "}
              <strong className="font-medium text-foreground">
                command-a-03-2025
              </strong>{" "}
              is the strongest overall model,{" "}
              <strong className="font-medium text-foreground">
                command-r7b-12-2024
              </strong>{" "}
              is the fastest/lightest. A Cohere trial key is free but rate
              limited (~20 requests/min, ~1,000/month) across every model.
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
                  ? "ml-auto rounded-tr-sm bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white"
                  : "rounded-tl-sm bg-muted/40 text-foreground"
              )}
            >
              {m.image && (
                <Image
                  src={m.image}
                  alt="Attached"
                  width={220}
                  height={220}
                  unoptimized
                  className="mb-2 max-h-48 w-auto rounded-lg object-contain"
                />
              )}
              {m.content ? (
                m.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-pre:my-2 prose-pre:rounded-lg prose-pre:bg-black/40 prose-code:text-fuchsia-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )
              ) : m.role === "assistant" ? (
                <span className="flex gap-1 py-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </span>
              ) : null}
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

        {pendingImage && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted/10 p-2">
            <Image
              src={pendingImage}
              alt="Pending attachment"
              width={40}
              height={40}
              unoptimized
              className="size-10 rounded-md object-cover"
            />
            <span className="flex-1 text-xs text-muted-foreground">
              {activeModel?.vision
                ? "Image attached — ready to send."
                : "Image attached, but the active model doesn't support vision. Switch models in Options."}
            </span>
            <button
              type="button"
              onClick={() => setPendingImage(null)}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground"
              aria-label="Remove attachment"
            >
              <X className="size-4" />
            </button>
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
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full"
            aria-label="Attach image"
            title="Attach image (vision models only)"
          >
            <ImagePlus className="size-4" />
          </Button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${activeModel?.label ?? "Cohere"} anything…`}
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
              disabled={!input.trim() && !pendingImage}
              className="rounded-full bg-foreground text-background hover:opacity-90"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
          )}
        </form>
      </main>

      <FloatingInfo accentClassName="text-fuchsia-400">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-foreground">Run this yourself</p>
          <ol className="flex flex-col gap-2.5">
            <li>
              1. Sign up free at{" "}
              <a href="https://dashboard.cohere.com" target="_blank" rel="noopener noreferrer">
                dashboard.cohere.com
              </a>{" "}
              and generate a trial API key.
            </li>
            <li>
              2. <KeyRound className="mr-1 inline size-3.5" />
              Add it to <code>.env.local</code>:
              <pre>COHERE_API_KEY=xxx</pre>
            </li>
            <li>
              3. Restart <code>npm run dev</code>, then chat. Attach an image
              and switch to a <Eye className="mx-1 inline size-3.5" />{" "}
              Vision model (e.g. <code>command-a-vision-07-2025</code>) to
              ask about photos.
            </li>
          </ol>
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex w-fit items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium"
          >
            <Sparkles className="size-3.5" />
            docs.cohere.com
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </FloatingInfo>
    </div>
  );
}
