import { isValidElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, BookOpenText, Clock, ListTree } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { LessonMobileNav } from "@/components/lesson-mobile-nav";
import { LessonToc, LessonTocMobile } from "@/components/lesson-toc";
import { ReadingProgress } from "@/components/reading-progress";
import { LESSONS, getLesson } from "@/data/lessons";
import { EMPTY_LESSON_NOTE, getLessonContent, hasAltContent } from "@/lib/lessons-content";
import { CATEGORY_STYLE } from "@/lib/lesson-style";
import { extractToc } from "@/lib/toc";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

type CategoryStyle = (typeof CATEGORY_STYLE)[keyof typeof CATEGORY_STYLE];

/**
 * Tags every `##` heading with `section-1`, `section-2`, … in document order —
 * the same numbering src/lib/toc.ts assigns from the raw markdown, so the
 * sidebar's links land on the right heading.
 */
function createMarkdownComponents(style: CategoryStyle): Components {
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
    pre({ children }) {
      const className = isValidElement<{ className?: string }>(children)
        ? children.props.className
        : undefined;
      const language = /language-([\w+-]+)/.exec(className ?? "")?.[1];
      return <CodeBlock language={language}>{children}</CodeBlock>;
    },
    blockquote({ children }) {
      return (
        <blockquote
          className={cn(
            "my-6 rounded-r-xl border-l-[3px] px-5 py-1 font-normal not-italic text-foreground [&_p]:before:content-none [&_p]:after:content-none",
            style.border,
            style.soft,
          )}
        >
          {children}
        </blockquote>
      );
    },
    table({ children }) {
      return (
        <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm [&_td]:border-t [&_td]:border-border [&_td]:px-4 [&_td]:py-2.5 [&_td]:align-top [&_th]:bg-black/[.03] dark:[&_th]:bg-white/[.04] [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_tbody_tr:hover]:bg-accent/40 [&_code]:rounded [&_code]:bg-black/[.05] dark:[&_code]:bg-white/[.08] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em]">
            {children}
          </table>
        </div>
      );
    },
    img({ src, alt }) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={typeof src === "string" ? src : undefined}
          alt={alt ?? ""}
          loading="lazy"
          className="rounded-xl border border-border bg-white"
        />
      );
    },
  };
}

const PROSE = cn(
  "prose dark:prose-invert max-w-3xl text-[1.0625rem] leading-[1.8]",
  "prose-headings:font-semibold prose-headings:tracking-tight",
  "prose-h2:mt-4 prose-h2:text-2xl sm:prose-h2:text-[1.75rem]",
  "prose-h3:mt-10 prose-h3:text-lg",
  "prose-hr:my-14 prose-hr:border-border",
  "prose-a:underline-offset-4",
  "prose-strong:font-semibold prose-li:my-1",
  "prose-code:rounded-md prose-code:bg-black/[.05] dark:prose-code:bg-white/[.08] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.875em] prose-code:font-medium prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none",
);

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
  const ready = content !== EMPTY_LESSON_NOTE;
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  return (
    <div className="flex gap-10">
      <ReadingProgress className={style.dot} />

      <div className="min-w-0 flex-1">
        <LessonMobileNav />

        <header className="relative max-w-3xl overflow-hidden rounded-3xl border border-border bg-card px-5 py-7 sm:px-8 sm:py-8">
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute -right-20 -top-28 size-72 rounded-full blur-3xl",
              style.glow,
            )}
          />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={cn("flex items-center gap-2 text-sm font-medium", style.text)}>
                <span className={cn("size-2 rounded-full", style.dot)} />
                {lesson.category}
              </p>
              <p className="text-sm tabular-nums text-muted-foreground">
                Lesson {index + 1} of {LESSONS.length}
              </p>
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {lesson.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {ready ? (
                  <>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      {minutes} min পড়া
                    </span>
                    {toc.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <ListTree className="size-4" />
                        {toc.length} sections
                      </span>
                    )}
                  </>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <BookOpenText className="size-4" />
                    নোট এখনো যোগ হয়নি
                  </span>
                )}
              </div>

              {alt && (
                <div className="flex rounded-full border border-border bg-background p-1 text-sm">
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
            </div>
          </div>
        </header>

        <LessonTocMobile items={toc} />

        <article className={cn(PROSE, "mt-10")}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={createMarkdownComponents(style)}>
            {content}
          </ReactMarkdown>
        </article>

        <nav className="mt-16 grid max-w-3xl gap-3 border-t border-border pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/ai/ml/lessons/${prev.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-accent/50"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                আগের lesson
              </span>
              <span className="mt-1.5 block truncate font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/ai/ml/lessons/${next.slug}`}
              className="group rounded-2xl border border-border bg-card p-5 text-right transition-colors hover:bg-accent/50"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                পরের lesson
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1.5 block truncate font-medium">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>

      <LessonToc items={toc} accent={style.border} />
    </div>
  );
}
