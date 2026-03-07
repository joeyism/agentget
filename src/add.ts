import { parseSource } from './source-parser.js';
import { cloneRepo } from './git.js';
import { discoverContent, ContentType } from './discover.js';
import { installAll } from './install.js';

export interface AddOptions {
  agentFilter?: string;
  all?: boolean;
  agentsOnly?: boolean;
  skillsOnly?: boolean;
  instructionsOnly?: boolean;
  rulesOnly?: boolean;
  agentsDir?: string;
  skillsDir?: string;
  instructionsDir?: string;
  rulesDir?: string;
}

export async function add(source: string, options: AddOptions = {}): Promise<void> {
  console.log(`Fetching ${source}...`);

  const parsed = parseSource(source);
  const { dir, cleanup } = await cloneRepo(parsed.cloneUrl);

  try {
    console.log(`Discovering content...`);
    let items = await discoverContent(dir, parsed.subpath, {
      agentsDir: options.agentsDir,
      skillsDir: options.skillsDir,
      instructionsDir: options.instructionsDir,
      rulesDir: options.rulesDir,
    });

    // Determine which content types to include
    const includeTypes = new Set<ContentType>();
    
    if (options.all) {
      // --all: include everything
      includeTypes.add('agent');
      includeTypes.add('skill');
      includeTypes.add('instruction');
      includeTypes.add('rule');
    } else if (options.skillsOnly) {
      includeTypes.add('skill');
    } else if (options.instructionsOnly) {
      includeTypes.add('instruction');
    } else if (options.rulesOnly) {
      includeTypes.add('rule');
    } else if (options.agentFilter) {
      // --agent includes that agent + all skills/instructions/rules
      includeTypes.add('agent');
      includeTypes.add('skill');
      includeTypes.add('instruction');
      includeTypes.add('rule');
    } else {
      // Default: agents only
      includeTypes.add('agent');
    }

    // Filter by content type
    items = items.filter(item => includeTypes.has(item.type));

    // Filter to specific agent if requested
    if (options.agentFilter) {
      const agentItems = items.filter(item => item.type === 'agent');
      const matchingAgent = agentItems.find(item => item.name === options.agentFilter);
      
      if (!matchingAgent) {
        const availableAgents = agentItems.map(item => item.name);
        throw new Error(
          `Agent "${options.agentFilter}" not found. Available agents: ${availableAgents.join(', ') || 'none'}`
        );
      }
      
      // Keep only the matching agent, but preserve all skills/instructions
      items = items.filter(item => 
        item.type !== 'agent' || item.name === options.agentFilter
      );
      console.log(`Filtering to agent: ${options.agentFilter}`);
    }

    console.log(`Found ${items.length} item(s):`);
    for (const item of items) {
      console.log(`  ${item.type}: ${item.name}`);
    }

    console.log(`\nInstalling...`);
    const cwd = process.cwd();
    const results = await installAll(items, cwd);

    console.log(`\n✓ Installed ${results.length} item(s):`);
    for (const result of results) {
      console.log(`  ${result.item.type}: ${result.item.name}`);
      console.log(`    canonical: ${result.canonicalPath}`);
      for (const link of result.symlinks) {
        console.log(`    symlink:   ${link}`);
      }
    }
  } finally {
    await cleanup();
  }
}
