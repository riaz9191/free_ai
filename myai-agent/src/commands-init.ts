import { registerCommand, getCommands } from "./commands.js";
import type { Interface } from "readline";

const DIM = "\x1b[2m";
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";

function ask(rl: Interface, prompt: string): Promise<string> {
  return new Promise((r) => rl.question(prompt, r));
}

registerCommand({
  name: "/model",
  description: "Switch to a different model",
  execute: async (_args, ctx) => {
    console.log(`  ${DIM}Current:${RESET} ${CYAN}${ctx.config.model}${RESET}`);
    const query = await ask(ctx.rl, `  ${DIM}Search models:${RESET} `);
    if (!query.trim()) return;
    process.stdout.write(`  ${DIM}Fetching…${RESET}`);
    const res = await fetch("https://openrouter.ai/api/v1/models");
    const { data } = (await res.json()) as { data: { id: string; name: string }[] };
    process.stdout.write("\r\x1b[K");
    const q = query.toLowerCase();
    const matches = data
      .filter((m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q))
      .slice(0, 15);
    if (!matches.length) {
      console.log(`  ${DIM}No models matching "${query}".${RESET}`);
      return;
    }
    matches.forEach((m, i) => console.log(`  ${DIM}${String(i + 1).padStart(2)})${RESET} ${m.id}`));
    const pick = await ask(ctx.rl, `\n  ${DIM}Select (1-${matches.length}):${RESET} `);
    const idx = parseInt(pick, 10) - 1;
    if (idx >= 0 && idx < matches.length) {
      ctx.config.model = matches[idx].id;
      console.log(`  ${DIM}Model →${RESET} ${CYAN}${ctx.config.model}${RESET}`);
    } else {
      console.log(`  ${DIM}Cancelled.${RESET}`);
    }
  },
});

registerCommand({
  name: "/new",
  description: "Start a fresh conversation",
  execute: async (_args, ctx) => {
    ctx.messages.length = 0;
    ctx.sessionPath = ctx.resetSession();
    console.log(`  ${GREEN}✓${RESET} ${DIM}New session started.${RESET}`);
  },
});

registerCommand({
  name: "/help",
  description: "List available commands",
  execute: async () => {
    for (const cmd of getCommands()) {
      console.log(`  ${CYAN}${cmd.name.padEnd(12)}${RESET}${DIM}${cmd.description}${RESET}`);
    }
  },
});
