"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, MessageCircle, Send, Square, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const MODEL = "openai/gpt-oss-120b";

const SUGGESTIONS = [
  "Gradient descent সহজ ভাষায় বোঝাও",
  "Overfitting কী, কীভাবে কমাবো?",
  "NumPy broadcasting এর একটা উদাহরণ দাও",
];

function systemPrompt(pathname: string) {
  return [
    "You are a friendly, patient Machine Learning & Python tutor embedded in a learning site.",
    "The learner is usually a Bangla speaker. Reply in the same language the user writes in (Bangla, English, or Banglish mix).",
    "Keep answers concise and practical. Use short code examples in Python (NumPy, pandas, scikit-learn, PyTorch) when helpful, with fenced code blocks.",
    "Explain intuition first, then math only if needed.",
    `The learner is currently viewing the page: ${pathname}. Use it as context if relevant.`,
  ].join(" ");
}

export function MlChatbot() {
  const pathname = usePathname() || "/ai/ml";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send(textArg?: string) {
    const text = (textArg ?? input).trim();
    if (!text || isStreaming) return;

    setError(null);
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          model: MODEL,
          temperature: 0.5,
          system: systemPrompt(pathname),
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
      let answer = "";

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
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) {
              answer += delta;
              const content = answer;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content };
                return copy;
              });
            }
          } catch {
            // ignore malformed SSE chunk
          }
        }
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function clear() {
    stop();
    setMessages([]);
    setError(null);
  }

  return (
    // Below lg the lesson TOC button owns bottom-right, so sit above it there.
    <div className="fixed right-5 bottom-20 z-40 lg:bottom-5">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 bottom-full mb-3 flex h-[min(34rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-label="ML AI assistant"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                <Bot className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">ML Tutor</p>
                <p className="text-[11px] text-muted-foreground">Powered by Groq · GPT-OSS 120B</p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Clear chat"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    আসসালামু আলাইকুম! ML, Python, NumPy — যা খুশি জিজ্ঞেস করো।
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-xl border border-border bg-muted/20 px-3 py-2 text-left text-xs transition-colors hover:bg-muted/50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-muted/40 text-foreground"
                    )}
                  >
                    {m.role === "assistant" ? (
                      m.content ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1.5 prose-pre:my-2 prose-pre:overflow-x-auto prose-pre:text-xs prose-ul:my-1.5 prose-ol:my-1.5">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <span className="flex gap-1 py-1.5">
                          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                        </span>
                      )
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                  {error}
                </p>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-end gap-2 border-t border-border p-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="প্রশ্ন লেখো…"
                className="max-h-32 min-h-9 flex-1 resize-none rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/30"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Stop"
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors hover:bg-muted/70"
                >
                  <Square className="size-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send"
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-opacity disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        className="flex size-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </button>
    </div>
  );
}
