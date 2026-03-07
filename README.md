# agentsmd

Install AI agents, instructions, skills, and rules from GitHub repos into your project.

## Usage

```bash
# Install all agents (default)
npx agentsmd add owner/repo

# Install everything (agents, skills, instructions, rules)
npx agentsmd add owner/repo --all

# Install specific agent + all skills/instructions/rules
npx agentsmd add owner/repo --agent code-reviewer

# Install only skills
npx agentsmd add owner/repo --skills-only

# Install only instructions
npx agentsmd add owner/repo --instructions-only

# Install only rules
npx agentsmd add owner/repo --rules-only

# Install specific agent only (no skills/instructions/rules)
npx agentsmd add owner/repo --agent code-reviewer --agents-only

# Use alternative directory names (for repos with non-standard structure)
npx agentsmd add VoltAgent/awesome-claude-code-subagents --agents-dir categories
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
