import { AGENTS, type AgentTarget } from './agents.js';
import type { InstallResult } from './install.js';

export interface TargetClassification {
  canonical: AgentTarget[];
  detectedProject: AgentTarget[];
  detectedGlobal: AgentTarget[];
  undetectedProject: AgentTarget[];
  undetectedGlobal: AgentTarget[];
}

export function classifyTargets(cwd: string): TargetClassification {
  const result: TargetClassification = {
    canonical: [],
    detectedProject: [],
    detectedGlobal: [],
    undetectedProject: [],
    undetectedGlobal: [],
  };

  for (const agent of AGENTS) {
    // Canonical targets: no isAvailable, getPath returns null.
    // These agents read .agents/ directly — always active.
    if (!agent.isGlobal && !agent.isAvailable) {
      result.canonical.push(agent);
      continue;
    }

    const available = agent.isAvailable ? agent.isAvailable(cwd) : true;

    if (agent.isGlobal) {
      (available ? result.detectedGlobal : result.undetectedGlobal).push(agent);
    } else {
      (available ? result.detectedProject : result.undetectedProject).push(agent);
    }
  }

  return result;
}

function stripGlobalSuffix(name: string): string {
  return name.replace(/ \(global\)$/, '');
}

export function getUniqueAgentCount(): number {
  return new Set(AGENTS.map((a) => stripGlobalSuffix(a.name))).size;
}

function nameList(agents: AgentTarget[], strip = false): string {
  const names = agents.map((a) => (strip ? stripGlobalSuffix(a.name) : a.name));
  return names.join(', ');
}

function wrapNameList(agents: AgentTarget[], indent: string, strip = false): string {
  const names = agents.map((a) => (strip ? stripGlobalSuffix(a.name) : a.name));
  const maxWidth = 72;
  const lines: string[] = [];
  let line = indent;

  for (let i = 0; i < names.length; i++) {
    const sep = i === 0 ? '' : ', ';
    const candidate = line + sep + names[i];
    if (candidate.length > maxWidth && line !== indent) {
      lines.push(line + ',');
      line = indent + names[i];
    } else {
      line = candidate;
    }
  }
  if (line !== indent) lines.push(line);
  return lines.join('\n');
}

export function printTargets(cwd: string): void {
  const c = classifyTargets(cwd);
  const total = getUniqueAgentCount();
  const detectedCount = c.detectedProject.length + c.detectedGlobal.length;
  const undetectedCount = c.undetectedProject.length + c.undetectedGlobal.length;

  console.log(`\n${total} supported targets\n`);

  console.log(`Canonical (${c.canonical.length}) — read .agents/ directly, always active:`);
  console.log(wrapNameList(c.canonical, '  '));
  console.log('');

  if (detectedCount > 0) {
    console.log(`Detected (${detectedCount}) — will receive files:`);
    if (c.detectedProject.length > 0) {
      console.log(`  Project: ${nameList(c.detectedProject)}`);
    }
    if (c.detectedGlobal.length > 0) {
      console.log(`  Global:  ${nameList(c.detectedGlobal, true)}`);
    }
    console.log('');
  }

  if (undetectedCount > 0) {
    console.log(`Not detected (${undetectedCount}) — unchecked by default until tools installed:`);
    if (c.undetectedProject.length > 0) {
      console.log(`  Project: ${nameList(c.undetectedProject)}`);
    }
    if (c.undetectedGlobal.length > 0) {
      console.log(`  Global:  ${nameList(c.undetectedGlobal, true)}`);
    }
    console.log('');
  }

  if (detectedCount === 0) {
    console.log(`⚠  No external targets detected.`);
    console.log(`   .agents/ will still be populated for canonical readers.`);
    console.log(`   Install agent tools (Claude Code, Cursor, etc.) then re-run.\n`);
  }

  console.log(`Notes:`);
  console.log(`  • CLAUDE_CONFIG_DIR overrides Claude Code global path`);
  console.log(`  • CODEX_HOME overrides Codex global path`);
  console.log(`  • Kiro CLI: after install, manually add skills to .kiro/agents/<agent>.json`);
  console.log(`  • OpenClaw project target requires .openclaw/.clawdbot/.moltbot marker dir`);
}

export function printInstallSummary(results: InstallResult[], _cwd: string): void {
  const total = getUniqueAgentCount();
  const totalInstalled = results.reduce((sum, r) => sum + r.installedPaths.length, 0);

  console.log(`\nTarget summary:`);
  if (totalInstalled > 0) {
    console.log(`  ✓ ${totalInstalled} file(s) installed`);
  } else {
    console.log(`  ⚠ No targets selected — nothing installed`);
  }
  console.log(`  Run \`agentget targets\` to see all ${total} supported targets.`);
}
