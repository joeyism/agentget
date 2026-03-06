import { Command } from 'commander';
import { add } from './add.js';

const program = new Command();

program
  .name('agentsmd')
  .description('Install AI agents from GitHub repos')
  .version('0.1.0');

program
  .command('add <source>')
  .description('Install agents from a GitHub repo (e.g. owner/repo or owner/repo/subpath)')
  .action(async (source: string) => {
    try {
      await add(source);
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
