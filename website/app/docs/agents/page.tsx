import type { Metadata } from "next";
import Link from "next/link";

import { DocsNav } from "@/components/DocsNav";
import { SiteHeader } from "@/components/SiteHeader";
import {
  BUILTIN_AGENTS,
  getBuiltinAgentInstallCommand,
} from "@/lib/builtin-agents";

export const metadata: Metadata = {
  title: "Builtin Agents | agentget",
  description: "Browse the builtin agent documentation included with agentget.",
};

export default function AgentsDocsPage() {
  return (
    <>
      <SiteHeader currentPath="/docs/agents" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <DocsNav active="agents" />

        <section className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Builtin Agents
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Browse the agents that ship with agentget.
          </h1>
          <p className="mt-5 text-base leading-7 text-neutral-400 sm:text-lg">
            Each agent page is generated from the markdown source in this repo,
            so the docs route stays aligned with the actual builtins you install.
          </p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {BUILTIN_AGENTS.map((agent) => (
            <article
              key={agent.slug}
              className="flex flex-col rounded-2xl border border-white/[0.06] bg-neutral-950 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                  {agent.category}
                </p>
                <span className="text-xs text-neutral-500">--agent {agent.flag}</span>
              </div>

              <h2 className="mt-4 text-xl font-semibold">{agent.name}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-neutral-400">
                {agent.summary}
              </p>

              <pre className="mt-5 overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30 p-4 text-xs text-neutral-200">
                <code>{getBuiltinAgentInstallCommand(agent.flag)}</code>
              </pre>

              <Link
                href={`/docs/agents/${agent.slug}`}
                className="mt-5 inline-flex items-center text-sm text-neutral-300 hover:text-white transition-colors"
              >
                Read agent docs →
              </Link>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
