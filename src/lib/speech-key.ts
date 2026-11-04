/**
 * Shared by the server (speech paragraphs) and the browser (rendered lesson
 * blocks) so the listen player can find which paragraph on the page is being
 * read. Keeps only letters, combining marks (Bangla vowel signs) and digits,
 * so markdown syntax, punctuation, arrows and emoji don't affect matching.
 */
export function speechKey(text: string, length = 24): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]/gu, "")
    .slice(0, length);
}

/** Paragraph is a code block placeholder → matches the next `<pre>`. */
export const CODE_KEY = "#code";
/** Paragraph continues the previous one (a long paragraph split in parts). */
export const CONT_KEY = "+";

/** Average Bangla speaking rate of the bn-BD neural voices at 1×. */
export const CHARS_PER_SECOND = 13.2;
