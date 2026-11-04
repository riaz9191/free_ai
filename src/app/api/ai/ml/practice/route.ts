import { GroqError, groqComplete } from "@/lib/groq";
import { contextFromRequest, errorResponse } from "@/lib/lesson-ai";

export const runtime = "nodejs";

export type PracticeQuestion = {
  type: "mcq" | "output" | "truefalse";
  question: string;
  code?: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type Flashcard = { front: string; back: string };

const SYSTEM = `You create practice material for a Bangladeshi learner studying ML and Python from their own class notes.
Write in the same Bangla + English mix the notes use (technical terms stay in English). Base everything ONLY on the given notes.

Return a JSON object exactly like:
{
  "questions": [
    {
      "type": "mcq" | "output" | "truefalse",
      "question": "string (may use \`inline code\`)",
      "code": "optional Python snippet — REQUIRED for type output",
      "options": ["...", "..."],
      "answer": 0,
      "explanation": "1-2 sentences: why the right answer is right"
    }
  ],
  "flashcards": [ { "front": "short term or question", "back": "short answer" } ]
}

Rules:
- 7 questions. Mix: about 4 "mcq" (4 options), 2 "output" ("এই code-এর output কী?" with a small runnable snippet; 4 options; the right option must be exactly what Python prints), 1 "truefalse" (options ["সত্য","মিথ্যা"]).
- Test understanding, not trivia. Wrong options must be plausible common mistakes.
- "answer" is the 0-based index of the correct option. Double-check it.
- 6 flashcards covering the key ideas/terms.
- If the notes have no code (e.g. pure math), use math/calculation questions instead of "output".`;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Drops malformed items and shuffles options (models like putting the answer first). */
function clean(raw: unknown) {
  const data = raw as { questions?: unknown[]; flashcards?: unknown[] };
  const questions: PracticeQuestion[] = [];
  for (const q of data.questions ?? []) {
    const item = q as Record<string, unknown>;
    const options = Array.isArray(item.options) ? item.options.map(str).filter(Boolean) : [];
    const answer = Number(item.answer);
    const question = str(item.question);
    if (!question || options.length < 2 || !Number.isInteger(answer) || !options[answer]) continue;
    const type = item.type === "output" || item.type === "truefalse" ? item.type : "mcq";
    const correct = options[answer];
    const order = type === "truefalse" ? options : shuffle(options);
    questions.push({
      type,
      question,
      code: str(item.code) || undefined,
      options: order,
      answer: order.indexOf(correct),
      explanation: str(item.explanation),
    });
  }
  const flashcards: Flashcard[] = (data.flashcards ?? [])
    .map((f) => ({ front: str((f as Flashcard).front), back: str((f as Flashcard).back) }))
    .filter((f) => f.front && f.back);
  return { questions, flashcards };
}

export async function POST(req: Request) {
  try {
    // ~2.8k prompt tokens + ~3.5k answer stays under the 8k/min free limit.
    const { lesson, ctx } = await contextFromRequest(req, 11000);
    const raw = await groqComplete({
      system: SYSTEM,
      user: `Lesson: ${lesson.title}\nTopic: ${ctx.title}\n\nNOTES:\n${ctx.text}`,
      maxTokens: 3500,
      json: true,
    });
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new GroqError("AI-এর উত্তর ঠিকমতো আসেনি, আবার চেষ্টা করো।", 502);
    }
    const result = clean(parsed);
    if (result.questions.length < 2) {
      throw new GroqError("যথেষ্ট প্রশ্ন বানানো যায়নি, আবার চেষ্টা করো।", 502);
    }
    return Response.json(result);
  } catch (e) {
    return errorResponse(e);
  }
}
