"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Thin bar pinned to the top of the viewport that fills as the page is read. */
export function ReadingProgress({ className }: { className?: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-0.5">
      <div className={cn("h-full", className)} style={{ width: `${pct}%` }} />
    </div>
  );
}
