# MyAi Agent

A terminal coding agent built on OpenRouter, generated with the
[`create-agent-tui`](https://github.com/OpenRouterTeam/skills/tree/main/skills/create-agent-tui)
skill.

## Setup

```bash
cd myai-agent
npm install
cp .env.example .env
# edit .env and set OPENROUTER_API_KEY (get one at https://openrouter.ai/settings/keys)
npm start
```

## What's included

- **Tools**: file_read, file_write, file_edit, glob, grep, list_dir, shell (approval-gated), plus a custom tool template
- **Server tools**: web search, datetime — executed by OpenRouter, no local code
- **Session persistence**: conversations are logged to `.sessions/*.jsonl`
- **Slash commands**: `/model` (switch models live from the OpenRouter catalog), `/new` (fresh session), `/help`
- **TUI**: adaptive background-aware input box, grouped tool-call display, spinner loader, ASCII banner

## Commands

| Command | What it does |
|---|---|
| `/model` | Search and switch to any OpenRouter model |
| `/new` | Start a fresh conversation |
| `/help` | List available commands |
| `exit` | Quit |

## Config

Override defaults via `agent.config.json` in this directory, or env vars:

- `OPENROUTER_API_KEY` — required
- `AGENT_MODEL` — override the default model (`anthropic/claude-opus-4.7`)
- `AGENT_MAX_STEPS` — max tool-call steps per turn (default 20)
- `AGENT_MAX_COST` — max USD cost per turn (default 1.0)
