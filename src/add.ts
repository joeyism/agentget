import { parseSource } from './source-parser.js';
import { cloneRepo } from './git.js';
import { discoverContent } from './discover.js';
import { installAll } from './install.js';

export async function add(source: string): Promise<void> {
  console.log(`Fetching ${source}...`);

  const parsed = parseSource(source);
  const { dir, cleanup } = await cloneRepo(parsed.cloneUrl);

  try {
    console.log(`Discovering content...`);
    const items = await discoverContent(dir, parsed.subpath);

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
