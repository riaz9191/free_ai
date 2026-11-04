"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Headphones,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { CHARS_PER_SECOND, CODE_KEY, CONT_KEY, speechKey } from "@/lib/speech-key";
import { cn } from "@/lib/utils";

export type ListenChunk = {
  sectionId: string | null;
  sectionTitle: string;
  hash: string;
  paras: { k: string; n: number }[];
};
type Voice = "female" | "male";

const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];
const PREFS_KEY = "lesson-listen-prefs";

const BLOCK_SELECTOR = "p, li, h3, h4, h5, h6, tr, pre";
const HIGHLIGHT = [
  "rounded-md",
  "bg-amber-300/25",
  "shadow-[0_0_0_6px_rgb(252_211_77/0.25)]",
  "transition-[background-color,box-shadow]",
  "duration-300",
];

/** Readable blocks of one section, in page order, starting with its heading. */
function sectionBlocks(sectionId: string | null): Element[] {
  const article = document.querySelector("[data-lesson-article]");
  if (!article) return [];
  const heading = sectionId ? document.getElementById(sectionId) : null;
  const out: Element[] = heading ? [heading] : [];
  let el = heading ? heading.nextElementSibling : article.firstElementChild;
  while (el && el.tagName !== "H2") {
    if (el.matches(BLOCK_SELECTOR)) out.push(el);
    out.push(...el.querySelectorAll(BLOCK_SELECTOR));
    el = el.nextElementSibling;
  }
  // <p> inside a list item is part of that item, not a block of its own.
  return out.filter((b) => !(b.tagName === "P" && b.parentElement?.closest("li")));
}

/**
 * Pairs every spoken paragraph of a section (across its chunks) with the
 * block on the page it came from, by matching the start of their text.
 * Unmatched paragraphs map to null and simply keep the previous highlight.
 */
function mapSection(chunks: ListenChunk[], sectionId: string | null) {
  const blocks = sectionBlocks(sectionId);
  const keys = blocks.map((b) => speechKey(b.textContent ?? ""));
  const result = new Map<number, (Element | null)[]>();
  let j = 0;
  let last: Element | null = null;
  chunks.forEach((chunk, ci) => {
    if (chunk.sectionId !== sectionId) return;
    result.set(
      ci,
      chunk.paras.map(({ k }) => {
        if (k === CONT_KEY) return last;
        let found = -1;
        for (let x = j; x < Math.min(blocks.length, j + 12); x++) {
          const hit =
            k === CODE_KEY
              ? blocks[x].tagName === "PRE"
              : k !== "" && keys[x] !== "" && (keys[x].startsWith(k) || k.startsWith(keys[x]));
          if (hit) {
            found = x;
            break;
          }
        }
        if (found < 0) return null;
        j = found + 1;
        last = blocks[found];
        return last;
      }),
    );
  });
  return result;
}

function loadPrefs(): { rate: number; voice: Voice } {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
    return {
      rate: RATES.includes(p.rate) ? p.rate : 1,
      voice: p.voice === "male" ? "male" : "female",
    };
  } catch {
    return { rate: 1, voice: "female" };
  }
}

function savePrefs(prefs: { rate: number; voice: Voice }) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function LessonListen({
  slug,
  variant,
  chunks,
  accentText,
}: {
  slug: string;
  variant?: "alt";
  chunks: ListenChunk[];
  /** Tailwind text-colour class used to highlight the heading being read. */
  accentText: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [voice, setVoice] = useState<Voice>("female");
  const [error, setError] = useState<string | null>(null);
  // Which paragraph of which chunk is being read (estimated from audio time).
  const [reading, setReading] = useState({ chunk: 0, para: 0 });
  const mapRef = useRef<{ sectionId: string | null; map: Map<number, (Element | null)[]> } | null>(
    null,
  );

  // First chunk of every section, for the jump list and skip buttons.
  const sectionStarts = useMemo(
    () =>
      chunks
        .map((c, i) => ({ ...c, i }))
        .filter((c, i, arr) => i === 0 || arr[i - 1].sectionId !== c.sectionId),
    [chunks],
  );
  const sectionPos = sectionStarts.findLastIndex((s) => s.i <= index);
  const current = chunks[index];

  const urlFor = (i: number, v: Voice = voice) => {
    const q = new URLSearchParams({ slug, i: String(i), voice: v, h: chunks[i].hash });
    if (variant) q.set("v", variant);
    return `/api/ai/ml/tts?${q}`;
  };

  // Load the current chunk whenever position or voice changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !active) return;
    audio.src = urlFor(index);
    audio.playbackRate = rate;
    if (playing) audio.play().catch(() => {});
    // Warm the server cache for the next chunk so playback doesn't stall.
    if (index + 1 < chunks.length) fetch(urlFor(index + 1)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, voice, active]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);

  // Colour the heading of the section being read.
  const sectionId = active ? current?.sectionId : null;
  useEffect(() => {
    if (!sectionId) return;
    const el = document.getElementById(sectionId);
    if (!el) return;
    // accentText can hold several classes ("text-teal-600 dark:text-teal-400").
    const classes = [...accentText.split(/\s+/).filter(Boolean), "transition-colors"];
    el.classList.add(...classes);
    return () => el.classList.remove(...classes);
  }, [sectionId, accentText]);

  // Highlight the paragraph being read and keep it on screen.
  const para = reading.chunk === index ? reading.para : 0;
  useEffect(() => {
    if (!active || !current) return;
    if (!mapRef.current || mapRef.current.sectionId !== current.sectionId) {
      mapRef.current = {
        sectionId: current.sectionId,
        map: mapSection(chunks, current.sectionId),
      };
    }
    // Nearest matched paragraph at or before the current one.
    const list = mapRef.current.map.get(index) ?? [];
    let el: Element | null = null;
    for (let p = Math.min(para, list.length - 1); p >= 0 && !el; p--) el = list[p];
    if (!el) return;
    el.classList.add(...HIGHLIGHT);
    const r = el.getBoundingClientRect();
    // Leave room for the sticky nav on top and the player bar at the bottom.
    if (r.top < 90 || r.bottom > window.innerHeight - 110) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return () => el.classList.remove(...HIGHLIGHT);
  }, [active, current, index, para, chunks]);

  function onTimeUpdate(audio: HTMLAudioElement) {
    const paras = chunks[index]?.paras ?? [];
    const total = paras.reduce((a, p) => a + p.n, 0);
    if (!total) return;
    // Cached audio knows its duration; a first-time stream doesn't yet, so
    // fall back to the voice's average speaking rate.
    const duration =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : total / CHARS_PER_SECOND;
    const pos = Math.min(1, audio.currentTime / duration) * total;
    let acc = 0;
    let p = 0;
    while (p < paras.length - 1 && acc + paras[p].n <= pos) acc += paras[p++].n;
    if (reading.chunk !== index || reading.para !== p) setReading({ chunk: index, para: p });
  }

  function start() {
    const prefs = loadPrefs();
    setRate(prefs.rate);
    setVoice(prefs.voice);
    setError(null);
    setActive(true);
    setPlaying(true);
    setLoading(true);
  }

  function close() {
    audioRef.current?.pause();
    setPlaying(false);
    setActive(false);
    setLoading(false);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setError(null);
      setPlaying(true);
      audio.play().catch(() => {});
    }
  }

  function jumpSection(pos: number) {
    const target = sectionStarts[Math.max(0, Math.min(sectionStarts.length - 1, pos))];
    if (!target) return;
    setError(null);
    setPlaying(true);
    setIndex(target.i);
  }

  function cycleRate() {
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    setRate(next);
    savePrefs({ rate: next, voice });
  }

  function switchVoice() {
    const next: Voice = voice === "female" ? "male" : "female";
    setVoice(next);
    setPlaying(true);
    savePrefs({ rate, voice: next });
  }

  async function onAudioError() {
    if (!active) return;
    setLoading(false);
    setPlaying(false);
    try {
      const res = await fetch(urlFor(index));
      const data = await res.json();
      setError(data?.error || "Audio load হয়নি");
    } catch {
      setError("Audio load হয়নি");
    }
  }

  if (chunks.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={active ? togglePlay : start}
        className="flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
      >
        <Headphones className="size-4" />
        {active ? (playing ? "Pause" : "আবার চালাও") : "Lesson শোনো"}
      </button>

      <audio
        ref={audioRef}
        preload="auto"
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onCanPlay={() => setLoading(false)}
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget)}
        onEnded={() => {
          if (index + 1 < chunks.length) setIndex(index + 1);
          else {
            setPlaying(false);
            setIndex(0);
          }
        }}
        onError={onAudioError}
      />

      {active && (
        <div
          role="region"
          aria-label="Lesson audio player"
          // Mobile: keep clear of the TOC/chat buttons stacked bottom-right.
          className="fixed bottom-4 left-4 right-20 z-40 rounded-2xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-xl lg:right-auto lg:left-1/2 lg:w-[36rem] lg:-translate-x-1/2"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform active:scale-95"
            >
              {loading && playing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : playing ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 translate-x-px fill-current" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <select
                value={sectionPos}
                onChange={(e) => jumpSection(Number(e.target.value))}
                aria-label="Section"
                className="w-full cursor-pointer truncate bg-transparent text-sm font-medium outline-none"
              >
                {sectionStarts.map((s, pos) => (
                  <option key={s.i} value={pos} className="bg-background">
                    {s.sectionTitle}
                  </option>
                ))}
              </select>
              <p className="text-[11px] tabular-nums text-muted-foreground">
                Section {sectionPos + 1}/{sectionStarts.length}
                {loading && playing && " · audio বানানো হচ্ছে…"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <IconBtn label="আগের section" onClick={() => jumpSection(sectionPos - 1)}>
                <SkipBack className="size-4" />
              </IconBtn>
              <IconBtn label="পরের section" onClick={() => jumpSection(sectionPos + 1)}>
                <SkipForward className="size-4" />
              </IconBtn>
              <button
                type="button"
                onClick={cycleRate}
                aria-label="Speed"
                className="w-11 rounded-md py-1.5 text-xs font-semibold tabular-nums text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                {rate}×
              </button>
              <button
                type="button"
                onClick={switchVoice}
                aria-label="Voice"
                className="hidden rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground sm:block"
              >
                {voice === "female" ? "নাবনীতা" : "প্রদীপ"}
              </button>
              <IconBtn label="বন্ধ করো" onClick={close}>
                <X className="size-4" />
              </IconBtn>
            </div>
          </div>

          {error && (
            <p className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      )}
    </>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
