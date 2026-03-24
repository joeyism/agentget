'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface Agent {
  key: string;
  name: string;
  repo: string;
  owner: string;
  shortDescription: string;
  hasSkills: boolean;
  hasInstructions: boolean;
  installCommand: string;
  url: string;
  numGhStars: number;
}

const PAGE_SIZE = 50;

function formatStars(count: number): string {
  return count > 0 ? count.toLocaleString() : '—';
}

export function AgentsDirectory({ agents }: { agents: Agent[] }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(
    () => [...agents].sort((a, b) => b.numGhStars - a.numGhStars || a.name.localeCompare(b.name)),
    [agents]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();

    return sorted.filter(
      (agent) =>
        agent.name.toLowerCase().includes(q) ||
        agent.repo.toLowerCase().includes(q) ||
        agent.shortDescription.toLowerCase().includes(q)
    );
  }, [search, sorted]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
    setExpandedKey(null);
  }, [search]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        event.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName)
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const copyInstall = async (command: string, key: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      void 0;
    }
  };

  const renderBadges = (agent: Agent) => (
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

  return (
    <section
      data-testid="agents-directory"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mb-8 flex items-baseline gap-3">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Agents Directory</h2>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
          {agents.length.toLocaleString()}
        </span>
      </div>

      <div className="relative mb-6">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>

        <input
          ref={searchRef}
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          data-testid="agents-search"
          className="w-full rounded-lg border border-white/[0.08] bg-neutral-900/60 py-3 pl-10 pr-14 text-sm text-neutral-200 placeholder:text-neutral-600 transition-all focus:border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-neutral-700/60 bg-neutral-800/80 px-1.5 py-0.5 font-mono text-[11px] leading-none text-neutral-600 select-none">
          /
        </kbd>
      </div>

      <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-neutral-600 select-none">
        <span className="w-10 shrink-0 text-right">#</span>
        <span className="w-36 shrink-0 sm:w-48">Agent</span>
        <span className="hidden w-40 shrink-0 sm:block">Repo</span>
        <span className="flex-1 min-w-0">Description</span>
        <span className="hidden w-24 shrink-0 text-right sm:block">Stars ☆</span>
        <span className="hidden w-44 shrink-0 text-right sm:block">Actions</span>
      </div>

      <div data-testid="agents-table-body" role="list">
        {rows.map((agent, index) => {
          const globalIdx = (page - 1) * PAGE_SIZE + index;
          const isCopied = copiedKey === agent.key;
          const isExpanded = expandedKey === agent.key;
          const detailsId = `agent-description-${agent.key.replace(/[^a-zA-Z0-9-_]/g, '-')}`;

          return (
            <div
              key={agent.key}
              role="listitem"
              data-testid="agent-row"
              className="border-b border-white/[0.04]"
            >
              <div className="px-4 py-3 transition-colors hover:bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <span className="w-10 shrink-0 pt-0.5 text-right font-mono text-sm tabular-nums text-neutral-600">
                    {globalIdx + 1}
                  </span>

                  <div className="w-36 min-w-0 shrink-0 sm:w-48">
                    <a
                      href={agent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm font-semibold text-neutral-200 transition-colors hover:text-white"
                    >
                      {agent.name}
                    </a>
                    <span className="mt-1 block truncate font-mono text-[11px] text-neutral-600 sm:hidden">
                      {agent.repo}
                    </span>
                    <span className="mt-1 block font-mono text-[11px] text-neutral-500 sm:hidden">
                      ☆ {formatStars(agent.numGhStars)}
                    </span>
                  </div>

                  <span className="hidden w-40 shrink-0 truncate pt-0.5 font-mono text-xs text-neutral-500 sm:block">
                    {agent.repo}
                  </span>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="truncate text-sm text-neutral-500">{agent.shortDescription}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
                      {renderBadges(agent)}
                    </div>
                  </div>

                  <div className="hidden w-24 shrink-0 pt-0.5 text-right font-mono text-xs text-neutral-400 sm:block">
                    {formatStars(agent.numGhStars)}
                  </div>

                  <div className="shrink-0 sm:w-44">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        onClick={() => copyInstall(agent.installCommand, agent.key)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 font-mono text-xs text-neutral-300 ring-1 ring-white/[0.06] transition-colors hover:bg-neutral-800"
                        aria-label={`Copy install command for ${agent.name}`}
                      >
                        {isCopied ? (
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
                        onClick={() =>
                          setExpandedKey((current) => (current === agent.key ? null : agent.key))
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 font-mono text-xs text-neutral-300 ring-1 ring-white/[0.06] transition-colors hover:bg-neutral-800"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                      >
                        <svg
                          className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <polyline
                            points="9 18 15 12 9 6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {isExpanded ? 'Less' : 'More'}
                      </button>
                    </div>

                    <div className="mt-2 hidden flex-wrap items-center justify-end gap-2.5 md:flex">
                      {renderBadges(agent)}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    id={detailsId}
                    className="mt-3 ml-[3.25rem] rounded-lg border border-white/[0.06] bg-neutral-950/60 px-4 py-3 sm:ml-0 sm:pl-14"
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
                      <a
                        href={agent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 transition-colors hover:text-white"
                      >
                        Open repo ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-sm text-neutral-600">
          No agents found for &ldquo;{search}&rdquo;
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between pt-5" data-testid="pagination">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            data-testid="prev-page"
            className="rounded-md px-3 py-1.5 font-mono text-sm text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:text-neutral-700 disabled:hover:bg-transparent"
          >
            &larr; Previous
          </button>

          <span
            className="font-mono text-sm tabular-nums text-neutral-600"
            data-testid="page-indicator"
          >
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            data-testid="next-page"
            className="rounded-md px-3 py-1.5 font-mono text-sm text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:text-neutral-700 disabled:hover:bg-transparent"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {search.trim() && filtered.length > 0 && (
        <p className="mt-3 text-center font-mono text-xs text-neutral-600">
          {filtered.length.toLocaleString()} result
          {filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
        </p>
      )}
    </section>
  );
}
