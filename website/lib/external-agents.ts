import 'server-only';

import topAgentsData from '@/public/agents-top.json';

import type { ExternalAgent } from '@/lib/external-agent';

export type { ExternalAgent } from '@/lib/external-agent';
export { getExternalAgentHref } from '@/lib/external-agent';

const TOP_EXTERNAL_AGENTS = topAgentsData as ExternalAgent[];

export function getTopExternalAgents(limit = 50) {
  return TOP_EXTERNAL_AGENTS.slice(0, limit);
}
