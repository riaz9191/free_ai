import { tool } from "@openrouter/agent/tool";
import { z } from "zod";
import { readFile, writeFile } from "fs/promises";

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    count++;
    idx = haystack.indexOf(needle, idx + needle.length);
  }
  return count;
}

function makeDiff(before: string, after: string, path: string): string {
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const lines: string[] = [`--- ${path}`, `+++ ${path}`];

  const maxLen = Math.max(beforeLines.length, afterLines.length);
  let hunkStart = -1;
  const hunkLines: string[] = [];

  function flushHunk(startB: number, startA: number) {
    if (hunkLines.length === 0) return;
    lines.push(`@@ -${startB + 1} +${startA + 1} @@`);
    lines.push(...hunkLines);
    hunkLines.length = 0;
  }

  let bIdx = 0;
  let aIdx = 0;
  for (let i = 0; i < maxLen; i++) {
    const b = beforeLines[i];
    const a = afterLines[i];
    if (b === a) {
      if (hunkStart !== -1) flushHunk(bIdx, aIdx);
      hunkStart = -1;
      bIdx = i + 1;
      aIdx = i + 1;
      continue;
    }
    if (hunkStart === -1) hunkStart = i;
    if (b !== undefined) hunkLines.push(`-${b}`);
    if (a !== undefined) hunkLines.push(`+${a}`);
  }
  flushHunk(bIdx, aIdx);

  return lines.join("\n");
}

export const fileEditTool = tool({
  name: "file_edit",
  description:
    "Apply search-and-replace edits to a file. Each old_text must appear exactly once in the file (error if not found or ambiguous). Returns a unified diff.",
  inputSchema: z.object({
    path: z.string().describe("Absolute path to the file"),
    edits: z
      .array(
        z.object({
          old_text: z.string().describe("Exact text to find (must be unique in the file)"),
          new_text: z.string().describe("Replacement text"),
        })
      )
      .min(1),
  }),
  execute: async ({ path, edits }) => {
    try {
      const original = await readFile(path, "utf-8");
      let content = original;

      for (const edit of edits) {
        const occurrences = countOccurrences(content, edit.old_text);
        if (occurrences === 0) {
          return { error: `old_text not found in ${path}: ${JSON.stringify(edit.old_text.slice(0, 80))}` };
        }
        if (occurrences > 1) {
          return {
            error: `old_text is ambiguous (${occurrences} matches) in ${path}: ${JSON.stringify(edit.old_text.slice(0, 80))}`,
          };
        }
        content = content.replace(edit.old_text, edit.new_text);
      }

      await writeFile(path, content, "utf-8");
      return { written: true, path, diff: makeDiff(original, content, path) };
    } catch (err: unknown) {
      const e = err as NodeJS.ErrnoException;
      if (e.code === "ENOENT") return { error: `File not found: ${path}` };
      return { error: e.message };
    }
  },
});
