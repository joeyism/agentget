'use client';

import Link from 'next/link';

import { getExternalAgentHref, type ExternalAgent } from '@/lib/external-agent';
import { useCopyToClipboard } from '@/lib/useCopyToClipboard';

function formatStars(count: number): string {
  return count > 0 ? count.toLocaleString() : '—';
}

function AgentBadges({ agent }: { agent: ExternalAgent }) {
  return (
    <>
      {agent.hasSkills && (
        <span className="whitespace-nowrap font-mono text-[11px] text-emerald-400/70">
          ✓ skills
        </span>
      )}
      {agent.hasInstructions && (
        <span className="whitespace-nowrap font-mono text-[11px] text-emerald-400/70">
          ✓ instructions
        </span>
      )}
    </>
  );
}

interface AgentDirectoryRowProps {
  agent: ExternalAgent;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function AgentDirectoryRow({
  agent,
  index,
  isExpanded,
  onToggleExpand,
}: AgentDirectoryRowProps) {
  const { copied, copy } = useCopyToClipboard();
  const detailsId = `agent-description-${agent.key.replace(/[^a-zA-Z0-9-_]/g, '-')}`;

  return (
    <>
      <tr
        data-testid="agent-row"
        className={`hover:bg-white/[0.02] ${isExpanded ? '' : 'border-b border-white/[0.04]'}`}
      >
        <td className="w-10 shrink-0 py-3 pl-4 pr-1.5 text-right align-top font-mono text-sm tabular-nums text-neutral-600">
          {index}
        </td>

        <th
          scope="row"
          className="w-36 min-w-0 shrink-0 py-3 pl-1.5 pr-1.5 text-left align-top font-semibold sm:w-48"
        >
          <Link
            href={getExternalAgentHref(agent.key)}
            className="block truncate text-sm font-semibold text-neutral-200 transition-colors hover:text-white"
          >
            {agent.name}
          </Link>
          <span className="mt-1 block truncate font-mono text-[11px] text-neutral-600 sm:hidden">
            {agent.repo}
          </span>
          <span className="mt-1 block font-mono text-[11px] text-neutral-500 sm:hidden">
            ☆ {formatStars(agent.numGhStars)}
          </span>
        </th>

        <td className="hidden w-40 shrink-0 truncate py-3 pl-1.5 pr-1.5 align-top font-mono text-xs text-neutral-500 sm:table-cell">
          {agent.repo}
        </td>

        <td className="py-3 pl-1.5 pr-4 align-top sm:pr-1.5">
          <p className="truncate text-sm text-neutral-500">{agent.shortDescription}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
            <AgentBadges agent={agent} />
          </div>
        </td>

        <td className="hidden w-24 shrink-0 py-3 pl-1.5 pr-1.5 text-right align-top sm:table-cell">
          <a
            href={`${agent.repoUrl}/stargazers`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-neutral-400 transition-colors hover:text-neutral-300"
            aria-label={`View stars for ${agent.repo}`}
          >
            {formatStars(agent.numGhStars)}
          </a>
        </td>

        <td className="hidden w-44 shrink-0 py-3 pl-1.5 pr-4 align-top sm:table-cell">
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => copy(agent.installCommand)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 font-mono text-xs text-neutral-300 ring-1 ring-white/[0.06] transition-colors hover:bg-neutral-800"
              aria-label={
                copied
                  ? `Copied: ${agent.installCommand}`
                  : `Copy install command for ${agent.name}`
              }
            >
              {copied ? (
                <>
                  <svg
                    className="h-3.5 w-3.5 text-emerald-400"
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
                  Copied
                </>
              ) : (
                <>
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 font-mono text-xs text-neutral-300 ring-1 ring-white/[0.06] transition-colors hover:bg-neutral-800"
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              aria-label={
                isExpanded ? `Show less about ${agent.name}` : `Show more about ${agent.name}`
              }
            >
              <svg
                className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {isExpanded ? 'Less' : 'More'}
            </button>
          </div>

          <div className="mt-2 hidden flex-wrap items-center justify-end gap-2.5 md:flex">
            <AgentBadges agent={agent} />
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-b border-white/[0.04]">
          <td colSpan={6} className="pt-3 px-4 pb-4">
            <div
              id={detailsId}
              className="rounded-lg border border-white/[0.06] bg-neutral-950/60 px-4 py-3"
            >
              <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-neutral-600">
                <span>Full description</span>
                <span className="font-mono normal-case text-neutral-500">
                  ☆ {formatStars(agent.numGhStars)} stars
                </span>
              </div>

              <p className="break-words whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                {agent.shortDescription}
              </p>

              <div className="mt-3 rounded-md border border-white/[0.05] bg-black/20 px-3 py-2">
                <code className="block break-all font-mono text-xs text-neutral-400">
                  <span className="text-neutral-600">$ </span>
                  {agent.installCommand}
                </code>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs">
                <Link
                  href={getExternalAgentHref(agent.key)}
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Open details →
                </Link>
                <a
                  href={agent.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Open repository ↗
                </a>
                {agent.hasValidSourceUrl && agent.sourceUrl && agent.sourceKind !== 'repo' && (
                  <a
                    href={agent.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    View source ↗
                  </a>
                )}
              </div>

              <span className="sr-only" role="status" aria-live="polite">
                {copied ? 'Copied' : ''}
              </span>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
