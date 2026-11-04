import crypto from "crypto";

/**
 * Turns a lesson's markdown into speakable chunks for the "listen" player.
 *
 * Sections follow the `##` headings, numbered `section-1`, `section-2`, … in
 * the same order the lesson page's custom `h2` renderer assigns ids, so the
 * player can highlight the heading being read. Text before the first `##` is
 * an intro chunk with no heading id.
 *
 * Each section is split further into chunks of at most MAX_CHARS so one Azure
 * request stays well under its 10-minute-per-request audio limit and the first
 * sound arrives quickly.
 */

export type SpeechChunk = {
  /** DOM id of the `##` heading this chunk belongs to (null = intro). */
  sectionId: string | null;
  sectionTitle: string;
  text: string;
  /** Content hash — changes when the notes or voice change, busting caches. */
  hash: string;
};

const MAX_CHARS = 1800;
const CODE_NOTE = "এখানে একটা code উদাহরণ আছে, স্ক্রিনে দেখে নাও।";

export const VOICES = {
  female: "bn-BD-NabanitaNeural",
  male: "bn-BD-PradeepNeural",
} as const;
export type VoiceKey = keyof typeof VOICES;

function cleanInline(line: string): string {
  return (
    line
      // images, then links → just their text
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      // inline code, bold/italic/strike markers
      .replace(/`([^`]+)`/g, "$1")
      .replace(/(\*\*|__|\*|_|~~)(?=\S)([\s\S]*?\S)\1/g, "$2")
      // stray html tags
      .replace(/<[^>]+>/g, "")
      // emoji and pictographs read badly (“eye emoji”), drop them
      .replace(/[\p{Extended_Pictographic}️‍]/gu, "")
      // arrows and dashes used as separators → pause
      .replace(/\s*(→|⟶|=>|—|–)\s*/g, ", ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** Ensures a pause after headings / list items that lack end punctuation. */
function sentence(text: string): string {
  if (!text) return "";
  return /[।.!?:;,)]$/.test(text) ? text : `${text}।`;
}

type RawSection = { id: string | null; title: string; paragraphs: string[] };

function toSections(markdown: string, lessonTitle: string): RawSection[] {
  const sections: RawSection[] = [{ id: null, title: lessonTitle, paragraphs: [] }];
  let current = sections[0];
  let n = 0;
  let inFence = false;
  let para: string[] = [];

  const flush = () => {
    const text = para.join(" ").trim();
    if (text) current.paragraphs.push(text);
    para = [];
  };

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trimEnd();

    if (/^\s*(```|~~~)/.test(line)) {
      if (!inFence) {
        flush();
        current.paragraphs.push(CODE_NOTE);
      }
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const h2 = /^##\s+(.+?)\s*#*$/.exec(line);
    if (h2) {
      flush();
      n += 1;
      const title = cleanInline(h2[1]);
      current = { id: `section-${n}`, title, paragraphs: [sentence(title)] };
      sections.push(current);
      continue;
    }

    if (!line.trim() || /^\s*([-*_]\s*){3,}$/.test(line)) {
      flush();
      continue;
    }

    // Table: skip the |---| divider, read other rows as comma-separated cells.
    if (/^\s*\|/.test(line)) {
      if (/^\s*\|?[\s:|-]+\|?\s*$/.test(line)) continue;
      flush();
      const cells = line
        .split("|")
        .map((c) => cleanInline(c))
        .filter(Boolean);
      if (cells.length) current.paragraphs.push(sentence(cells.join(", ")));
      continue;
    }

    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      const t = sentence(cleanInline(heading[1]));
      if (t) current.paragraphs.push(t);
      continue;
    }

    const listItem = /^\s*(?:[-*+]|\d+[.)])\s+(.*)$/.exec(line);
    if (listItem) {
      flush();
      const t = sentence(cleanInline(listItem[1]));
      if (t) current.paragraphs.push(t);
      continue;
    }

    const text = cleanInline(line.replace(/^\s*>+\s?/, ""));
    if (text) para.push(text);
  }
  flush();

  // Collapse runs of back-to-back code notes into one.
  for (const s of sections) {
    s.paragraphs = s.paragraphs.filter(
      (p, i, arr) => !(p === CODE_NOTE && arr[i - 1] === CODE_NOTE),
    );
  }
  return sections.filter((s) => s.paragraphs.some((p) => p !== CODE_NOTE) || s.id);
}

function splitLong(paragraph: string): string[] {
  if (paragraph.length <= MAX_CHARS) return [paragraph];
  const parts: string[] = [];
  let buf = "";
  for (const piece of paragraph.split(/(?<=[।.!?])\s+/)) {
    if (buf && buf.length + piece.length + 1 > MAX_CHARS) {
      parts.push(buf);
      buf = "";
    }
    buf = buf ? `${buf} ${piece}` : piece;
    while (buf.length > MAX_CHARS) {
      parts.push(buf.slice(0, MAX_CHARS));
      buf = buf.slice(MAX_CHARS);
    }
  }
  if (buf) parts.push(buf);
  return parts;
}

export function buildSpeechChunks(markdown: string, lessonTitle: string): SpeechChunk[] {
  const chunks: SpeechChunk[] = [];
  for (const section of toSections(markdown, lessonTitle)) {
    let buf: string[] = [];
    let len = 0;
    const push = () => {
      if (!buf.length) return;
      const text = buf.join("\n");
      chunks.push({
        sectionId: section.id,
        sectionTitle: section.title,
        text,
        hash: crypto.createHash("sha1").update(text).digest("hex").slice(0, 12),
      });
      buf = [];
      len = 0;
    };
    for (const p of section.paragraphs.flatMap(splitLong)) {
      if (len && len + p.length > MAX_CHARS) push();
      buf.push(p);
      len += p.length + 1;
    }
    push();
  }
  return chunks;
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toSsml(text: string, voice: VoiceKey): string {
  const body = text
    .split("\n")
    .map((p) => escapeXml(p))
    .join('<break time="450ms"/>');
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="bn-BD"><voice name="${VOICES[voice]}">${body}</voice></speak>`;
}
