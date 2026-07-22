import { tool } from "@openrouter/agent/tool";
import { z } from "zod";

/**
 * Starting point for domain-specific tools. Rename, rewrite the schema and
 * execute function, then wire it into tools/index.ts.
 */
export const myCustomTool = tool({
  name: "my_tool",
  description: "Describe what this tool does",
  inputSchema: z.object({
    param: z.string().describe("Description of the parameter"),
  }),
  execute: async ({ param }) => {
    return { result: `TODO: implement my_tool (received: ${param})` };
  },
});
