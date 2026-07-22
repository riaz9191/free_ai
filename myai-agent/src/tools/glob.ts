import { tool } from "@openrouter/agent/tool";
import { z } from "zod";
import { glob } from "glob";

export const globTool = tool({
  name: "glob",
  description: "Find files by glob pattern.",
  inputSchema: z.object({
    pattern: z.string().describe('Glob pattern, e.g. "src/**/*.ts"'),
    path: z.string().optional().describe("Directory to search in (default: cwd)"),
  }),
  execute: async ({ pattern, path }) => {
    const matches = await glob(pattern, {
      cwd: path ?? process.cwd(),
      ignore: ["**/node_modules/**", "**/.git/**"],
      nodir: true,
    });
    const capped = matches.slice(0, 1000);
    return {
      files: capped,
      total: matches.length,
      truncated: matches.length > 1000,
    };
  },
});
