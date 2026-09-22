"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";

export function LessonToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    observerRef.current?.disconnect();
    // Treat the top band of the viewport (below the sticky navbar) as the
    // "currently reading" line; whichever heading is in that band is active.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [items]);

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }

  if (items.length === 0) return null;

  return (
    <aside className="hidden shrink-0 lg:block lg:w-62">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          এই পেজে
        </p>
        <nav className="space-y-0.5 border-l border-border">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              title={item.text}
              onClick={(e) => {
                e.preventDefault();
                jumpTo(item.id);
              }}
              className={cn(
                "-ml-px block truncate border-l-2 py-1 pl-3 text-sm leading-snug transition-colors",
                activeId === item.id
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
