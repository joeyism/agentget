import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
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
  starCount: number;
  starCountLabel: string;
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

interface RepoStars {
  starCount: number;
  starCountLabel: string;
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
    cleaned = cleaned.slice(0, DESC_MAX_LENGTH).trimEnd() + '...';
  }

  return cleaned;
}

function normalizeUrl(url: string): string {
  return url.startsWith('https://') ? url : `https://${url}`;
}

function parseStarCount(value: string): number {
  const normalized = value.trim().toLowerCase().replace(/,/g, '');
  const match = normalized.match(/^(\d+(?:\.\d+)?)([km]?)$/);

  if (!match) {
    return 0;
  }

  const base = Number(match[1]);
  const suffix = match[2];

  if (suffix === 'm') {
    return Math.round(base * 1_000_000);
  }

  if (suffix === 'k') {
    return Math.round(base * 1_000);
  }

  return Math.round(base);
}

function formatStarCount(value: string): string {
  if (!value) {
    return '—';
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)([kKmM]?)$/);

  if (!match) {
    return trimmed;
  }

  const numeric = Number(match[1]);
  const suffix = match[2].toUpperCase();

  if (!suffix) {
    return Math.round(numeric).toLocaleString('en-US');
  }

  const abbreviated = Number.isInteger(numeric) ? numeric.toString() : numeric.toFixed(1);
  return `${abbreviated}${suffix}`;
}

async function fetchRepoStars(repo: string): Promise<RepoStars> {
  try {
    const response = await fetch(`https://img.shields.io/github/stars/${repo}.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stars for ${repo}`);
    }

    const payload = (await response.json()) as { value?: string };
    const rawValue = payload.value ?? '';

    return {
      starCount: parseStarCount(rawValue),
      starCountLabel: formatStarCount(rawValue),
    };
  } catch {
    return {
      starCount: 0,
      starCountLabel: '—',
    };
  }
}

async function buildRepoStarsMap(repos: string[]): Promise<Map<string, RepoStars>> {
  const starsEntries = await Promise.all(
    repos.map(async (repo) => [repo, await fetchRepoStars(repo)] as const)
  );

  return new Map(starsEntries);
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

async function main(): Promise<void> {
  const rootDir = resolve(__dirname, '..');
  const sourcePath = resolve(rootDir, 'sources.json');
  const outputPath = resolve(rootDir, 'public', 'agents-index.json');
  const supportedTargetsPath = resolve(rootDir, 'public', 'supported-targets.json');

  console.log('Reading sources.json...');
  const raw = readFileSync(sourcePath, 'utf-8');
  const sources: Record<string, SourceEntry> = JSON.parse(raw);

  const keys = Object.keys(sources);
  console.log(`Found ${keys.length} entries`);

  const uniqueRepos = [...new Set(keys.map((key) => key.split('/').slice(0, 2).join('/')))];
  console.log(`Fetching stars for ${uniqueRepos.length} unique repos...`);
  const repoStars = await buildRepoStarsMap(uniqueRepos);

  const agents: AgentEntry[] = keys.map((key) => {
    const entry = sources[key];
    const segments = key.split('/');
    const owner = segments[0];
    const repoName = segments[1];
    const repo = `${owner}/${repoName}`;
    const agentSlug = segments[2];
    const githubLink = parseGitHubLink(entry.url, owner, repoName);
    const stars = repoStars.get(repo) ?? { starCount: 0, starCountLabel: '—' };

    return {
      key,
      name: titleCase(agentSlug),
      repo,
      owner,
      shortDescription: sanitizeDescription(entry.short_description, repo),
      hasSkills: entry.has_skills,
      hasInstructions: entry.has_instructions,
      installCommand: entry.installation_method,
      starCount: stars.starCount,
      starCountLabel: stars.starCountLabel,
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
    (a) => a.shortDescription.startsWith('"') && a.shortDescription.endsWith('"')
  ).length;
  const invalidRepoUrls = agents.filter(
    (a) => !/^https:\/\/github\.com\/[^/]+\/[^/]+$/.test(a.repoUrl)
  ).length;
  const validRepoLinks = agents.filter((a) => a.sourceKind === 'repo').length;
  const validFileLinks = agents.filter((a) => a.sourceKind === 'file').length;
  const validFolderLinks = agents.filter((a) => a.sourceKind === 'folder').length;
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

void main();
