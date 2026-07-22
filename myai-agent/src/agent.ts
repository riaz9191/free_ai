import { OpenRouter } from "@openrouter/agent";
import type { Item } from "@openrouter/agent";
import { stepCountIs, maxCost } from "@openrouter/agent/stop-conditions";
import type { AgentConfig } from "./config.js";
import { tools } from "./tools/index.js";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export type AgentEvent =
  | { type: "text"; delta: string }
  | { type: "tool_call"; name: string; callId: string; args: Record<string, unknown> }
  | { type: "tool_result"; name: string; callId: string; output: string }
  | { type: "reasoning"; delta: string };

export async function runAgent(
  config: AgentConfig,
  input: string | ChatMessage[],
  options?: { onEvent?: (event: AgentEvent) => void; signal?: AbortSignal }
) {
  const client = new OpenRouter({ apiKey: config.apiKey });

  const result = client.callModel({
    model: config.model,
    instructions: config.systemPrompt.replace("{cwd}", process.cwd()),
    input: input as string | Item[],
    tools,
    stopWhen: [stepCountIs(config.maxSteps), maxCost(config.maxCost)],
  });

  // Fallback accumulator: some SDK versions return an empty
  // response.outputText after tool-calling turns even though the correct
  // text streamed through getItemsStream() — observed live against
  // OpenRouter with a tool-calling model. Rebuild the final text from the
  // streamed message items (in the order they were first seen) so callers
  // that persist `result.text` (e.g. session logs) never silently save an
  // empty assistant turn.
  const finalTextByItem = new Map<string, string>();
  const itemOrder: string[] = [];

  if (options?.onEvent) {
    // Track text length PER message item by id. A multi-step agent emits
    // multiple OutputMessage items over the course of a single run (one per
    // assistant turn between tool calls), and each one grows from 0 to its
    // final length. A single global cursor breaks on the second message:
    // when its length is smaller than the cursor from the first, the slice
    // cuts mid-string and drops the start of the new message's text.
    const textByItem = new Map<string, number>();
    const callNames = new Map<string, string>();

    for await (const item of result.getItemsStream()) {
      if (options?.signal?.aborted) break;
      if (item.type === "message") {
        const text =
          item.content
            ?.filter((c): c is { type: "output_text"; text: string } => "text" in c)
            .map((c) => c.text)
            .join("") ?? "";
        if (!finalTextByItem.has(item.id)) itemOrder.push(item.id);
        finalTextByItem.set(item.id, text);
        const prev = textByItem.get(item.id) ?? 0;
        if (text.length > prev) {
          options.onEvent({ type: "text", delta: text.slice(prev) });
          textByItem.set(item.id, text.length);
        }
      } else if (item.type === "function_call") {
        callNames.set(item.callId, item.name);
        if (item.status === "completed") {
          const args = (() => {
            try {
              return item.arguments ? JSON.parse(item.arguments) : {};
            } catch {
              return {};
            }
          })();
          options.onEvent({ type: "tool_call", name: item.name, callId: item.callId, args });
        }
      } else if (item.type === "function_call_output") {
        const out = typeof item.output === "string" ? item.output : JSON.stringify(item.output);
        options.onEvent({
          type: "tool_result",
          name: callNames.get(item.callId) ?? "unknown",
          callId: item.callId,
          output: out.length > 200 ? out.slice(0, 200) + "…" : out,
        });
      } else if (item.type === "reasoning") {
        const text = item.summary?.map((s: { text: string }) => s.text).join("") ?? "";
        if (text) options.onEvent({ type: "reasoning", delta: text });
      }
    }
  }

  const response = await result.getResponse();
  const fallbackText = itemOrder.map((id) => finalTextByItem.get(id) ?? "").join("");
  return {
    text: response.outputText || fallbackText,
    usage: response.usage,
    output: response.output,
  };
}

export async function runAgentWithRetry(
  config: AgentConfig,
  input: string | ChatMessage[],
  options?: { onEvent?: (event: AgentEvent) => void; signal?: AbortSignal; maxRetries?: number }
) {
  for (let attempt = 0, max = options?.maxRetries ?? 3; attempt <= max; attempt++) {
    try {
      return await runAgent(config, input, options);
    } catch (err: unknown) {
      const status = (err as { status?: number; statusCode?: number }).status ??
        (err as { statusCode?: number }).statusCode;
      if (!(status === 429 || (status !== undefined && status >= 500 && status < 600)) || attempt === max) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, Math.min(1000 * 2 ** attempt, 30000)));
    }
  }
  throw new Error("Unreachable");
}
