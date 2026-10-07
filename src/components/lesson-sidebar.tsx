"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LESSONS, LESSON_CATEGORIES } from "@/data/lessons";
import { CATEGORY_STYLE } from "@/lib/lesson-style";
import { cn } from "@/lib/utils";

export function LessonSidebar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // The sidebar scrolls on its own, so bring the current lesson into view
  // (e.g. a Python lesson near the bottom of the list).
  useEffect(() => {
    navRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <nav ref={navRef} className="space-y-6">
      {LESSON_CATEGORIES.map((category) => {
        const items = LESSONS.filter((l) => l.category === category);
        if (items.length === 0) return null;
        const style = CATEGORY_STYLE[category];

        return (
          <div key={category}>
            <p className={cn("mb-2 flex items-center gap-2 px-2 text-sm font-semibold", style.text)}>
              <span className={cn("size-1.5 rounded-full", style.dot)} />
              {category}
            </p>
            <ul className="ml-2.5 space-y-0.5 border-l border-border">
              {items.map((lesson) => {
                const href = `/ai/ml/lessons/${lesson.slug}`;
                const active = pathname === href;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "-ml-px block truncate border-l-2 py-1.5 pl-3 pr-2 text-[15px] transition-colors",
                        active
                          ? cn(style.border, "font-medium text-foreground")
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                      )}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
