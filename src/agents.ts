import { homedir } from 'os';
import { join } from 'path';

export type ContentType = 'agent' | 'instruction' | 'skill' | 'rule';

export interface AgentTarget {
  name: string;
  // Returns the path where this content type should be symlinked/installed
  // Returns null if this agent reads from canonical directly (no symlink needed)
  getPath: (cwd: string, type: ContentType, name: string, extension?: string) => string | null;
  isGlobal: boolean; // if true, path is absolute (global); if false, relative to cwd
}

function typeDir(type: ContentType): string {
  if (type === 'agent') return 'agents';
  if (type === 'instruction') return 'instructions';
  if (type === 'rule') return 'rules';
  return 'skills';
}

export const AGENTS: AgentTarget[] = [
  {
    name: 'Claude Code',
    isGlobal: false,
    getPath: (cwd: string, type: ContentType, name: string, ext?: string) => {
      const extension = ext || (type === 'skill' ? '' : type === 'agent' ? '.agent.md' : type === 'rule' ? '.rules.md' : '.instructions.md');
      return join(cwd, '.claude', typeDir(type), name + extension);
    },
  },
  {
    name: 'Cursor',
    isGlobal: false,
    getPath: (cwd: string, type: ContentType, name: string, ext?: string) => {
      const extension = ext || (type === 'skill' ? '' : type === 'agent' ? '.agent.md' : type === 'rule' ? '.rules.md' : '.instructions.md');
      return join(cwd, '.cursor', typeDir(type), name + extension);
    },
  },
  {
    name: 'OpenCode (project)',
    isGlobal: false,
    // OpenCode reads directly from .agents/ — no symlink needed
    getPath: () => null,
  },
  {
    name: 'OpenCode (global)',
    isGlobal: true,
    getPath: (_cwd: string, type: ContentType, name: string, ext?: string) => {
      const extension = ext || (type === 'skill' ? '' : type === 'agent' ? '.agent.md' : type === 'rule' ? '.rules.md' : '.instructions.md');
      return join(homedir(), '.config', 'opencode', typeDir(type), name + extension);
    },
  },
];
