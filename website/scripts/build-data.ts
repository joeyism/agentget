import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { AGENTS } from '../../src/agents';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DESC_MAX_LENGTH = 200;

type SourceKind = 'repo' | 'file' | 'folder' | 'unknown';

interface SourceEntry {
  url: string;
  installation_method: string;
  has_skills: boolean;
  has_instructions: boolean;
  short_description: string;
  long_description: string;
  num_gh_stars: number;
}

interface AgentEntry {
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
  sourceKind: SourceKind;
  sourcePath?: string;
  sourceRef?: string;
  hasValidSourceUrl: boolean;
}

interface SupportedTargetEntry {
  name: string;
}

interface ParsedGitHubLink {
  repoUrl: string;
  sourceUrl?: string;
  sourceKind: SourceKind;
  sourcePath?: string;
  sourceRef?: string;
  hasValidSourceUrl: boolean;
  normalizedUrl: string;
  wasAmbiguous: boolean;
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function sanitizeDescription(desc: string, repo: string): string {
  let cleaned = desc.trim();

  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  if (cleaned.length < 10) {
    return `Agent from ${repo}`;
  }

  if (cleaned.length > DESC_MAX_LENGTH) {
    cleaned = `${cleaned.slice(0, DESC_MAX_LENGTH).trimEnd()}...`;
  }

  return cleaned;
}

function normalizeUrl(url: string): string {
  return url.startsWith('https://') ? url : `https://${url}`;
}

function parseGitHubLink(rawUrl: string, owner: string, repoName: string): ParsedGitHubLink {
  const normalizedUrl = normalizeUrl(rawUrl);
  const repoUrl = `https://github.com/${owner}/${repoName}`;
  const repoPattern = new RegExp(`^${repoUrl}/?$`);

  if (repoPattern.test(normalizedUrl)) {
    return {
      repoUrl,
      sourceUrl: repoUrl,
      sourceKind: 'repo',
      hasValidSourceUrl: true,
      normalizedUrl,
      wasAmbiguous: false,
    };
  }

  const fileMatch = normalizedUrl.match(
    /^https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/([^/]+)\/(.+)$/
  );

  if (fileMatch) {
    return {
      repoUrl,
      sourceUrl: normalizedUrl,
      sourceKind: 'file',
      sourceRef: fileMatch[1],
      sourcePath: fileMatch[2],
      hasValidSourceUrl: true,
      normalizedUrl,
      wasAmbiguous: false,
    };
  }

  const folderMatch = normalizedUrl.match(
    /^https:\/\/github\.com\/[^/]+\/[^/]+\/tree\/([^/]+)\/(.+)$/
  );

  if (folderMatch) {
    return {
      repoUrl,
      sourceUrl: normalizedUrl,
      sourceKind: 'folder',
      sourceRef: folderMatch[1],
      sourcePath: folderMatch[2],
      hasValidSourceUrl: true,
      normalizedUrl,
      wasAmbiguous: false,
    };
  }

  const ambiguousPathMatch = normalizedUrl.match(/^https:\/\/github\.com\/[^/]+\/[^/]+\/(.+)$/);

  return {
    repoUrl,
    sourceKind: 'unknown',
    sourcePath: ambiguousPathMatch?.[1],
    hasValidSourceUrl: false,
    normalizedUrl,
    wasAmbiguous: Boolean(ambiguousPathMatch),
  };
}

function isValidGeneratedSourceUrl(agent: AgentEntry): boolean {
  if (!agent.hasValidSourceUrl || !agent.sourceUrl) {
    return true;
  }

  if (agent.sourceKind === 'repo') {
    return agent.sourceUrl === agent.repoUrl;
  }

  if (agent.sourceKind === 'file') {
    return /^https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/.+$/.test(agent.sourceUrl);
  }

  if (agent.sourceKind === 'folder') {
    return /^https:\/\/github\.com\/[^/]+\/[^/]+\/tree\/[^/]+\/.+$/.test(agent.sourceUrl);
  }

  return false;
}

function buildSupportedTargets(): SupportedTargetEntry[] {
  const seen = new Set<string>();

  return AGENTS.flatMap((target) => {
    if (target.name === 'agentget (.agents/)') {
      return [];
    }

    const name = target.name.replace(/ \(global\)$/, '');

    if (seen.has(name)) {
      return [];
    }

    seen.add(name);
    return [{ name }];
  });
}

function main(): void {
  const rootDir = resolve(__dirname, '..');
  const sourcePath = resolve(rootDir, 'sources.json');
  const outputPath = resolve(rootDir, 'public', 'agents-index.json');
  const supportedTargetsPath = resolve(rootDir, 'public', 'supported-targets.json');

  console.log('Reading sources.json...');
  const raw = readFileSync(sourcePath, 'utf-8');
  const sources: Record<string, SourceEntry> = JSON.parse(raw);

  const keys = Object.keys(sources);
  console.log(`Found ${keys.length} entries`);

  const agents: AgentEntry[] = keys.map((key) => {
    const entry = sources[key];
    const segments = key.split('/');
    const owner = segments[0];
    const repoName = segments[1];
    const repo = `${owner}/${repoName}`;
    const agentSlug = segments[2];
    const githubLink = parseGitHubLink(entry.url, owner, repoName);

    return {
      key,
      name: titleCase(agentSlug),
      repo,
      owner,
      shortDescription: sanitizeDescription(entry.short_description, repo),
      hasSkills: entry.has_skills,
      hasInstructions: entry.has_instructions,
      installCommand: entry.installation_method,
      url: githubLink.sourceUrl ?? githubLink.repoUrl,
      numGhStars: entry.num_gh_stars ?? 0,
      repoUrl: githubLink.repoUrl,
      sourceUrl: githubLink.sourceUrl,
      sourceKind: githubLink.sourceKind,
      sourcePath: githubLink.sourcePath,
      sourceRef: githubLink.sourceRef,
      hasValidSourceUrl: githubLink.hasValidSourceUrl,
    };
  });

  console.log(`Transformed ${agents.length} agents`);

  const output = JSON.stringify(agents);
  writeFileSync(outputPath, output, 'utf-8');

  const supportedTargets = buildSupportedTargets();
  writeFileSync(supportedTargetsPath, JSON.stringify(supportedTargets), 'utf-8');

  const rawKB = (Buffer.byteLength(output, 'utf-8') / 1024).toFixed(1);
  const gzipKB = (gzipSync(output).byteLength / 1024).toFixed(1);
  console.log(`Written to ${outputPath}`);
  console.log(`  Raw: ${rawKB}KB | Gzipped (transfer size): ${gzipKB}KB`);
  console.log(`Written to ${supportedTargetsPath}`);
  console.log(`Supported targets: ${supportedTargets.length}`);

  const hasLongDesc = output.includes('long_description');
  const wrappedQuotes = agents.filter(
    (agent) => agent.shortDescription.startsWith('"') && agent.shortDescription.endsWith('"')
  ).length;
  const missingHttps = agents.filter((agent) => !agent.url.startsWith('https://')).length;
  const missingStars = agents.filter((agent) => agent.numGhStars <= 0).length;
  const invalidRepoUrls = agents.filter(
    (agent) => !/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(agent.repoUrl)
  ).length;
  const validRepoLinks = agents.filter((agent) => agent.sourceKind === 'repo').length;
  const validFileLinks = agents.filter((agent) => agent.sourceKind === 'file').length;
  const validFolderLinks = agents.filter((agent) => agent.sourceKind === 'folder').length;
  const ambiguousGitHubPaths = keys
    .map((key) => {
      const segments = key.split('/');
      return parseGitHubLink(sources[key].url, segments[0], segments[1]);
    })
    .filter((link) => link.wasAmbiguous).length;
  const invalidGeneratedSourceUrls = agents.filter(
    (agent) => !isValidGeneratedSourceUrl(agent)
  ).length;
  const duplicateSupportedTargets =
    supportedTargets.length !== new Set(supportedTargets.map((target) => target.name)).size;

  console.log('\n--- Verification ---');
  console.log(`Entries: ${agents.length}`);
  console.log(`Contains long_description: ${hasLongDesc}`);
  console.log(`Wrapped quotes remaining: ${wrappedQuotes}`);
  console.log(`URLs missing https://: ${missingHttps}`);
  console.log(`Entries missing stars: ${missingStars}`);
  console.log(`Invalid repo URLs: ${invalidRepoUrls}`);
  console.log(`Valid repo links: ${validRepoLinks}`);
  console.log(`Valid file links: ${validFileLinks}`);
  console.log(`Valid folder links: ${validFolderLinks}`);
  console.log(`Ambiguous GitHub paths downgraded to repo URLs: ${ambiguousGitHubPaths}`);
  console.log(`Invalid generated source URLs: ${invalidGeneratedSourceUrls}`);
  console.log(`Duplicate supported targets: ${duplicateSupportedTargets}`);

  const failed =
    hasLongDesc ||
    wrappedQuotes > 0 ||
    missingHttps > 0 ||
    invalidRepoUrls > 0 ||
    invalidGeneratedSourceUrls > 0 ||
    agents.length !== keys.length ||
    duplicateSupportedTargets;

  if (failed) {
    console.error('\nVerification FAILED!');
    process.exit(1);
  }

  if (ambiguousGitHubPaths > 0) {
    console.warn(
      `\nWarning: ${ambiguousGitHubPaths} ambiguous GitHub paths were downgraded to repository root links.`
    );
  }

  console.log('\nAll checks passed.');
}

main();
