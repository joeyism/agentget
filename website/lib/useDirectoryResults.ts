'use client';

import { useMemo } from 'react';

import type { ExternalAgent } from '@/lib/external-agent';
import type { AgentsCatalogStatus } from '@/lib/useAgentsCatalog';

const PAGE_SIZE = 50;

interface UseDirectoryResultsInput {
  agents: ExternalAgent[];
  query: string;
  status: AgentsCatalogStatus;
  page: number;
}

export function useDirectoryResults({ agents, query, status, page }: UseDirectoryResultsInput) {
  const isSearchPending = query !== '' && status === 'loading';
  const isSearchBlocked = query !== '' && status !== 'ready';

  const sorted = useMemo(
    () => [...agents].sort((a, b) => b.numGhStars - a.numGhStars || a.name.localeCompare(b.name)),
    [agents]
  );

  const filtered = useMemo(() => {
    if (isSearchBlocked) return [];
    if (!query) return sorted;
    const q = query.toLowerCase();

    return sorted.filter(
      (agent) =>
        agent.name.toLowerCase().includes(q) ||
        agent.repo.toLowerCase().includes(q) ||
        agent.shortDescription.toLowerCase().includes(q)
    );
  }, [isSearchBlocked, query, sorted]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return {
    rows,
    filtered,
    totalPages,
    currentPage,
    isSearchPending,
    isSearchBlocked,
    PAGE_SIZE,
  };
}
