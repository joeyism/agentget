import { Metadata } from 'next';
import { AgentsDirectory } from '@/components/AgentsDirectory';
import { BrandMark } from '@/components/BrandMark';
import { BuiltinAgents } from '@/components/BuiltinAgents';
import { CopyableCommand } from '@/components/CopyableCommand';
import { DocsSection } from '@/components/DocsSection';
import { JsonLd } from '@/components/JsonLd';
import { SubmitAgentSection } from '@/components/SubmitAgentSection';
import { SupportedTargetsMarquee } from '@/components/SupportedTargetsMarquee';
import { getTopExternalAgents } from '@/lib/external-agents';

export const metadata: Metadata = {
  description:
    'Discover, install, and manage AI agents, skills, and instructions from GitHub. The open-source package manager for AI coding agents — supports 41+ tools.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const topAgents = getTopExternalAgents(50);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'agentget',
          url: 'https://agentget.sh',
          description: 'The AI Agents Package Manager',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://agentget.sh/?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-start">
          <div className="w-[56ch] max-w-full">
            <BrandMark />
            <SupportedTargetsMarquee />
          </div>

          <div className="flex flex-col gap-6 min-w-0">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                The AI Agents Package Manager
              </h1>
              <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed max-w-lg">
                Install AI agents, instructions, skills, and rules from GitHub repos into your
                project with a single command.
              </p>
            </div>

            <CopyableCommand command="npx agentget add <owner/repo>" variant="hero" />
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]">
        <AgentsDirectory initialAgents={topAgents} />
      </div>

      <div className="border-t border-white/[0.06]">
        <SubmitAgentSection />
      </div>

      <div className="border-t border-white/[0.06]">
        <BuiltinAgents />
      </div>

      <div className="border-t border-white/[0.06]">
        <DocsSection />
      </div>
    </>
  );
}
