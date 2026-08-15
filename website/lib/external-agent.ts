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

export function getExternalAgentHref(key: string) {
  return `/agents/${key}`;
}
