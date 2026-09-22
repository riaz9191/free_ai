import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NotebookText } from "lucide-react";
import { LessonMobileNav } from "@/components/lesson-mobile-nav";
import { LESSONS, getLesson } from "@/data/lessons";
import { getLessonContent } from "@/lib/lessons-content";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const content = await getLessonContent(slug);

  return (
    <div>
      <LessonMobileNav />

      <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <NotebookText className="size-4" />
        {lesson.category}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{lesson.title}</h1>

      <div className="prose prose-sm dark:prose-invert mt-6 max-w-none prose-headings:font-semibold prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-muted prose-pre:text-foreground prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
