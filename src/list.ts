import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import type { AgentTarget, ContentType } from './agents.js';
import { AGENTS } from './agents.js';
import { exists } from './utils.js';

export interface InstalledItemPath {
  targetName: string;
  filePath: string;
}

export interface InstalledItem {
  type: ContentType;
  name: string;
  paths: InstalledItemPath[];
}

type ScanResult = { name: string; filePath: string };

async function scanAgentDir(dir: string): Promise<ScanResult[]> {
  if (!(await exists(dir))) return [];
  const allResults: ScanResult[] = [];

  async function scanRecursive(currentDir: string): Promise<void> {
    const entries = await readdir(currentDir);
    // Two-pass per-directory dedup: .agent.md wins over .md with the same base name
    const found = new Map<string, string>();
    for (const entry of entries) {
      if (entry.endsWith('.agent.md')) {
        found.set(entry.replace(/\.agent\.md$/, ''), join(currentDir, entry));
      }
    }
    for (const entry of entries) {
      if (entry.endsWith('.md') && !entry.endsWith('.agent.md')) {
        const name = entry.replace(/\.md$/, '');
        if (!found.has(name)) found.set(name, join(currentDir, entry));
      }
    }
    for (const [name, filePath] of found) allResults.push({ name, filePath });
    // Use stat() (follows symlinks) for directory detection so symlinked dirs are recursed too
    for (const entry of entries) {
      if (entry.endsWith('.md')) continue;
      const fullPath = join(currentDir, entry);
      try {
        const s = await stat(fullPath);
        if (s.isDirectory()) await scanRecursive(fullPath);
      } catch {
        // skip broken symlinks or permission errors
      }
    }
  }

  await scanRecursive(dir);
  return allResults;
}

async function scanInstructionDir(dir: string): Promise<ScanResult[]> {
  if (!(await exists(dir))) return [];
  const entries = await readdir(dir);
  return entries
    .filter((e) => e.endsWith('.instructions.md'))
    .map((e) => ({ name: e.replace(/\.instructions\.md$/, ''), filePath: join(dir, e) }));
}

async function scanRuleDir(dir: string): Promise<ScanResult[]> {
  if (!(await exists(dir))) return [];
  const entries = await readdir(dir);
  return entries
    .filter((e) => e.endsWith('.rules.md'))
    .map((e) => ({ name: e.replace(/\.rules\.md$/, ''), filePath: join(dir, e) }));
}

async function scanSkillDir(dir: string): Promise<ScanResult[]> {
  if (!(await exists(dir))) return [];
  const entries = await readdir(dir);
  const results: ScanResult[] = [];
  for (const entry of entries) {
    const skillDir = join(dir, entry);
    if (await exists(join(skillDir, 'SKILL.md'))) {
      results.push({ name: entry, filePath: skillDir });
    }
  }
  return results;
}

const scanners: Record<ContentType, (dir: string) => Promise<ScanResult[]>> = {
  agent: scanAgentDir,
  instruction: scanInstructionDir,
  rule: scanRuleDir,
  skill: scanSkillDir,
};

export async function scanInstalledContent(
  targets: AgentTarget[],
  cwd: string,
  types: ContentType[]
): Promise<InstalledItem[]> {
  const itemMap = new Map<string, InstalledItem>();

  for (const target of targets) {
    for (const type of types) {
      const dir = target.getDir(cwd, type);
      if (!dir) continue;

      const results = await scanners[type](dir);
      for (const { name, filePath } of results) {
        const key = `${type}::${name}`;
        const existing = itemMap.get(key);
        const item = existing ?? { type, name, paths: [] };
        if (!existing) itemMap.set(key, item);
        item.paths.push({ targetName: target.name, filePath });
      }
    }
  }

  return Array.from(itemMap.values()).sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.name.localeCompare(b.name);
  });
}

export function printList(items: InstalledItem[], log: (msg: string) => void = console.log): void {
  if (items.length === 0) {
    log('');
    log('No installed content found.');
    log('Run `agentget add <source>` to install agents.');
    log('');
    return;
  }

  const grouped = new Map<ContentType, InstalledItem[]>();
  for (const item of items) {
    const group = grouped.get(item.type) || [];
    group.push(item);
    grouped.set(item.type, group);
  }

  const typeLabels: Record<ContentType, string> = {
    agent: 'Agents',
    skill: 'Skills',
    instruction: 'Instructions',
    rule: 'Rules',
  };

  const typeOrder: ContentType[] = ['agent', 'skill', 'instruction', 'rule'];

  log('');
  for (const type of typeOrder) {
    const group = grouped.get(type);
    if (!group) continue;

    log(`${typeLabels[type]} (${group.length}):`);
    for (const item of group) {
      log(`  ${item.name}`);
      for (const p of item.paths) {
        log(`    → ${p.filePath} (${p.targetName})`);
      }
    }
    log('');
  }
}

export interface ListOptions {
  all?: boolean;
  agentsOnly?: boolean;
  skillsOnly?: boolean;
  instructionsOnly?: boolean;
  rulesOnly?: boolean;
}

export async function listInstalled(options: ListOptions = {}): Promise<void> {
  const types: ContentType[] = [];

  if (options.all) {
    types.push('agent', 'skill', 'instruction', 'rule');
  } else if (options.skillsOnly) {
    types.push('skill');
  } else if (options.instructionsOnly) {
    types.push('instruction');
  } else if (options.rulesOnly) {
    types.push('rule');
  } else if (options.agentsOnly) {
    types.push('agent');
  } else {
    // Default: agents only (matches `add` default)
    types.push('agent');
  }

  const cwd = process.cwd();
  const targets = AGENTS.filter(
    (t) => t.getPath(cwd, 'agent', 'test') !== null && (!t.isAvailable || t.isAvailable(cwd))
  );

  const items = await scanInstalledContent(targets, cwd, types);
  printList(items);
}
