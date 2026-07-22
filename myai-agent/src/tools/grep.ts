import { tool } from "@openrouter/agent/tool";
import { z } from "zod";
import { execFile } from "child_process";
import { promisify } from "util";
import { glob } from "glob";
import { readFile } from "fs/promises";

const execFileAsync = promisify(execFile);

type Match = { file: string; line: number; content: string };

async function grepWithRipgrep(
  pattern: string,
  path: string,
  globFilter: string | undefined,
  ignoreCase: boolean | undefined
): Promise<Match[]> {
  const args = ["--line-number", "--no-heading"];
  if (ignoreCase) args.push("-i");
  if (globFilter) args.push("--glob", globFilter);
  args.push(pattern, path);

  const { stdout } = await execFileAsync("rg", args, { maxBuffer: 4 * 1024 * 1024 });
  return stdout
    .split("\n")
    .filter(Boolean)
    .slice(0, 100)
    .map((line) => {
      const match = line.match(/^(.+?):(\d+):(.*)$/);
      if (!match) return null;
      return { file: match[1], line: Number(match[2]), content: match[3] };
    })
    .filter((m): m is Match => m !== null);
}

async function grepFallback(
  pattern: string,
  path: string,
  globFilter: string | undefined,
  ignoreCase: boolean | undefined
): Promise<Match[]> {
  const files = await glob(globFilter ?? "**/*", {
    cwd: path,
    ignore: ["**/node_modules/**", "**/.git/**"],
    nodir: true,
    absolute: true,
  });

  const regex = new RegExp(pattern, ignoreCase ? "i" : "");
  const matches: Match[] = [];

  for (const file of files) {
    if (matches.length >= 100) break;
    try {
      const content = await readFile(file, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
          matches.push({ file, line: i + 1, content: lines[i] });
          if (matches.length >= 100) break;
        }
      }
    } catch {
      // skip unreadable/binary files
    }
  }

  return matches;
}

export const grepTool = tool({
  name: "grep",
  description: "Search file contents by regex.",
  inputSchema: z.object({
    pattern: z.string().describe("Regex pattern to search for"),
    path: z.string().optional().describe("Directory or file to search (default: cwd)"),
    glob: z.string().optional().describe('File filter, e.g. "*.ts"'),
    ignoreCase: z.boolean().optional(),
  }),
  execute: async ({ pattern, path, glob: globFilter, ignoreCase }) => {
    const searchPath = path ?? process.cwd();
    try {
      const matches = await grepWithRipgrep(pattern, searchPath, globFilter, ignoreCase);
      return { matches, total: matches.length };
    } catch {
      try {
        const matches = await grepFallback(pattern, searchPath, globFilter, ignoreCase);
        return { matches, total: matches.length };
      } catch (err: unknown) {
        return { error: (err as Error).message };
      }
    }
  },
});
