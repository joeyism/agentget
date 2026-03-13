import type { Metadata } from "next";
import Link from "next/link";

import { DocsNav } from "@/components/DocsNav";
import { SiteHeader } from "@/components/SiteHeader";
import { SubmitAgentSection } from "@/components/SubmitAgentSection";
import {
  BUILTIN_AGENTS,
  getBuiltinAgentInstallCommand,
} from "@/lib/builtin-agents";

export const metadata: Metadata = {
  title: "Docs | agentget",
  description: "Documentation for agentget and its builtin agents.",
};

const featuredAgents = BUILTIN_AGENTS.slice(0, 3);

export default function DocsPage() {
  return (
    <>
      <SiteHeader currentPath="/docs" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <DocsNav active="overview" />

        <section className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Documentation
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Install and understand the builtin agents.
          </h1>
          <p className="mt-5 text-base leading-7 text-neutral-400 sm:text-lg">
            agentget ships with curated agents for planning, execution,
            orchestration, research, and review. Use the docs to pick the right
            agent, copy the install command, and read the full source-backed
            behavior for each one.
          </p>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-neutral-950 p-6">
            <h2 className="text-lg font-semibold">What builtin agents are</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-400">
              Versioned agent definitions maintained in this repo. Each one has a
              clear role, operating constraints, and guidance for when to use it.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-neutral-950 p-6">
            <h2 className="text-lg font-semibold">Getting started</h2>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30 p-4 text-sm text-neutral-200">
              <code>{getBuiltinAgentInstallCommand("atlas")}</code>
            </pre>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-neutral-950 p-6">
            <h2 className="text-lg font-semibold">Docs coverage</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-400">
              Browse an agent index at <code>/docs/agents</code>, then open each
              agent page for the full markdown-backed role definition and usage
              guidance.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured agents</h2>
              <p className="mt-2 text-sm text-neutral-400">
                Start here if you want the core planning and execution loop.
              </p>
            </div>
            <Link
              href="/docs/agents"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              View all agents →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredAgents.map((agent) => (
              <Link
                key={agent.slug}
                href={`/docs/agents/${agent.slug}`}
                className="rounded-2xl border border-white/[0.06] bg-neutral-950 p-6 hover:border-white/[0.12] transition-colors"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                  {agent.category}
                </p>
                <h3 className="mt-3 text-lg font-semibold">{agent.name}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-400">
                  {agent.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-16 -mx-4 sm:-mx-6 lg:-mx-8 border-t border-white/[0.06]">
          <SubmitAgentSection />
        </div>
      </main>
    </>
  );
}
