"use client";

import Link from "next/link";
import { Inter } from "next/font/google";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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
  PanelLeftClose,
  PanelLeft,
  Plus,
  MessageSquare,
  Pencil,
  Wand2,
  Brain,
  Zap,
  Code2,
  Bot,
  Image as ImageIcon,
  Cpu,
  Sun,
  Moon,
  Mic,
  Loader2,
  Paperclip,
  X,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Minimal Web Speech API types — not part of TypeScript's DOM lib.
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

const STORAGE_KEY = "myai.myai.conversations";
const THEME_KEY = "myai.theme";
const ACCESS_CODE_KEY = "myai.accessCode";
const AUTO = "auto";

type Category = "fast" | "coding" | "heavy" | "reasoning" | "agentic" | "multimodal" | "image" | "music";

type ModelOption = {
  id: string;
  label: string;
  tag: string;
  group: string;
  category: Category;
  reasoning?: boolean;
  icon: typeof Zap;
  imageEndpoint?: string;
};

const MODELS: ModelOption[] = [
  { id: "nvidia/nemotron-3-nano-30b-a3b", label: "Nemotron 3 Nano", tag: "Fast & light", group: "NVIDIA", category: "fast", icon: Zap },
  { id: "stepfun-ai/step-3.7-flash", label: "Step 3.7 Flash", tag: "Fast coding", group: "StepFun", category: "coding", icon: Code2 },
  { id: "nvidia/nemotron-3-super-120b-a12b", label: "Nemotron 3 Super", tag: "Heavy coding & reasoning", group: "NVIDIA", category: "heavy", icon: Brain },
  { id: "nvidia/nemotron-3.5-lightning-30b-a3b", label: "Nemotron 3.5 Lightning", tag: "Reasoning", group: "NVIDIA", category: "reasoning", reasoning: true, icon: Brain },
  { id: "z-ai/glm-5.2", label: "GLM 5.2", tag: "Reasoning", group: "Z.AI", category: "reasoning", icon: Brain },
  { id: "minimaxai/minimax-m2.7", label: "MiniMax M2.7", tag: "Agentic coding", group: "MiniMax", category: "agentic", icon: Bot },
  { id: "minimaxai/minimax-m3", label: "MiniMax M3", tag: "Multimodal coding", group: "MiniMax", category: "multimodal", icon: ImageIcon },
  { id: "nvidia/llama-3.3-nemotron-super-49b-v1.5", label: "Llama 3.3 Nemotron Super v1.5", tag: "General", group: "NVIDIA", category: "heavy", icon: Brain },
  { id: "nvidia/nemotron-mini-4b-instruct", label: "Nemotron Mini 4B", tag: "Fast & light", group: "NVIDIA", category: "fast", icon: Zap },
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B", tag: "General", group: "OpenAI", category: "heavy", icon: Brain },
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B", tag: "Fast & light", group: "OpenAI", category: "fast", icon: Zap },
  { id: "meta/llama-3.1-70b-instruct", label: "Llama 3.1 70B", tag: "General", group: "Meta", category: "heavy", icon: Brain },
  { id: "mistralai/mistral-nemotron", label: "Mistral Nemotron", tag: "General", group: "Mistral AI", category: "fast", icon: Zap },
  { id: "deepseek-ai/deepseek-v4-flash-0731", label: "DeepSeek V4 Flash", tag: "Reasoning", group: "DeepSeek", category: "reasoning", reasoning: true, icon: Brain },
  { id: "nvidia/ising-calibration-1.5-31b", label: "Ising Calibration", tag: "Vision & multimodal", group: "NVIDIA", category: "multimodal", icon: ImageIcon },
  { id: "meta/muse-glimmer-30b", label: "Muse Glimmer", tag: "General", group: "Meta", category: "fast", icon: Zap },
  { id: "thinkingmachines/inkling", label: "Inkling", tag: "General", group: "Thinking Machines", category: "fast", icon: Zap },
  { id: "poolside/laguna-xs-2.1", label: "Laguna XS", tag: "Fast coding", group: "Poolside", category: "coding", icon: Code2 },
  { id: "pollinations/image", label: "Image Generation", tag: "Text-to-image", group: "Image", category: "image", icon: ImageIcon, imageEndpoint: "/api/ai/myai/image" },
  { id: "worker/image", label: "Image Generation (Alt)", tag: "Text-to-image (alt)", group: "Image", category: "image", icon: ImageIcon, imageEndpoint: "/api/ai/myai/image-worker" },
  { id: "xenova/musicgen-small", label: "Music Generation", tag: "Text-to-music (in-browser)", group: "Music", category: "music", icon: Music },
];

const MODEL_BY_ID = new Map(MODELS.map((m) => [m.id, m]));
const DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b";

const CODING_WORDS = [
  "code", "function", "bug", "debug", "script", "python", "javascript",
  "typescript", "api", "algorithm", "refactor", "error", "class ", "import ",
  "component", "regex", "compile", "stack trace", "```", "sql", "css", "html",
];
const REASONING_WORDS = [
  "prove", "solve", "step by step", "logic", "puzzle", "calculate",
  "reasoning", "why does", "derive", "theorem", "optimi", "strategy",
];
const AGENTIC_WORDS = [
  "agent", "multi-step", "workflow", "automate", "plan out", "tool use",
  "orchestrat", "pipeline",
];
const MULTIMODAL_WORDS = [
  "screenshot", "diagram", "chart", "figma", "ui design", "explain this image",
];
const HEAVY_CODING_WORDS = [
  "build", "implement", "architecture", "design a", "full app", "large", "complex",
];
const IMAGE_GEN_WORDS = [
  "generate an image", "generate a picture", "generate an picture", "generate art",
  "draw", "paint", "create an image", "create a picture", "make an image",
  "make a picture", "image of", "picture of", "photo of", "illustration of",
  "text to image", "text-to-image", "render an image", "generate a photo",
  "generate a logo", "design a logo", "create a logo", "wallpaper of",
];

function classify(text: string): Category {
  const t = text.toLowerCase();
  const score = (words: string[]) => words.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);

  const imageGen = score(IMAGE_GEN_WORDS);
  const coding = score(CODING_WORDS);
  const reasoning = score(REASONING_WORDS);
  const agentic = score(AGENTIC_WORDS);
  const multimodal = score(MULTIMODAL_WORDS);
  const heavySignal = score(HEAVY_CODING_WORDS);

  if (imageGen > 0) return "image";
  if (multimodal > 0) return "multimodal";
  if (agentic > 0) return "agentic";
  if (reasoning > 0) return "reasoning";
  if (coding > 0) return coding + heavySignal >= 2 || t.length > 400 ? "heavy" : "coding";
  if (t.length < 60) return "fast";
  return "heavy";
}

function pickModel(text: string): ModelOption {
  const category = classify(text);
  const candidates = MODELS.filter((m) => m.category === category);
  return candidates[0] ?? MODEL_BY_ID.get(DEFAULT_MODEL)!;
}

type Message = {
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  modelId?: string;
  imageUrl?: string;
  audioUrl?: string;
};
type Conversation = {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  createdAt: number;
};

async function generateImage(
  prompt: string,
  signal: AbortSignal,
  accessCode: string,
  endpoint: string
): Promise<string> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-access-code": accessCode },
    body: JSON.stringify({ prompt }),
    signal,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Image generation failed (${res.status})`);
  return data.imageUrl as string;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function streamChat(
  modelOption: ModelOption,
  messages: Message[],
  signal: AbortSignal,
  accessCode: string,
  onDelta: (content: string, reasoning: string) => void
) {
  const res = await fetch("/api/ai/myai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-access-code": accessCode },
    body: JSON.stringify({
      messages: messages.map(({ role, content, imageUrl }) => ({
        role,
        content:
          role === "user" && imageUrl
            ? [
                { type: "text", text: content },
                { type: "image_url", image_url: { url: imageUrl } },
              ]
            : content,
      })),
      model: modelOption.id,
      reasoning: !!modelOption.reasoning,
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let reasoning = "";
  const STALL_MS = 30_000;

  while (true) {
    const timeout = new Promise<"stalled">((resolve) =>
      setTimeout(() => resolve("stalled"), STALL_MS)
    );
    const result = await Promise.race([reader.read(), timeout]);
    if (result === "stalled") {
      await reader.cancel().catch(() => {});
      throw new Error("The model stopped responding. Please try again.");
    }
    const { done, value } = result;
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
        const delta = json.choices?.[0]?.delta;
        const reasoningDelta: string | undefined = delta?.reasoning_content;
        const contentDelta: string | undefined = delta?.content;
        if (reasoningDelta) reasoning += reasoningDelta;
        if (contentDelta) content += contentDelta;
        if (reasoningDelta || contentDelta) onDelta(content, reasoning);
      } catch {
        // ignore malformed SSE chunk
      }
    }
  }
}

function newConversation(): Conversation {
  return { id: crypto.randomUUID(), title: "New Chat", model: AUTO, messages: [], createdAt: Date.now() };
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

// All colors are applied via inline styles (not Tailwind color utilities) so
// theming never depends on which arbitrary utility classes happen to get
// compiled — layout/spacing still uses Tailwind, color does not.
type Palette = {
  bg: string;
  panel: string;
  panelHover: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentText: string;
  danger: string;
  dangerBg: string;
  codeBg: string;
  inputBg: string;
};

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    bg: "#141517",
    panel: "#191b1d",
    panelHover: "#212325",
    border: "#2a2c2f",
    borderStrong: "#3a3d41",
    text: "#f2f2f0",
    textMuted: "#9a9da3",
    textFaint: "#6b6e73",
    accent: "#f5f5f4",
    accentText: "#141517",
    danger: "#f87171",
    dangerBg: "rgba(248,113,113,0.12)",
    codeBg: "#0c0d0e",
    inputBg: "#161719",
  },
  light: {
    bg: "#fbfbfa",
    panel: "#f4f4f3",
    panelHover: "#ebebe9",
    border: "#e5e5e3",
    borderStrong: "#d4d4d1",
    text: "#1f1f1f",
    textMuted: "#71717a",
    textFaint: "#a1a1aa",
    accent: "#18181b",
    accentText: "#ffffff",
    danger: "#dc2626",
    dangerBg: "rgba(220,38,38,0.08)",
    codeBg: "#f4f4f3",
    inputBg: "#ffffff",
  },
};

function ModelPicker({
  value,
  onChange,
  pal,
}: {
  value: string;
  onChange: (id: string) => void;
  pal: Palette;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const active = value === AUTO ? null : MODEL_BY_ID.get(value);

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
    setCoords({ top: rect.bottom + 6, left: Math.min(rect.left, window.innerWidth - 340) });
  }, [open]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = MODELS.filter(
      (m) => m.label.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
    );
    const byGroup = new Map<string, ModelOption[]>();
    for (const m of filtered) {
      const list = byGroup.get(m.group) || [];
      list.push(m);
      byGroup.set(m.group, list);
    }
    return [...byGroup.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [query]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ borderColor: pal.border, background: pal.panel, color: pal.text }}
        className="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
      >
        <div
          style={{ background: pal.panelHover, color: pal.textMuted }}
          className="flex size-4 items-center justify-center rounded"
        >
          {active ? <active.icon className="size-3" /> : <Wand2 className="size-3" />}
        </div>
        <span className="max-w-[12rem] truncate leading-tight font-medium">
          {active ? active.label : "Auto Route"}
        </span>
        <ChevronDown className="size-3.5 opacity-60" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              aria-hidden
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div
              data-model-picker-menu
              style={{
                top: coords.top,
                left: coords.left,
                width: "20rem",
                background: pal.panel,
                borderColor: pal.border,
                color: pal.text,
              }}
              className="fixed z-50 overflow-hidden rounded-xl border p-1.5 shadow-xl"
            >
              <div style={{ borderColor: pal.border }} className="relative mb-1.5 border-b pb-1.5">
                <Search
                  style={{ color: pal.textFaint }}
                  className="absolute top-2 left-2.5 size-3.5"
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search intelligence models…"
                  style={{ borderColor: pal.border, color: pal.text, background: "transparent" }}
                  className="w-full rounded-lg border py-1.5 pr-2 pl-8 text-xs outline-none"
                />
              </div>
              <div className="max-h-72 space-y-1 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    onChange(AUTO);
                    setOpen(false);
                    setQuery("");
                  }}
                  style={{
                    background: value === AUTO ? pal.panelHover : "transparent",
                    color: value === AUTO ? pal.text : pal.textMuted,
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left text-xs font-medium"
                >
                  <div
                    style={{ background: pal.bg, color: pal.textMuted }}
                    className="flex size-5 items-center justify-center rounded"
                  >
                    <Wand2 className="size-3" />
                  </div>
                  <span className="text-xs font-medium">Auto Smart Route</span>
                </button>
                {groups.map(([group, items]) => (
                  <div key={group} className="pt-1.5">
                    <p
                      style={{ color: pal.textFaint }}
                      className="px-2 pb-1 text-[10px] font-bold tracking-wide uppercase"
                    >
                      {group}
                    </p>
                    <div className="space-y-0.5">
                      {items.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            onChange(m.id);
                            setOpen(false);
                            setQuery("");
                          }}
                          style={{
                            background: m.id === value ? pal.panelHover : "transparent",
                            color: m.id === value ? pal.text : pal.textMuted,
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs"
                        >
                          <m.icon className="size-3.5 shrink-0 opacity-60" />
                          <span className="flex-1 truncate">{m.label}</span>
                          <span
                            style={{ background: pal.bg, color: pal.textFaint }}
                            className="shrink-0 rounded px-1 py-0.5 text-[9px] font-semibold tracking-wide uppercase"
                          >
                            {m.tag.split(" ")[0]}
                          </span>
                        </button>
                      ))}
                    </div>
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

function ReasoningBlock({
  text,
  streaming,
  pal,
}: {
  text: string;
  streaming: boolean;
  pal: Palette;
}) {
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const open = manualOpen ?? streaming;
  return (
    <div
      style={{ borderColor: pal.border, background: pal.bg }}
      className="mb-3 overflow-hidden rounded-lg border"
    >
      <button
        type="button"
        onClick={() => setManualOpen(!open)}
        style={{ color: pal.textMuted }}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-[11px] font-medium"
      >
        <Brain className={cn("size-3.5", streaming && "animate-pulse")} />
        <span>{streaming ? "Thinking process…" : "Thought process"}</span>
        <ChevronDown className={cn("ml-auto size-3 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div
          style={{ borderColor: pal.border, color: pal.textMuted }}
          className="max-h-48 overflow-y-auto border-t p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap"
        >
          {text.trim()}
        </div>
      )}
    </div>
  );
}

function CopyButton({ text, pal }: { text: string; pal: Palette }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      style={{ color: pal.textFaint }}
      className="flex items-center gap-1 rounded px-2 py-1 text-[11px]"
      aria-label="Copy message"
    >
      {copied ? <Check className="size-3" style={{ color: "#34d399" }} /> : <Copy className="size-3" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

const PROMPT_STARTERS = [
  { icon: Code2, title: "Refactor code", prompt: "Write an optimized TypeScript function for deep merging nested objects with generic type support." },
  { icon: Brain, title: "Logic & reasoning", prompt: "Explain the Monty Hall problem step-by-step and show why switching doors gives a 2/3 win probability." },
  { icon: Bot, title: "Automate task", prompt: "Design an agentic workflow architecture for automated GitHub issue triaging and PR code review." },
];

export default function MyAiPage() {
  const initial = useMemo(() => [newConversation()], []);
  const [conversations, setConversations] = useState<Conversation[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(() => initial[0]?.id ?? null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [input, setInput] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [accessCode, setAccessCode] = useState("");
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const [accessInput, setAccessInput] = useState("");
  const [accessChecking, setAccessChecking] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [speechStatus, setSpeechStatus] = useState<
    "idle" | "listening" | "unsupported" | "insecure" | "error" | "ended-early"
  >("idle");
  const [speechStatusDetail, setSpeechStatusDetail] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllers = useRef(new Map<string, AbortController>());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const isStreaming = streamingId !== null && streamingId === activeId;
  const pal = PALETTES[theme];

  const active = conversations.find((c) => c.id === activeId) ?? null;

  async function checkAccess(code: string, silent = false) {
    setAccessChecking(true);
    if (!silent) setAccessError(null);
    try {
      const res = await fetch("/api/ai/myai/verify", {
        method: "POST",
        headers: { "x-access-code": code },
      });
      if (res.ok) {
        setAccessCode(code);
        setAccessGranted(true);
        localStorage.setItem(ACCESS_CODE_KEY, code);
      } else {
        setAccessGranted(false);
        if (!silent) setAccessError("Incorrect access code.");
      }
    } catch {
      setAccessGranted(false);
      if (!silent) setAccessError("Couldn't reach the server. Try again.");
    } finally {
      setAccessChecking(false);
    }
  }

  useEffect(() => {
    const stored = loadConversations();
    if (stored) {
      setConversations(stored);
      setActiveId(stored[0].id);
    }

    const savedTheme = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
    setMounted(true);
    checkAccess(localStorage.getItem(ACCESS_CODE_KEY) || "", true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [mounted, conversations]);

  useEffect(() => {
    if (!mounted || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [mounted, activeId]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  }

  function updateActive(fn: (c: Conversation) => Conversation) {
    setConversations((prev) => prev.map((c) => (c.id === activeId ? fn(c) : c)));
  }

  function createChat() {
    const c = newConversation();
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
          const fresh = newConversation();
          setActiveId(fresh.id);
          return [fresh];
        }
      }
      return next;
    });
  }

  async function sendMessage(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || !active || !accessGranted || abortControllers.current.has(active.id)) return;

    setError(null);
    const nextMessages: Message[] = [
      ...active.messages,
      { role: "user", content: text, ...(attachedImage ? { imageUrl: attachedImage } : {}) },
    ];
    const isFirst = active.messages.length === 0;
    const convId = active.id;

    const chosen = active.model === AUTO ? pickModel(text) : MODEL_BY_ID.get(active.model);
    const modelOption = chosen ?? MODEL_BY_ID.get(DEFAULT_MODEL)!;

    updateActive((c) => ({
      ...c,
      messages: [...nextMessages, { role: "assistant", content: "", modelId: modelOption.id }],
      title: isFirst ? text.slice(0, 36) : c.title,
    }));
    setInput("");
    setAttachedImage(null);
    setStreamingId(convId);

    const controller = new AbortController();
    abortControllers.current.set(convId, controller);

    try {
      if (modelOption.category === "image") {
        const imageUrl = await generateImage(
          text,
          controller.signal,
          accessCode,
          modelOption.imageEndpoint || "/api/ai/myai/image"
        );
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convId) return c;
            const copy = [...c.messages];
            copy[copy.length - 1] = {
              role: "assistant",
              content: "",
              imageUrl,
              modelId: modelOption.id,
            };
            return { ...c, messages: copy };
          })
        );
        if (convId === activeId) {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
      } else if (modelOption.category === "music") {
        const setStatus = (status: string) => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== convId) return c;
              const copy = [...c.messages];
              copy[copy.length - 1] = { role: "assistant", content: status, modelId: modelOption.id };
              return { ...c, messages: copy };
            })
          );
        };
        setStatus("Loading music model in your browser (~656MB on first use)…");
        const { generateMusicClientSide } = await import("@/lib/musicgen");
        const blob = await generateMusicClientSide(text, (p) => {
          const pct = Math.round(p.percent * 100);
          setStatus(
            p.phase === "loading"
              ? `Loading model… ${pct}%`
              : p.phase === "generating"
                ? `Composing… ${pct}%`
                : "Encoding audio…"
          );
        });
        const audioUrl = await blobToDataUrl(blob);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== convId) return c;
            const copy = [...c.messages];
            copy[copy.length - 1] = {
              role: "assistant",
              content: "",
              audioUrl,
              modelId: modelOption.id,
            };
            return { ...c, messages: copy };
          })
        );
        if (convId === activeId) {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
      } else {
        await streamChat(modelOption, nextMessages, controller.signal, accessCode, (content, reasoning) => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== convId) return c;
              const copy = [...c.messages];
              copy[copy.length - 1] = {
                role: "assistant",
                content,
                reasoning: reasoning || undefined,
                modelId: modelOption.id,
              };
              return { ...c, messages: copy };
            })
          );
          if (convId === activeId) {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
          }
        });
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        // stopped by user
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, messages: c.messages.slice(0, -1) } : c))
        );
        if (convId === activeId) setInput(text);
      }
    } finally {
      abortControllers.current.delete(convId);
      setStreamingId((id) => (id === convId ? null : id));
    }
  }

  function stopGenerating() {
    if (active) abortControllers.current.get(active.id)?.abort();
  }

  async function startRecording() {
    setMicError(null);
    setLiveTranscript("");
    setSpeechStatus("idle");
    setSpeechStatusDetail(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size === 0) return;

        setIsTranscribing(true);
        try {
          const form = new FormData();
          form.append("audio", blob, "audio.webm");
          const res = await fetch("/api/ai/myai/transcribe", {
            method: "POST",
            headers: { "x-access-code": accessCode },
            body: form,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || `Transcription failed (${res.status})`);
          const text = (data.text || "").trim();
          if (text) setInput((prev) => (prev ? `${prev} ${text}` : text));
        } catch (e) {
          setMicError(e instanceof Error ? e.message : "Transcription failed");
        } finally {
          setIsTranscribing(false);
          setLiveTranscript("");
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      // Live interim captions via the browser's built-in speech recognition —
      // Groq Whisper (above) still supplies the final, more accurate text
      // once recording stops; this is just a preview while speaking.
      const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionCtor) {
        setSpeechStatus("unsupported");
        setSpeechStatusDetail("This browser has no SpeechRecognition API.");
      } else if (!window.isSecureContext) {
        setSpeechStatus("insecure");
        setSpeechStatusDetail("Needs HTTPS or localhost.");
      } else {
        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || "en-US";
        let gotAnyResult = false;
        recognition.onstart = () => {
          setSpeechStatus("listening");
          setSpeechStatusDetail(null);
        };
        recognition.onresult = (event) => {
          gotAnyResult = true;
          let text = "";
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setLiveTranscript(text);
        };
        recognition.onerror = (event) => {
          setSpeechStatus("error");
          setSpeechStatusDetail(event.error);
        };
        recognition.onend = () => {
          speechRecognitionRef.current = null;
          setSpeechStatus((prev) =>
            prev === "listening" && !gotAnyResult ? "ended-early" : prev
          );
        };
        speechRecognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          setSpeechStatus("error");
          setSpeechStatusDetail(e instanceof Error ? e.message : "start() threw");
        }
      }
    } catch {
      setMicError("Microphone access denied or unavailable.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    speechRecognitionRef.current?.stop();
    speechRecognitionRef.current = null;
    setIsRecording(false);
  }

  const messages = active?.messages ?? [];
  const isAuto = active?.model === AUTO;
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const pickedModel = lastAssistant?.modelId ? MODEL_BY_ID.get(lastAssistant.modelId) : undefined;

  if (!mounted || accessGranted === null) {
    return <div style={{ background: PALETTES.dark.bg }} className="h-dvh" />;
  }

  if (!accessGranted) {
    return (
      <div
        style={{ background: pal.bg, color: pal.text }}
        className={cn(inter.className, "flex h-dvh items-center justify-center px-4 max-w-7xl mx-auto")}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkAccess(accessInput.trim());
          }}
          style={{ borderColor: pal.border, background: pal.panel }}
          className="flex w-full max-w-lg flex-col gap-3 rounded-xl border p-6 shadow-sm"
        >
          <div style={{ borderColor: pal.border, background: pal.bg, color: pal.text }} className="flex size-9 items-center justify-center rounded-lg border">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h1 style={{ color: pal.text }} className="text-sm font-semibold">
              MyAI.Studio is private
            </h1>
            <p style={{ color: pal.textMuted }} className="mt-1 text-xs leading-relaxed">
              Enter the access code to continue.
            </p>
          </div>
          <input
            autoFocus
            type="password"
            value={accessInput}
            onChange={(e) => setAccessInput(e.target.value)}
            placeholder="Access code"
            style={{ borderColor: pal.border, background: pal.inputBg, color: pal.text, fontSize: "14px" }}
            className="rounded-lg border px-3 py-2 outline-none"
          />
          {accessError && (
            <p style={{ color: pal.danger }} className="text-xs">
              {accessError}
            </p>
          )}
          <button
            type="submit"
            disabled={accessChecking || !accessInput.trim()}
            style={{ background: pal.accent, color: pal.accentText }}
            className="rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-40"
          >
            {accessChecking ? "Checking…" : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  const userBubbleStyle: CSSProperties =
    theme === "dark"
      ? { background: pal.panel, borderColor: pal.border, color: pal.text }
      : { background: pal.panel, color: pal.text };

  return (
    <div
      style={{ background: pal.bg, color: pal.text }}
      className={cn(inter.className, "relative flex h-dvh overflow-hidden select-none")}
    >
      {/* Sidebar Navigation */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            style={{ borderColor: pal.border, background: pal.panel }}
            className="relative z-30 flex h-full shrink-0 flex-col border-r"
          >
            {/* Sidebar Top Controls */}
            <div className="flex items-center justify-between px-3 py-3">
              <Link
                href="/ai"
                style={{ color: pal.textMuted }}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium"
              >
                <ArrowLeft className="size-3.5" />
                <span>All Tools</span>
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                style={{ color: pal.textFaint }}
                className="rounded-lg p-1.5"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="px-3 pb-2.5">
              <button
                type="button"
                onClick={createChat}
                style={{ background: pal.bg, borderColor: pal.border, color: pal.text }}
                className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium shadow-sm"
              >
                <span style={{ opacity: 0.85 }}>New Chat</span>
                <Plus className="size-3.5" />
              </button>
            </div>

            {/* Conversations Container */}
            <div className="flex-1 space-y-0.5 overflow-y-auto px-2">
              {conversations.map((c) => {
                const isActive = c.id === activeId;
                return (
                  <div
                    key={c.id}
                    style={{
                      background: isActive ? pal.panelHover : "transparent",
                      color: isActive ? pal.text : pal.textMuted,
                      fontWeight: isActive ? 500 : 400,
                    }}
                    className="group relative flex items-center rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <MessageSquare className="size-3.5 shrink-0 opacity-50" />
                      {renamingId === c.id ? (
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
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
                          style={{ borderColor: pal.borderStrong, background: pal.bg, color: pal.text }}
                          className="min-w-0 flex-1 rounded border px-1 py-0.5 text-xs outline-none"
                        />
                      ) : (
                        <span className="truncate leading-none">{c.title}</span>
                      )}
                    </button>
                    <div className="ml-1.5 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setRenamingId(c.id);
                          setRenameValue(c.title);
                        }}
                        style={{ color: pal.textMuted }}
                        className="rounded p-0.5"
                        aria-label="Rename chat"
                      >
                        <Pencil className="size-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteChat(c.id)}
                        style={{ color: pal.textMuted }}
                        className="rounded p-0.5"
                        aria-label="Delete chat"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Bottom Controls: Theme Toggle */}
            <div style={{ borderColor: pal.border }} className="border-t p-3">
              <button
                type="button"
                onClick={toggleTheme}
                style={{ color: pal.textMuted }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="size-4 opacity-70" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="size-4 opacity-70" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Studio Area */}
      <div className="relative flex h-full min-w-0 flex-1 flex-col">
        {/* Navigation Deck */}
        <header
          style={{ borderColor: pal.border, background: pal.bg }}
          className="relative z-20 flex shrink-0 items-center justify-between border-b px-4 py-3.5"
        >
          <div className="flex items-center gap-2.5">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                style={{ borderColor: pal.border, color: pal.textMuted }}
                className="rounded-lg border p-1.5"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="size-4" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <span style={{ color: pal.text }} className="font-mono text-xs font-bold tracking-wide">
                MyAI<span style={{ opacity: 0.4 }}>.Studio</span>
              </span>
            </div>

            <div style={{ background: pal.border }} className="h-4 w-px" />

            {active && <ModelPicker value={active.model} onChange={(id) => updateActive((c) => ({ ...c, model: id }))} pal={pal} />}

            {isAuto && pickedModel && (
              <div
                style={{ borderColor: pal.border, background: pal.panel, color: pal.textMuted }}
                className="hidden items-center gap-1 rounded-lg border px-2 py-1 text-[10px] md:flex"
              >
                <Cpu className="size-3" />
                <span className="font-mono">{pickedModel.label}</span>
              </div>
            )}
          </div>
        </header>

        {/* Message Canvas */}
        <main className="relative flex flex-1 flex-col justify-between overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8">
            {messages.length === 0 ? (
              <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center px-4 text-center">
                <div
                  style={{ borderColor: pal.border, background: pal.panel, color: pal.text }}
                  className="mb-5 flex size-11 items-center justify-center rounded-xl border shadow-sm"
                >
                  <Sparkles className="size-5" />
                </div>

                <h2 style={{ color: pal.text }} className="text-lg font-medium tracking-tight">
                  What can we build today?
                </h2>
                <p style={{ color: pal.textMuted }} className="mt-1.5 max-w-sm text-xs leading-relaxed">
                  Select a specialized intelligence or write a prompt to dynamically route your workflow to optimal model nodes.
                </p>

                {/* Quick Starters */}
                <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
                  {PROMPT_STARTERS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(s.prompt)}
                      style={{ borderColor: pal.border, background: pal.panel }}
                      className="group flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <s.icon className="size-3.5" style={{ color: pal.textMuted }} />
                        <span style={{ color: pal.text }}>{s.title}</span>
                      </div>
                      <p style={{ color: pal.textMuted }} className="line-clamp-2 text-[10px] leading-normal">
                        {s.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-2xl space-y-6 pb-6">
                {messages.map((m, i) => {
                  const mModel = m.modelId ? MODEL_BY_ID.get(m.modelId) : undefined;
                  const isLast = i === messages.length - 1;
                  const isAssistant = m.role === "assistant";

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn("flex flex-col gap-1.5", isAssistant ? "items-start" : "items-end")}
                    >
                      {/* Message Meta Info */}
                      <div
                        style={{ color: pal.textFaint }}
                        className="flex items-center gap-2 px-1 text-[10px] font-semibold tracking-wide uppercase opacity-70"
                      >
                        {isAssistant ? (
                          <>
                            <Bot className="size-3" />
                            <span>{mModel ? mModel.label : "Assistant"}</span>
                          </>
                        ) : (
                          <span>You</span>
                        )}
                      </div>

                      {/* Content Card Layout */}
                      <div
                        style={{
                          ...(isAssistant ? { color: pal.text } : userBubbleStyle),
                          fontSize: "15px",
                        }}
                        className="group relative w-full max-w-[92%] rounded-xl px-4 py-3.5 leading-relaxed sm:max-w-[88%]"
                      >
                        {m.reasoning && (
                          <ReasoningBlock text={m.reasoning} streaming={isStreaming && isLast && !m.content} pal={pal} />
                        )}

                        {m.imageUrl && !isAssistant ? (
                          <div className="flex flex-col gap-2">
                            <img
                              src={m.imageUrl}
                              alt="Attached"
                              className="max-w-full rounded-lg"
                              style={{ borderColor: pal.border }}
                            />
                            {m.content && <p className="whitespace-pre-wrap">{m.content}</p>}
                          </div>
                        ) : m.imageUrl ? (
                          <img
                            src={m.imageUrl}
                            alt={messages[i - 1]?.content || "Generated image"}
                            className="max-w-full rounded-lg"
                            style={{ borderColor: pal.border }}
                          />
                        ) : m.audioUrl ? (
                          <audio controls src={m.audioUrl} className="w-full" />
                        ) : m.content ? (
                          isAssistant ? (
                            <div
                              className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:rounded-lg prose-pre:border prose-pre:px-4 prose-pre:py-3.5 prose-code:font-mono"
                              style={
                                {
                                  "--tw-prose-body": pal.text,
                                  "--tw-prose-headings": pal.text,
                                  "--tw-prose-bold": pal.text,
                                  "--tw-prose-code": pal.text,
                                  "--tw-prose-pre-bg": pal.codeBg,
                                  "--tw-prose-pre-border": pal.border,
                                } as CSSProperties
                              }
                            >
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          )
                        ) : !m.reasoning ? (
                          <div className="flex items-center gap-2 py-1">
                            <span
                              style={{ background: pal.textFaint }}
                              className="size-1.5 animate-bounce rounded-full [animation-delay:-0.3s]"
                            />
                            <span
                              style={{ background: pal.textFaint }}
                              className="size-1.5 animate-bounce rounded-full [animation-delay:-0.15s]"
                            />
                            <span style={{ background: pal.textFaint }} className="size-1.5 animate-bounce rounded-full" />
                            {mModel?.category === "image" && (
                              <span style={{ color: pal.textFaint }} className="text-xs">
                                Generating image…
                              </span>
                            )}
                            {mModel?.category === "music" && (
                              <span style={{ color: pal.textFaint }} className="text-xs">
                                Composing music…
                              </span>
                            )}
                          </div>
                        ) : null}

                        {isAssistant && m.content && (
                          <div
                            style={{ borderColor: pal.border }}
                            className="mt-3 flex items-center justify-between border-t pt-2 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <CopyButton text={m.content} pal={pal} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{ borderColor: `${pal.danger}33`, background: pal.dangerBg, color: pal.danger }}
              className="mx-auto mb-2 max-w-xl rounded-lg border px-4 py-2 text-xs font-medium"
            >
              {error}
            </div>
          )}

          {/* Bottom Floating Command Capsule */}
          <div className="relative z-20 mx-auto w-full max-w-2xl px-4 pb-5">
            {micError && (
              <div
                style={{ color: pal.danger }}
                className="mb-2 px-1 text-xs"
              >
                {micError}
              </div>
            )}
            {isRecording && (
              <div style={{ color: pal.textFaint }} className="mb-2 px-1 text-xs">
                {speechStatus === "idle" && "Starting live captions…"}
                {speechStatus === "listening" && "Live captions active"}
                {speechStatus === "unsupported" &&
                  `Live captions not supported in this browser — final transcript still works on stop. (${speechStatusDetail})`}
                {speechStatus === "insecure" &&
                  `Live captions need HTTPS or localhost. (${speechStatusDetail})`}
                {speechStatus === "error" &&
                  `Live captions error: ${speechStatusDetail} — final transcript still works on stop.`}
                {speechStatus === "ended-early" &&
                  "Live captions stopped without hearing anything — final transcript still works on stop."}
              </div>
            )}
            {attachedImage && (
              <div
                style={{ borderColor: pal.border, background: pal.inputBg }}
                className="mb-2 flex w-fit items-center gap-2 rounded-lg border p-1.5"
              >
                <img src={attachedImage} alt="Attachment preview" className="size-8 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  style={{ color: pal.textMuted }}
                  className="mr-1 rounded p-1 hover:opacity-70"
                  aria-label="Remove attached image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setAttachedImage(reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              style={{ borderColor: pal.border, background: pal.inputBg }}
              className="relative flex items-center gap-1.5 rounded-xl border p-2"
            >
              <Button
                type="button"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isStreaming || isRecording}
                style={{ background: pal.panel, color: pal.textMuted, borderColor: pal.border }}
                className="size-8 rounded-lg border disabled:opacity-40"
                aria-label="Attach image"
              >
                <Paperclip className="size-3.5" />
              </Button>

              <input
                value={isRecording ? liveTranscript : input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isRecording
                    ? "Listening…"
                    : isAuto
                      ? "Ask anything… Smart route will assign the best model"
                      : "Ask MyAI…"
                }
                disabled={isStreaming || isRecording}
                style={{ color: isRecording ? pal.textMuted : pal.text, fontSize: "14px" }}
                className="flex-1 bg-transparent px-2.5 outline-none placeholder:opacity-50"
              />

              <Button
                type="button"
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isStreaming || isTranscribing}
                style={
                  isRecording
                    ? { background: pal.dangerBg, color: pal.danger, borderColor: pal.border }
                    : { background: pal.panel, color: pal.textMuted, borderColor: pal.border }
                }
                className="size-8 rounded-lg border disabled:opacity-40"
                aria-label={isRecording ? "Stop recording" : "Record voice message"}
              >
                {isTranscribing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : isRecording ? (
                  <span className="relative flex size-2.5">
                    <span
                      style={{ background: pal.danger }}
                      className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
                    />
                    <span style={{ background: pal.danger }} className="relative inline-flex size-2.5 rounded-full" />
                  </span>
                ) : (
                  <Mic className="size-3.5" />
                )}
              </Button>

              {isStreaming ? (
                <Button
                  type="button"
                  size="icon"
                  onClick={stopGenerating}
                  style={{ background: pal.panel, color: pal.danger, borderColor: pal.border }}
                  className="size-8 rounded-lg border"
                  aria-label="Stop generating"
                >
                  <Square className="size-3.5 fill-current" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  style={{ background: pal.accent, color: pal.accentText }}
                  className="size-8 rounded-lg disabled:opacity-20"
                  aria-label="Send message"
                >
                  <Send className="size-3.5" />
                </Button>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
