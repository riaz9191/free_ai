import { tool } from "@openrouter/agent/tool";
import { z } from "zod";
import { readdir } from "fs/promises";

export const listDirTool = tool({
  name: "list_dir",
  description: "List directory contents.",
  inputSchema: z.object({
    path: z.string().optional().describe("Directory path (default: cwd)"),
  }),
  execute: async ({ path }) => {
    const dir = path ?? process.cwd();
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      const names = entries
        .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
        .sort();
      const capped = names.slice(0, 500);
      return { entries: capped, total: names.length, truncated: names.length > 500 };
    } catch (err: unknown) {
      const e = err as NodeJS.ErrnoException;
      if (e.code === "ENOENT") return { error: `Directory not found: ${dir}` };
      return { error: e.message };
    }
  },
});
