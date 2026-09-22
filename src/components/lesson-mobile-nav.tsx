"use client";

import { useRouter, usePathname } from "next/navigation";
import { LESSONS } from "@/data/lessons";

export function LessonMobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const currentSlug = pathname.split("/").pop();

  return (
    <select
      value={LESSONS.some((l) => l.slug === currentSlug) ? currentSlug : ""}
      onChange={(e) => {
        if (e.target.value) router.push(`/ai/ml/lessons/${e.target.value}`);
      }}
      className="mb-6 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm lg:hidden"
    >
      <option value="" disabled>
        Lesson বেছে নাও
      </option>
      {LESSONS.map((lesson) => (
        <option key={lesson.slug} value={lesson.slug}>
          {lesson.category} — {lesson.title}
        </option>
      ))}
    </select>
  );
}
