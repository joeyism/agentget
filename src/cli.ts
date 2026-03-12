import { Command } from 'commander';
import { add } from './add.js';
import { printTargets } from './targets.js';

const program = new Command();

program
  .name('agentget')
  .description('Install AI agents from GitHub repos')
  .version('0.1.0');

program
  .command('add <source>')
  .description('Install agents from a GitHub repo (e.g. owner/repo or owner/repo/subpath)')
  .option('--agent <name>', 'Install only the specified agent by name (includes all skills/instructions/rules)')
  .option('--all', 'Install everything (agents, skills, instructions, rules)')
  .option('--agents-only', 'Install only agents (default)')
  .option('--skills-only', 'Install only skills')
  .option('--instructions-only', 'Install only instructions')
  .option('--rules-only', 'Install only rules')
  .option('--agents-dir <name>', 'Alternative directory name for agents (default: "agents")')
  .option('--skills-dir <name>', 'Alternative directory name for skills (default: "skills")')
  .option('--instructions-dir <name>', 'Alternative directory name for instructions (default: "instructions")')
  .option('--rules-dir <name>', 'Alternative directory name for rules (default: "rules")')
  .action(async (source: string, options: { 
    agent?: string;
    all?: boolean;
    agentsOnly?: boolean;
    skillsOnly?: boolean;
    instructionsOnly?: boolean;
    rulesOnly?: boolean;
    agentsDir?: string;
    skillsDir?: string;
    instructionsDir?: string;
    rulesDir?: string;
  }) => {
    try {
      await add(source, {
        agentFilter: options.agent,
        all: options.all,
        agentsOnly: options.agentsOnly,
        skillsOnly: options.skillsOnly,
        instructionsOnly: options.instructionsOnly,
        rulesOnly: options.rulesOnly,
        agentsDir: options.agentsDir,
        skillsDir: options.skillsDir,
        instructionsDir: options.instructionsDir,
        rulesDir: options.rulesDir,
      });
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('targets')
  .description('Show supported, detected, and undetected agent targets')
  .action(() => {
    printTargets(process.cwd());
  });

program.parse();
