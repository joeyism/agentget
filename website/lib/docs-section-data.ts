// Keep in sync with src/agents.ts. A future PR will emit the canonical/project/global
// breakdown from website/scripts/build-data.ts once AgentTarget exposes a displayPath.
// The total tool count (41) already comes from public/supported-targets.json.

export type CodeLine = { type: 'comment'; text: string } | { type: 'command'; text: string };

export const installationLines: CodeLine[] = [
  { type: 'comment', text: '# npm' },
  { type: 'command', text: 'npm install -g agentget' },
  { type: 'comment', text: '# bun' },
  { type: 'command', text: 'bun add -g agentget' },
  { type: 'comment', text: '# Or use without installing:' },
  { type: 'command', text: 'npx agentget add owner/repo' },
  { type: 'command', text: 'bunx agentget add owner/repo' },
];

export const basicUsageLines: CodeLine[] = [
  { type: 'comment', text: '# Install all agents (default)' },
  { type: 'command', text: 'npx agentget add owner/repo' },
  { type: 'comment', text: '# Install everything (agents, skills, instructions, rules)' },
  { type: 'command', text: 'npx agentget add owner/repo --all' },
  { type: 'comment', text: '# Install a specific agent + all skills/instructions/rules' },
  { type: 'command', text: 'npx agentget add owner/repo --agent code-reviewer' },
  { type: 'comment', text: '# Install only skills' },
  { type: 'command', text: 'npx agentget add owner/repo --skills-only' },
  { type: 'comment', text: '# Install specific agent only (no extras)' },
  { type: 'command', text: 'npx agentget add owner/repo --agent code-reviewer --agents-only' },
];

export const cliHintLines: CodeLine[] = [
  { type: 'comment', text: '# See all supported targets and which are detected on your machine' },
  { type: 'command', text: 'npx agentget targets' },
];

export const filteringFlags: { flag: string; behavior: string }[] = [
  { flag: '(none)', behavior: 'Installs agents only (default)' },
  { flag: '--all', behavior: 'Installs everything' },
  { flag: '--agent <name>', behavior: 'Installs specified agent + all skills/instructions/rules' },
  { flag: '--agents-only', behavior: 'Installs agents only (explicit)' },
  { flag: '--skills-only', behavior: 'Installs skills only' },
  { flag: '--instructions-only', behavior: 'Installs instructions only' },
  { flag: '--rules-only', behavior: 'Installs rules only' },
];

export const whatItInstalls: { type: string; pattern: string }[] = [
  { type: 'Agents', pattern: 'agents/*.agent.md' },
  { type: 'Instructions', pattern: 'instructions/*.instructions.md' },
  { type: 'Skills', pattern: 'skills/*/SKILL.md (whole folder)' },
  { type: 'Rules', pattern: 'rules/*.rules.md' },
  { type: 'Plugins', pattern: 'plugins/*/ (expanded recursively)' },
];

export const canonicalReaders: string[] = [
  'AMP',
  'Cline',
  'Codex',
  'Cursor',
  'Gemini CLI',
  'GitHub Copilot',
  'Kimi Code CLI',
  'OpenCode',
  'Replit',
  'Universal',
];

export const projectTargets: { tool: string; path: string }[] = [
  { tool: 'AdaL', path: '.adal/' },
  { tool: 'Antigravity', path: '.agent/' },
  { tool: 'Augment', path: '.augment/' },
  { tool: 'Claude Code', path: '.claude/' },
  { tool: 'CodeBuddy', path: '.codebuddy/' },
  { tool: 'Command Code', path: '.commandcode/' },
  { tool: 'Continue', path: '.continue/' },
  { tool: 'Cortex Code', path: '.cortex/' },
  { tool: 'Crush', path: '.crush/' },
  { tool: 'Droid', path: '.factory/' },
  { tool: 'Goose', path: '.goose/' },
  { tool: 'iFlow CLI', path: '.iflow/' },
  { tool: 'Junie', path: '.junie/' },
  { tool: 'Kilo Code', path: '.kilocode/' },
  { tool: 'Kiro CLI', path: '.kiro/' },
  { tool: 'Kode', path: '.kode/' },
  { tool: 'MCPJam', path: '.mcpjam/' },
  { tool: 'Mistral Vibe', path: '.vibe/' },
  { tool: 'Mux', path: '.mux/' },
  { tool: 'Neovate', path: '.neovate/' },
  { tool: 'OpenClaw', path: '* (marker-gated)' },
  { tool: 'OpenHands', path: '.openhands/' },
  { tool: 'Pi', path: '.pi/' },
  { tool: 'Pochi', path: '.pochi/' },
  { tool: 'Qoder', path: '.qoder/' },
  { tool: 'Qwen Code', path: '.qwen/' },
  { tool: 'Roo Code', path: '.roo/' },
  { tool: 'Trae', path: '.trae/' },
  { tool: 'Trae CN', path: '.trae/' },
  { tool: 'Windsurf', path: '.windsurf/' },
  { tool: 'Zencoder', path: '.zencoder/' },
];

export const globalTargets: { tool: string; path: string }[] = [
  { tool: 'AdaL', path: '~/.adal/' },
  { tool: 'AMP / Kimi Code CLI / Replit / Universal', path: '~/.config/agents/' },
  { tool: 'Antigravity', path: '~/.gemini/antigravity/' },
  { tool: 'Augment', path: '~/.augment/' },
  { tool: 'Claude Code', path: '${CLAUDE_CONFIG_DIR:-~/.claude}/' },
  { tool: 'Cline', path: '~/.agents/' },
  { tool: 'CodeBuddy', path: '~/.codebuddy/' },
  { tool: 'Codex', path: '${CODEX_HOME:-~/.codex}/' },
  { tool: 'Command Code', path: '~/.commandcode/' },
  { tool: 'Continue', path: '~/.continue/' },
  { tool: 'Cortex Code', path: '~/.snowflake/cortex/' },
  { tool: 'Crush', path: '~/.config/crush/' },
  { tool: 'Cursor', path: '~/.cursor/' },
  { tool: 'Droid', path: '~/.factory/' },
  { tool: 'Gemini CLI', path: '~/.gemini/' },
  { tool: 'GitHub Copilot', path: '~/.copilot/' },
  { tool: 'Goose', path: '~/.config/goose/' },
  { tool: 'iFlow CLI', path: '~/.iflow/' },
  { tool: 'Junie', path: '~/.junie/' },
  { tool: 'Kilo Code', path: '~/.kilocode/' },
  { tool: 'Kiro CLI', path: '~/.kiro/' },
  { tool: 'Kode', path: '~/.kode/' },
  { tool: 'MCPJam', path: '~/.mcpjam/' },
  { tool: 'Mistral Vibe', path: '~/.vibe/' },
  { tool: 'Mux', path: '~/.mux/' },
  { tool: 'Neovate', path: '~/.neovate/' },
  { tool: 'OpenClaw', path: '~/.openclaw/' },
  { tool: 'OpenCode', path: '~/.config/opencode/' },
  { tool: 'OpenHands', path: '~/.openhands/' },
  { tool: 'Pi', path: '~/.pi/agent/' },
  { tool: 'Pochi', path: '~/.pochi/' },
  { tool: 'Qoder', path: '~/.qoder/' },
  { tool: 'Qwen Code', path: '~/.qwen/' },
  { tool: 'Roo Code', path: '~/.roo/' },
  { tool: 'Trae', path: '~/.trae/' },
  { tool: 'Trae CN', path: '~/.trae-cn/' },
  { tool: 'Windsurf', path: '~/.codeium/windsurf/' },
  { tool: 'Zencoder', path: '~/.zencoder/' },
];
