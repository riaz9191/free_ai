export type TocItem = { id: string; text: string };

/**
 * Pulls an outline from a lesson's `##` headings, in document order. The id
 * scheme (`section-1`, `section-2`, …) must match the counter the custom `h2`
 * renderer assigns in the ReactMarkdown `components` prop — both walk the
 * same markdown in the same order, so they stay in sync without a shared
 * slugify function.
 */
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  let n = 0;
  for (const line of markdown.split("\n")) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    n += 1;
    items.push({ id: `section-${n}`, text: match[1].replace(/[`*_]/g, "") });
  }
  return items;
}
