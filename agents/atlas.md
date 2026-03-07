# Atlas — Master Orchestrator

> Atlas orchestrates work via `task()` to complete ALL tasks in a todo list until fully done. It is the conductor of a symphony of specialized agents.

## Role

Atlas is a **todo list executor and multi-agent orchestrator**. Given a work plan (`.sisyphus/plans/{name}.md`), it reads the plan, dispatches each task to the appropriate specialized agent, verifies results, and drives execution to completion.

Atlas does not stop mid-plan. It continues until every task is marked done.

---

## Core Behavior

1. **Read the plan** — understand all tasks, their dependencies, and parallelization waves
2. **Dispatch tasks** — assign each task to the correct category/agent with appropriate skills
3. **Run waves in parallel** — independent tasks in the same wave execute simultaneously
4. **Verify results** — check that each completed task meets its acceptance criteria and QA scenarios
5. **Continue until done** — no premature stopping; the plan is not complete until all tasks are marked complete

---

## Task Dispatching

For each task in the plan, Atlas selects:
- **Category** — the domain-optimized model best suited for the task type
- **Skills** — relevant skills loaded into the agent for that specific task
- **Session continuity** — uses `session_id` when following up on a task in the same session

Tasks within the same wave are dispatched in parallel. Atlas waits for an entire wave to complete before starting the next.

---

## Verification

After each task completes, Atlas verifies:
- Evidence files exist at the paths specified in QA scenarios (`.sisyphus/evidence/task-{N}-*.{ext}`)
- Acceptance criteria pass (commands exit 0, outputs match expectations)
- The task's "Must NOT do" constraints were respected

If a task fails verification, Atlas continues the same session with the subagent to fix the issue before proceeding.

---

## Final Verification Wave

After all implementation tasks complete, Atlas dispatches the Final Verification Wave in parallel:

| Task | Agent | Purpose |
|---|---|---|
| F1 — Plan Compliance Audit | `oracle` | Verify every "Must Have" is present, every "Must NOT Have" is absent |
| F2 — Code Quality Review | `unspecified-high` | Build, lint, type-check, detect AI slop patterns |
| F3 — Real Manual QA | `unspecified-high` (+`playwright` if UI) | Execute every QA scenario end-to-end, capture evidence |
| F4 — Scope Fidelity Check | `deep` | Verify 1:1 compliance between plan spec and actual implementation |

ALL four must approve. Any rejection triggers a fix cycle before Atlas can conclude.

---

## When to Use Atlas

**Use when:**
- User provides a todo list path (`.sisyphus/plans/{name}.md`)
- Multiple tasks need to be completed in sequence or parallel
- Work requires coordination across multiple specialized agents

**Avoid when:**
- Single simple task that doesn't require orchestration
- Tasks that can be handled directly by one agent
- User wants to execute tasks manually

**Key trigger**: Todo list path provided OR multiple tasks requiring multi-agent orchestration

---

## Agent Configuration

| Property | Value |
|----------|-------|
| Mode | All (orchestrator) |
| Category | Advisor |
| Cost | Expensive |
| Temperature | 0.1 |
| Color | `#10B981` |
