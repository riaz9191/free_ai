import type { LessonCategory } from "@/data/lessons";

// Same phase colours as the routine page (src/app/ai/ml/page.tsx), so a module
// reads as the same colour everywhere. Class names are spelled out for Tailwind.
export const CATEGORY_STYLE: Record<
  LessonCategory,
  { dot: string; text: string; soft: string; border: string; blurb: string }
> = {
  "Math Foundations": {
    dot: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-400",
    soft: "bg-indigo-500/10",
    border: "border-indigo-500",
    blurb: "Linear equation থেকে gradient descent পর্যন্ত",
  },
  "Statistics & Probability": {
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    soft: "bg-amber-500/10",
    border: "border-amber-500",
    blurb: "Data বোঝার ভাষা",
  },
  Python: {
    dot: "bg-teal-500",
    text: "text-teal-600 dark:text-teal-400",
    soft: "bg-teal-500/10",
    border: "border-teal-500",
    blurb: "Basics থেকে NumPy, Pandas আর visualization",
  },
  "Intro to ML": {
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    soft: "bg-rose-500/10",
    border: "border-rose-500",
    blurb: "প্রথম ML ধারণা",
  },
};
