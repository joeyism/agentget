import 'server-only';

import topAgentsData from '@/public/agents-top.json';

export interface ExternalAgent {
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
  repoUrl: string;
  sourceUrl?: string;
  sourceKind: string;
  sourcePath?: string;
  sourceRef?: string;
  hasValidSourceUrl: boolean;
}

const TOP_EXTERNAL_AGENTS = topAgentsData as ExternalAgent[];

export function getTopExternalAgents(limit = 50) {
  return TOP_EXTERNAL_AGENTS.slice(0, limit);
}

export function getExternalAgentHref(key: string) {
  return `/agents/${key}`;
}
