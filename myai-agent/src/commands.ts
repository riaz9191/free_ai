import type { Interface } from "readline";
import type { AgentConfig } from "./config.js";
import type { ChatMessage } from "./agent.js";

export interface CommandContext {
  config: AgentConfig;
  rl: Interface;
  messages: ChatMessage[];
  sessionPath: string;
  resetSession: () => string;
  totalTokens: { input: number; output: number };
}

export interface SlashCommand {
  name: string;
  description: string;
  execute: (args: string, ctx: CommandContext) => Promise<void>;
}

const commands: SlashCommand[] = [];

export function registerCommand(cmd: SlashCommand): void {
  commands.push(cmd);
}

export function getCommands(): SlashCommand[] {
  return commands;
}

const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

export async function dispatch(input: string, ctx: CommandContext): Promise<boolean> {
  const [name, ...rest] = input.split(" ");
  const cmd = commands.find((c) => c.name === name);
  if (!cmd) {
    console.log(`  ${DIM}Unknown command: ${name}. Type /help for available commands.${RESET}`);
    return true;
  }
  await cmd.execute(rest.join(" "), ctx);
  return true;
}
