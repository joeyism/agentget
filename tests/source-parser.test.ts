import { describe, it, expect } from 'vitest';
import { parseSource } from '../src/source-parser.js';

describe('parseSource', () => {
  it('Full GitHub URL', () => {
    expect(parseSource('https://github.com/owner/repo')).toEqual({
      owner: 'owner',
      repo: 'repo',
      subpath: undefined,
      cloneUrl: 'https://github.com/owner/repo.git',
    });
  });

  it('Full URL with .git suffix', () => {
    expect(parseSource('https://github.com/owner/repo.git')).toEqual({
      owner: 'owner',
      repo: 'repo',
      subpath: undefined,
      cloneUrl: 'https://github.com/owner/repo.git',
    });
  });

  it('Full URL with tree path', () => {
    expect(parseSource('https://github.com/owner/repo/tree/main/some/subpath')).toEqual({
      owner: 'owner',
      repo: 'repo',
      subpath: 'some/subpath',
      cloneUrl: 'https://github.com/owner/repo.git',
    });
  });

  it('Shorthand', () => {
    expect(parseSource('owner/repo')).toEqual({
      owner: 'owner',
      repo: 'repo',
      subpath: undefined,
      cloneUrl: 'https://github.com/owner/repo.git',
    });
  });

  it('Shorthand with subpath', () => {
    expect(parseSource('owner/repo/sub')).toEqual({
      owner: 'owner',
      repo: 'repo',
      subpath: 'sub',
      cloneUrl: 'https://github.com/owner/repo.git',
    });
  });

  it('Shorthand with deep subpath', () => {
    expect(parseSource('owner/repo/a/b/c')).toEqual({
      owner: 'owner',
      repo: 'repo',
      subpath: 'a/b/c',
      cloneUrl: 'https://github.com/owner/repo.git',
    });
  });

  it('Single segment throws', () => {
    expect(() => parseSource('justowner')).toThrow('Invalid source');
  });
});
