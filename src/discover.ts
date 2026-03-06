import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export type ContentType = 'agent' | 'instruction' | 'skill';

export interface DiscoveredItem {
  type: ContentType;
  name: string;      // e.g. "4.1-Beast", "a11y", "add-educational-comments"
  sourcePath: string; // absolute path to file or folder in cloned repo
}

export async function discoverContent(
  repoDir: string,
  subpath?: string
): Promise<DiscoveredItem[]> {
  const root = subpath ? join(repoDir, subpath) : repoDir;
  const items: DiscoveredItem[] = [];

  await scanAgents(join(root, 'agents'), items);
  await scanInstructions(join(root, 'instructions'), items);
  await scanSkills(join(root, 'skills'), items);
  await scanPlugins(join(root, 'plugins'), items);

  if (items.length === 0) {
    throw new Error(
      'No installable content found. Expected agents/, instructions/, or skills/ directories.'
    );
  }

  return items;
}

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function scanAgents(dir: string, items: DiscoveredItem[]): Promise<void> {
  if (!(await exists(dir))) return;
  const entries = await readdir(dir);
  for (const entry of entries) {
    if (entry.endsWith('.agent.md')) {
      items.push({
        type: 'agent',
        name: entry.replace(/\.agent\.md$/, ''),
        sourcePath: join(dir, entry),
      });
    } else if (entry.endsWith('.md')) {
      // plugins/*/agents/ uses plain .md
      items.push({
        type: 'agent',
        name: entry.replace(/\.md$/, ''),
        sourcePath: join(dir, entry),
      });
    }
  }
}

async function scanInstructions(dir: string, items: DiscoveredItem[]): Promise<void> {
  if (!(await exists(dir))) return;
  const entries = await readdir(dir);
  for (const entry of entries) {
    if (entry.endsWith('.instructions.md')) {
      items.push({
        type: 'instruction',
        name: entry.replace(/\.instructions\.md$/, ''),
        sourcePath: join(dir, entry),
      });
    }
  }
}

async function scanSkills(dir: string, items: DiscoveredItem[]): Promise<void> {
  if (!(await exists(dir))) return;
  const entries = await readdir(dir);
  for (const entry of entries) {
    const skillDir = join(dir, entry);
    const skillFile = join(skillDir, 'SKILL.md');
    if (await exists(skillFile)) {
      items.push({
        type: 'skill',
        name: entry,
        sourcePath: skillDir,
      });
    }
  }
}

async function scanPlugins(dir: string, items: DiscoveredItem[]): Promise<void> {
  if (!(await exists(dir))) return;
  const plugins = await readdir(dir);
  for (const plugin of plugins) {
    const pluginDir = join(dir, plugin);
    await scanAgents(join(pluginDir, 'agents'), items);
    await scanInstructions(join(pluginDir, 'instructions'), items);
    await scanSkills(join(pluginDir, 'skills'), items);
  }
}
