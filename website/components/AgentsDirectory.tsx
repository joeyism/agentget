'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';

interface Agent {
  key: string;
  name: string;
  repo: string;
  owner: string;
  shortDescription: string;
  hasSkills: boolean;
  hasInstructions: boolean;
  installCommand: string;
  starCount: number;
  starCountLabel: string;
  repoUrl: string;
  sourceUrl?: string;
  sourceKind: string;
  hasValidSourceUrl: boolean;
}

const PAGE_SIZE = 50;

function getExternalAgentHref(key: string) {
  return `/agents/${key}`;
}

export function AgentsDirectory({ agents }: { agents: Agent[] }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(
    () => [...agents].sort((a, b) => b.starCount - a.starCount || a.name.localeCompare(b.name)),
    [agents]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.repo.toLowerCase().includes(q) ||
        a.shortDescription.toLowerCase().includes(q)
    );
  }, [search, sorted]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
    setExpandedKey(null);
  }, [search]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const copyInstall = async (cmd: string, key: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      void 0;
    }
  };

  const renderBadges = (agent: Agent) => (
    <>
      {agent.hasSkills && (
        <span className="text-[11px] text-emerald-400/70 font-mono whitespace-nowrap">
          ✓ skills
        </span>
      )}
      {agent.hasInstructions && (
        <span className="text-[11px] text-emerald-400/70 font-mono whitespace-nowrap">
          ✓ instructions
        </span>
      )}
    </>
  );

  return (
    <section
      data-testid="agents-directory"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
    >
      {/* ── Heading ── */}
      <div className="flex items-baseline gap-3 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Agents Directory</h2>
        <span className="inline-flex items-center bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium px-2.5 py-1 rounded-full ring-1 ring-emerald-500/20">
          {agents.length.toLocaleString()}
        </span>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-6">
        {/* Magnifying glass */}
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600"
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
          onChange={(e) => setSearch(e.target.value)}
          data-testid="agents-search"
          className="w-full bg-neutral-900/60 border border-white/[0.08] rounded-lg pl-10 pr-14 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400/30 transition-all"
        />

        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-600 bg-neutral-800/80 border border-neutral-700/60 px-1.5 py-0.5 rounded font-mono leading-none select-none">
          /
        </kbd>
      </div>

      {/* ── Table header ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 text-[11px] uppercase tracking-wider text-neutral-600 font-medium border-b border-white/[0.08] select-none">
        <span className="w-10 shrink-0 text-right">#</span>
        <span className="w-36 sm:w-48 shrink-0">Agent</span>
        <span className="w-40 shrink-0 hidden sm:block">Repo</span>
        <span className="w-24 shrink-0 hidden lg:block">Stars ☆</span>
        <span className="flex-1 min-w-0">Description</span>
        <span className="w-44 shrink-0 text-right hidden sm:block">Actions</span>
      </div>

      {/* ── Rows ── */}
      <div data-testid="agents-table-body" role="list">
        {rows.map((agent, i) => {
          const globalIdx = (page - 1) * PAGE_SIZE + i;
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
              <div className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start gap-3">
                  {/* Rank */}
                  <span className="w-10 shrink-0 text-right text-neutral-600 text-sm font-mono tabular-nums pt-0.5">
                    {globalIdx + 1}
                  </span>

                  {/* Name */}
                  <div className="w-36 sm:w-48 shrink-0 min-w-0">
                    <Link
                      href={getExternalAgentHref(agent.key)}
                      className="font-semibold text-sm text-neutral-200 hover:text-white transition-colors truncate block"
                    >
                      {agent.name}
                    </Link>
                    <span className="mt-1 block text-[11px] text-neutral-600 font-mono truncate sm:hidden">
                      {agent.repo}
                    </span>
                  </div>

                  {/* Repo */}
                  <span className="w-40 shrink-0 text-neutral-500 text-xs font-mono truncate hidden sm:block pt-0.5">
                    {agent.repo}
                  </span>

                  <a
                    href={`${agent.repoUrl}/stargazers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden lg:block w-24 shrink-0 pt-0.5 text-sm text-neutral-500 hover:text-neutral-300 transition-colors font-mono tabular-nums"
                    aria-label={`View stars for ${agent.repo}`}
                  >
                    {agent.starCountLabel}
                  </a>

                  {/* Description */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-neutral-500 text-sm truncate">{agent.shortDescription}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
                      {renderBadges(agent)}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2 sm:w-44">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        onClick={() => copyInstall(agent.installCommand, agent.key)}
                        className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono px-3 py-1.5 rounded-md ring-1 ring-white/[0.06] transition-colors cursor-pointer"
                        aria-label={`Copy install command for ${agent.name}`}
                      >
                        {isCopied ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5 text-emerald-400"
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
                              className="w-3.5 h-3.5"
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
                        className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono px-3 py-1.5 rounded-md ring-1 ring-white/[0.06] transition-colors cursor-pointer"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                      >
                        <svg
                          className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
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

                    <div className="hidden md:flex flex-wrap items-center justify-end gap-2.5">
                      {renderBadges(agent)}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    id={detailsId}
                    className="mt-3 ml-[3.25rem] rounded-lg border border-white/[0.06] bg-neutral-950/60 px-4 py-3 sm:ml-0 sm:pl-14"
                  >
                    <p className="text-[11px] uppercase tracking-wider text-neutral-600 font-medium mb-2">
                      Full description
                    </p>
                    <p className="text-sm leading-6 text-neutral-300 whitespace-pre-wrap break-words">
                      {agent.shortDescription}
                    </p>
                    <div className="mt-3 rounded-md border border-white/[0.05] bg-black/20 px-3 py-2">
                      <code className="text-xs text-neutral-400 font-mono break-all">
                        <span className="text-neutral-600">$ </span>
                        {agent.installCommand}
                      </code>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono">
                      <a
                        href={agent.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white transition-colors"
                      >
                        Open repo ↗
                      </a>
                      {agent.hasValidSourceUrl &&
                        agent.sourceUrl &&
                        agent.sourceKind !== 'repo' && (
                          <a
                            href={agent.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-white transition-colors"
                          >
                            View source ↗
                          </a>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-neutral-600 text-sm">
          No agents found for &ldquo;{search}&rdquo;
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-5" data-testid="pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            data-testid="prev-page"
            className="text-sm font-mono text-neutral-400 hover:text-white disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-md hover:bg-white/[0.04] disabled:hover:bg-transparent"
          >
            &larr; Previous
          </button>

          <span
            className="text-sm text-neutral-600 font-mono tabular-nums"
            data-testid="page-indicator"
          >
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            data-testid="next-page"
            className="text-sm font-mono text-neutral-400 hover:text-white disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-md hover:bg-white/[0.04] disabled:hover:bg-transparent"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* ── Search result count ── */}
      {search.trim() && filtered.length > 0 && (
        <p className="mt-3 text-xs text-neutral-600 font-mono text-center">
          {filtered.length.toLocaleString()} result
          {filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
        </p>
      )}
    </section>
  );
}
