"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  ListChecks,
  Loader2,
  RefreshCw,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  type: "mcq" | "output" | "truefalse";
  question: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
};
type Practice = { questions: Question[]; flashcards: { front: string; back: string }[] };
export type StudioSection = { id: string; title: string };

type Tab = "practice" | "explore";

// The mini-app runs in a sandboxed iframe without same-origin access, and this
// CSP stops it loading or sending anything over the network.
const CSP =
  `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; ` +
  `script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:">`;
const ERROR_REPORTER =
  "<script>window.addEventListener('error',function(e){parent.postMessage({type:'studio-error',message:String(e.message)},'*')});</script>";

function prepareHtml(html: string) {
  const inject = CSP + ERROR_REPORTER;
  return /<head[^>]*>/i.test(html)
    ? html.replace(/<head[^>]*>/i, (m) => m + inject)
    : inject + html;
}

/** Renders `inline code` in AI text without pulling in a markdown parser. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[0.85em]">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

async function post<T>(url: string, body: object): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

/** The `##` section currently at the top of the screen, or "all". */
function sectionInView(sections: StudioSection[]): string {
  let current = "all";
  for (const s of sections) {
    const el = s.id === "intro" ? null : document.getElementById(s.id);
    if (el && el.getBoundingClientRect().top < 160) current = s.id;
  }
  return current;
}

export function LessonStudio({
  slug,
  variant,
  sections,
}: {
  slug: string;
  variant?: "alt";
  sections: StudioSection[];
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("practice");
  const [scope, setScope] = useState("all");
  // Results are kept per section, so switching back and forth is free.
  const [practice, setPractice] = useState<Record<string, Practice>>({});
  const [apps, setApps] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Tab | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openStudio() {
    setScope(sectionInView(sections));
    setError(null);
    setOpen(true);
  }

  const theme = () =>
    document.documentElement.classList.contains("dark") ? "dark" : "light";

  async function generate(which: Tab, idea?: string) {
    setLoading(which);
    setError(null);
    try {
      const body = { slug, v: variant, scope, idea, theme: theme() };
      if (which === "practice") {
        const data = await post<Practice>("/api/ai/ml/practice", body);
        setPractice((p) => ({ ...p, [scope]: data }));
      } else {
        const data = await post<{ html: string }>("/api/ai/ml/explore", body);
        setApps((a) => ({ ...a, [scope]: data.html }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  const scopeTitle =
    scope === "all" ? "পুরো lesson" : sections.find((s) => s.id === scope)?.title ?? "";

  return (
    <>
      <button
        type="button"
        onClick={openStudio}
        className="flex items-center gap-2 rounded-full bg-orange-500 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm shadow-orange-500/30 transition-transform hover:scale-[1.03] active:scale-95"
      >
        <Sparkles className="size-4" />
        Practice
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Practice">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="absolute inset-2 m-auto flex max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:inset-6">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-3">
                <div className="flex rounded-full border border-border bg-muted/30 p-1 text-sm">
                  {(
                    [
                      ["practice", "Practice", ListChecks],
                      ["explore", "Explore", Wand2],
                    ] as const
                  ).map(([id, label, Icon]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setTab(id);
                        setError(null);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors",
                        tab === id
                          ? "bg-foreground font-medium text-background"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </button>
                  ))}
                </div>

                <select
                  value={scope}
                  onChange={(e) => {
                    setScope(e.target.value);
                    setError(null);
                  }}
                  disabled={loading !== null}
                  aria-label="কোন অংশ থেকে"
                  className="order-last w-full min-w-0 cursor-pointer truncate rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none sm:order-none sm:w-auto sm:max-w-xs sm:flex-1"
                >
                  <option value="all">পুরো lesson</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="বন্ধ করো"
                  className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Body */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                {error && (
                  <p className="mx-4 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
                    {error}
                  </p>
                )}

                {tab === "practice" ? (
                  practice[scope] ? (
                    <PracticeView
                      key={scope + practice[scope].questions[0]?.question}
                      data={practice[scope]}
                      loading={loading === "practice"}
                      onRegenerate={() => generate("practice")}
                    />
                  ) : (
                    <Empty
                      icon={<BrainCircuit className="size-7" />}
                      title={`"${scopeTitle}" থেকে প্রশ্ন বানাও`}
                      text="AI তোমার notes পড়ে MCQ, 'এই code-এর output কী?' প্রশ্ন আর flashcard বানাবে। উত্তর দিলেই সাথে সাথে ব্যাখ্যা।"
                      cta="প্রশ্ন বানাও"
                      loading={loading === "practice"}
                      onClick={() => generate("practice")}
                    />
                  )
                ) : (
                  <ExploreView
                    key={scope}
                    html={apps[scope]}
                    scopeTitle={scopeTitle}
                    loading={loading === "explore"}
                    onGenerate={(idea) => generate("explore", idea)}
                  />
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function Empty({
  icon,
  title,
  text,
  cta,
  loading,
  onClick,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  cta: string;
  loading: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-500">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
      {children}
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="mt-5 flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {loading ? "বানানো হচ্ছে…" : cta}
      </button>
    </div>
  );
}

function PracticeView({
  data,
  loading,
  onRegenerate,
}: {
  data: Practice;
  loading: boolean;
  onRegenerate: () => void;
}) {
  const [mode, setMode] = useState<"quiz" | "cards">("quiz");
  const [qi, setQi] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() => data.questions.map(() => null));
  const [ci, setCi] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const q = data.questions[qi];
  const picked = picks[qi];
  const answered = picks.filter((p) => p !== null).length;
  const score = picks.filter((p, i) => p === data.questions[i].answer).length;
  const finished = qi >= data.questions.length;
  const card = data.flashcards[ci];

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex rounded-full border border-border p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("quiz")}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1",
              mode === "quiz" ? "bg-muted font-medium" : "text-muted-foreground",
            )}
          >
            <ListChecks className="size-3.5" /> Quiz
          </button>
          {data.flashcards.length > 0 && (
            <button
              type="button"
              onClick={() => setMode("cards")}
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-1",
                mode === "cards" ? "bg-muted font-medium" : "text-muted-foreground",
              )}
            >
              <Layers className="size-3.5" /> Flashcards
            </button>
          )}
        </div>
        {mode === "quiz" && (
          <span className="text-xs tabular-nums text-muted-foreground">
            Score {score}/{answered}
          </span>
        )}
        <button
          type="button"
          onClick={onRegenerate}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          নতুন প্রশ্ন
        </button>
      </div>

      {mode === "cards" && card ? (
        <div>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className={cn(
              "flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border p-8 text-center transition-colors",
              flipped
                ? "border-orange-500/40 bg-orange-500/10"
                : "border-border bg-muted/20 hover:bg-muted/40",
            )}
          >
            <span className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {flipped ? "উত্তর" : "প্রশ্ন"}
            </span>
            <span className={cn(flipped ? "text-base" : "text-xl font-semibold")}>
              <Rich text={flipped ? card.back : card.front} />
            </span>
            {!flipped && (
              <span className="mt-4 text-xs text-muted-foreground">চাপ দিয়ে উল্টাও</span>
            )}
          </button>
          <div className="mt-4 flex items-center justify-between">
            <NavBtn
              disabled={ci === 0}
              onClick={() => {
                setCi(ci - 1);
                setFlipped(false);
              }}
            >
              <ChevronLeft className="size-4" /> আগের
            </NavBtn>
            <span className="text-sm tabular-nums text-muted-foreground">
              {ci + 1} / {data.flashcards.length}
            </span>
            <NavBtn
              disabled={ci === data.flashcards.length - 1}
              onClick={() => {
                setCi(ci + 1);
                setFlipped(false);
              }}
            >
              পরের <ChevronRight className="size-4" />
            </NavBtn>
          </div>
        </div>
      ) : finished ? (
        <div className="rounded-2xl border border-border bg-muted/20 p-8 text-center">
          <p className="text-4xl font-semibold tabular-nums">
            {score}/{data.questions.length}
          </p>
          <p className="mt-2 text-muted-foreground">
            {score === data.questions.length
              ? "অসাধারণ! সব ঠিক 🎉"
              : score >= data.questions.length * 0.6
                ? "ভালো হয়েছে! ভুলগুলো আরেকবার দেখে নাও।"
                : "আরেকবার notes দেখে চেষ্টা করো, হয়ে যাবে।"}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPicks(data.questions.map(() => null));
                setQi(0);
              }}
              className="rounded-full border border-border px-4 py-2 text-sm hover:bg-muted/40"
            >
              আবার দাও
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              নতুন প্রশ্ন বানাও
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="tabular-nums">
              প্রশ্ন {qi + 1}/{data.questions.length}
            </span>
            <span className="rounded-full bg-muted/50 px-2 py-0.5">
              {q.type === "output" ? "Code output" : q.type === "truefalse" ? "সত্য / মিথ্যা" : "MCQ"}
            </span>
          </div>
          <div className="mb-4 h-1 overflow-hidden rounded-full bg-muted/50">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${(qi / data.questions.length) * 100}%` }}
            />
          </div>

          <h3 className="text-lg font-medium leading-relaxed">
            <Rich text={q.question} />
          </h3>
          {q.code && (
            <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-muted/30 p-4 font-mono text-sm leading-relaxed">
              {q.code}
            </pre>
          )}

          <div className="mt-4 grid gap-2">
            {q.options.map((opt, i) => {
              const isAnswer = i === q.answer;
              const isPicked = i === picked;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => setPicks((p) => p.map((v, j) => (j === qi ? i : v)))}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    picked === null && "border-border hover:border-foreground/30 hover:bg-muted/30",
                    picked !== null && isAnswer && "border-emerald-500/60 bg-emerald-500/10",
                    picked !== null && isPicked && !isAnswer && "border-red-500/60 bg-red-500/10",
                    picked !== null && !isAnswer && !isPicked && "border-border opacity-60",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                      picked !== null && isAnswer
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : picked !== null && isPicked
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-border",
                    )}
                  >
                    {picked !== null && isAnswer ? (
                      <Check className="size-3.5" />
                    ) : picked !== null && isPicked ? (
                      <X className="size-3.5" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className={cn(q.type === "output" && "font-mono")}>
                    <Rich text={opt} />
                  </span>
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4 text-sm">
              <p className="font-medium">
                {picked === q.answer ? "✅ ঠিক!" : "❌ হয়নি"}
              </p>
              {q.explanation && (
                <p className="mt-1 text-muted-foreground">
                  <Rich text={q.explanation} />
                </p>
              )}
            </div>
          )}

          <div className="mt-5 flex justify-between">
            <NavBtn disabled={qi === 0} onClick={() => setQi(qi - 1)}>
              <ChevronLeft className="size-4" /> আগের
            </NavBtn>
            <NavBtn disabled={picked === null} onClick={() => setQi(qi + 1)} primary>
              {qi === data.questions.length - 1 ? "ফলাফল দেখো" : "পরের প্রশ্ন"}
              <ChevronRight className="size-4" />
            </NavBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function NavBtn({
  children,
  onClick,
  disabled,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-opacity disabled:opacity-40",
        primary ? "bg-foreground font-medium text-background" : "border border-border",
      )}
    >
      {children}
    </button>
  );
}

function ExploreView({
  html,
  scopeTitle,
  loading,
  onGenerate,
}: {
  html?: string;
  scopeTitle: string;
  loading: boolean;
  onGenerate: (idea: string) => void;
}) {
  const [idea, setIdea] = useState("");
  const [appError, setAppError] = useState<string | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== frameRef.current?.contentWindow) return;
      if (e.data?.type === "studio-error") setAppError(String(e.data.message));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const ideaBox = (
    <input
      value={idea}
      onChange={(e) => setIdea(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !loading) {
          setAppError(null);
          onGenerate(idea);
        }
      }}
      placeholder="কী দেখতে চাও? (optional) যেমন: learning rate বড় হলে কী হয়"
      className="mt-5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/30"
    />
  );

  if (!html) {
    return (
      <Empty
        icon={<Wand2 className="size-7" />}
        title={`"${scopeTitle}" নিয়ে খেলো`}
        text="AI এই অংশের একটা ছোট interactive app বানাবে: slider, button, animation দিয়ে নিজে বদলে দেখো কী হয়।"
        cta="Interactive app বানাও"
        loading={loading}
        onClick={() => {
          setAppError(null);
          onGenerate(idea);
        }}
      >
        {ideaBox}
      </Empty>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2.5">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              setAppError(null);
              onGenerate(idea);
            }
          }}
          placeholder="অন্য কিছু দেখতে চাও? লিখে নতুন করে বানাও…"
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/30"
        />
        <button
          type="button"
          onClick={() => {
            setAppError(null);
            onGenerate(idea);
          }}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3.5 py-1.5 text-sm font-medium text-white disabled:opacity-60"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          {loading ? "বানানো হচ্ছে…" : "নতুন করে বানাও"}
        </button>
      </div>
      {appError && (
        <p className="mx-4 mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          এই app-এ একটা সমস্যা হয়েছে ({appError})। ঠিকমতো না চললে &quot;নতুন করে বানাও&quot; চাপো।
        </p>
      )}
      <iframe
        ref={frameRef}
        title="Interactive lesson app"
        // allow-scripts without allow-same-origin: the app can run JS but can't
        // touch this site's cookies, storage or DOM.
        sandbox="allow-scripts"
        srcDoc={prepareHtml(html)}
        className={cn("min-h-[60vh] w-full flex-1 border-0 bg-transparent", loading && "opacity-40")}
      />
    </div>
  );
}
