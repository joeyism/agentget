import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export type ContentType = 'agent' | 'instruction' | 'skill' | 'rule';

export interface DiscoveredItem {
  type: ContentType;
  name: string;      // e.g. "4.1-Beast", "a11y", "add-educational-comments"
  sourcePath: string; // absolute path to file or folder in cloned repo
  extension?: string; // original file extension (e.g. ".md", ".agent.md"), undefined for skills (folders)
}

export interface DiscoverOptions {
  agentsDir?: string;
  skillsDir?: string;
  instructionsDir?: string;
  rulesDir?: string;
}

export async function discoverContent(
  repoDir: string,
  subpath?: string,
  options: DiscoverOptions = {}
): Promise<DiscoveredItem[]> {
  const root = subpath ? join(repoDir, subpath) : repoDir;
  const items: DiscoveredItem[] = [];

  const agentsDir = options.agentsDir || 'agents';
  const skillsDir = options.skillsDir || 'skills';
  const instructionsDir = options.instructionsDir || 'instructions';
  const rulesDir = options.rulesDir || 'rules';

  await scanAgents(join(root, agentsDir), items);
  await scanInstructions(join(root, instructionsDir), items);
  await scanSkills(join(root, skillsDir), items);
  await scanRules(join(root, rulesDir), items);
  await scanPlugins(join(root, 'plugins'), items);

  if (items.length === 0) {
    throw new Error(
      `No installable content found. Expected ${agentsDir}/, ${instructionsDir}/, ${skillsDir}/, or ${rulesDir}/ directories.`
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
  
  async function scanRecursive(currentDir: string): Promise<void> {
    const entries = await readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Recurse into subdirectories
        await scanRecursive(fullPath);
      } else if (entry.isFile()) {
        if (entry.name.endsWith('.agent.md')) {
          items.push({
            type: 'agent',
            name: entry.name.replace(/\.agent\.md$/, ''),
            sourcePath: fullPath,
            extension: '.agent.md',
          });
        } else if (entry.name.endsWith('.md')) {
          // Plain .md files are also treated as agents
          items.push({
            type: 'agent',
            name: entry.name.replace(/\.md$/, ''),
            sourcePath: fullPath,
            extension: '.md',
          });
        }
      }
    }
  }
  
  await scanRecursive(dir);
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
        extension: '.instructions.md',
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
        // No extension - skills are folders
      });
    }
  }
}

async function scanRules(dir: string, items: DiscoveredItem[]): Promise<void> {
  if (!(await exists(dir))) return;
  const entries = await readdir(dir);
  for (const entry of entries) {
    if (entry.endsWith('.rules.md')) {
      items.push({
        type: 'rule',
        name: entry.replace(/\.rules\.md$/, ''),
        sourcePath: join(dir, entry),
        extension: '.rules.md',
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
    await scanRules(join(pluginDir, 'rules'), items);
  }
}
