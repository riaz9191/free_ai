/**
 * Splits a lesson's markdown at its `##` headings (ignoring `##` inside code
 * fences), numbered `section-1`, `section-2`, … like the page's heading ids.
 * Text before the first `##` is the intro (id null).
 */
export type LessonSection = { id: string | null; title: string; body: string };

export function splitSections(markdown: string, lessonTitle: string): LessonSection[] {
  const sections: LessonSection[] = [{ id: null, title: lessonTitle, body: "" }];
  let n = 0;
  let inFence = false;
  const lines: string[][] = [[]];
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const h2 = !inFence && /^##\s+(.+?)\s*#*$/.exec(line);
    if (h2) {
      n += 1;
      sections.push({ id: `section-${n}`, title: h2[1].replace(/[`*_]/g, ""), body: "" });
      lines.push([]);
      continue;
    }
    lines[lines.length - 1].push(line);
  }
  sections.forEach((s, i) => (s.body = lines[i].join("\n").trim()));
  return sections.filter((s) => s.id || s.body);
}

const bytes = (s: string) => Buffer.byteLength(s, "utf-8");

/** Cuts text to at most maxBytes, preferring a paragraph or line boundary. */
function trimTo(text: string, maxBytes: number): string {
  if (bytes(text) <= maxBytes) return text;
  let out = "";
  for (const block of text.split(/\n(?=\n)|\n(?=```)/)) {
    if (bytes(out + block) > maxBytes) break;
    out += block;
  }
  if (!out) out = Buffer.from(text).subarray(0, maxBytes).toString("utf-8").replace(/�+$/, "");
  // Don't leave a code fence open.
  if ((out.match(/```/g) ?? []).length % 2 === 1) out += "\n```";
  return `${out}\n…`;
}

/**
 * The lesson text sent to the model. Groq's free tier allows ~8000 tokens a
 * minute (prompt + answer), and Bangla costs roughly 1 token per 4–5 bytes, so
 * the context is capped by bytes. One section is sent as-is up to the cap;
 * "all" gives every section an equal slice so the whole lesson is covered.
 */
export function lessonContext(
  markdown: string,
  lessonTitle: string,
  scope: string,
  maxBytes: number,
): { title: string; text: string } | null {
  const sections = splitSections(markdown, lessonTitle);
  if (scope !== "all") {
    const s = sections.find((x) => (x.id ?? "intro") === scope);
    if (!s) return null;
    return { title: s.title, text: trimTo(`## ${s.title}\n\n${s.body}`, maxBytes) };
  }
  const per = Math.floor(maxBytes / Math.max(1, sections.length));
  const text = sections
    .map((s) => trimTo(`## ${s.title}\n\n${s.body}`, Math.max(300, per)))
    .join("\n\n");
  return { title: lessonTitle, text: trimTo(text, maxBytes) };
}
