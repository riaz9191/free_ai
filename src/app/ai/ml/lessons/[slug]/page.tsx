import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NotebookText } from "lucide-react";
import { LessonMobileNav } from "@/components/lesson-mobile-nav";
import { LESSONS, getLesson } from "@/data/lessons";
import { getLessonContent, hasAltContent } from "@/lib/lessons-content";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
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

  return (
    <div>
      <LessonMobileNav />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <NotebookText className="size-4" />
            {lesson.category}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{lesson.title}</h1>
        </div>

        {alt && (
          <div className="flex rounded-lg border border-border bg-card p-0.5 text-sm">
            <Link
              href={`/ai/ml/lessons/${slug}`}
              className={cn(
                "rounded-md px-3 py-1.5 transition-colors",
                !showAlt
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Version 1
            </Link>
            <Link
              href={`/ai/ml/lessons/${slug}?v=alt`}
              className={cn(
                "rounded-md px-3 py-1.5 transition-colors",
                showAlt
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Version 2
            </Link>
          </div>
        )}
      </div>

      <div className="prose prose-sm dark:prose-invert mt-6 max-w-none prose-headings:font-semibold prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-muted prose-pre:text-foreground prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
