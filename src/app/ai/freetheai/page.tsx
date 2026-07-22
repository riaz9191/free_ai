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
  FolderGit2,
  Square,
  Trash2,
  Copy,
  Check,
  SlidersHorizontal,
  ChevronDown,
  MessageCircle,
  CalendarClock,
  ImageIcon,
  Wand2,
  Mic,
  AudioLines,
  Loader2,
  Download,
  Upload,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInfo } from "@/components/ai/floating-info";
import { cn } from "@/lib/utils";

const REPO_URL = "https://github.com/Free-The-Ai/free-ai";
const CHAT_STORAGE_KEY = "myai.freetheai.chat";

const FALLBACK_MODELS = [
  { id: "glm/glm-5.1", label: "GLM 5.1", tag: "Long-context" },
  { id: "bbl/gpt-oss-120b", label: "GPT-OSS 120B", tag: "General chat" },
  { id: "kai/kimi-k2", label: "Kimi K2", tag: "Aggregated" },
  { id: "opc/qwen3-coder", label: "Qwen3 Coder", tag: "Coding" },
  { id: "olm/deepseek-v3", label: "DeepSeek V3", tag: "Coding" },
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm running on the free FreeTheAi gateway — 60+ models behind one OpenAI-compatible API. Ask me anything, or open **Options** to switch models.",
};

type Message = { role: "user" | "assistant"; content: string };
type ModelOption = { id: string; label: string; tag: string };
type Tab = "chat" | "image" | "edit" | "speech" | "transcribe";

const TABS: { id: Tab; label: string; icon: typeof MessageCircle }[] = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "edit", label: "Edit Image", icon: Wand2 },
  { id: "speech", label: "Speech", icon: AudioLines },
  { id: "transcribe", label: "Transcribe", icon: Mic },
];

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

function ChatTab({
  models,
  model,
  setModel,
}: {
  models: ModelOption[];
  model: string;
  setModel: (m: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [temperature, setTemperature] = useState(1);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showOptions, setShowOptions] = useState(false);
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
      const res = await fetch("/api/ai/freetheai/chat", {
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
                    {m.tag ? ` — ${m.tag}` : ""}
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
              className="accent-cyan-500"
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
                ? "ml-auto rounded-tr-sm bg-gradient-to-br from-cyan-500 to-blue-500 text-white"
                : "rounded-tl-sm bg-muted/40 text-foreground"
            )}
          >
            {m.content ? (
              m.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-pre:my-2 prose-pre:rounded-lg prose-pre:bg-black/40 prose-code:text-cyan-300">
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
          placeholder={`Ask ${activeModel?.label ?? "FreeTheAi"} anything…`}
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

/* ---------------- Image generation ---------------- */

function ImageTab() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function generate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const res = await fetch("/api/ai/freetheai/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setImageUrl(data.imageUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/10 p-5">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. a watercolor painting of a fox in a misty forest"
          rows={3}
          disabled={loading}
          className="w-full resize-none rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
        />
        <Button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="w-fit rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
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
      </div>

      {error && <ErrorBanner error={error} />}

      {(loading || imageUrl) && (
        <div className="flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/10">
          {loading && !imageUrl ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={prompt}
              width={1024}
              height={1024}
              unoptimized
              className="size-full object-contain"
            />
          ) : null}
        </div>
      )}
      {imageUrl && (
        <a
          href={imageUrl}
          download="freetheai-image.png"
          className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40"
        >
          <Download className="size-3.5" />
          Download
        </a>
      )}
      <p className="text-xs text-muted-foreground">
        Default model: <code className="font-mono">eve/gpt-image-2</code>. If
        this errors with &quot;unknown aliased model&quot;, that alias isn&apos;t
        currently exposed on your key — check{" "}
        <a
          href="https://freetheai.xyz/models"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          the live catalog
        </a>
        .
      </p>
    </div>
  );
}

/* ---------------- Image edit ---------------- */

function EditTab() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function generate() {
    if (!prompt.trim() || !file || loading) return;
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const form = new FormData();
      form.set("image", file);
      form.set("prompt", prompt.trim());
      const res = await fetch("/api/ai/freetheai/images/edit", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setImageUrl(data.imageUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/10 p-5">
        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40">
          <Upload className="size-3.5" />
          {file ? file.name : "Choose an image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the edit — e.g. add a red hat"
          rows={2}
          disabled={loading}
          className="w-full resize-none rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
        />
        <Button
          onClick={generate}
          disabled={loading || !prompt.trim() || !file}
          className="w-fit rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Editing…
            </>
          ) : (
            <>
              <Wand2 className="size-4" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {error && <ErrorBanner error={error} />}

      {(loading || imageUrl) && (
        <div className="flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/10">
          {loading && !imageUrl ? (
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              alt={prompt}
              width={1024}
              height={1024}
              unoptimized
              className="size-full object-contain"
            />
          ) : null}
        </div>
      )}
      {imageUrl && (
        <a
          href={imageUrl}
          download="freetheai-edit.png"
          className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40"
        >
          <Download className="size-3.5" />
          Download
        </a>
      )}
    </div>
  );
}

/* ---------------- Text to speech ---------------- */

function SpeechTab() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  async function generate() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    try {
      const res = await fetch("/api/ai/freetheai/audio/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/10 p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type text to convert to speech…"
          rows={3}
          disabled={loading}
          className="w-full resize-none rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20"
        />
        <Button
          onClick={generate}
          disabled={loading || !text.trim()}
          className="w-fit rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Synthesizing…
            </>
          ) : (
            <>
              <Play className="size-4" />
              Generate speech
            </>
          )}
        </Button>
      </div>

      {error && <ErrorBanner error={error} />}

      {audioUrl && (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/10 p-5">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={audioUrl} className="w-full" />
          <a
            href={audioUrl}
            download="freetheai-speech.mp3"
            className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40"
          >
            <Download className="size-3.5" />
            Download mp3
          </a>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Default model: <code className="font-mono">mim/mimo-v2.5-tts</code>{" "}
        (public). <code className="font-mono">xai/grok-tts</code> is an
        alternate but requires the Discord{" "}
        <code className="font-mono">seems_legit</code> role.
      </p>
    </div>
  );
}

/* ---------------- Transcription ---------------- */

function TranscribeTab() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);

  async function transcribe() {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    setText(null);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/ai/freetheai/audio/transcribe", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setText(data.text || "(empty transcript)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/10 p-5">
        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40">
          <Upload className="size-3.5" />
          {file ? file.name : "Choose an audio file"}
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <Button
          onClick={transcribe}
          disabled={loading || !file}
          className="w-fit rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Transcribing…
            </>
          ) : (
            <>
              <Mic className="size-4" />
              Transcribe
            </>
          )}
        </Button>
      </div>

      {error && <ErrorBanner error={error} />}

      {text && (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/10 p-5">
          <p className="text-sm leading-relaxed">{text}</p>
          <CopyButton text={text} />
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Default model: <code className="font-mono">mim/mimo-v2.5-asr</code>{" "}
        (public). <code className="font-mono">xai/grok-stt</code> is an
        alternate but requires the Discord{" "}
        <code className="font-mono">seems_legit</code> role.
      </p>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function FreeTheAiPage() {
  const [tab, setTab] = useState<Tab>("chat");
  const [models, setModels] = useState<ModelOption[]>(FALLBACK_MODELS);
  const [model, setModel] = useState(FALLBACK_MODELS[0].id);

  useEffect(() => {
    fetch("/api/ai/freetheai/models")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return;
        const list = (data.data || data.models || [])
          .map((m: { id?: string; name?: string }) => ({
            id: m.id,
            label: m.id || m.name,
            tag: "",
          }))
          .filter((m: ModelOption) => m.id);
        if (list.length) setModels(list);
      })
      .catch(() => {
        // keep fallback list
      });
  }, []);

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
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-blue-500">
              <Sparkles className="size-3.5 text-white" />
            </span>
            FreeTheAi Studio
          </div>
          <div className="w-24" />
        </div>
        <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-6 pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
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
          <ChatTab models={models} model={model} setModel={setModel} />
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            {tab === "image" && <ImageTab />}
            {tab === "edit" && <EditTab />}
            {tab === "speech" && <SpeechTab />}
            {tab === "transcribe" && <TranscribeTab />}
          </div>
        )}
      </main>

      <FloatingInfo accentClassName="text-cyan-400">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-foreground">Run this yourself</p>
          <ol className="flex flex-col gap-2.5">
            <li>
              1. <MessageCircle className="mr-1 inline size-3.5" />
              Join{" "}
              <a href="https://discord.gg/secrets" target="_blank" rel="noopener noreferrer">
                discord.gg/secrets
              </a>{" "}
              and run <code>/signup</code> for a free key.
            </li>
            <li>
              2. <CalendarClock className="mr-1 inline size-3.5" />
              Run <code>/checkin</code> in Discord{" "}
              <strong>once every UTC day</strong> — keys stop working
              without it.
            </li>
            <li>
              3. <KeyRound className="mr-1 inline size-3.5" />
              Add your key to <code>.env.local</code>:
              <pre>FREETHEAI_API_KEY=xxx</pre>
            </li>
            <li>
              4. Restart <code>npm run dev</code>, then switch tabs above.
              Some models need the Discord <code>seems_legit</code> role —
              if you see <code>unknown aliased model</code> or{" "}
              <code>model_access_denied</code>, check the live catalog.
            </li>
          </ol>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex w-fit items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium"
          >
            <FolderGit2 className="size-3.5" />
            Free-The-Ai/free-ai
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </FloatingInfo>
    </div>
  );
}
