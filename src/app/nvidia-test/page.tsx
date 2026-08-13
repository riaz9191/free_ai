"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Square,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  Search,
  Star,
  PanelLeftClose,
  PanelLeft,
  Plus,
  MessageSquare,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "myai.nvidia-test.conversations";
const DEFAULT_MODEL = "nvidia/nemotron-3-nano-30b-a3b";
const BEST_MODEL = "nvidia/nemotron-3-super-120b-a12b";

const FALLBACK_MODELS: ModelOption[] = [
  { id: "stepfun-ai/step-3.7-flash", label: "stepfun-ai/step-3.7-flash", tag: "Fast coding", group: "StepFun" },
  { id: "nvidia/nemotron-3-nano-30b-a3b", label: "nvidia/nemotron-3-nano-30b-a3b", tag: "NVIDIA fast/light", group: "NVIDIA" },
  { id: "nvidia/nemotron-3-super-120b-a12b", label: "nvidia/nemotron-3-super-120b-a12b", tag: "Heavy coding/reasoning", group: "NVIDIA" },
  { id: "minimaxai/minimax-m2.7", label: "minimaxai/minimax-m2.7", tag: "Agentic coding", group: "MiniMax" },
  { id: "minimaxai/minimax-m3", label: "minimaxai/minimax-m3", tag: "Multimodal coding", group: "MiniMax" },
  { id: "nvidia/llama-3.3-nemotron-super-49b-v1.5", label: "nvidia/llama-3.3-nemotron-super-49b-v1.5", tag: "Free", group: "NVIDIA" },
  { id: "nvidia/llama-3.3-nemotron-super-49b-v1", label: "nvidia/llama-3.3-nemotron-super-49b-v1", tag: "Free", group: "NVIDIA" },
  { id: "nvidia/nemotron-mini-4b-instruct", label: "nvidia/nemotron-mini-4b-instruct", tag: "Free", group: "NVIDIA" },
  { id: "nvidia/nvidia-nemotron-nano-9b-v2", label: "nvidia/nvidia-nemotron-nano-9b-v2", tag: "Free", group: "NVIDIA" },
  { id: "openai/gpt-oss-120b", label: "openai/gpt-oss-120b", tag: "Free", group: "OpenAI" },
  { id: "openai/gpt-oss-20b", label: "openai/gpt-oss-20b", tag: "Free", group: "OpenAI" },
  { id: "meta/llama-3.1-70b-instruct", label: "meta/llama-3.1-70b-instruct", tag: "Free", group: "Meta" },
  { id: "meta/llama-3.1-8b-instruct", label: "meta/llama-3.1-8b-instruct", tag: "Free", group: "Meta" },
  { id: "mistralai/mistral-nemotron", label: "mistralai/mistral-nemotron", tag: "Free", group: "Mistral AI" },
];

type Message = { role: "user" | "assistant"; content: string };
type ModelOption = { id: string; label: string; tag: string; group: string };
type Conversation = {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  createdAt: number;
};

function newConversation(model: string): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    model,
    messages: [],
    createdAt: Date.now(),
  };
}

function loadConversations(): Conversation[] | null {
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
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const active = models.find((m) => m.id === value);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-model-picker-menu]")
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  }, [open]);

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
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium outline-none transition-colors hover:bg-muted/40"
      >
        <span className="max-w-[14rem] truncate sm:max-w-[22rem]">
          {active?.label ?? value}
          {value === BEST_MODEL ? " ★" : ""}
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              aria-hidden
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div
              data-model-picker-menu
              style={{ top: coords.top, left: coords.left, width: "min(22rem, 80vw)" }}
              className="fixed z-50 overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
            >
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
                          {m.id === BEST_MODEL && (
                            <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
                          )}
                          <span className="truncate">{m.label}</span>
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {m.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>,
          document.body
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

export default function NvidiaTestPage() {
  const models = FALLBACK_MODELS;
  const initial = useMemo(() => [newConversation(DEFAULT_MODEL)], []);
  const [conversations, setConversations] = useState<Conversation[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(() => initial[0]?.id ?? null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const assistantRef = useRef("");

  const active = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    const stored = loadConversations();
    if (stored) {
      setConversations(stored);
      setActiveId(stored[0].id);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [mounted, conversations]);

  function updateActive(fn: (c: Conversation) => Conversation) {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? fn(c) : c))
    );
  }

  function createChat() {
    const c = newConversation(active?.model ?? DEFAULT_MODEL);
    setConversations((prev) => [c, ...prev]);
    setActiveId(c.id);
    setInput("");
    setError(null);
  }

  function deleteChat(id: string) {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (id === activeId) {
        if (next.length) setActiveId(next[0].id);
        else {
          const fresh = newConversation(DEFAULT_MODEL);
          setActiveId(fresh.id);
          return [fresh];
        }
      }
      return next;
    });
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming || !active) return;

    setError(null);
    const nextMessages: Message[] = [...active.messages, { role: "user", content: text }];
    const isFirst = active.messages.length === 0;
    updateActive((c) => ({
      ...c,
      messages: [...nextMessages, { role: "assistant", content: "" }],
      title: isFirst ? text.slice(0, 48) : c.title,
    }));
    setInput("");
    setIsStreaming(true);
    assistantRef.current = "";

    const controller = new AbortController();
    abortRef.current = controller;
    const model = active.model;
    const convId = active.id;

    try {
      const res = await fetch("/api/ai/nvidia/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, model }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

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
              assistantRef.current += delta;
              setConversations((prev) =>
                prev.map((c) => {
                  if (c.id !== convId) return c;
                  const copy = [...c.messages];
                  copy[copy.length - 1] = { role: "assistant", content: assistantRef.current };
                  return { ...c, messages: copy };
                })
              );
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
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId ? { ...c, messages: c.messages.slice(0, -1) } : c
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function stopGenerating() {
    abortRef.current?.abort();
  }

  const messages = active?.messages ?? [];
  const activeModelLabel = models.find((m) => m.id === active?.model)?.label ?? active?.model;

  return (
    <div className="relative flex h-dvh overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/3 size-[28rem] rounded-full bg-emerald-600/10 blur-[130px]" />
        <div className="absolute bottom-0 -right-24 size-[24rem] rounded-full bg-green-500/10 blur-[130px]" />
      </div>

      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-muted/[0.06]"
          >
            <div className="flex items-center justify-between gap-2 p-3">
              <Link
                href="/ai"
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                AI Tools
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>

            <div className="px-3 pb-2">
              <button
                type="button"
                onClick={createChat}
                className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/40"
              >
                <Plus className="size-4" />
                New chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-3">
              <div className="flex flex-col gap-0.5">
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      c.id === activeId
                        ? "bg-muted/60 text-foreground"
                        : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <MessageSquare className="size-3.5 shrink-0" />
                      {renamingId === c.id ? (
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateActive((cur) =>
                                cur.id === c.id ? { ...cur, title: renameValue.trim() || cur.title } : cur
                              );
                              setConversations((prev) =>
                                prev.map((x) =>
                                  x.id === c.id ? { ...x, title: renameValue.trim() || x.title } : x
                                )
                              );
                              setRenamingId(null);
                            } else if (e.key === "Escape") {
                              setRenamingId(null);
                            }
                          }}
                          onBlur={() => setRenamingId(null)}
                          className="min-w-0 flex-1 truncate bg-transparent text-sm outline-none"
                        />
                      ) : (
                        <span className="truncate">{c.title}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRenamingId(c.id);
                        setRenameValue(c.title);
                      }}
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Rename chat"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteChat(c.id)}
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex h-full min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-background/70 px-4 py-2.5 backdrop-blur-xl">
          <div className="flex items-center gap-1">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="mr-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="size-4" />
              </button>
            )}
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-600 to-green-500">
              <Sparkles className="size-3.5 text-white" />
            </span>
            {active && (
              <ModelPicker
                models={models}
                value={active.model}
                onChange={(id) => updateActive((c) => ({ ...c, model: id }))}
              />
            )}
          </div>
          {isStreaming ? null : (
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-green-400" />
              </span>
              Connected
            </span>
          )}
        </header>

        <main className="mx-auto flex w-full max-w-3xl flex-1 min-h-0 flex-col px-4 py-4">
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-5 px-4 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 shadow-lg shadow-emerald-500/20">
                  <Sparkles className="size-7 text-white" />
                </span>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Ask {activeModelLabel ?? "NVIDIA"} anything
                  </h2>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Switch models above, start a new chat, or pick up an old
                    one from the sidebar.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pb-2">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      "group max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "ml-auto rounded-tr-sm bg-gradient-to-br from-emerald-600 to-green-500 text-white shadow-sm shadow-emerald-500/20"
                        : "rounded-tl-sm border border-border/60 bg-muted/40 text-foreground shadow-sm"
                    )}
                  >
                    {m.content ? (
                      m.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-pre:my-2 prose-pre:rounded-lg prose-pre:bg-black/40 prose-code:text-emerald-300">
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
                  </motion.div>
                ))}
              </div>
            )}
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
            className="mt-3 flex shrink-0 items-center gap-2 rounded-full border border-border bg-muted/[0.07] p-1.5 pl-4 transition-colors focus-within:border-emerald-500/30"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${activeModelLabel ?? "NVIDIA"}…`}
              disabled={isStreaming}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
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
      </div>
    </div>
  );
}
