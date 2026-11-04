"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sits above the chat button in the bottom-right stack. Below lg that stack is
 * TOC (bottom-5) → chat (bottom-20) → this; on lg the TOC button is hidden, so
 * it's chat (bottom-5) → this.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="উপরে যাও"
      title="উপরে যাও"
      className={cn(
        "fixed right-6 bottom-36 z-40 flex size-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 lg:bottom-20",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
