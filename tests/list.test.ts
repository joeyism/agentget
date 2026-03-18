import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { scanInstalledContent, printList, type InstalledItem } from '../src/list.js';
import { mkdtemp, rm, mkdir, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { AgentTarget, ContentType } from '../src/agents.js';

function createTestTarget(baseDir: string, name = 'test-target'): AgentTarget {
  return {
    name,
    isGlobal: false,
    getDir: (_cwd: string, type: ContentType) => {
      const dirs: Record<ContentType, string> = {
        agent: join(baseDir, 'agents'),
        instruction: join(baseDir, 'instructions'),
        skill: join(baseDir, 'skills'),
        rule: join(baseDir, 'rules'),
      };
      return dirs[type];
    },
    getPath: () => null,
    isAvailable: () => true,
  };
}

describe('scanInstalledContent', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'agentget-list-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('returns empty array when no content exists', async () => {
    const target = createTestTarget(tempDir);
    const result = await scanInstalledContent([target], tempDir, ['agent']);
    expect(result).toEqual([]);
  });

  it('finds .agent.md files', async () => {
    await mkdir(join(tempDir, 'agents'), { recursive: true });
    await writeFile(join(tempDir, 'agents', 'oracle.agent.md'), 'content');

    const target = createTestTarget(tempDir);
    const result = await scanInstalledContent([target], tempDir, ['agent']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('oracle');
    expect(result[0].type).toBe('agent');
    expect(result[0].paths).toHaveLength(1);
    expect(result[0].paths[0].targetName).toBe('test-target');
    expect(result[0].paths[0].filePath).toBe(join(tempDir, 'agents', 'oracle.agent.md'));
  });

  it('finds plain .md files as agents', async () => {
    await mkdir(join(tempDir, 'agents'), { recursive: true });
    await writeFile(join(tempDir, 'agents', 'chat.md'), 'content');

    const target = createTestTarget(tempDir);
    const result = await scanInstalledContent([target], tempDir, ['agent']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('chat');
  });

  it('finds agents in subdirectories recursively', async () => {
    await mkdir(join(tempDir, 'agents', '.agents', 'agents'), { recursive: true });
    await writeFile(join(tempDir, 'agents', '.agents', 'agents', 'oracle.agent.md'), 'content');

    const target = createTestTarget(tempDir);
    const result = await scanInstalledContent([target], tempDir, ['agent']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('oracle');
    expect(result[0].paths[0].filePath).toBe(
      join(tempDir, 'agents', '.agents', 'agents', 'oracle.agent.md')
    );
  });

  it('deduplicates agent with both .agent.md and .md in same dir, preferring .agent.md', async () => {
    await mkdir(join(tempDir, 'agents'), { recursive: true });
    await writeFile(join(tempDir, 'agents', 'oracle.agent.md'), 'content');
    await writeFile(join(tempDir, 'agents', 'oracle.md'), 'content');

    const target = createTestTarget(tempDir);
    const result = await scanInstalledContent([target], tempDir, ['agent']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('oracle');
    expect(result[0].paths).toHaveLength(1);
    expect(result[0].paths[0].filePath).toBe(join(tempDir, 'agents', 'oracle.agent.md'));
  });

  it('finds .instructions.md files', async () => {
    await mkdir(join(tempDir, 'instructions'), { recursive: true });
    await writeFile(join(tempDir, 'instructions', 'style.instructions.md'), 'content');

    const target = createTestTarget(tempDir);
    const result = await scanInstalledContent([target], tempDir, ['instruction']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('style');
    expect(result[0].type).toBe('instruction');
  });

  it('finds .rules.md files', async () => {
    await mkdir(join(tempDir, 'rules'), { recursive: true });
    await writeFile(join(tempDir, 'rules', 'lint.rules.md'), 'content');

    const target = createTestTarget(tempDir);
    const result = await scanInstalledContent([target], tempDir, ['rule']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('lint');
    expect(result[0].type).toBe('rule');
  });

  it('finds skill directories with SKILL.md', async () => {
    await mkdir(join(tempDir, 'skills', 'my-skill'), { recursive: true });
    await writeFile(join(tempDir, 'skills', 'my-skill', 'SKILL.md'), 'content');

    const target = createTestTarget(tempDir);
    const result = await scanInstalledContent([target], tempDir, ['skill']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('my-skill');
    expect(result[0].type).toBe('skill');
  });

  it('deduplicates same agent across multiple targets', async () => {
    const dir1 = join(tempDir, 'target-1');
    const dir2 = join(tempDir, 'target-2');
    await mkdir(join(dir1, 'agents'), { recursive: true });
    await mkdir(join(dir2, 'agents'), { recursive: true });
    await writeFile(join(dir1, 'agents', 'oracle.agent.md'), 'content');
    await writeFile(join(dir2, 'agents', 'oracle.agent.md'), 'content');

    const target1 = createTestTarget(dir1, 'target-1');
    const target2 = createTestTarget(dir2, 'target-2');

    const result = await scanInstalledContent([target1, target2], tempDir, ['agent']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('oracle');
    expect(result[0].paths).toHaveLength(2);
    expect(result[0].paths.map((p) => p.targetName).sort()).toEqual(['target-1', 'target-2']);
    expect(result[0].paths.find((p) => p.targetName === 'target-1')?.filePath).toContain(
      'target-1'
    );
  });

  it('returns all content types when all types requested', async () => {
    await mkdir(join(tempDir, 'agents'), { recursive: true });
    await mkdir(join(tempDir, 'instructions'), { recursive: true });
    await mkdir(join(tempDir, 'rules'), { recursive: true });
    await mkdir(join(tempDir, 'skills', 'my-skill'), { recursive: true });
    await writeFile(join(tempDir, 'agents', 'oracle.agent.md'), 'content');
    await writeFile(join(tempDir, 'instructions', 'style.instructions.md'), 'content');
    await writeFile(join(tempDir, 'rules', 'lint.rules.md'), 'content');
    await writeFile(join(tempDir, 'skills', 'my-skill', 'SKILL.md'), 'content');

    const target = createTestTarget(tempDir);
    const result = await scanInstalledContent([target], tempDir, [
      'agent',
      'instruction',
      'skill',
      'rule',
    ]);

    expect(result).toHaveLength(4);
    const types = result.map((r) => r.type).sort();
    expect(types).toEqual(['agent', 'instruction', 'rule', 'skill']);
  });

  it('skips targets whose getDir returns null', async () => {
    const canonicalTarget: AgentTarget = {
      name: 'canonical',
      isGlobal: false,
      getPath: () => null,
      getDir: () => null,
    };

    const result = await scanInstalledContent([canonicalTarget], tempDir, ['agent']);
    expect(result).toEqual([]);
  });
});

describe('printList', () => {
  it('prints nothing found message when empty', () => {
    const output: string[] = [];
    const log = (msg: string) => output.push(msg);
    printList([], log);
    expect(output.some((l) => l.includes('No installed content found'))).toBe(true);
    expect(output.some((l) => l.includes('agentget add'))).toBe(true);
  });

  it('prints agent name and full file paths', () => {
    const items: InstalledItem[] = [
      {
        type: 'agent',
        name: 'oracle',
        paths: [
          { targetName: 'Claude Code', filePath: '/project/.claude/agents/oracle.agent.md' },
          { targetName: 'agentget (.agents/)', filePath: '/project/.agents/agents/oracle.md' },
        ],
      },
    ];
    const output: string[] = [];
    const log = (msg: string) => output.push(msg);
    printList(items, log);
    expect(output.some((l) => l.includes('oracle'))).toBe(true);
    expect(output.some((l) => l.includes('.claude/agents/oracle.agent.md'))).toBe(true);
    expect(output.some((l) => l.includes('.agents/agents/oracle.md'))).toBe(true);
    expect(output.some((l) => l.includes('Agents (1):'))).toBe(true);
  });
});
