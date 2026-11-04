import { GroqError, groqComplete } from "@/lib/groq";
import { contextFromRequest, errorResponse } from "@/lib/lesson-ai";

export const runtime = "nodejs";

const SYSTEM = `You build ONE small interactive web page that helps a learner understand a concept from their ML/Python class notes by playing with it.

Output ONLY a complete HTML document (<!doctype html> … </html>). No markdown fences, no explanation outside the HTML.

Hard rules (it runs in a locked sandbox):
- Everything inline: one <style>, one <script>. Plain JavaScript only.
- NO external resources at all: no CDN scripts, fonts, images, fetch, or network. Draw with <canvas> or inline SVG.
- Do not use localStorage, sessionStorage, cookies, alert, prompt or confirm.
- Must work at 360px wide and on desktop; use relative widths; canvas must resize to its container.
- Keep it under ~220 lines. The code must run without errors.

Design it to teach:
- Pick ONE core idea from the notes that becomes clearer when the learner changes something (sliders, buttons, inputs, step-by-step animation, drag) and sees the result update live.
- Top: a title and 1–2 lines telling the learner what to try. Show the key numbers/state as values change, and a short "কী দেখলে?" takeaway line that updates with the state.
- If the topic is Python code (OOP, lists, functions…), simulate it: e.g. let the learner build objects, step through a loop, or see how a list/dict changes after each operation, showing the matching Python line.
- Labels in the notes' Bangla + English mix (technical terms in English).
- Visual style: clean, rounded cards, system-ui font, generous spacing, one accent colour (#f97316). Use the THEME colours given in the request.`;

const THEMES = {
  dark: "background #0a0a0a, cards #171717, text #fafafa, muted text #a3a3a3, borders #262626",
  light: "background #ffffff, cards #f5f5f5, text #0a0a0a, muted text #525252, borders #e5e5e5",
};

function extractHtml(raw: string): string | null {
  const text = raw.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = text.search(/<!doctype html|<html/i);
  const end = text.toLowerCase().lastIndexOf("</html>");
  if (start < 0) return null;
  return end > start ? text.slice(start, end + 7) : text.slice(start);
}

export async function POST(req: Request) {
  try {
    // The answer (HTML) is long, so the notes get a smaller share of the 8k/min budget.
    const { lesson, ctx, idea, theme } = await contextFromRequest(req, 7000);
    const raw = await groqComplete({
      system: SYSTEM,
      user: [
        `Lesson: ${lesson.title}`,
        `Topic: ${ctx.title}`,
        `THEME: ${theme === "light" ? THEMES.light : THEMES.dark}`,
        idea ? `The learner asked for: ${idea}` : "",
        "",
        "NOTES:",
        ctx.text,
      ]
        .filter((l) => l !== "")
        .join("\n"),
      maxTokens: 5000,
      temperature: 0.6,
    });
    const html = extractHtml(raw);
    if (!html || !/<script/i.test(html)) {
      throw new GroqError("Interactive page বানানো যায়নি, আবার চেষ্টা করো।", 502);
    }
    return Response.json({ html });
  } catch (e) {
    return errorResponse(e);
  }
}
