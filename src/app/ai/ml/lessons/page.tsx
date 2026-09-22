import Link from "next/link";
import { NotebookText } from "lucide-react";
import { LessonMobileNav } from "@/components/lesson-mobile-nav";
import { LESSONS, LESSON_CATEGORIES } from "@/data/lessons";

export default function LessonsIndexPage() {
  return (
    <div>
      <LessonMobileNav />

      <header className="mb-8">
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <NotebookText className="size-4" />
          AI / ML Lessons
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Notes</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          বাঁয়ের sidebar থেকে একটা module বেছে নাও। Chat-এ data পেস্ট করলে সেই
          module-এর নোট এখানে বসে যাবে।
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {LESSON_CATEGORIES.map((category) => {
          const items = LESSONS.filter((l) => l.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category} className="rounded-xl border border-border bg-card p-4">
              <p className="mb-2 text-sm font-semibold">{category}</p>
              <ul className="space-y-1">
                {items.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/ai/ml/lessons/${lesson.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
