"use client";

import { useState } from "react";

interface BuiltinAgent {
  name: string;
  flag: string;
  description: string;
}

const BUILTIN_AGENTS: BuiltinAgent[] = [
  {
    name: "Sisyphus-Junior",
    flag: "sisyphus-junior",
    description:
      "Focused task executor that completes delegated atomic tasks without spawning other agents.",
  },
  {
    name: "Atlas",
    flag: "atlas",
    description:
      "Master orchestrator that drives a full todo list to completion by dispatching tasks to specialized agents in parallel waves.",
  },
  {
    name: "Prometheus",
    flag: "prometheus",
    description:
      "Strategic planning consultant that interviews you to clarify requirements, then generates a structured work plan.",
  },
  {
    name: "Oracle",
    flag: "oracle",
    description:
      "Read-only high-IQ reasoning specialist for architecture decisions, hard debugging, and post-implementation review.",
  },
  {
    name: "Metis",
    flag: "metis",
    description:
      "Pre-planning consultant that classifies intent, surfaces hidden requirements, and produces guardrail directives.",
  },
  {
    name: "Momus",
    flag: "momus",
    description:
      "Work plan reviewer that checks plans for executability and valid references. Only blocks on true blockers.",
  },
  {
    name: "Explore",
    flag: "explore",
    description:
      "Contextual grep specialist for your own codebase. Fire multiple instances in parallel to find patterns and structure.",
  },
  {
    name: "Librarian",
    flag: "librarian",
    description:
      "External reference specialist that finds official documentation, open-source implementations, and best practices.",
  },
  {
    name: "Hephaestus",
    flag: "hephaestus",
    description:
      "Autonomous deep worker that explores thoroughly before writing, then completes complex multi-file implementations end-to-end.",
  },
  {
    name: "Multimodal Looker",
    flag: "multimodal-looker",
    description:
      "Media file interpreter that extracts specific information from PDFs, images, and diagrams.",
  },
];

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <polyline
        points="20 6 9 17 4 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BuiltinAgents() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyCommand = async (flag: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(
        `npx agentget add joeyism/agentget --agent ${flag}`
      );
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Builtin Agents
        </h2>
        <p className="mt-2 text-neutral-400 text-sm sm:text-base">
          Curated agents you can install directly from this repo
        </p>
      </div>

      <div
        data-testid="builtin-agents-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {BUILTIN_AGENTS.map((agent, idx) => (
          <div
            key={agent.flag}
            data-testid={`builtin-agent-card-${agent.flag}`}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:shadow-lg hover:shadow-neutral-950/50 hover:-translate-y-1 transition-all duration-200 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <p className="mt-2 text-neutral-400 text-sm leading-relaxed flex-1">
              {agent.description}
            </p>

            <div
              className="mt-4 group/cmd flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 cursor-pointer hover:border-neutral-700 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none transition-colors"
              onClick={() => copyCommand(agent.flag, idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && copyCommand(agent.flag, idx)
              }
              title="Click to copy install command"
            >
              <code className="font-mono text-xs text-neutral-500 truncate flex-1">
                <span className="text-neutral-600">$ </span>
                npx agentget add joeyism/agentget --agent {agent.flag}
              </code>
              <span className="text-neutral-600 group-hover/cmd:text-neutral-400 transition-colors shrink-0">
                {copiedIdx === idx ? (
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <CopyIcon className="w-3.5 h-3.5" />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
