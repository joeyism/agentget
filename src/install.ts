import { mkdir, copyFile, symlink, rm, readdir, stat, readFile, writeFile } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { platform } from 'os';
import type { DiscoveredItem, ContentType } from './discover.js';
import { AGENTS } from './agents.js';

export interface InstallResult {
  item: DiscoveredItem;
  canonicalPath: string;
  symlinks: string[];
}

export function getCanonicalPath(cwd: string, item: DiscoveredItem): string {
  const dir = typeDir(item.type);
  const ext = item.extension || itemExt(item.type);
  return join(cwd, '.agents', dir, item.name + ext);
}

function typeDir(type: ContentType): string {
  if (type === 'agent') return 'agents';
  if (type === 'instruction') return 'instructions';
  if (type === 'rule') return 'rules';
  return 'skills';
}

function itemExt(type: ContentType): string {
  if (type === 'agent') return '.agent.md';
  if (type === 'instruction') return '.instructions.md';
  if (type === 'rule') return '.rules.md';
  return ''; // skills are folders
}

function stripFrontmatter(content: string): string {
  const lines = content.split('\n');
  
  // Check if file starts with frontmatter delimiter
  if (lines[0] !== '---') {
    return content;
  }
  
  // Find closing delimiter
  const closingIndex = lines.findIndex((line, idx) => idx > 0 && line === '---');
  
  if (closingIndex === -1) {
    // No closing delimiter found, return original
    return content;
  }
  
  // Return content after closing delimiter, preserving leading newlines
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
    
    // Strip frontmatter from .md files
    if (dest.endsWith('.md')) {
      const content = await readFile(src, 'utf-8');
      const stripped = stripFrontmatter(content);
      await writeFile(dest, stripped, 'utf-8');
    } else {
      await copyFile(src, dest);
    }
  }
}

async function createSymlink(target: string, linkPath: string): Promise<void> {
  await mkdir(dirname(linkPath), { recursive: true });

  // Remove existing symlink if present
  try {
    await rm(linkPath, { recursive: true, force: true });
  } catch {
    // ignore
  }

  const rel = relative(dirname(linkPath), target);
  const symlinkType = platform() === 'win32' ? 'junction' : undefined;
  await symlink(rel, linkPath, symlinkType);
}

export async function installItem(
  item: DiscoveredItem,
  cwd: string
): Promise<InstallResult> {
  const canonicalPath = getCanonicalPath(cwd, item);

  // Copy to canonical
  await copyItem(item.sourcePath, canonicalPath);

  // Create symlinks for each agent tool
  const symlinks: string[] = [];
  for (const agent of AGENTS) {
    const linkPath = agent.getPath(cwd, item.type, item.name, item.extension);
    if (linkPath === null) continue; // OpenCode project-local reads canonical directly

    await createSymlink(canonicalPath, linkPath);
    symlinks.push(linkPath);
  }

  return { item, canonicalPath, symlinks };
}

export async function installAll(
  items: DiscoveredItem[],
  cwd: string
): Promise<InstallResult[]> {
  const results: InstallResult[] = [];
  for (const item of items) {
    const result = await installItem(item, cwd);
    results.push(result);
  }
  return results;
}
