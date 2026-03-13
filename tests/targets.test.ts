import { describe, it, expect } from 'vitest';
import { classifyTargets, getUniqueAgentCount } from '../src/targets.js';

describe('targets', () => {
  it('getUniqueAgentCount', () => {
    expect(getUniqueAgentCount()).toBeGreaterThan(0);
  });

  it('classifyTargets structure', () => {
    const result = classifyTargets(process.cwd());
    expect(result).toHaveProperty('canonical');
    expect(result).toHaveProperty('detectedProject');
    expect(result).toHaveProperty('detectedGlobal');
    expect(result).toHaveProperty('undetectedProject');
    expect(result).toHaveProperty('undetectedGlobal');

    expect(Array.isArray(result.canonical)).toBe(true);
    expect(Array.isArray(result.detectedProject)).toBe(true);
    expect(Array.isArray(result.detectedGlobal)).toBe(true);
    expect(Array.isArray(result.undetectedProject)).toBe(true);
    expect(Array.isArray(result.undetectedGlobal)).toBe(true);

    expect(result.canonical.length).toBeGreaterThan(0);

    // Canonical agents only appear in canonical
    const canonicalNames = new Set(result.canonical.map((a) => a.name));
    for (const a of result.detectedProject) expect(canonicalNames.has(a.name)).toBe(false);
    for (const a of result.detectedGlobal) expect(canonicalNames.has(a.name)).toBe(false);
    for (const a of result.undetectedProject) expect(canonicalNames.has(a.name)).toBe(false);
    for (const a of result.undetectedGlobal) expect(canonicalNames.has(a.name)).toBe(false);
  });
});
