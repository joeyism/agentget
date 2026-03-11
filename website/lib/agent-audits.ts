import { BUILTIN_AGENTS } from "@/lib/builtin-agents";

export type AgentControl = "Contained" | "Guarded" | "Elevated";

interface AgentAuditDetails {
  scope: string;
  access: string;
  delegates: boolean;
  control: AgentControl;
  note: string;
}

const AUDIT_DETAILS: Record<string, AgentAuditDetails> = {
  "sisyphus-junior": {
    scope: "Execution",
    access: "Local writes",
    delegates: false,
    control: "Guarded",
    note: "Atomic task executor with explicit verification before handoff.",
  },
  atlas: {
    scope: "Orchestrator",
    access: "Local reads + delegation",
    delegates: true,
    control: "Elevated",
    note: "Highest coordination surface; intended for structured multi-wave work only.",
  },
  prometheus: {
    scope: "Planning",
    access: "Plan output",
    delegates: false,
    control: "Guarded",
    note: "Writes work plans, but does not implement code changes directly.",
  },
  oracle: {
    scope: "Advisory",
    access: "Read-only",
    delegates: false,
    control: "Contained",
    note: "Strategic reviewer with no write path and no task execution.",
  },
  metis: {
    scope: "Pre-planning",
    access: "Read-only",
    delegates: false,
    control: "Contained",
    note: "Clarifies intent and guardrails before implementation begins.",
  },
  momus: {
    scope: "Plan review",
    access: "Read-only",
    delegates: false,
    control: "Contained",
    note: "Reviews plan executability and blocks only on concrete issues.",
  },
  explore: {
    scope: "Repository search",
    access: "Read-only",
    delegates: false,
    control: "Contained",
    note: "Finds code paths and structure without making edits.",
  },
  librarian: {
    scope: "External research",
    access: "Read-only + docs",
    delegates: false,
    control: "Contained",
    note: "Pulls official references to reduce implementation guesswork.",
  },
  hephaestus: {
    scope: "Autonomous execution",
    access: "Local writes + external reads",
    delegates: false,
    control: "Elevated",
    note: "Broadest single-agent implementation surface; best for end-to-end work.",
  },
  "multimodal-looker": {
    scope: "Media analysis",
    access: "Read-only files",
    delegates: false,
    control: "Contained",
    note: "Extracts structured insight from images, PDFs, and diagrams only.",
  },
};

export const AGENT_AUDITS = BUILTIN_AGENTS.map((agent) => ({
  ...agent,
  ...AUDIT_DETAILS[agent.flag],
}));

export const AUDIT_SUMMARY = {
  total: AGENT_AUDITS.length,
  readOnly: AGENT_AUDITS.filter((agent) => agent.access.startsWith("Read-only")).length,
  writeCapable: AGENT_AUDITS.filter((agent) =>
    ["Local writes", "Plan output", "Local writes + external reads"].includes(agent.access)
  ).length,
  delegating: AGENT_AUDITS.filter((agent) => agent.delegates).length,
};
