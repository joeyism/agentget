import 'server-only';

import agentsData from '@/public/agents-index.json';

import type { ExternalAgent } from '@/lib/external-agents';

const EXTERNAL_AGENTS = agentsData as ExternalAgent[];

export function getExternalAgents() {
  return EXTERNAL_AGENTS;
}

export function getExternalAgent(routeSegments: string[]) {
  const key = routeSegments.join('/');
  return EXTERNAL_AGENTS.find((agent) => agent.key === key);
}
