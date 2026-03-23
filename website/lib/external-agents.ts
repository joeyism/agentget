import 'server-only';

import agentsData from '@/public/agents-index.json';

export interface ExternalAgent {
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
  sourcePath?: string;
  sourceRef?: string;
  hasValidSourceUrl: boolean;
}

const EXTERNAL_AGENTS = agentsData as ExternalAgent[];

export function getExternalAgents() {
  return EXTERNAL_AGENTS;
}

export function getExternalAgent(routeSegments: string[]) {
  const key = routeSegments.join('/');
  return EXTERNAL_AGENTS.find((agent) => agent.key === key);
}

export function getExternalAgentHref(key: string) {
  return `/agents/${key}`;
}
