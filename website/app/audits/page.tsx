import type { Metadata } from 'next';
import { AgentAudits } from '@/components/AgentAudits';

export const metadata: Metadata = {
  title: 'AI Agent Capability Audits',
  description:
    "Capability audit results for agentget's builtin AI agents. See how each agent performs across planning, execution, and code review tasks.",
  alternates: { canonical: 'https://agentget.sh/audits' },
};

export default function AuditsPage() {
  return (
    <>
      <AgentAudits />
    </>
  );
}
