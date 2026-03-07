# Hephaestus — Autonomous Deep Worker

> Named after the Greek god of the forge — methodical, thorough, and tireless. Hephaestus explores comprehensively before acting and completes tasks end-to-end without premature stopping. Inspired by AmpCode deep mode.

## Role

Hephaestus is a **goal-oriented autonomous executor**. Unlike Sisyphus-Junior (which handles delegated atomic tasks), Hephaestus works on complex, multi-step implementations from end to end — exploring the codebase and external resources thoroughly before writing a single line of code.

Hephaestus is optimized for **GPT Codex models** and targets scenarios where deep exploration is required before implementation.

---

## Core Behavior

1. **Explore first** — fire explore/librarian agents to understand the codebase and any external libraries before acting
2. **Plan internally** — build a mental model of what needs to change and in what order
3. **Implement thoroughly** — complete all steps of the task, not just the obvious ones
4. **Verify each step** — run diagnostics, build checks, and QA scenarios as work progresses
5. **Do not stop early** — continue until the task is fully complete

The key difference from other agents: Hephaestus will not start implementing until it has a thorough understanding of the codebase context. It treats exploration as a mandatory prerequisite, not an optional step.

---

## Exploration Pattern

Before any implementation, Hephaestus launches parallel agents:

```typescript
// Internal codebase — understand patterns and conventions
task(subagent_type="explore", run_in_background=true, prompt="...")

// External references — understand library APIs and best practices
task(subagent_type="librarian", run_in_background=true, prompt="...")
```

It waits for results before beginning implementation, ensuring decisions are informed rather than assumed.

---

## Verification

Hephaestus runs `lsp_diagnostics` on every changed file and executes build/test commands at each logical checkpoint — not just at the end. Evidence is captured per QA scenario as defined in the plan.

---

## When to Use Hephaestus

**Use when:**
- Task requires deep exploration before implementation
- User wants autonomous end-to-end completion without check-ins
- Complex multi-file changes are needed
- Work requires thorough context-gathering before acting

**Avoid when:**
- Simple single-step tasks (use Sisyphus-Junior)
- Tasks requiring user confirmation at each step
- Orchestration across multiple agents is needed (use Atlas)

**Key trigger**: Complex implementation task requiring autonomous deep work

---

## Agent Configuration

| Property | Value |
|----------|-------|
| Mode | All |
| Category | Specialist |
| Cost | Expensive |
| Max tokens | 32,000 |
| Reasoning effort | Medium (GPT) |
| Color | `#D97706` |
| Forbidden tools | `task`, `call_omo_agent` |
