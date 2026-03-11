import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocsNav } from "@/components/DocsNav";
import { SiteHeader } from "@/components/SiteHeader";
import { getBuiltinAgentDoc, getBuiltinAgentDocs } from "@/lib/builtin-agent-docs";
import { getBuiltinAgentInstallCommand } from "@/lib/builtin-agents";

type AgentDocPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getBuiltinAgentDocs().map((agent) => ({
    slug: agent.slug,
  }));
}

export async function generateMetadata({
  params,
}: AgentDocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = getBuiltinAgentDoc(slug);

  if (!agent) {
    return {
      title: "Agent Docs | agentget",
    };
  }

  return {
    title: `${agent.name} | agentget docs`,
    description: agent.summary,
  };
}

export default async function AgentDocPage({ params }: AgentDocPageProps) {
  const { slug } = await params;
  const agent = getBuiltinAgentDoc(slug);

  if (!agent) {
    notFound();
  }

  const otherAgents = getBuiltinAgentDocs().filter(
    (candidate) => candidate.slug !== agent.slug
  );

  return (
    <>
      <SiteHeader currentPath={`/docs/agents/${slug}`} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <DocsNav active="agents" />

        <div className="text-sm text-neutral-500">
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <span className="px-2">/</span>
          <Link href="/docs/agents" className="hover:text-white transition-colors">
            Agents
          </Link>
          <span className="px-2">/</span>
          <span className="text-neutral-300">{agent.name}</span>
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
              {agent.category}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {agent.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-neutral-300 sm:text-lg">
              {agent.intro || agent.summary}
            </p>

            <div className="mt-10 space-y-6">
              {agent.sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-2xl border border-white/[0.06] bg-neutral-950 p-6"
                >
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {section.title}
                  </h2>
                  <pre className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-300 font-sans overflow-x-auto">
                    {section.body}
                  </pre>
                </section>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-white/[0.06] bg-neutral-950 p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Install</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30 p-4 text-xs text-neutral-200">
              <code>{getBuiltinAgentInstallCommand(agent.flag)}</code>
            </pre>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href={agent.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-neutral-300 hover:text-white transition-colors"
              >
                View source on GitHub ↗
              </a>
              <Link
                href="/docs/agents"
                className="block text-neutral-300 hover:text-white transition-colors"
              >
                Back to all agents
              </Link>
            </div>

            <div className="mt-8 border-t border-white/[0.06] pt-6">
              <h3 className="text-sm font-semibold text-neutral-200">More agents</h3>
              <div className="mt-4 space-y-3">
                {otherAgents.slice(0, 4).map((candidate) => (
                  <Link
                    key={candidate.slug}
                    href={`/docs/agents/${candidate.slug}`}
                    className="block rounded-xl border border-white/[0.06] px-4 py-3 text-sm text-neutral-400 hover:border-white/[0.12] hover:text-white transition-colors"
                  >
                    {candidate.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
