import { mkdir, copyFile, readdir, stat, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import type { DiscoveredItem } from './discover.js';
import type { AgentTarget } from './agents.js';

export interface InstallResult {
  item: DiscoveredItem;
  installedPaths: string[];
}

export function stripFrontmatter(content: string): string {
  const lines = content.split('\n');

  if (lines[0] !== '---') {
    return content;
  }

  const closingIndex = lines.findIndex((line, idx) => idx > 0 && line === '---');

  if (closingIndex === -1) {
    return content;
  }

  return lines.slice(closingIndex + 1).join('\n');
}

async function copyItem(src: string, dest: string): Promise<void> {
  const s = await stat(src);
  if (s.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);
    for (const entry of entries) {
      await copyItem(join(src, entry), join(dest, entry));
    }
  } else {
    await mkdir(dirname(dest), { recursive: true });

    if (dest.endsWith('.md')) {
      const content = await readFile(src, 'utf-8');
      const stripped = stripFrontmatter(content);
      await writeFile(dest, stripped, 'utf-8');
    } else {
      await copyFile(src, dest);
    }
  }
}

export async function installItem(
  item: DiscoveredItem,
  targets: AgentTarget[],
  cwd: string
): Promise<InstallResult> {
  const installedPaths: string[] = [];

  for (const target of targets) {
    const destPath = target.getPath(cwd, item.type, item.name, item.extension);
    if (destPath === null) continue;

    await copyItem(item.sourcePath, destPath);
    installedPaths.push(destPath);
  }

  return { item, installedPaths };
}

export async function installAll(
  items: DiscoveredItem[],
  targets: AgentTarget[],
  cwd: string
): Promise<InstallResult[]> {
  const results: InstallResult[] = [];
  for (const item of items) {
    const result = await installItem(item, targets, cwd);
    results.push(result);
  }
  return results;
}
