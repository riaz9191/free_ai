// Lesson metadata for /ai/ml/lessons. Client-safe — no filesystem access here,
// so the sidebar and mobile nav (client components) can import it directly.
//
// The actual notes live as markdown files in src/content/lessons/<slug>.md,
// read dynamically by src/lib/lessons-content.ts. To add or edit a lesson's
// content: drop/edit that file — no change needed here unless the lesson
// itself (title/category/order) is new.

export type LessonCategory = "Math Foundations" | "Statistics & Probability" | "Python" | "Intro to ML";

export type Lesson = {
  slug: string;
  title: string;
  category: LessonCategory;
  /** Matches the module id in the routine table (src/app/ai/ml/page.tsx), when one exists. */
  routineTaskId?: string;
};

export const LESSONS: Lesson[] = [
  {
    slug: "linear-equation",
    title: "Linear Equation",
    category: "Math Foundations",
    routineTaskId: "m01",
  },
  {
    slug: "scalars-vectors",
    title: "Scalars & Vectors",
    category: "Math Foundations",
    routineTaskId: "m02",
  },
  {
    slug: "matrices",
    title: "Matrices",
    category: "Math Foundations",
    routineTaskId: "m03",
  },
  {
    slug: "derivative-from-scratch",
    title: "Derivative from Scratch",
    category: "Math Foundations",
    routineTaskId: "m04",
  },
  {
    slug: "advanced-derivative",
    title: "Advanced Derivative",
    category: "Math Foundations",
    routineTaskId: "m05",
  },
  {
    slug: "gradient-descent",
    title: "Gradient Descent",
    category: "Math Foundations",
    routineTaskId: "m06",
  },
  {
    slug: "statistics-intro",
    title: "Statistics Intro",
    category: "Statistics & Probability",
    routineTaskId: "m07",
  },
  {
    slug: "probability",
    title: "Probability",
    category: "Statistics & Probability",
    routineTaskId: "m08",
  },
  {
    slug: "python-basics",
    title: "Python Basics",
    category: "Python",
    routineTaskId: "p01",
  },
  {
    slug: "control-flow",
    title: "Control Flow",
    category: "Python",
    routineTaskId: "p02",
  },
  {
    slug: "string-list",
    title: "String & List",
    category: "Python",
    routineTaskId: "p03",
  },
  {
    slug: "tuple-set-dictionary",
    title: "Tuple, Set & Dictionary",
    category: "Python",
    routineTaskId: "p03",
  },
  {
    slug: "intro-to-ml",
    title: "Intro to ML",
    category: "Intro to ML",
    routineTaskId: "p03",
  },
];

export const LESSON_CATEGORIES: LessonCategory[] = [
  "Math Foundations",
  "Statistics & Probability",
  "Python",
  "Intro to ML",
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}
