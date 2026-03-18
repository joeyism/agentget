import { autocompleteMultiselect, isCancel } from '@clack/prompts';
import { parseSource } from './source-parser.js';
import { cloneRepo } from './git.js';
import { discoverContent, ContentType } from './discover.js';
import { installAll } from './install.js';
import { printInstallSummary } from './targets.js';
import { AGENTS, type AgentTarget } from './agents.js';

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

async function selectTargets(cwd: string): Promise<AgentTarget[]> {
  // All targets with real paths (exclude canonical readers that return null)
  const allTargets = AGENTS.filter((t) => t.getPath(cwd, 'agent', 'test') !== null);

  if (!process.stdout.isTTY) {
    // Non-interactive: auto-select all detected targets
    return allTargets.filter((t) => !t.isAvailable || t.isAvailable(cwd));
  }

  const detectedTargets = allTargets.filter((t) => !t.isAvailable || t.isAvailable(cwd));
  const undetectedTargets = allTargets.filter((t) => t.isAvailable && !t.isAvailable(cwd));
  const sortedTargets = [...detectedTargets, ...undetectedTargets];

  const result = await autocompleteMultiselect<AgentTarget>({
    message: 'Select install targets',
    options: sortedTargets.map((t) => ({ value: t, label: t.name })),
    initialValues: detectedTargets,
    required: false,
  });

  if (isCancel(result)) {
    console.log('Cancelled.');
    process.exit(0);
  }

  return result as AgentTarget[];
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
    } else if (options.agentsOnly) {
      includeTypes.add('agent');
    } else if (options.agentFilter) {
      // --agent with no type restriction: include all related content
      includeTypes.add('agent');
      includeTypes.add('skill');
      includeTypes.add('instruction');
      includeTypes.add('rule');
    } else {
      includeTypes.add('agent');
    }

    items = items.filter((item) => includeTypes.has(item.type));

    if (options.agentFilter) {
      const agentItems = items.filter((item) => item.type === 'agent');
      const matchingAgent = agentItems.find((item) => item.name === options.agentFilter);

      if (!matchingAgent) {
        const availableAgents = agentItems.map((item) => item.name);
        throw new Error(
          `Agent "${options.agentFilter}" not found. Available agents: ${availableAgents.join(', ') || 'none'}`
        );
      }

      items = items.filter((item) => item.type !== 'agent' || item.name === options.agentFilter);
      console.log(`Filtering to agent: ${options.agentFilter}`);
    }

    console.log(`Found ${items.length} item(s):`);
    for (const item of items) {
      console.log(`  ${item.type}: ${item.name}`);
    }

    const cwd = process.cwd();
    const selectedTargets = await selectTargets(cwd);

    if (selectedTargets.length === 0) {
      console.log('\nNo targets selected — nothing installed.');
      return;
    }

    console.log(`\nInstalling...`);
    const results = await installAll(items, selectedTargets, cwd);

    console.log(`\n✓ Installed ${results.length} item(s):`);
    for (const result of results) {
      console.log(`  ${result.item.type}: ${result.item.name}`);
      for (const p of result.installedPaths) {
        console.log(`    → ${p}`);
      }
    }

    printInstallSummary(results, cwd);
  } finally {
    await cleanup();
  }
}
