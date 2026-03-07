# Sisyphus-Junior — Focused Task Executor

> Sisyphus-Junior executes delegated tasks directly without spawning other agents. Same discipline as Sisyphus, but scoped to a single atomic task at a time.

## Role

Sisyphus-Junior is a **focused task executor**. It is the category-spawned worker that Sisyphus (or Atlas) delegates atomic tasks to. It does not orchestrate or plan — it receives a task and completes it.

The key constraint: Sisyphus-Junior **cannot spawn other agents** via `task()`. It can use `call_omo_agent` to invoke explore/librarian for context, but it cannot delegate work upward.

---

## Core Behavior

1. **Receive an atomic task** from Sisyphus or Atlas
2. **Gather context** using explore/librarian via `call_omo_agent` if needed
3. **Implement the task** following existing codebase patterns
4. **Verify** — run `lsp_diagnostics` on changed files, run build/test commands if applicable
5. **Report completion** with evidence

---

## What Makes It Different from Sisyphus

| | Sisyphus | Sisyphus-Junior |
|---|---|---|
| Spawns subagents via `task()` | ✅ Yes | ❌ No |
| Uses `call_omo_agent` for explore/librarian | ✅ Yes | ✅ Yes |
| Orchestrates multi-task work | ✅ Yes | ❌ No |
| Handles todo list management | ✅ Yes | ❌ No |
| Works on a single delegated task | ✅ Can | ✅ Always |

---

## Code Conventions

- Match existing patterns when codebase is disciplined
- Never suppress type errors with `as any`, `@ts-ignore`, or `@ts-expect-error`
- Never commit unless explicitly instructed
- **Bugfix rule**: Fix minimally. Never refactor while fixing.
- Empty catch blocks (`catch(e) {}`) are forbidden

---

## Verification

After completing work, Sisyphus-Junior verifies:
- `lsp_diagnostics` clean on all changed files
- Build exits with code 0 (if applicable)
- Tests pass (or documents pre-existing failures that are unrelated to changes)
- QA scenarios from the plan are executed and evidence is captured

**No evidence = task not complete.**

---

## Default Model

When spawned by a category, Sisyphus-Junior defaults to `anthropic/claude-sonnet-4-6` unless overridden. The model selection also determines the prompt variant:

| Model Family | Prompt Variant |
|---|---|
| GPT-5.4 | GPT-5.4 optimized (XML-tagged, principle-driven) |
| GPT-5.3 Codex | Codex-specific prompt |
| Other GPT | Standard GPT prompt |
| Gemini | Gemini-optimized (aggressive tool-call enforcement) |
| Claude / Default | Default (Claude-optimized) |

---

## When to Use Sisyphus-Junior

Sisyphus-Junior is not invoked directly by users. It is **spawned by the category system** when Sisyphus or Atlas delegates a task with a specific category (e.g., `quick`, `unspecified-high`, `visual-engineering`).

---

## Agent Configuration

| Property | Value |
|----------|-------|
| Mode | Subagent |
| Default model | `anthropic/claude-sonnet-4-6` |
| Default temperature | 0.1 |
| Max tokens | 64,000 |
| Thinking budget | 32,000 tokens (Claude) / medium reasoning effort (GPT) |
| Color | `#20B2AA` |
| Forbidden tools | `task` |
| Allowed delegation | `call_omo_agent` (explore/librarian only) |
