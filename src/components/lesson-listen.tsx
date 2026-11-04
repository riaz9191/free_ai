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
import { cn } from "@/lib/utils";

export type ListenChunk = { sectionId: string | null; sectionTitle: string; hash: string };
type Voice = "female" | "male";

const RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];
const PREFS_KEY = "lesson-listen-prefs";

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

  // Highlight and scroll to the heading being read.
  const sectionId = active ? current?.sectionId : null;
  useEffect(() => {
    if (!sectionId) return;
    const el = document.getElementById(sectionId);
    if (!el) return;
    // accentText can hold several classes ("text-teal-600 dark:text-teal-400").
    const classes = [...accentText.split(/\s+/).filter(Boolean), "transition-colors"];
    el.classList.add(...classes);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return () => el.classList.remove(...classes);
  }, [sectionId, accentText]);

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
