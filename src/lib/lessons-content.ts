import { promises as fs } from "fs";
import path from "path";

// Server-only: reads markdown files from disk. Never import this from a
// client component (see src/data/lessons.ts for the client-safe metadata).
const CONTENT_DIR = path.join(process.cwd(), "src", "content", "lessons");

export const EMPTY_LESSON_NOTE =
  "এখনো নোট যোগ করা হয়নি।\n\nচ্যাটে এই module-এর data/lecture note পেস্ট করো — সেটা এখানে গুছিয়ে বসিয়ে দেওয়া হবে।";

function fileFor(slug: string, variant?: "alt") {
  const name = variant === "alt" ? `${slug}.alt.md` : `${slug}.md`;
  return path.join(CONTENT_DIR, name);
}

/**
 * Lesson content lives as plain markdown files in src/content/lessons/<slug>.md,
 * read at build/request time — edit or add a file and the page picks it up, no
 * code change needed. A slug without a file falls back to a placeholder note.
 *
 * A `<slug>.alt.md` file holds an alternative write-up of the same module
 * (e.g. a differently-structured version of the same notes) — pass
 * variant: "alt" to read it instead of the primary file.
 */
export async function getLessonContent(slug: string, variant?: "alt"): Promise<string> {
  try {
    const raw = await fs.readFile(fileFor(slug, variant), "utf-8");
    return raw.trim() || EMPTY_LESSON_NOTE;
  } catch {
    return EMPTY_LESSON_NOTE;
  }
}

export async function hasAltContent(slug: string): Promise<boolean> {
  try {
    await fs.access(fileFor(slug, "alt"));
    return true;
  } catch {
    return false;
  }
}
