import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { AGENTS } from "../../src/agents";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DESC_MAX_LENGTH = 200;

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
  url: string;
}

interface SupportedTargetEntry {
  name: string;
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
    cleaned = cleaned.slice(0, DESC_MAX_LENGTH).trimEnd() + "...";
  }

  return cleaned;
}

function buildSupportedTargets(): SupportedTargetEntry[] {
  const seen = new Set<string>();

  return AGENTS.flatMap((target) => {
    if (target.name === "agentget (.agents/)") {
      return [];
    }

    const name = target.name.replace(/ \(global\)$/, "");

    if (seen.has(name)) {
      return [];
    }

    seen.add(name);
    return [{ name }];
  });
}

function main(): void {
  const rootDir = resolve(__dirname, "..");
  const sourcePath = resolve(rootDir, "sources.json");
  const outputPath = resolve(rootDir, "public", "agents-index.json");
  const supportedTargetsPath = resolve(rootDir, "public", "supported-targets.json");

  console.log("Reading sources.json...");
  const raw = readFileSync(sourcePath, "utf-8");
  const sources: Record<string, SourceEntry> = JSON.parse(raw);

  const keys = Object.keys(sources);
  console.log(`Found ${keys.length} entries`);

  const agents: AgentEntry[] = keys.map((key) => {
    const entry = sources[key];
    const segments = key.split("/");
    const owner = segments[0];
    const repo = `${segments[0]}/${segments[1]}`;
    const agentSlug = segments[2];

    const url = entry.url.startsWith("https://")
      ? entry.url
      : `https://${entry.url}`;

    return {
      key,
      name: titleCase(agentSlug),
      repo,
      owner,
      shortDescription: sanitizeDescription(entry.short_description, repo),
      hasSkills: entry.has_skills,
      hasInstructions: entry.has_instructions,
      installCommand: entry.installation_method,
      url,
    };
  });

  console.log(`Transformed ${agents.length} agents`);

  const output = JSON.stringify(agents);
  writeFileSync(outputPath, output, "utf-8");

  const supportedTargets = buildSupportedTargets();
  writeFileSync(supportedTargetsPath, JSON.stringify(supportedTargets), "utf-8");

  const rawKB = (Buffer.byteLength(output, "utf-8") / 1024).toFixed(1);
  const gzipKB = (gzipSync(output).byteLength / 1024).toFixed(1);
  console.log(`Written to ${outputPath}`);
  console.log(`  Raw: ${rawKB}KB | Gzipped (transfer size): ${gzipKB}KB`);
  console.log(`Written to ${supportedTargetsPath}`);
  console.log(`Supported targets: ${supportedTargets.length}`);

  const hasLongDesc = output.includes("long_description");
  const wrappedQuotes = agents.filter(
    (a) =>
      a.shortDescription.startsWith('"') && a.shortDescription.endsWith('"')
  ).length;
  const missingHttps = agents.filter(
    (a) => !a.url.startsWith("https://")
  ).length;
  const duplicateSupportedTargets = supportedTargets.length !== new Set(supportedTargets.map((target) => target.name)).size;

  console.log("\n--- Verification ---");
  console.log(`Entries: ${agents.length}`);
  console.log(`Contains long_description: ${hasLongDesc}`);
  console.log(`Wrapped quotes remaining: ${wrappedQuotes}`);
  console.log(`URLs missing https://: ${missingHttps}`);
  console.log(`Duplicate supported targets: ${duplicateSupportedTargets}`);

  const failed =
    hasLongDesc ||
    wrappedQuotes > 0 ||
    missingHttps > 0 ||
    agents.length !== keys.length ||
    duplicateSupportedTargets;

  if (failed) {
    console.error("\nVerification FAILED!");
    process.exit(1);
  }

  console.log("\nAll checks passed.");
}

main();
