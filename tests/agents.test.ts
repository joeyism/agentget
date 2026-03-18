import { describe, it, expect } from 'vitest';
import { AGENTS, type ContentType } from '../src/agents.js';

describe('AGENTS', () => {
  it('array length > 0', () => {
    expect(AGENTS.length).toBeGreaterThan(0);
  });

  it('Every agent has a name', () => {
    for (const agent of AGENTS) {
      expect(typeof agent.name).toBe('string');
      expect(agent.name.length).toBeGreaterThan(0);
    }
  });

  it('Every agent has a boolean isGlobal', () => {
    for (const agent of AGENTS) {
      expect(typeof agent.isGlobal).toBe('boolean');
    }
  });

  it('Every agent has a getPath function', () => {
    for (const agent of AGENTS) {
      expect(typeof agent.getPath).toBe('function');
    }
  });

  it('Canonical agents getPath returns null', () => {
    for (const agent of AGENTS) {
      if (!agent.isGlobal && agent.isAvailable === undefined) {
        expect(agent.getPath(process.cwd(), 'agent', agent.name, '.agent.md')).toBeNull();
      }
    }
  });

  it('Non-canonical agents getPath returns non-null string path', () => {
    for (const agent of AGENTS) {
      if (agent.isGlobal || agent.isAvailable !== undefined) {
        const path = agent.getPath(process.cwd(), 'agent', 'my-agent', '.agent.md');
        expect(typeof path).toBe('string');
        expect(path).toContain('my-agent');
      }
    }
  });

  it('getPath for instruction type', () => {
    for (const agent of AGENTS) {
      if (agent.isGlobal || agent.isAvailable !== undefined) {
        const path = agent.getPath(process.cwd(), 'instruction', 'my-inst', '.md');
        if (path) expect(path).toContain('instructions');
      }
    }
  });

  it('getPath for skill type', () => {
    for (const agent of AGENTS) {
      if (agent.isGlobal || agent.isAvailable !== undefined) {
        const path = agent.getPath(process.cwd(), 'skill', 'my-skill', undefined);
        if (path) expect(path).toContain('skills');
      }
    }
  });

  it('getPath for rule type', () => {
    for (const agent of AGENTS) {
      if (agent.isGlobal || agent.isAvailable !== undefined) {
        const path = agent.getPath(process.cwd(), 'rule', 'my-rule', '.md');
        if (path) expect(path).toContain('rules');
      }
    }
  });

  it('Every agent has a getDir function', () => {
    for (const agent of AGENTS) {
      expect(typeof agent.getDir).toBe('function');
    }
  });

  it('Canonical agents getDir returns null', () => {
    for (const agent of AGENTS) {
      if (!agent.isGlobal && agent.isAvailable === undefined) {
        expect(agent.getDir(process.cwd(), 'agent')).toBeNull();
      }
    }
  });

  it('Non-canonical agents getDir returns directory path for each content type', () => {
    const types: ContentType[] = ['agent', 'instruction', 'skill', 'rule'];
    for (const agent of AGENTS) {
      if (agent.isGlobal || agent.isAvailable !== undefined) {
        for (const type of types) {
          const dir = agent.getDir(process.cwd(), type);
          expect(typeof dir).toBe('string');
          if (type === 'agent') expect(dir).toContain('agents');
          if (type === 'instruction') expect(dir).toContain('instructions');
          if (type === 'skill') expect(dir).toContain('skills');
          if (type === 'rule') expect(dir).toContain('rules');
        }
      }
    }
  });
});
