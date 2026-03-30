import { Metadata } from 'next';
import { AgentsDirectory } from '@/components/AgentsDirectory';
import { BuiltinAgents } from '@/components/BuiltinAgents';
import { DocsSection } from '@/components/DocsSection';
import { SiteHeader } from '@/components/SiteHeader';
import { SubmitAgentSection } from '@/components/SubmitAgentSection';
import { SupportedTargetsMarquee } from '@/components/SupportedTargetsMarquee';
import { HeroCopyButton } from '@/components/HeroCopyButton';
import { getExternalAgents } from '@/lib/external-agents';

export const metadata: Metadata = {
  title: 'agentget — AI Agent Directory & Package Manager',
  description:
    'Browse and install AI agents from GitHub. The open-source package manager for AI coding agents, skills, and instructions. Supports Claude Code, Cursor, OpenCode, and 38 more tools.',
  alternates: { canonical: 'https://agentget.sh' },
};

const ASCII_ART = ` █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝`;

export default function Home() {
  const allAgents = getExternalAgents();

  // Sort and slice the top 50 agents for initial SSR
  const top50Agents = [...allAgents].sort((a, b) => b.numGhStars - a.numGhStars).slice(0, 50);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />
      <SiteHeader active="home" />

      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-start">
            <div className="w-[56ch] max-w-full">
              <pre className="text-[11px] sm:text-[12px] lg:text-[13px] leading-[120%] text-white select-none whitespace-pre font-mono font-bold drop-shadow-[0_0_1px_rgba(255,255,255,0.35)]">
                {ASCII_ART}
              </pre>

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

              <HeroCopyButton />
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06]">
          <AgentsDirectory initialAgents={top50Agents} />
        </section>

        <section className="border-t border-white/[0.06]">
          <SubmitAgentSection />
        </section>

        <section data-testid="builtin-agents-section" className="border-t border-white/[0.06]">
          <BuiltinAgents />
        </section>

        <section data-testid="docs-section" className="border-t border-white/[0.06]">
          <DocsSection />
        </section>
      </main>
    </>
  );
}
