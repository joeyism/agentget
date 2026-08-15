'use client';

import { useCallback, useEffect, useState } from 'react';

import type { AgentsCatalogStatus } from '@/lib/useAgentsCatalog';

const URL_SYNC_MS = 300;

function readDirectoryParams() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') ?? '';
  const page = Math.max(1, Number(params.get('page')) || 1);
  return { q, page };
}

function writeDirectoryParams(search: string, page: number) {
  const url = new URL(window.location.href);
  const q = search.trim();

  if (q) url.searchParams.set('q', q);
  else url.searchParams.delete('q');

  if (page > 1) url.searchParams.set('page', String(page));
  else url.searchParams.delete('page');

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.replaceState(null, '', next);
  }
}

export function useDirectoryQuery(catalogStatus: AgentsCatalogStatus) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [urlReady, setUrlReady] = useState(false);

  useEffect(() => {
    const { q, page: urlPage } = readDirectoryParams();
    setSearch(q);
    setPage(urlPage);
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    if (search.trim() !== '' && catalogStatus !== 'ready') return;

    const timeout = window.setTimeout(() => {
      writeDirectoryParams(search, page);
    }, URL_SYNC_MS);

    return () => window.clearTimeout(timeout);
  }, [search, page, urlReady, catalogStatus]);

  const updateSearch = useCallback((next: string) => {
    setSearch(next);
    setPage(1);
  }, []);

  const query = search.trim();

  return { search, query, page, setPage, updateSearch };
}
