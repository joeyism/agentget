import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { discoverContent } from '../src/discover.js';
import { mkdtemp, rm, mkdir, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

describe('discoverContent', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'agentget-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('Empty repo throws', async () => {
    await expect(discoverContent(tempDir)).rejects.toThrow('No installable content found');
  });

  it('agents/ with foo.agent.md', async () => {
    await mkdir(join(tempDir, 'agents'));
    await writeFile(join(tempDir, 'agents', 'foo.agent.md'), 'content');
    const result = await discoverContent(tempDir);
    expect(result).toContainEqual(
      expect.objectContaining({ type: 'agent', name: 'foo', extension: '.agent.md' })
    );
  });

  it('agents/ with bar.md', async () => {
    await mkdir(join(tempDir, 'agents'));
    await writeFile(join(tempDir, 'agents', 'bar.md'), 'content');
    const result = await discoverContent(tempDir);
    expect(result).toContainEqual(
      expect.objectContaining({ type: 'agent', name: 'bar', extension: '.md' })
    );
  });

  it('agents/ nested subdir', async () => {
    await mkdir(join(tempDir, 'agents', 'subdir'), { recursive: true });
    await writeFile(join(tempDir, 'agents', 'subdir', 'deep.agent.md'), 'content');
    const result = await discoverContent(tempDir);
    expect(result).toContainEqual(
      expect.objectContaining({ type: 'agent', name: 'deep', extension: '.agent.md' })
    );
  });

  it('instructions/ with foo.instructions.md', async () => {
    await mkdir(join(tempDir, 'instructions'));
    await writeFile(join(tempDir, 'instructions', 'foo.instructions.md'), 'content');
    const result = await discoverContent(tempDir);
    expect(result).toContainEqual(expect.objectContaining({ type: 'instruction', name: 'foo' }));
  });

  it('skills/ with my-skill/SKILL.md', async () => {
    await mkdir(join(tempDir, 'skills', 'my-skill'), { recursive: true });
    await writeFile(join(tempDir, 'skills', 'my-skill', 'SKILL.md'), 'content');
    const result = await discoverContent(tempDir);
    expect(result).toContainEqual(expect.objectContaining({ type: 'skill', name: 'my-skill' }));
  });

  it('rules/ with foo.rules.md', async () => {
    await mkdir(join(tempDir, 'rules'));
    await writeFile(join(tempDir, 'rules', 'foo.rules.md'), 'content');
    const result = await discoverContent(tempDir);
    expect(result).toContainEqual(expect.objectContaining({ type: 'rule', name: 'foo' }));
  });

  it('Multiple content types', async () => {
    await mkdir(join(tempDir, 'agents'));
    await writeFile(join(tempDir, 'agents', 'foo.agent.md'), 'content');
    await mkdir(join(tempDir, 'rules'));
    await writeFile(join(tempDir, 'rules', 'bar.rules.md'), 'content');
    const result = await discoverContent(tempDir);
    expect(result).toContainEqual(
      expect.objectContaining({ type: 'agent', name: 'foo', extension: '.agent.md' })
    );
    expect(result).toContainEqual(expect.objectContaining({ type: 'rule', name: 'bar' }));
  });

  it('subpath option', async () => {
    await mkdir(join(tempDir, 'sub', 'agents'), { recursive: true });
    await writeFile(join(tempDir, 'sub', 'agents', 'foo.agent.md'), 'content');
    const result = await discoverContent(tempDir, 'sub');
    expect(result).toContainEqual(
      expect.objectContaining({ type: 'agent', name: 'foo', extension: '.agent.md' })
    );
  });

  it('Custom dir names via options', async () => {
    await mkdir(join(tempDir, 'custom-agents'));
    await writeFile(join(tempDir, 'custom-agents', 'foo.agent.md'), 'content');
    const result = await discoverContent(tempDir, undefined, { agentsDir: 'custom-agents' });
    expect(result).toContainEqual(
      expect.objectContaining({ type: 'agent', name: 'foo', extension: '.agent.md' })
    );
  });

  it('plugins/ with myplugin/agents/foo.agent.md', async () => {
    await mkdir(join(tempDir, 'plugins', 'myplugin', 'agents'), { recursive: true });
    await writeFile(join(tempDir, 'plugins', 'myplugin', 'agents', 'foo.agent.md'), 'content');
    const result = await discoverContent(tempDir);
    expect(result).toContainEqual(
      expect.objectContaining({ type: 'agent', name: 'foo', extension: '.agent.md' })
    );
  });
});
