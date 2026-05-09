import { parseSource } from './source-parser.js';
import { cloneRepo } from './git.js';
import { discoverContent } from './discover.js';

const CONTENT_TYPE_ORDER = ['agent', 'skill', 'instruction', 'rule'] as const;
const CONTENT_TYPE_LABELS: Record<string, string> = {
  agent: 'Agents',
  skill: 'Skills',
  instruction: 'Instructions',
  rule: 'Rules',
};

export interface ListRemoteOptions {
  all?: boolean;
  agentsOnly?: boolean;
  skillsOnly?: boolean;
  instructionsOnly?: boolean;
  rulesOnly?: boolean;
}

export async function listRemote(source: string, options: ListRemoteOptions = {}): Promise<void> {
  console.log(`Fetching ${source}...`);

  const parsed = parseSource(source);
  const { dir, cleanup } = await cloneRepo(parsed.cloneUrl);

  try {
    console.log(`Discovering content...`);
    let items = await discoverContent(dir, parsed.subpath);

    // Determine which content types to include
    const includeTypes = new Set<string>();
    if (options.all) {
      CONTENT_TYPE_ORDER.forEach((t) => includeTypes.add(t));
    } else if (options.skillsOnly) {
      includeTypes.add('skill');
    } else if (options.instructionsOnly) {
      includeTypes.add('instruction');
    } else if (options.rulesOnly) {
      includeTypes.add('rule');
    } else if (
      options.agentsOnly ||
      (!options.skillsOnly && !options.instructionsOnly && !options.rulesOnly)
    ) {
      includeTypes.add('agent');
    }

    // Filter by content types
    items = items.filter((item) => includeTypes.has(item.type));

    if (items.length === 0) {
      console.log('\nNo items found.');
      return;
    }

    // Group by type
    const grouped = new Map<string, typeof items>();
    for (const item of items) {
      const key = item.type;
      const group = grouped.get(key) || [];
      group.push(item);
      grouped.set(key, group);
    }

    console.log(`\nFound ${items.length} item(s) in ${source}:`);

    for (const type of CONTENT_TYPE_ORDER) {
      const group = grouped.get(type);
      if (!group) continue;

      console.log(`\n${CONTENT_TYPE_LABELS[type]} (${group.length}):`);
      for (const item of group) {
        console.log(`  ${item.name}`);
      }
    }
    console.log('');
  } finally {
    await cleanup();
  }
}
