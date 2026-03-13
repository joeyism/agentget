import { describe, it, expect } from 'vitest';
import { AGENTS } from '../src/agents.js';

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
});
