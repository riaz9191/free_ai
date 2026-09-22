"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";

/** Tracks which heading is currently in the "reading band" below the navbar. */
function useActiveSection(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  return [activeId, setActiveId] as const;
}

function jumpTo(id: string, setActiveId: (id: string) => void) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
  setActiveId(id);
}

/** Sticky right-rail outline — desktop only. */
export function LessonToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useActiveSection(items);
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
                jumpTo(item.id, setActiveId);
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

/**
 * Floating outline button — mobile/tablet only. Stays pinned to the corner
 * while scrolling (unlike an inline dropdown, which scrolls out of reach),
 * and opens a bottom sheet listing every section.
 */
export function LessonTocMobile({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useActiveSection(items);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="এই পেজের section list খোলো"
        className="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full border border-border bg-foreground text-background shadow-lg transition-transform active:scale-95"
      >
        <ListTree className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="বন্ধ করো"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full rounded-t-2xl border-t border-border bg-card pb-[env(safe-area-inset-bottom)] shadow-2xl">
            <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-border" />
            <p className="px-4 pb-2 pt-3 text-sm font-semibold">এই পেজে</p>
            <nav className="max-h-[60vh] overflow-y-auto px-2 pb-3">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  title={item.text}
                  onClick={(e) => {
                    e.preventDefault();
                    jumpTo(item.id, setActiveId);
                    setOpen(false);
                  }}
                  className={cn(
                    "block truncate rounded-md px-3 py-2.5 text-sm transition-colors",
                    activeId === item.id
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
