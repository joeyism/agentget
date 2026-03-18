import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export type ContentType = 'agent' | 'instruction' | 'skill' | 'rule';

export interface AgentTarget {
  name: string;
  getPath: (cwd: string, type: ContentType, name: string, extension?: string) => string | null;
  getDir: (cwd: string, type: ContentType) => string | null;
  isAvailable?: (cwd: string) => boolean;
  isGlobal: boolean;
}

function typeDir(type: ContentType): string {
  if (type === 'agent') return 'agents';
  if (type === 'instruction') return 'instructions';
  if (type === 'rule') return 'rules';
  return 'skills';
}

function itemExt(type: ContentType, extension?: string): string {
  if (extension) return extension;
  if (type === 'skill') return '';
  if (type === 'agent') return '.agent.md';
  if (type === 'rule') return '.rules.md';
  return '.instructions.md';
}

function xdgConfigHome(): string {
  return process.env.XDG_CONFIG_HOME || join(homedir(), '.config');
}

function pathExists(path: string | undefined | null): boolean {
  if (!path) return false;
  return existsSync(path);
}

function homePath(...parts: string[]): string {
  return join(homedir(), ...parts);
}

function configPath(...parts: string[]): string {
  return join(xdgConfigHome(), ...parts);
}

function createCanonicalTarget(name: string): AgentTarget {
  return {
    name,
    isGlobal: false,
    getPath: () => null,
    getDir: () => null,
  };
}

function createPathTarget(
  name: string,
  isGlobal: boolean,
  getBasePath: (cwd: string) => string,
  isAvailable?: (cwd: string) => boolean
): AgentTarget {
  return {
    name,
    isGlobal,
    isAvailable,
    getPath: (cwd: string, type: ContentType, itemName: string, extension?: string) => {
      const basePath = getBasePath(cwd);
      return join(basePath, typeDir(type), itemName + itemExt(type, extension));
    },
    getDir: (cwd: string, type: ContentType) => {
      const basePath = getBasePath(cwd);
      return join(basePath, typeDir(type));
    },
  };
}

function createProjectTarget(name: string, dirName: string): AgentTarget {
  return createPathTarget(
    name,
    false,
    (cwd) => join(cwd, dirName),
    (cwd) => pathExists(join(cwd, dirName))
  );
}

function createGlobalTarget(
  name: string,
  getBasePath: () => string,
  isAvailable: () => boolean
): AgentTarget {
  return createPathTarget(
    name,
    true,
    () => getBasePath(),
    () => isAvailable()
  );
}

function resolveOpenClawHome(): string | null {
  const candidates = ['.openclaw', '.clawdbot', '.moltbot'].map((dir) => homePath(dir));
  return candidates.find(pathExists) || null;
}

// Bare-path target gated by marker dir to avoid collision with source-repo skills/ dirs
function resolveOpenClawProjectDir(cwd: string): string | null {
  const candidates = ['.openclaw', '.clawdbot', '.moltbot'].map((dir) => join(cwd, dir));
  return candidates.find(pathExists) || null;
}

export const AGENTS: AgentTarget[] = [
  createPathTarget(
    'agentget (.agents/)',
    false,
    (cwd) => join(cwd, '.agents'),
    () => true
  ),

  createCanonicalTarget('AMP'),
  createCanonicalTarget('Cline'),
  createCanonicalTarget('Codex'),
  createCanonicalTarget('Cursor'),
  createCanonicalTarget('Gemini CLI'),
  createCanonicalTarget('GitHub Copilot'),
  createCanonicalTarget('Kimi Code CLI'),
  createCanonicalTarget('OpenCode'),
  createCanonicalTarget('Replit'),
  createCanonicalTarget('Universal'),

  createProjectTarget('AdaL', '.adal'),
  createProjectTarget('Antigravity', '.agent'),
  createProjectTarget('Augment', '.augment'),
  createProjectTarget('Claude Code', '.claude'),
  createProjectTarget('CodeBuddy', '.codebuddy'),
  createProjectTarget('Command Code', '.commandcode'),
  createProjectTarget('Continue', '.continue'),
  createProjectTarget('Cortex Code', '.cortex'),
  createProjectTarget('Crush', '.crush'),
  createProjectTarget('Droid', '.factory'),
  createProjectTarget('Goose', '.goose'),
  createProjectTarget('iFlow CLI', '.iflow'),
  createProjectTarget('Junie', '.junie'),
  createProjectTarget('Kilo Code', '.kilocode'),
  createProjectTarget('Kiro CLI', '.kiro'),
  createProjectTarget('Kode', '.kode'),
  createProjectTarget('MCPJam', '.mcpjam'),
  createProjectTarget('Mistral Vibe', '.vibe'),
  createProjectTarget('Mux', '.mux'),
  createProjectTarget('Neovate', '.neovate'),
  createProjectTarget('OpenHands', '.openhands'),
  createProjectTarget('Pi', '.pi'),
  createProjectTarget('Pochi', '.pochi'),
  createProjectTarget('Qoder', '.qoder'),
  createProjectTarget('Qwen Code', '.qwen'),
  createProjectTarget('Roo Code', '.roo'),
  createProjectTarget('Trae', '.trae'),
  createProjectTarget('Trae CN', '.trae'), // shares .trae/ with Trae per official skills.sh
  createProjectTarget('Windsurf', '.windsurf'),
  createProjectTarget('Zencoder', '.zencoder'),

  createPathTarget(
    'OpenClaw',
    false,
    (cwd) => cwd,
    (cwd) => resolveOpenClawProjectDir(cwd) !== null
  ),

  createGlobalTarget(
    'AdaL (global)',
    () => homePath('.adal'),
    () => pathExists(homePath('.adal'))
  ),
  createGlobalTarget(
    'AMP (global)',
    () => configPath('agents'),
    () => pathExists(configPath('agents'))
  ),
  createGlobalTarget(
    'Antigravity (global)',
    () => homePath('.gemini', 'antigravity'),
    () => pathExists(homePath('.gemini', 'antigravity'))
  ),
  createGlobalTarget(
    'Augment (global)',
    () => homePath('.augment'),
    () => pathExists(homePath('.augment'))
  ),
  createGlobalTarget(
    'Claude Code (global)',
    () => process.env.CLAUDE_CONFIG_DIR || homePath('.claude'),
    () => Boolean(process.env.CLAUDE_CONFIG_DIR) || pathExists(homePath('.claude'))
  ),
  createGlobalTarget(
    'Cline (global)',
    () => homePath('.agents'),
    () => pathExists(homePath('.agents'))
  ),
  createGlobalTarget(
    'CodeBuddy (global)',
    () => homePath('.codebuddy'),
    () => pathExists(homePath('.codebuddy'))
  ),
  createGlobalTarget(
    'Codex (global)',
    () => process.env.CODEX_HOME || homePath('.codex'),
    () => Boolean(process.env.CODEX_HOME) || pathExists(homePath('.codex'))
  ),
  createGlobalTarget(
    'Command Code (global)',
    () => homePath('.commandcode'),
    () => pathExists(homePath('.commandcode'))
  ),
  createGlobalTarget(
    'Continue (global)',
    () => homePath('.continue'),
    () => pathExists(homePath('.continue'))
  ),
  createGlobalTarget(
    'Cortex Code (global)',
    () => homePath('.snowflake', 'cortex'),
    () => pathExists(homePath('.snowflake', 'cortex'))
  ),
  createGlobalTarget(
    'Crush (global)',
    () => configPath('crush'),
    () => pathExists(configPath('crush'))
  ),
  createGlobalTarget(
    'Cursor (global)',
    () => homePath('.cursor'),
    () => pathExists(homePath('.cursor'))
  ),
  createGlobalTarget(
    'Droid (global)',
    () => homePath('.factory'),
    () => pathExists(homePath('.factory'))
  ),
  createGlobalTarget(
    'Gemini CLI (global)',
    () => homePath('.gemini'),
    () => pathExists(homePath('.gemini'))
  ),
  createGlobalTarget(
    'GitHub Copilot (global)',
    () => homePath('.copilot'),
    () => pathExists(homePath('.copilot'))
  ),
  createGlobalTarget(
    'Goose (global)',
    () => configPath('goose'),
    () => pathExists(configPath('goose'))
  ),
  createGlobalTarget(
    'iFlow CLI (global)',
    () => homePath('.iflow'),
    () => pathExists(homePath('.iflow'))
  ),
  createGlobalTarget(
    'Junie (global)',
    () => homePath('.junie'),
    () => pathExists(homePath('.junie'))
  ),
  createGlobalTarget(
    'Kilo Code (global)',
    () => homePath('.kilocode'),
    () => pathExists(homePath('.kilocode'))
  ),
  createGlobalTarget(
    'Kimi Code CLI (global)',
    () => configPath('agents'),
    () => pathExists(configPath('agents'))
  ),
  createGlobalTarget(
    'Kiro CLI (global)',
    () => homePath('.kiro'),
    () => pathExists(homePath('.kiro'))
  ),
  createGlobalTarget(
    'Kode (global)',
    () => homePath('.kode'),
    () => pathExists(homePath('.kode'))
  ),
  createGlobalTarget(
    'MCPJam (global)',
    () => homePath('.mcpjam'),
    () => pathExists(homePath('.mcpjam'))
  ),
  createGlobalTarget(
    'Mistral Vibe (global)',
    () => homePath('.vibe'),
    () => pathExists(homePath('.vibe'))
  ),
  createGlobalTarget(
    'Mux (global)',
    () => homePath('.mux'),
    () => pathExists(homePath('.mux'))
  ),
  createGlobalTarget(
    'Neovate (global)',
    () => homePath('.neovate'),
    () => pathExists(homePath('.neovate'))
  ),
  createGlobalTarget(
    'OpenClaw (global)',
    () => resolveOpenClawHome() || homePath('.openclaw'),
    () => resolveOpenClawHome() !== null
  ),
  createGlobalTarget(
    'OpenCode (global)',
    () => configPath('opencode'),
    () => pathExists(configPath('opencode'))
  ),
  createGlobalTarget(
    'OpenHands (global)',
    () => homePath('.openhands'),
    () => pathExists(homePath('.openhands'))
  ),
  createGlobalTarget(
    'Pi (global)',
    () => homePath('.pi', 'agent'),
    () => pathExists(homePath('.pi', 'agent'))
  ),
  createGlobalTarget(
    'Pochi (global)',
    () => homePath('.pochi'),
    () => pathExists(homePath('.pochi'))
  ),
  createGlobalTarget(
    'Qoder (global)',
    () => homePath('.qoder'),
    () => pathExists(homePath('.qoder'))
  ),
  createGlobalTarget(
    'Qwen Code (global)',
    () => homePath('.qwen'),
    () => pathExists(homePath('.qwen'))
  ),
  createGlobalTarget(
    'Replit (global)',
    () => configPath('agents'),
    () => pathExists(configPath('agents'))
  ),
  createGlobalTarget(
    'Roo Code (global)',
    () => homePath('.roo'),
    () => pathExists(homePath('.roo'))
  ),
  createGlobalTarget(
    'Trae (global)',
    () => homePath('.trae'),
    () => pathExists(homePath('.trae'))
  ),
  createGlobalTarget(
    'Trae CN (global)',
    () => homePath('.trae-cn'),
    () => pathExists(homePath('.trae-cn'))
  ),
  createGlobalTarget(
    'Universal (global)',
    () => configPath('agents'),
    () => pathExists(configPath('agents'))
  ),
  createGlobalTarget(
    'Windsurf (global)',
    () => homePath('.codeium', 'windsurf'),
    () => pathExists(homePath('.codeium', 'windsurf'))
  ),
  createGlobalTarget(
    'Zencoder (global)',
    () => homePath('.zencoder'),
    () => pathExists(homePath('.zencoder'))
  ),
];
