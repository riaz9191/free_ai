import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LessonMobileNav } from "@/components/lesson-mobile-nav";
import { LessonToc, LessonTocMobile } from "@/components/lesson-toc";
import { LESSONS, getLesson } from "@/data/lessons";
import { EMPTY_LESSON_NOTE, getLessonContent, hasAltContent } from "@/lib/lessons-content";
import { CATEGORY_STYLE } from "@/lib/lesson-style";
import { extractToc } from "@/lib/toc";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

/**
 * Tags every `##` heading with `section-1`, `section-2`, … in document order —
 * the same numbering src/lib/toc.ts assigns from the raw markdown, so the
 * sidebar's links land on the right heading.
 */
function createMarkdownComponents(): Components {
  let n = 0;
  return {
    h2({ children, ...rest }) {
      n += 1;
      return (
        <h2 id={`section-${n}`} className="scroll-mt-24" {...rest}>
          {children}
        </h2>
      );
    },
    // Notebook/dataset links download the file instead of opening raw JSON/CSV.
    a({ href, children, ...rest }) {
      const isDownload = /\.(ipynb|csv)$/i.test(href ?? "");
      return (
        <a href={href} download={isDownload || undefined} {...rest}>
          {children}
        </a>
      );
    },
  };
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const { slug } = await params;
  const { v } = await searchParams;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const showAlt = v === "alt";
  const alt = await hasAltContent(slug);
  const content = await getLessonContent(slug, showAlt && alt ? "alt" : undefined);
  const toc = extractToc(content);

  const index = LESSONS.findIndex((l) => l.slug === slug);
  const prev = LESSONS[index - 1];
  const next = LESSONS[index + 1];
  const style = CATEGORY_STYLE[lesson.category];
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        <LessonMobileNav />

        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div className="min-w-0">
            <p className={cn("flex items-center gap-2 text-sm font-medium", style.text)}>
              <span className={cn("size-2 rounded-full", style.dot)} />
              {lesson.category}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {lesson.title}
            </h1>
            <p className="mt-2 text-sm tabular-nums text-muted-foreground">
              Lesson {index + 1} of {LESSONS.length}
              {content !== EMPTY_LESSON_NOTE && <> · {minutes} min পড়া</>}
            </p>
          </div>

          {alt && (
            <div className="flex rounded-full border border-border bg-card p-1 text-sm">
              <Link
                href={`/ai/ml/lessons/${slug}`}
                className={cn(
                  "rounded-full px-3.5 py-1.5 transition-colors",
                  !showAlt
                    ? "bg-foreground font-medium text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Version 1
              </Link>
              <Link
                href={`/ai/ml/lessons/${slug}?v=alt`}
                className={cn(
                  "rounded-full px-3.5 py-1.5 transition-colors",
                  showAlt
                    ? "bg-foreground font-medium text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Version 2
              </Link>
            </div>
          )}
        </header>

        <LessonTocMobile items={toc} />

        <div className="prose dark:prose-invert mt-8 max-w-3xl prose-headings:font-semibold prose-headings:tracking-tight prose-a:underline-offset-4 prose-table:text-sm prose-pre:rounded-xl prose-pre:border prose-pre:border-border prose-pre:bg-muted prose-pre:text-foreground prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={createMarkdownComponents()}>
            {content}
          </ReactMarkdown>
        </div>

        <nav className="mt-16 grid max-w-3xl gap-3 border-t border-border pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/ai/ml/lessons/${prev.slug}`}
              className="group rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                আগের lesson
              </span>
              <span className="mt-1 block truncate font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/ai/ml/lessons/${next.slug}`}
              className="group rounded-2xl border border-border bg-card p-4 text-right transition-colors hover:bg-accent/50"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                পরের lesson
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block truncate font-medium">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>

      <LessonToc items={toc} />
    </div>
  );
}
