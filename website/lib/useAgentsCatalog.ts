'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { ExternalAgent } from '@/lib/external-agent';

export type AgentsCatalogStatus = 'loading' | 'ready' | 'error';

export function useAgentsCatalog(initialAgents: ExternalAgent[]) {
  const initialAgentsRef = useRef(initialAgents);
  initialAgentsRef.current = initialAgents;

  const [agents, setAgents] = useState(initialAgents);
  const [status, setStatus] = useState<AgentsCatalogStatus>('loading');
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setStatus('loading');
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/agents-index.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load catalog (${response.status})`);
        }
        return response.json() as Promise<ExternalAgent[]>;
      })
      .then((data) => {
        setAgents(data);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setAgents(initialAgentsRef.current);
        setStatus('error');
      });

    return () => controller.abort();
  }, [retryCount]);

  return { agents, status, retry };
}
