import Link from 'next/link';
import { BUILTIN_AGENTS, getBuiltinAgentInstallCommand } from '@/lib/builtin-agents';
import { CopyableCommand } from './CopyableCommand';

export function BuiltinAgents() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Builtin Agents</h2>
        <p className="mt-2 text-neutral-400 text-sm sm:text-base">
          Curated agents you can install directly from this repo
        </p>
      </div>

      <div
        data-testid="builtin-agents-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {BUILTIN_AGENTS.map((agent) => (
          <div
            key={agent.flag}
            data-testid={`builtin-agent-card-${agent.flag}`}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:shadow-lg hover:shadow-neutral-950/50 hover:-translate-y-1 transition-all duration-200 flex flex-col"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
                  {agent.category}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">{agent.name}</h3>
              </div>

              <Link
                href={`/docs/agents/${agent.slug}`}
                className="text-xs text-neutral-500 hover:text-white transition-colors"
              >
                Docs
              </Link>
            </div>

            <p className="mt-2 text-neutral-400 text-sm leading-relaxed flex-1">{agent.summary}</p>

            <CopyableCommand command={getBuiltinAgentInstallCommand(agent.flag)} />
          </div>
        ))}
      </div>
    </div>
  );
}
