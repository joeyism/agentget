export interface BuiltinAgent {
  slug: string;
  flag: string;
  name: string;
  category: string;
  summary: string;
  sourceFile: string;
}

export const BUILTIN_AGENTS: BuiltinAgent[] = [
  {
    slug: "sisyphus-junior",
    flag: "sisyphus-junior",
    name: "Sisyphus-Junior",
    category: "Executor",
    summary:
      "Focused task executor that completes delegated atomic tasks without spawning other agents.",
    sourceFile: "sisyphus-junior.md",
  },
  {
    slug: "atlas",
    flag: "atlas",
    name: "Atlas",
    category: "Orchestrator",
    summary:
      "Master orchestrator that drives a full todo list to completion by dispatching tasks to specialized agents in parallel waves.",
    sourceFile: "atlas.md",
  },
  {
    slug: "prometheus",
    flag: "prometheus",
    name: "Prometheus",
    category: "Planner",
    summary:
      "Strategic planning consultant that interviews you to clarify requirements, then generates a structured work plan.",
    sourceFile: "prometheus.md",
  },
  {
    slug: "oracle",
    flag: "oracle",
    name: "Oracle",
    category: "Advisor",
    summary:
      "Read-only high-IQ reasoning specialist for architecture decisions, hard debugging, and post-implementation review.",
    sourceFile: "oracle.md",
  },
  {
    slug: "metis",
    flag: "metis",
    name: "Metis",
    category: "Analyst",
    summary:
      "Pre-planning consultant that classifies intent, surfaces hidden requirements, and produces guardrail directives.",
    sourceFile: "metis.md",
  },
  {
    slug: "momus",
    flag: "momus",
    name: "Momus",
    category: "Reviewer",
    summary:
      "Work plan reviewer that checks plans for executability and valid references. Only blocks on true blockers.",
    sourceFile: "momus.md",
  },
  {
    slug: "explore",
    flag: "explore",
    name: "Explore",
    category: "Discovery",
    summary:
      "Contextual grep specialist for your own codebase. Fire multiple instances in parallel to find patterns and structure.",
    sourceFile: "explore.md",
  },
  {
    slug: "librarian",
    flag: "librarian",
    name: "Librarian",
    category: "Research",
    summary:
      "External reference specialist that finds official documentation, open-source implementations, and best practices.",
    sourceFile: "librarian.md",
  },
  {
    slug: "hephaestus",
    flag: "hephaestus",
    name: "Hephaestus",
    category: "Deep Worker",
    summary:
      "Autonomous deep worker that explores thoroughly before writing, then completes complex multi-file implementations end-to-end.",
    sourceFile: "hephaestus.md",
  },
  {
    slug: "multimodal-looker",
    flag: "multimodal-looker",
    name: "Multimodal Looker",
    category: "Multimodal",
    summary:
      "Media file interpreter that extracts specific information from PDFs, images, and diagrams.",
    sourceFile: "multimodal-looker.md",
  },
];

export function getBuiltinAgentBySlug(slug: string) {
  return BUILTIN_AGENTS.find((agent) => agent.slug === slug);
}

export function getBuiltinAgentInstallCommand(flag: string) {
  return `npx agentget add joeyism/agentget --agent ${flag}`;
}
