'use client';

import { useRef, useState } from 'react';

import { AgentDirectoryRow } from '@/components/AgentDirectoryRow';
import type { ExternalAgent } from '@/lib/external-agent';
import { useAgentsCatalog } from '@/lib/useAgentsCatalog';
import { useDirectoryQuery } from '@/lib/useDirectoryQuery';
import { useDirectoryResults } from '@/lib/useDirectoryResults';
import { useFocusOnSlash } from '@/lib/useFocusOnSlash';

export function AgentsDirectory({ initialAgents }: { initialAgents: ExternalAgent[] }) {
  const { agents, status, retry } = useAgentsCatalog(initialAgents);
  const { search, query, page, setPage, updateSearch } = useDirectoryQuery(status);
  const { rows, filtered, totalPages, currentPage, isSearchPending, PAGE_SIZE } =
    useDirectoryResults({ agents, query, status, page });

  const searchRef = useRef<HTMLInputElement>(null);
  useFocusOnSlash(searchRef);

  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const handleSearchChange = (next: string) => {
    updateSearch(next);
    setExpandedKey(null);
  };

  const countLabel =
    status === 'ready'
      ? agents.length.toLocaleString()
      : `${initialAgents.length.toLocaleString()}+`;

  return (
    <section
      data-testid="agents-directory"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mb-8 flex items-baseline gap-3">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Agents Directory</h2>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
          {countLabel}
        </span>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {status === 'loading' && 'Loading full catalog'}
        {status === 'error' && 'Failed to load full catalog'}
        {status === 'ready' && `${agents.length.toLocaleString()} agents`}
      </span>

      <div className="relative mb-6">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>

        <label htmlFor="agents-search" className="sr-only">
          Search agents
        </label>
        <input
          ref={searchRef}
          id="agents-search"
          type="search"
          placeholder="Search agents..."
          autoComplete="off"
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          data-testid="agents-search"
          aria-controls="agents-table-body"
          className="w-full rounded-lg border border-white/[0.08] bg-neutral-900/60 py-3 pl-10 pr-14 text-sm text-neutral-200 placeholder:text-neutral-600 transition-all focus:border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-neutral-700/60 bg-neutral-800/80 px-1.5 py-0.5 font-mono text-[11px] leading-none text-neutral-600 select-none">
          /
        </kbd>
      </div>

      {status === 'error' && (
        <p className="mb-6 text-sm text-neutral-500">
          Couldn&apos;t load the full catalog.{' '}
          <button
            type="button"
            onClick={retry}
            className="font-mono text-neutral-300 underline-offset-2 hover:text-white hover:underline"
          >
            Retry
          </button>
        </p>
      )}

      <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-neutral-600 select-none">
        <span className="w-10 shrink-0 text-right">#</span>
        <span className="w-36 shrink-0 sm:w-48">Agent</span>
        <span className="hidden w-40 shrink-0 sm:block">Repo</span>
        <span className="flex-1 min-w-0">Description</span>
        <span className="hidden w-24 shrink-0 text-right sm:block">Stars ☆</span>
        <span className="hidden w-44 shrink-0 text-right sm:block">Actions</span>
      </div>

      <div
        id="agents-table-body"
        data-testid="agents-table-body"
        role="list"
        aria-busy={isSearchPending || undefined}
      >
        {isSearchPending ? (
          <div className="py-20 text-center text-sm text-neutral-600" role="status">
            Loading catalog…
          </div>
        ) : status === 'error' && query !== '' ? (
          <div className="py-20 text-center text-sm text-neutral-600">
            Search needs the full catalog.
          </div>
        ) : (
          rows.map((agent, index) => (
            <AgentDirectoryRow
              key={agent.key}
              agent={agent}
              index={(currentPage - 1) * PAGE_SIZE + index + 1}
              isExpanded={expandedKey === agent.key}
              onToggleExpand={() =>
                setExpandedKey((current) => (current === agent.key ? null : agent.key))
              }
            />
          ))
        )}
      </div>

      {status === 'ready' && query !== '' && filtered.length === 0 && (
        <div className="py-20 text-center text-sm text-neutral-600">
          No agents found for &ldquo;{search}&rdquo;
        </div>
      )}

      {!isSearchPending && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between pt-5" data-testid="pagination">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            data-testid="prev-page"
            className="rounded-md px-3 py-1.5 font-mono text-sm text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:text-neutral-700 disabled:hover:bg-transparent"
          >
            &larr; Previous
          </button>

          <span
            className="font-mono text-sm tabular-nums text-neutral-600"
            data-testid="page-indicator"
          >
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            data-testid="next-page"
            className="rounded-md px-3 py-1.5 font-mono text-sm text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:text-neutral-700 disabled:hover:bg-transparent"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {status === 'ready' && query !== '' && filtered.length > 0 && (
        <p className="mt-3 text-center font-mono text-xs text-neutral-600">
          {filtered.length.toLocaleString()} result
          {filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
        </p>
      )}
    </section>
  );
}
