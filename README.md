# agentget

[![npm version](https://img.shields.io/npm/v/agentget)](https://www.npmjs.com/package/agentget)
![npm downloads](https://img.shields.io/npm/dt/agentget)

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

| Flag | Behavior |
|---|---|
| (none) | Installs agents only (default) |
| `--all` | Installs everything |
| `--agent <name>` | Installs specified agent + all skills/instructions/rules |
| `--agents-only` | Installs agents only (explicit) |
| `--skills-only` | Installs skills only |
| `--instructions-only` | Installs instructions only |
| `--rules-only` | Installs rules only |

## Alternative Directory Names

For repos with non-standard structure, specify custom directory names:

| Flag | Default | Usage |
|---|---|---|
| `--agents-dir <name>` | `agents` | `--agents-dir categories` |
| `--skills-dir <name>` | `skills` | `--skills-dir my-skills` |
| `--instructions-dir <name>` | `instructions` | `--instructions-dir docs` |
| `--rules-dir <name>` | `rules` | `--rules-dir policies` |

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

| Type | Pattern |
|---|---|
| Agents | `agents/*.agent.md` |
| Instructions | `instructions/*.instructions.md` |
| Skills | `skills/*/SKILL.md` (whole folder) |
| Rules | `rules/*.rules.md` |
| Plugins | `plugins/*/` (expanded recursively) |

## Where files go

**Canonical (source of truth):**
```
.agents/agents/<name>.agent.md
.agents/instructions/<name>.instructions.md
.agents/skills/<name>/
.agents/rules/<name>.rules.md
```

**Symlinked into agent tools:**

| Tool | Path |
|---|---|
| Claude Code | `.claude/{agents,instructions,skills,rules}/` |
| Cursor | `.cursor/{agents,instructions,skills,rules}/` |
| OpenCode (project) | reads `.agents/` directly |
| OpenCode (global) | `~/.config/opencode/{agents,instructions,skills,rules}/` |


## Builtin Agents

agentget ships a curated set of agents you can install directly from this repo:

```bash
npx agentget add joeyism/agentget --agent <name>
```

| Agent | Install command | Description |
|---|---|---|
| **Sisyphus-Junior** | `--agent sisyphus-junior` | Focused task executor that completes delegated atomic tasks without spawning other agents. It follows existing codebase patterns, verifies its own work with diagnostics and build checks, and never refactors while fixing. |
| **Atlas** | `--agent atlas` | Master orchestrator that drives a full todo list to completion by dispatching tasks to specialized agents in parallel waves. It verifies each task's evidence before proceeding and runs a four-agent Final Verification Wave at the end. |
| **Prometheus** | `--agent prometheus` | Strategic planning consultant that interviews you to clarify requirements, then generates a structured work plan in `.sisyphus/plans/`. It never writes code — it only plans, and hands off to executors via `/start-work`. |
| **Oracle** | `--agent oracle` | Read-only high-IQ reasoning specialist for architecture decisions, hard debugging, and post-implementation review. Consult it after 2+ failed fix attempts or before committing to a complex design. |
| **Metis** | `--agent metis` | Pre-planning consultant that classifies intent, surfaces hidden requirements, and produces guardrail directives for Prometheus before planning begins. Prevents AI over-engineering and scope creep. |
| **Momus** | `--agent momus` | Work plan reviewer that checks plans for executability and valid references. Approves by default — it only blocks on true blockers (missing files, zero-context tasks, contradictions), never on stylistic concerns. |
| **Explore** | `--agent explore` | Contextual grep specialist for your own codebase. Fire multiple instances in parallel to find where patterns are implemented, how modules are structured, and which files are relevant — returns absolute paths with structured results. |
| **Librarian** | `--agent librarian` | External reference specialist that finds official documentation, open-source implementations, and best practices for any library. Every claim is backed by a GitHub permalink to the exact source line. |
| **Hephaestus** | `--agent hephaestus` | Autonomous deep worker that explores the codebase and external docs thoroughly before writing a single line, then completes complex multi-file implementations end-to-end without check-ins. |
| **Multimodal Looker** | `--agent multimodal-looker` | Media file interpreter that extracts specific information from PDFs, images, and diagrams. Use it when you need analyzed data from a file rather than its raw contents — it saves context tokens for the main agent. |