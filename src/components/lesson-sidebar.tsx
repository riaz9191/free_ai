"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { LESSONS, LESSON_CATEGORIES } from "@/data/lessons";
import { cn } from "@/lib/utils";

export function LessonSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {LESSON_CATEGORIES.map((category) => {
        const items = LESSONS.filter((l) => l.category === category);
        if (items.length === 0) return null;

        return (
          <div key={category}>
            <p className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {category}
            </p>
            <ul className="space-y-0.5">
              {items.map((lesson) => {
                const href = `/ai/ml/lessons/${lesson.slug}`;
                const active = pathname === href;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      )}
                    >
                      <BookOpen className="size-3.5 shrink-0" />
                      <span className="truncate">{lesson.title}</span>
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
