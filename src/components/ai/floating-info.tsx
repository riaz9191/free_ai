"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingInfo({
  children,
  accentClassName = "text-foreground",
}: {
  children: React.ReactNode;
  accentClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed right-5 bottom-5 z-30"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={cn(
          "absolute right-0 bottom-full mb-3 w-[min(26rem,calc(100vw-2.5rem))] origin-bottom-right rounded-2xl border border-border bg-background/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-200",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <div className="max-h-[70vh] overflow-y-auto pr-1 text-sm text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-muted/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground [&_pre]:mt-1 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted/40 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground">
          {children}
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
