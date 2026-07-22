import { tool } from "@openrouter/agent/tool";
import { z } from "zod";
import { execFile } from "child_process";

const MAX_OUTPUT_BYTES = 256 * 1024;
const MAX_OUTPUT_LINES = 2000;

export const shellTool = tool({
  name: "shell",
  description: "Execute a shell command and return its output.",
  inputSchema: z.object({
    command: z.string().describe("Shell command to execute"),
    timeout: z.number().optional().describe("Timeout in seconds (default: 120)"),
  }),
  requireApproval: true,
  execute: async ({ command, timeout }) => {
    const shell = process.env.SHELL || "/bin/bash";
    return new Promise((resolve) => {
      execFile(
        shell,
        ["-c", command],
        { timeout: (timeout ?? 120) * 1000, maxBuffer: MAX_OUTPUT_BYTES },
        (error, stdout, stderr) => {
          const combined = (stdout || "") + (stderr || "");
          const lines = combined.split("\n");
          const truncated = lines.length > MAX_OUTPUT_LINES;
          const output = truncated
            ? lines.slice(-MAX_OUTPUT_LINES).join("\n")
            : combined;

          if (error && (error as NodeJS.ErrnoException).code === undefined && error.killed) {
            resolve({ output, exitCode: -1, timedOut: true, truncated });
            return;
          }

          resolve({
            output,
            exitCode: error ? (error as { code?: number }).code ?? 1 : 0,
            ...(truncated && { truncated: true }),
          });
        }
      );
    });
  },
});
