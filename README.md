# agentget

[![npm version](https://img.shields.io/npm/v/agentget)](https://www.npmjs.com/package/agentget)
![npm downloads](https://img.shields.io/npm/dt/agentget)
[![CI](https://github.com/joeyism/agentget/actions/workflows/ci.yml/badge.svg)](https://github.com/joeyism/agentget/actions/workflows/ci.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Install AI agents, instructions, skills, and rules from GitHub repos into your project.

## Installation

```bash
# npm
npm install -g agentget

# bun
bun add -g agentget
```

Or use without installing via `npx` / `bunx`:

```bash
npx agentget add owner/repo
bunx agentget add owner/repo
```

## Usage

```bash
# Both of these work:
npx agentget add owner/repo
npx agent-get add owner/repo

# Install all agents (default)
npx agentget add owner/repo

# Install everything (agents, skills, instructions, rules)
npx agentget add owner/repo --all

# Install specific agent + all skills/instructions/rules
npx agentget add owner/repo --agent code-reviewer

# Install only skills
npx agentget add owner/repo --skills-only

# Install only instructions
npx agentget add owner/repo --instructions-only

# Install only rules
npx agentget add owner/repo --rules-only

# Install specific agent only (no skills/instructions/rules)
npx agentget add owner/repo --agent code-reviewer --agents-only

# Use alternative directory names (for repos with non-standard structure)
npx agentget add VoltAgent/awesome-claude-code-subagents --agents-dir categories
```

## Filtering

| Flag                  | Behavior                                                 |
| --------------------- | -------------------------------------------------------- |
| (none)                | Installs agents only (default)                           |
| `--all`               | Installs everything                                      |
| `--agent <name>`      | Installs specified agent + all skills/instructions/rules |
| `--agents-only`       | Installs agents only (explicit)                          |
| `--skills-only`       | Installs skills only                                     |
| `--instructions-only` | Installs instructions only                               |
| `--rules-only`        | Installs rules only                                      |

## Alternative Directory Names

For repos with non-standard structure, specify custom directory names:

| Flag                        | Default        | Usage                     |
| --------------------------- | -------------- | ------------------------- |
| `--agents-dir <name>`       | `agents`       | `--agents-dir categories` |
| `--skills-dir <name>`       | `skills`       | `--skills-dir my-skills`  |
| `--instructions-dir <name>` | `instructions` | `--instructions-dir docs` |
| `--rules-dir <name>`        | `rules`        | `--rules-dir policies`    |

**Note:** Agents directory scanning is **recursive** — finds `.md` and `.agent.md` files in all subdirectories.

## Frontmatter Handling

YAML frontmatter (content between `---` delimiters at the start of files) is **automatically stripped** during installation. This ensures compatibility with tools that don't support frontmatter or have different frontmatter requirements.

Example:

```markdown
---
name: ui-designer
tools: Read, Write, Edit
---

You are a UI designer...
```

Becomes:

```markdown
You are a UI designer...
```

## What it installs

Content is discovered from these patterns in the target repo:

| Type         | Pattern                             |
| ------------ | ----------------------------------- |
| Agents       | `agents/*.agent.md`                 |
| Instructions | `instructions/*.instructions.md`    |
| Skills       | `skills/*/SKILL.md` (whole folder)  |
| Rules        | `rules/*.rules.md`                  |
| Plugins      | `plugins/*/` (expanded recursively) |

## Where files go

agentget supports **41 AI coding tools**. Content is always written to a canonical location first, then symlinked to detected tool directories.

### Supported vs Detected

- **Supported** — all 41 tools agentget knows how to install into. Run `agentget targets` to list them.
- **Detected** — the subset whose config directories exist on your machine right now. Only detected targets receive symlinks, avoiding unused dot-directories.
- **Canonical** — 10 tools that read `.agents/` directly and are always active. No symlink needed.

### Canonical (source of truth)

```
.agents/agents/<name>.agent.md
.agents/instructions/<name>.instructions.md
.agents/skills/<name>/
.agents/rules/<name>.rules.md
```

### Canonical readers (always active)

These tools read `.agents/` directly — no symlinks needed:

AMP, Cline, Codex, Cursor, Gemini CLI, GitHub Copilot, Kimi Code CLI, OpenCode, Replit, Universal

### Project targets

Symlinks created when the tool's project directory is detected:

| Tool         | Path                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| AdaL         | `.adal/{agents,instructions,skills,rules}/`                                                |
| Antigravity  | `.agent/{agents,instructions,skills,rules}/`                                               |
| Augment      | `.augment/{agents,instructions,skills,rules}/`                                             |
| Claude Code  | `.claude/{agents,instructions,skills,rules}/`                                              |
| CodeBuddy    | `.codebuddy/{agents,instructions,skills,rules}/`                                           |
| Command Code | `.commandcode/{agents,instructions,skills,rules}/`                                         |
| Continue     | `.continue/{agents,instructions,skills,rules}/`                                            |
| Cortex Code  | `.cortex/{agents,instructions,skills,rules}/`                                              |
| Crush        | `.crush/{agents,instructions,skills,rules}/`                                               |
| Droid        | `.factory/{agents,instructions,skills,rules}/`                                             |
| Goose        | `.goose/{agents,instructions,skills,rules}/`                                               |
| iFlow CLI    | `.iflow/{agents,instructions,skills,rules}/`                                               |
| Junie        | `.junie/{agents,instructions,skills,rules}/`                                               |
| Kilo Code    | `.kilocode/{agents,instructions,skills,rules}/`                                            |
| Kiro CLI     | `.kiro/{agents,instructions,skills,rules}/`                                                |
| Kode         | `.kode/{agents,instructions,skills,rules}/`                                                |
| MCPJam       | `.mcpjam/{agents,instructions,skills,rules}/`                                              |
| Mistral Vibe | `.vibe/{agents,instructions,skills,rules}/`                                                |
| Mux          | `.mux/{agents,instructions,skills,rules}/`                                                 |
| Neovate      | `.neovate/{agents,instructions,skills,rules}/`                                             |
| OpenClaw     | `{agents,instructions,skills,rules}/` (requires `.openclaw`/`.clawdbot`/`.moltbot` marker) |
| OpenHands    | `.openhands/{agents,instructions,skills,rules}/`                                           |
| Pi           | `.pi/{agents,instructions,skills,rules}/`                                                  |
| Pochi        | `.pochi/{agents,instructions,skills,rules}/`                                               |
| Qoder        | `.qoder/{agents,instructions,skills,rules}/`                                               |
| Qwen Code    | `.qwen/{agents,instructions,skills,rules}/`                                                |
| Roo Code     | `.roo/{agents,instructions,skills,rules}/`                                                 |
| Trae         | `.trae/{agents,instructions,skills,rules}/`                                                |
| Trae CN      | `.trae/{agents,instructions,skills,rules}/`                                                |
| Windsurf     | `.windsurf/{agents,instructions,skills,rules}/`                                            |
| Zencoder     | `.zencoder/{agents,instructions,skills,rules}/`                                            |

### Global targets

Global symlinks are only created when the tool's config directory already exists (or an env var like `CLAUDE_CONFIG_DIR` / `CODEX_HOME` points to it). This avoids spraying unused dot-directories across your home directory.

| Tool                                     | Global path                                             |
| ---------------------------------------- | ------------------------------------------------------- |
| AdaL                                     | `~/.adal/`                                              |
| AMP / Kimi Code CLI / Replit / Universal | `~/.config/agents/`                                     |
| Antigravity                              | `~/.gemini/antigravity/`                                |
| Augment                                  | `~/.augment/`                                           |
| Claude Code                              | `${CLAUDE_CONFIG_DIR:-~/.claude}/`                      |
| Cline                                    | `~/.agents/`                                            |
| CodeBuddy                                | `~/.codebuddy/`                                         |
| Codex                                    | `${CODEX_HOME:-~/.codex}/`                              |
| Command Code                             | `~/.commandcode/`                                       |
| Continue                                 | `~/.continue/`                                          |
| Cortex Code                              | `~/.snowflake/cortex/`                                  |
| Crush                                    | `~/.config/crush/`                                      |
| Cursor                                   | `~/.cursor/`                                            |
| Droid                                    | `~/.factory/`                                           |
| Gemini CLI                               | `~/.gemini/`                                            |
| GitHub Copilot                           | `~/.copilot/`                                           |
| Goose                                    | `~/.config/goose/`                                      |
| iFlow CLI                                | `~/.iflow/`                                             |
| Junie                                    | `~/.junie/`                                             |
| Kilo Code                                | `~/.kilocode/`                                          |
| Kiro CLI                                 | `~/.kiro/`                                              |
| Kode                                     | `~/.kode/`                                              |
| MCPJam                                   | `~/.mcpjam/`                                            |
| Mistral Vibe                             | `~/.vibe/`                                              |
| Mux                                      | `~/.mux/`                                               |
| Neovate                                  | `~/.neovate/`                                           |
| OpenClaw / ClawdBot / MoltBot            | `~/.openclaw/` (auto-detects `.clawdbot` or `.moltbot`) |
| OpenCode                                 | `~/.config/opencode/`                                   |
| OpenHands                                | `~/.openhands/`                                         |
| Pi                                       | `~/.pi/agent/`                                          |
| Pochi                                    | `~/.pochi/`                                             |
| Qoder                                    | `~/.qoder/`                                             |
| Qwen Code                                | `~/.qwen/`                                              |
| Roo Code                                 | `~/.roo/`                                               |
| Trae                                     | `~/.trae/`                                              |
| Trae CN                                  | `~/.trae-cn/`                                           |
| Windsurf                                 | `~/.codeium/windsurf/`                                  |
| Zencoder                                 | `~/.zencoder/`                                          |

All global paths contain `{agents,instructions,skills,rules}/` subdirectories.

## Builtin Agents

agentget ships a curated set of agents you can install directly from this repo:

```bash
npx agentget add joeyism/agentget --agent <name>
```

| Agent                 | Install command             | Description                                                                                                                                                                                                                               |
| --------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sisyphus-Junior**   | `--agent sisyphus-junior`   | Focused task executor that completes delegated atomic tasks without spawning other agents. It follows existing codebase patterns, verifies its own work with diagnostics and build checks, and never refactors while fixing.              |
| **Atlas**             | `--agent atlas`             | Master orchestrator that drives a full todo list to completion by dispatching tasks to specialized agents in parallel waves. It verifies each task's evidence before proceeding and runs a four-agent Final Verification Wave at the end. |
| **Prometheus**        | `--agent prometheus`        | Strategic planning consultant that interviews you to clarify requirements, then generates a structured work plan in `.sisyphus/plans/`. It never writes code — it only plans, and hands off to executors via `/start-work`.               |
| **Oracle**            | `--agent oracle`            | Read-only high-IQ reasoning specialist for architecture decisions, hard debugging, and post-implementation review. Consult it after 2+ failed fix attempts or before committing to a complex design.                                      |
| **Metis**             | `--agent metis`             | Pre-planning consultant that classifies intent, surfaces hidden requirements, and produces guardrail directives for Prometheus before planning begins. Prevents AI over-engineering and scope creep.                                      |
| **Momus**             | `--agent momus`             | Work plan reviewer that checks plans for executability and valid references. Approves by default — it only blocks on true blockers (missing files, zero-context tasks, contradictions), never on stylistic concerns.                      |
| **Explore**           | `--agent explore`           | Contextual grep specialist for your own codebase. Fire multiple instances in parallel to find where patterns are implemented, how modules are structured, and which files are relevant — returns absolute paths with structured results.  |
| **Librarian**         | `--agent librarian`         | External reference specialist that finds official documentation, open-source implementations, and best practices for any library. Every claim is backed by a GitHub permalink to the exact source line.                                   |
| **Hephaestus**        | `--agent hephaestus`        | Autonomous deep worker that explores the codebase and external docs thoroughly before writing a single line, then completes complex multi-file implementations end-to-end without check-ins.                                              |
| **Multimodal Looker** | `--agent multimodal-looker` | Media file interpreter that extracts specific information from PDFs, images, and diagrams. Use it when you need analyzed data from a file rather than its raw contents — it saves context tokens for the main agent.                      |
