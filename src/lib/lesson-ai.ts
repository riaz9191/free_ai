import { getLesson } from "@/data/lessons";
import { GroqError } from "@/lib/groq";
import { lessonContext } from "@/lib/lesson-sections";
import { EMPTY_LESSON_NOTE, getLessonContent, hasAltContent } from "@/lib/lessons-content";

/** Reads `{ slug, v, scope }` from a request body and returns the lesson context. */
export async function contextFromRequest(req: Request, maxBytes: number) {
  let body: { slug?: string; v?: string; scope?: string; idea?: string; theme?: string };
  try {
    body = await req.json();
  } catch {
    throw new GroqError("Invalid JSON body", 400);
  }
  const lesson = getLesson(body.slug ?? "");
  if (!lesson) throw new GroqError("Unknown lesson", 400);

  const variant = body.v === "alt" && (await hasAltContent(lesson.slug)) ? "alt" : undefined;
  const content = await getLessonContent(lesson.slug, variant);
  if (content === EMPTY_LESSON_NOTE) throw new GroqError("এই lesson-এ এখনো নোট নেই।", 404);

  const ctx = lessonContext(content, lesson.title, body.scope || "all", maxBytes);
  if (!ctx) throw new GroqError("Section পাওয়া যায়নি", 404);
  return { lesson, ctx, idea: body.idea?.slice(0, 300).trim() || "", theme: body.theme };
}

export function errorResponse(e: unknown) {
  if (e instanceof GroqError) return Response.json({ error: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ error: "Something went wrong" }, { status: 500 });
}
