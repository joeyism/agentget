import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { stripFrontmatter, installItem, installAll } from '../src/install.js';
import { mkdtemp, rm, mkdir, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

describe('stripFrontmatter', () => {
  it('proper frontmatter', () => {
    const content = `---\ntitle: Test\n---\n# Content`;
    expect(stripFrontmatter(content).trim()).toBe('# Content');
  });

  it('content without ---', () => {
    const content = `# Content`;
    expect(stripFrontmatter(content)).toBe(content);
  });

  it('content with unclosed ---', () => {
    const content = `---\ntitle: Test\n# Content`;
    expect(stripFrontmatter(content)).toBe(content);
  });

  it('content starting with --- but no closing ---', () => {
    const content = `---\ntitle: Test`;
    expect(stripFrontmatter(content)).toBe(content);
  });
});

describe('installItem and installAll', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'agentget-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('installItem', async () => {
    const sourcePath = join(tempDir, 'source.md');
    await writeFile(sourcePath, 'content');
    const targetPath = join(tempDir, 'target.md');

    const target = {
      name: 'test',
      isGlobal: false,
      getPath: () => targetPath,
    };

    const item = { type: 'agent' as const, name: 'test', sourcePath };
    const result = await installItem(item, [target], tempDir);
    expect(result).toBeDefined();
  });

  it('installAll', async () => {
    const sourcePath = join(tempDir, 'source.md');
    await writeFile(sourcePath, 'content');
    const targetPath = join(tempDir, 'target.md');

    const target = {
      name: 'test',
      isGlobal: false,
      getPath: () => targetPath,
    };

    const item = { type: 'agent' as const, name: 'test', sourcePath };
    const results = await installAll([item], [target], tempDir);
    expect(results).toHaveLength(1);
  });
});
