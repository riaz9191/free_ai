import { createInterface } from "readline";
import { loadConfig } from "./config.js";
import { runAgentWithRetry, type ChatMessage } from "./agent.js";
import { detectBg } from "./terminal-bg.js";
import { TuiRenderer } from "./renderer.js";
import { Loader } from "./loader.js";
import { printBanner } from "./banner.js";
import {
  initSessionDir,
  loadSession,
  saveMessage,
  newSessionPath,
} from "./session.js";
import { dispatch, type CommandContext } from "./commands.js";
import "./commands-init.js";

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const WHITE = "\x1b[97m";
const YELLOW = "\x1b[33m";
const GRAY = "\x1b[90m";

function formatTokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function styledReadLine(bg: string): Promise<string> {
  return new Promise((resolve) => {
    let line = "";
    let first = true;

    function draw() {
      if (first) {
        process.stdout.write(`\n${bg}\x1b[K${RESET}\n`);
        process.stdout.write(`${bg}\x1b[K ${WHITE}›${RESET}${bg}${WHITE} ${line}${RESET}\n`);
        process.stdout.write(`${bg}\x1b[K${RESET}\x1b[1A\r\x1b[4G`);
        first = false;
      } else {
        process.stdout.write(`\r\x1b[2K`);
        process.stdout.write(`${bg}\x1b[K ${WHITE}›${RESET}${bg}${WHITE} ${line}${RESET}`);
      }
    }

    draw();

    process.stdin.setRawMode(true);
    process.stdin.resume();

    const onData = (data: Buffer) => {
      const str = data.toString("utf-8");
      if (str.startsWith("\x1b")) return;
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code === 13 || code === 10) {
          process.stdin.off("data", onData);
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write(`${RESET}\n`);
          resolve(line);
          return;
        } else if (code === 127 || code === 8) {
          line = line.slice(0, -1);
          draw();
        } else if (code === 3) {
          process.stdout.write(`${RESET}\n`);
          process.exit(0);
        } else if (code >= 32) {
          line += str[i];
          draw();
        }
      }
    };

    process.stdin.on("data", onData);
  });
}

async function main() {
  const config = loadConfig();
  const BG_INPUT = config.display.inputStyle === "block" ? await detectBg() : "";

  if (config.showBanner) {
    printBanner(config.model);
  } else {
    const width = Math.min(process.stdout.columns || 60, 60);
    const line = GRAY + "─".repeat(width) + RESET;
    console.log(`\n${line}`);
    console.log(`  ${BOLD}MyAi Agent${RESET}  ${DIM}v0.1.0${RESET}`);
    console.log(`  ${DIM}model${RESET}  ${CYAN}${config.model}${RESET}`);
    if (config.slashCommands) console.log(`  ${DIM}/model to change, /help for commands${RESET}`);
    console.log(`${line}\n`);
  }

  initSessionDir(config.sessionDir);
  let sessionPath = newSessionPath(config.sessionDir);
  const messages: ChatMessage[] = loadSession(sessionPath) as ChatMessage[];

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${GREEN}>${RESET} `,
  });

  async function getInput(): Promise<string> {
    switch (config.display.inputStyle) {
      case "block":
        return styledReadLine(BG_INPUT);
      case "plain":
      default:
        return new Promise((r) => {
          rl.prompt();
          rl.once("line", r);
        });
    }
  }

  const cmdCtx: CommandContext = {
    config,
    rl,
    messages,
    sessionPath,
    resetSession: () => {
      sessionPath = newSessionPath(config.sessionDir);
      cmdCtx.sessionPath = sessionPath;
      return sessionPath;
    },
    totalTokens: { input: 0, output: 0 },
  };

  const renderer = new TuiRenderer({ display: config.display });

  while (true) {
    const input = await getInput();
    const trimmed = input.trim();
    if (!trimmed) continue;

    if (config.display.inputStyle !== "plain") {
      const cwd = process.cwd().replace(process.env.HOME ?? "", "~");
      process.stdout.write(`\x1b[K  ${DIM}${cwd}${RESET}\n`);
    }

    if (trimmed.toLowerCase() === "exit") process.exit(0);

    if (trimmed.startsWith("/")) {
      await dispatch(trimmed, cmdCtx);
      continue;
    }

    messages.push({ role: "user", content: trimmed });
    saveMessage(sessionPath, { role: "user", content: trimmed });

    console.log();
    const loader = new Loader(config.display.loader);
    loader.start();
    let started = false;

    try {
      const result = await runAgentWithRetry(config, messages, {
        onEvent: (event) => {
          if (!started) {
            started = true;
            loader.stop();
          }
          renderer.handle(event);
        },
      });
      loader.stop();
      renderer.endTurn();

      messages.push({ role: "assistant", content: result.text });
      saveMessage(sessionPath, { role: "assistant", content: result.text });

      cmdCtx.totalTokens.input += result.usage?.inputTokens ?? 0;
      cmdCtx.totalTokens.output += result.usage?.outputTokens ?? 0;

      const inT = result.usage?.inputTokens ?? 0;
      const outT = result.usage?.outputTokens ?? 0;
      console.log(`\n${GRAY}  ${formatTokens(inT)} in · ${formatTokens(outT)} out${RESET}\n`);
    } catch (err: unknown) {
      loader.stop();
      console.log(`\n${YELLOW}  Error: ${(err as Error).message}${RESET}\n`);
    }
  }
}

main();
