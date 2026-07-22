"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Info, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingInfo({
  children,
  accentClassName = "text-foreground",
}: {
  children: React.ReactNode;
  accentClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setUnlocked((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function cancelClose() {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }

  function scheduleClose() {
    cancelClose();
    closeTimeout.current = setTimeout(() => setOpen(false), 250);
  }

  return (
    <div
      ref={rootRef}
      className="fixed right-5 bottom-5 z-30"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <div
        className={cn(
          "absolute right-0 bottom-full mb-3 w-[min(26rem,calc(100vw-2.5rem))] origin-bottom-right rounded-2xl border border-border bg-background/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-200",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <div className="relative">
          {!unlocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 rounded-xl bg-background/70 backdrop-blur-md">
              <span className="flex size-9 items-center justify-center rounded-full bg-muted/40">
                <Lock className="size-4 text-muted-foreground" />
              </span>
              <p className="text-sm font-semibold">Setup instructions are Premium</p>
              <Link
                href="/premium"
                className={cn(
                  "flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/50",
                  accentClassName
                )}
              >
                <Sparkles className="size-3.5" />
                Buy Premium
              </Link>
              {/* <p className="text-[11px] text-muted-foreground">
                or press{" "}
                <kbd className="rounded border border-border bg-muted/40 px-1 py-0.5 font-mono">
                  Ctrl
                </kbd>
                +
                <kbd className="rounded border border-border bg-muted/40 px-1 py-0.5 font-mono">
                  J
                </kbd>
              </p> */}
            </div>
          )}
          <div
            className={cn(
              "max-h-[70vh] overflow-y-auto pr-1 text-sm text-muted-foreground transition-all [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-muted/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground [&_pre]:mt-1 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted/40 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground",
              !unlocked && "pointer-events-none blur-md select-none"
            )}
          >
            {children}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Setup instructions"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex size-11 items-center justify-center rounded-full border border-border bg-background/90 shadow-lg backdrop-blur-xl transition-all hover:scale-105",
          accentClassName
        )}
      >
        <Info className="size-5" />
      </button>
    </div>
  );
}
