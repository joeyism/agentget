import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listRemote } from '../src/remote-list.js';
import * as sourceParser from '../src/source-parser.js';
import * as git from '../src/git.js';
import * as discover from '../src/discover.js';

// Mock all external dependencies
vi.mock('../src/source-parser.js');
vi.mock('../src/git.js');
vi.mock('../src/discover.js');

describe('listRemote', () => {
  const mockParseSource = sourceParser.parseSource as ReturnType<typeof vi.fn>;
  const mockCloneRepo = git.cloneRepo as ReturnType<typeof vi.fn>;
  const mockDiscoverContent = discover.discoverContent as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should list all content types with --all flag', async () => {
    const mockCleanup = vi.fn();
    mockParseSource.mockReturnValue({
      owner: 'test',
      repo: 'test-repo',
      cloneUrl: 'https://github.com/test/test-repo.git',
    });
    mockCloneRepo.mockResolvedValue({
      dir: '/tmp/mock-repo',
      cleanup: mockCleanup,
    });
    mockDiscoverContent.mockResolvedValue([
      { type: 'agent', name: 'test-agent', sourcePath: '/tmp/repo/agents/test.md' },
      { type: 'skill', name: 'claude-code', sourcePath: '/tmp/repo/skills/claude-code' },
      {
        type: 'instruction',
        name: 'test-instruction',
        sourcePath: '/tmp/repo/instructions/test.instructions.md',
      },
      { type: 'rule', name: 'test-rule', sourcePath: '/tmp/repo/rules/test.rules.md' },
    ]);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

    await listRemote('test/repo', { all: true });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('4 item(s)'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Agents'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Skills'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Instructions'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Rules'));

    consoleSpy.mockRestore();
  });

  it('should list only skills with --skills-only flag', async () => {
    const mockCleanup = vi.fn();
    mockParseSource.mockReturnValue({
      owner: 'test',
      repo: 'test-repo',
      cloneUrl: 'https://github.com/test/test-repo.git',
    });
    mockCloneRepo.mockResolvedValue({
      dir: '/tmp/mock-repo',
      cleanup: mockCleanup,
    });
    mockDiscoverContent.mockResolvedValue([
      { type: 'agent', name: 'test-agent', sourcePath: '/tmp/repo/agents/test.md' },
      { type: 'skill', name: 'claude-code', sourcePath: '/tmp/repo/skills/claude-code' },
      { type: 'skill', name: 'other-skill', sourcePath: '/tmp/repo/skills/other' },
    ]);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

    await listRemote('test/repo', { skillsOnly: true });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('2 item(s)'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('claude-code'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('other-skill'));
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('test-agent'));

    consoleSpy.mockRestore();
  });

  it('should list only agents by default', async () => {
    const mockCleanup = vi.fn();
    mockParseSource.mockReturnValue({
      owner: 'test',
      repo: 'test-repo',
      cloneUrl: 'https://github.com/test/test-repo.git',
    });
    mockCloneRepo.mockResolvedValue({
      dir: '/tmp/mock-repo',
      cleanup: mockCleanup,
    });
    mockDiscoverContent.mockResolvedValue([
      { type: 'agent', name: 'test-agent', sourcePath: '/tmp/repo/agents/test.md' },
      { type: 'skill', name: 'claude-code', sourcePath: '/tmp/repo/skills/claude-code' },
    ]);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

    await listRemote('test/repo', {});

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('test-agent'));
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('claude-code'));

    consoleSpy.mockRestore();
  });

  it('should show message when no items found', async () => {
    const mockCleanup = vi.fn();
    mockParseSource.mockReturnValue({
      owner: 'test',
      repo: 'test-repo',
      cloneUrl: 'https://github.com/test/test-repo.git',
    });
    mockCloneRepo.mockResolvedValue({
      dir: '/tmp/mock-repo',
      cleanup: mockCleanup,
    });
    mockDiscoverContent.mockResolvedValue([]);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

    await listRemote('test/repo', { agentsOnly: true });

    expect(consoleSpy).toHaveBeenCalledWith('\nNo items found.');

    consoleSpy.mockRestore();
  });

  it('should handle instructions-only flag', async () => {
    const mockCleanup = vi.fn();
    mockParseSource.mockReturnValue({
      owner: 'test',
      repo: 'test-repo',
      cloneUrl: 'https://github.com/test/test-repo.git',
    });
    mockCloneRepo.mockResolvedValue({
      dir: '/tmp/mock-repo',
      cleanup: mockCleanup,
    });
    mockDiscoverContent.mockResolvedValue([
      {
        type: 'instruction',
        name: 'inst-1',
        sourcePath: '/tmp/repo/instructions/1.instructions.md',
      },
      {
        type: 'instruction',
        name: 'inst-2',
        sourcePath: '/tmp/repo/instructions/2.instructions.md',
      },
    ]);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

    await listRemote('test/repo', { instructionsOnly: true });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('2 item(s)'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Instructions'));

    consoleSpy.mockRestore();
  });

  it('should handle rules-only flag', async () => {
    const mockCleanup = vi.fn();
    mockParseSource.mockReturnValue({
      owner: 'test',
      repo: 'test-repo',
      cloneUrl: 'https://github.com/test/test-repo.git',
    });
    mockCloneRepo.mockResolvedValue({
      dir: '/tmp/mock-repo',
      cleanup: mockCleanup,
    });
    mockDiscoverContent.mockResolvedValue([
      { type: 'rule', name: 'rule-1', sourcePath: '/tmp/repo/rules/1.rules.md' },
    ]);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation();

    await listRemote('test/repo', { rulesOnly: true });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('1 item(s)'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Rules'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('rule-1'));

    consoleSpy.mockRestore();
  });
});
