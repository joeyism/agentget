# agentsmd

Install AI agents, instructions, and skills from GitHub repos into your project.

## Usage

```bash
npx agentsmd add owner/repo
npx agentsmd add github/awesome-copilot
npx agentsmd add owner/repo/subpath
```

## What it installs

Content is discovered from these patterns in the target repo:

| Type | Pattern |
|---|---|
| Agents | `agents/*.agent.md` |
| Instructions | `instructions/*.instructions.md` |
| Skills | `skills/*/SKILL.md` (whole folder) |
| Plugins | `plugins/*/` (expanded recursively) |

## Where files go

**Canonical (source of truth):**
```
.agents/agents/<name>.agent.md
.agents/instructions/<name>.instructions.md
.agents/skills/<name>/
```

**Symlinked into agent tools:**

| Tool | Path |
|---|---|
| Claude Code | `.claude/{agents,instructions,skills}/` |
| Cursor | `.cursor/{agents,instructions,skills}/` |
| OpenCode (project) | reads `.agents/` directly |
| OpenCode (global) | `~/.config/opencode/{agents,instructions,skills}/` |
