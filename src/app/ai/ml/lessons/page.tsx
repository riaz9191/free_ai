import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { LessonMobileNav } from "@/components/lesson-mobile-nav";
import { LESSONS, LESSON_CATEGORIES } from "@/data/lessons";
import { EMPTY_LESSON_NOTE, getLessonContent, hasAltContent } from "@/lib/lessons-content";
import { CATEGORY_STYLE } from "@/lib/lesson-style";
import { cn } from "@/lib/utils";

function readingMinutes(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function LessonsIndexPage() {
  const meta = new Map(
    await Promise.all(
      LESSONS.map(async (lesson) => {
        const content = await getLessonContent(lesson.slug);
        const ready = content !== EMPTY_LESSON_NOTE;
        return [
          lesson.slug,
          {
            ready,
            minutes: ready ? readingMinutes(content) : 0,
            alt: await hasAltContent(lesson.slug),
          },
        ] as const;
      }),
    ),
  );
  const readyCount = [...meta.values()].filter((m) => m.ready).length;

  return (
    <div className="max-w-4xl">
      <LessonMobileNav />

      <header className="relative overflow-hidden rounded-3xl border border-border bg-card px-5 py-7 sm:px-8 sm:py-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-teal-500/10 blur-3xl"
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Lesson notes</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Routine-এর প্রতিটা module-এর গোছানো নোট, Bangla + English-এ। একটা
              lesson বেছে নাও, আর chat-এ data পেস্ট করলে সেই module-এর নোট এখানে বসে যাবে।
            </p>
          </div>
          <Link
            href="/ai/ml"
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <CalendarCheck className="size-4" />
            Routine
          </Link>
        </div>

        <div className="relative mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-5">
          <p className="text-3xl font-semibold tabular-nums tracking-tight">
            {readyCount}
            <span className="text-lg text-muted-foreground"> of {LESSONS.length} notes ready</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {LESSON_CATEGORIES.map((c) => (
              <span key={c} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className={cn("size-2 rounded-full", CATEGORY_STYLE[c].dot)} />
                {c}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-10 space-y-10">
        {LESSON_CATEGORIES.map((category) => {
          const items = LESSONS.filter((l) => l.category === category);
          if (items.length === 0) return null;
          const style = CATEGORY_STYLE[category];

          return (
            <section key={category}>
              <div className="mb-3">
                <h2 className={cn("text-base font-semibold", style.text)}>{category}</h2>
                <p className="text-sm text-muted-foreground">{style.blurb}</p>
              </div>

              <ol className="overflow-hidden rounded-2xl border border-border bg-card">
                {items.map((lesson, i) => {
                  const m = meta.get(lesson.slug)!;
                  return (
                    <li key={lesson.slug} className={cn(i > 0 && "border-t border-border")}>
                      <Link
                        href={`/ai/ml/lessons/${lesson.slug}`}
                        className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none sm:px-5"
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
                            style.soft,
                            style.text,
                          )}
                        >
                          {LESSONS.indexOf(lesson) + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-medium">
                            {lesson.title}
                          </span>
                          <span className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                            {m.ready ? (
                              <span className="tabular-nums">{m.minutes} min পড়া</span>
                            ) : (
                              <span>নোট আসছে</span>
                            )}
                            {m.alt && <span>২টা version</span>}
                          </span>
                        </span>
                        {!m.ready && (
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            Empty
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
