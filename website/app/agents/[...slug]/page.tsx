import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/JsonLd';
import { getExternalAgent, getExternalAgents } from '@/lib/external-agents-catalog';
import { getExternalAgentHref } from '@/lib/external-agents';

type ExternalAgentPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateStaticParams() {
  return getExternalAgents().map((agent) => ({
    slug: agent.key.split('/'),
  }));
}

export async function generateMetadata({ params }: ExternalAgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = getExternalAgent(slug);

  if (!agent) {
    return {
      title: 'Agent | agentget',
    };
  }

  return {
    title: `${agent.name} — AI Agent`,
    description: `Install the ${agent.name} AI agent. ${agent.shortDescription}`,
    alternates: { canonical: `https://agentget.sh/agents/${slug.join('/')}` },
    openGraph: {
      title: `${agent.name} — AI Agent | agentget`,
      description: agent.shortDescription,
      url: `https://agentget.sh/agents/${slug.join('/')}`,
      siteName: 'agentget',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${agent.name} — AI Agent | agentget`,
      description: agent.shortDescription,
    },
  };
}

export default async function ExternalAgentPage({ params }: ExternalAgentPageProps) {
  const { slug } = await params;
  const agent = getExternalAgent(slug);

  if (!agent) {
    notFound();
  }

  const relatedAgents = getExternalAgents()
    .filter((candidate) => candidate.key !== agent.key)
    .filter((candidate) => candidate.owner === agent.owner || candidate.repo === agent.repo)
    .slice(0, 4);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: agent.name,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          description: agent.shortDescription,
          url: `https://agentget.sh/agents/${agent.key}`,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-sm text-neutral-500">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="px-2">/</span>
          <span className="text-neutral-300">{agent.name}</span>
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">External Agent</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{agent.name}</h1>
            <p className="mt-5 text-base leading-8 text-neutral-300 sm:text-lg">
              {agent.shortDescription}
            </p>

            <div className="mt-10 space-y-6">
              <section className="rounded-2xl border border-white/[0.06] bg-neutral-950 p-6">
                <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">Repository</p>
                    <p className="mt-2 text-sm text-neutral-200 font-mono break-all">
                      {agent.repo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                      Source status
                    </p>
                    <p className="mt-2 text-sm text-neutral-200">
                      {agent.hasValidSourceUrl
                        ? agent.sourceKind === 'repo'
                          ? 'Repository link available'
                          : `Validated ${agent.sourceKind} link available`
                        : 'Repository link available; exact source path not yet validated'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {agent.hasSkills && (
                    <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-mono text-emerald-300">
                      skills
                    </span>
                  )}
                  {agent.hasInstructions && (
                    <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-mono text-emerald-300">
                      instructions
                    </span>
                  )}
                </div>

                {agent.sourcePath && (
                  <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                      Original source path
                    </p>
                    <p className="mt-2 break-all font-mono text-xs text-neutral-300">
                      {agent.sourcePath}
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-white/[0.06] bg-neutral-950 p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Install</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30 p-4 text-xs text-neutral-200">
              <code>{agent.installCommand}</code>
            </pre>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href={agent.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-neutral-300 hover:text-white transition-colors"
              >
                Open repository ↗
              </a>
              {agent.hasValidSourceUrl && agent.sourceUrl && agent.sourceKind !== 'repo' && (
                <a
                  href={agent.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-neutral-300 hover:text-white transition-colors"
                >
                  View source on GitHub ↗
                </a>
              )}
              <Link href="/" className="block text-neutral-300 hover:text-white transition-colors">
                Back to directory
              </Link>
            </div>

            {relatedAgents.length > 0 && (
              <div className="mt-8 border-t border-white/[0.06] pt-6">
                <h3 className="text-sm font-semibold text-neutral-200">Related agents</h3>
                <div className="mt-4 space-y-3">
                  {relatedAgents.map((candidate) => (
                    <Link
                      key={candidate.key}
                      href={getExternalAgentHref(candidate.key)}
                      className="block rounded-xl border border-white/[0.06] px-4 py-3 text-sm text-neutral-400 hover:border-white/[0.12] hover:text-white transition-colors"
                    >
                      {candidate.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>
      </div>
    </>
  );
}
