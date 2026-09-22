// Lesson notes for the AI/ML routine. Each entry's `content` is markdown.
//
// How this fills up: paste raw lecture notes/data in the chat for a module,
// and it gets written into that lesson's `content` here — this file is the
// single source of truth for /ai/ml/lessons, no CMS or DB involved.

export type LessonCategory = "Math Foundations" | "Statistics & Probability" | "Python" | "Intro to ML";

export type Lesson = {
  slug: string;
  title: string;
  category: LessonCategory;
  /** Matches the module id in the routine table (src/app/ai/ml/page.tsx), when one exists. */
  routineTaskId?: string;
  content: string;
};

const EMPTY_NOTE =
  "এখনো নোট যোগ করা হয়নি।\n\nচ্যাটে এই module-এর data/lecture note পেস্ট করো — সেটা এখানে গুছিয়ে বসিয়ে দেওয়া হবে।";

export const LESSONS: Lesson[] = [
  {
    slug: "linear-equation",
    title: "Linear Equation",
    category: "Math Foundations",
    routineTaskId: "m01",
    content: EMPTY_NOTE,
  },
  {
    slug: "scalars-vectors",
    title: "Scalars & Vectors",
    category: "Math Foundations",
    routineTaskId: "m02",
    content: EMPTY_NOTE,
  },
  {
    slug: "matrices",
    title: "Matrices",
    category: "Math Foundations",
    routineTaskId: "m03",
    content: EMPTY_NOTE,
  },
  {
    slug: "derivative-from-scratch",
    title: "Derivative from Scratch",
    category: "Math Foundations",
    routineTaskId: "m04",
    content: EMPTY_NOTE,
  },
  {
    slug: "advanced-derivative",
    title: "Advanced Derivative",
    category: "Math Foundations",
    routineTaskId: "m05",
    content: EMPTY_NOTE,
  },
  {
    slug: "gradient-descent",
    title: "Gradient Descent",
    category: "Math Foundations",
    routineTaskId: "m06",
    content: EMPTY_NOTE,
  },
  {
    slug: "statistics-intro",
    title: "Statistics Intro",
    category: "Statistics & Probability",
    routineTaskId: "m07",
    content: EMPTY_NOTE,
  },
  {
    slug: "probability",
    title: "Probability",
    category: "Statistics & Probability",
    routineTaskId: "m08",
    content: EMPTY_NOTE,
  },
  {
    slug: "python-basics",
    title: "Python Basics",
    category: "Python",
    routineTaskId: "p01",
    content: EMPTY_NOTE,
  },
  {
    slug: "control-flow",
    title: "Control Flow",
    category: "Python",
    routineTaskId: "p02",
    content: EMPTY_NOTE,
  },
  {
    slug: "string-list",
    title: "String & List",
    category: "Python",
    routineTaskId: "p03",
    content: EMPTY_NOTE,
  },
  {
    slug: "tuple-set-dictionary",
    title: "Tuple, Set & Dictionary",
    category: "Python",
    routineTaskId: "p03",
    content: EMPTY_NOTE,
  },
  {
    slug: "intro-to-ml",
    title: "Intro to ML",
    category: "Intro to ML",
    routineTaskId: "p03",
    content: EMPTY_NOTE,
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
