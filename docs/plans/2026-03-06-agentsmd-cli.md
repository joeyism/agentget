# agentsmd CLI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build `npx agentsmd add <owner/repo>` — a CLI that clones a GitHub repo, discovers agents/instructions/skills, and installs them into `.agents/` (canonical) with symlinks into `.claude/`, `.cursor/`, and `~/.config/opencode/`.

**Architecture:** Source input is parsed into `{ owner, repo, subpath }`, the repo is shallow-cloned into a temp dir, content is discovered by scanning for `agents/*.agent.md`, `instructions/*.instructions.md`, `skills/*/SKILL.md`, and `plugins/*/` (expanded recursively). Each discovered item is copied to `.agents/{type}/` (canonical) and symlinked into each agent tool's directory.

**Tech Stack:** TypeScript, Node.js 22, `simple-git`, `commander`, `fs/promises`, `os`, `path`

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/cli.ts`
- Create: `bin/cli.mjs`
- Create: `.gitignore`

**Step 1: Initialize npm project**

```bash
cd /home/joeyism/Programming/node/agentsmd
npm init -y
```

**Step 2: Install dependencies**

```bash
npm install simple-git commander
npm install --save-dev typescript @types/node tsx
```

**Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true
  },
  "include": ["src"]
}
```

**Step 4: Write `bin/cli.mjs`**

```js
#!/usr/bin/env node
import('../dist/cli.js');
```

**Step 5: Write minimal `src/cli.ts`**

```typescript
import { Command } from 'commander';

const program = new Command();

program
  .name('agentsmd')
  .description('Install AI agents from GitHub repos')
  .version('0.1.0');

program
  .command('add <source>')
  .description('Install agents from a GitHub repo (e.g. owner/repo)')
  .action(async (source: string) => {
    console.log(`Adding from: ${source}`);
  });

program.parse();
```

**Step 6: Update `package.json`**

Set these fields:
```json
{
  "name": "agentsmd",
  "version": "0.1.0",
  "type": "module",
  "bin": { "agentsmd": "./bin/cli.mjs" },
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/cli.ts"
  },
  "files": ["dist", "bin"]
}
```

**Step 7: Add `.gitignore`**

```
node_modules/
dist/
*.js.map
```

**Step 8: Build and verify**

```bash
npm run build
node bin/cli.mjs add github/awesome-copilot
```

Expected output: `Adding from: github/awesome-copilot`

**Step 9: Commit**

```bash
git add .
git commit -m "feat: project scaffold with commander CLI"
```

---

### Task 2: Source parser

**Files:**
- Create: `src/source-parser.ts`

**What it does:** Converts `"owner/repo"`, `"owner/repo/subpath"`, or a full GitHub URL into `{ owner: string, repo: string, subpath?: string, url: string }`.

**Step 1: Write `src/source-parser.ts`**

```typescript
export interface ParsedSource {
  owner: string;
  repo: string;
  subpath?: string;
  cloneUrl: string;
}

export function parseSource(input: string): ParsedSource {
  // Full GitHub URL: https://github.com/owner/repo or https://github.com/owner/repo/tree/main/subpath
  const urlMatch = input.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/tree\/[^/]+\/(.+))?$/
  );
  if (urlMatch) {
    const [, owner, repo, subpath] = urlMatch;
    return {
      owner,
      repo,
      subpath,
      cloneUrl: `https://github.com/${owner}/${repo}.git`,
    };
  }

  // Shorthand: owner/repo or owner/repo/subpath
  const parts = input.split('/');
  if (parts.length < 2) {
    throw new Error(
      `Invalid source: "${input}". Expected format: owner/repo or owner/repo/subpath`
    );
  }
  const [owner, repo, ...rest] = parts;
  const subpath = rest.length > 0 ? rest.join('/') : undefined;
  return {
    owner,
    repo,
    subpath,
    cloneUrl: `https://github.com/${owner}/${repo}.git`,
  };
}
```

**Step 2: Build**

```bash
npm run build
```

Expected: No TypeScript errors.

**Step 3: Commit**

```bash
git add src/source-parser.ts
git commit -m "feat: add source parser for owner/repo and GitHub URLs"
```

---

### Task 3: Git clone utility

**Files:**
- Create: `src/git.ts`

**What it does:** Shallow-clones a repo into a temp directory. Returns the temp dir path. Caller is responsible for cleanup.

**Step 1: Write `src/git.ts`**

```typescript
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import simpleGit from 'simple-git';

export interface CloneResult {
  dir: string;
  cleanup: () => Promise<void>;
}

export async function cloneRepo(cloneUrl: string): Promise<CloneResult> {
  const dir = await mkdtemp(join(tmpdir(), 'agentsmd-'));
  try {
    const git = simpleGit();
    await git.clone(cloneUrl, dir, ['--depth', '1']);
  } catch (err) {
    await rm(dir, { recursive: true, force: true });
    throw new Error(`Failed to clone ${cloneUrl}: ${(err as Error).message}`);
  }
  return {
    dir,
    cleanup: () => rm(dir, { recursive: true, force: true }),
  };
}
```

**Step 2: Build**

```bash
npm run build
```

Expected: No TypeScript errors.

**Step 3: Commit**

```bash
git add src/git.ts
git commit -m "feat: add shallow git clone utility"
```

---

### Task 4: Content discovery

**Files:**
- Create: `src/discover.ts`

**What it does:** Given a cloned repo directory (and optional subpath), scans for installable content. Returns a structured list of items ready to install.

**Detected patterns:**
- `agents/*.agent.md` → type: `agent`, name from filename (strip `.agent.md`)
- `instructions/*.instructions.md` → type: `instruction`, name from filename (strip `.instructions.md`)
- `skills/*/` (folder containing `SKILL.md`) → type: `skill`, name from folder name
- `plugins/*/agents/*.md` → type: `agent`
- `plugins/*/instructions/*.instructions.md` → type: `instruction`
- `plugins/*/skills/*/` (folder with `SKILL.md`) → type: `skill`

**Step 1: Write `src/discover.ts`**

```typescript
import { readdir, stat } from 'fs/promises';
import { join, basename } from 'path';

export type ContentType = 'agent' | 'instruction' | 'skill';

export interface DiscoveredItem {
  type: ContentType;
  name: string;      // e.g. "4.1-Beast", "a11y", "add-educational-comments"
  sourcePath: string; // absolute path to file or folder in cloned repo
}

export async function discoverContent(
  repoDir: string,
  subpath?: string
): Promise<DiscoveredItem[]> {
  const root = subpath ? join(repoDir, subpath) : repoDir;
  const items: DiscoveredItem[] = [];

  await scanAgents(join(root, 'agents'), items);
  await scanInstructions(join(root, 'instructions'), items);
  await scanSkills(join(root, 'skills'), items);
  await scanPlugins(join(root, 'plugins'), items);

  if (items.length === 0) {
    throw new Error(
      'No installable content found. Expected agents/, instructions/, or skills/ directories.'
    );
  }

  return items;
}

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function scanAgents(dir: string, items: DiscoveredItem[]): Promise<void> {
  if (!(await exists(dir))) return;
  const entries = await readdir(dir);
  for (const entry of entries) {
    if (entry.endsWith('.agent.md')) {
      items.push({
        type: 'agent',
        name: entry.replace(/\.agent\.md$/, ''),
        sourcePath: join(dir, entry),
      });
    } else if (entry.endsWith('.md')) {
      // plugins/*/agents/ uses plain .md
      items.push({
        type: 'agent',
        name: entry.replace(/\.md$/, ''),
        sourcePath: join(dir, entry),
      });
    }
  }
}

async function scanInstructions(dir: string, items: DiscoveredItem[]): Promise<void> {
  if (!(await exists(dir))) return;
  const entries = await readdir(dir);
  for (const entry of entries) {
    if (entry.endsWith('.instructions.md')) {
      items.push({
        type: 'instruction',
        name: entry.replace(/\.instructions\.md$/, ''),
        sourcePath: join(dir, entry),
      });
    }
  }
}

async function scanSkills(dir: string, items: DiscoveredItem[]): Promise<void> {
  if (!(await exists(dir))) return;
  const entries = await readdir(dir);
  for (const entry of entries) {
    const skillDir = join(dir, entry);
    const skillFile = join(skillDir, 'SKILL.md');
    if (await exists(skillFile)) {
      items.push({
        type: 'skill',
        name: entry,
        sourcePath: skillDir,
      });
    }
  }
}

async function scanPlugins(dir: string, items: DiscoveredItem[]): Promise<void> {
  if (!(await exists(dir))) return;
  const plugins = await readdir(dir);
  for (const plugin of plugins) {
    const pluginDir = join(dir, plugin);
    await scanAgents(join(pluginDir, 'agents'), items);
    await scanInstructions(join(pluginDir, 'instructions'), items);
    await scanSkills(join(pluginDir, 'skills'), items);
  }
}
```

**Step 2: Build**

```bash
npm run build
```

Expected: No TypeScript errors.

**Step 3: Commit**

```bash
git add src/discover.ts
git commit -m "feat: add content discovery (agents, instructions, skills, plugins)"
```

---

### Task 5: Agent registry

**Files:**
- Create: `src/agents.ts`

**What it does:** Defines the target paths for each supported agent tool.

**Step 1: Write `src/agents.ts`**

```typescript
import { homedir } from 'os';
import { join } from 'path';

export type ContentType = 'agent' | 'instruction' | 'skill';

export interface AgentTarget {
  name: string;
  // Returns the path where this content type should be symlinked/installed
  // Returns null if this agent reads from canonical directly (no symlink needed)
  getPath: (cwd: string, type: ContentType, name: string) => string | null;
  isGlobal: boolean; // if true, path is absolute (global); if false, relative to cwd
}

function typeDir(type: ContentType): string {
  if (type === 'agent') return 'agents';
  if (type === 'instruction') return 'instructions';
  return 'skills';
}

export const AGENTS: AgentTarget[] = [
  {
    name: 'Claude Code',
    isGlobal: false,
    getPath: (cwd, type, name) => {
      const ext = type === 'skill' ? '' : type === 'agent' ? '.agent.md' : '.instructions.md';
      return join(cwd, '.claude', typeDir(type), name + ext);
    },
  },
  {
    name: 'Cursor',
    isGlobal: false,
    getPath: (cwd, type, name) => {
      const ext = type === 'skill' ? '' : type === 'agent' ? '.agent.md' : '.instructions.md';
      return join(cwd, '.cursor', typeDir(type), name + ext);
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
    getPath: (_cwd, type, name) => {
      const ext = type === 'skill' ? '' : type === 'agent' ? '.agent.md' : '.instructions.md';
      return join(homedir(), '.config', 'opencode', typeDir(type), name + ext);
    },
  },
];
```

**Step 2: Build**

```bash
npm run build
```

Expected: No TypeScript errors.

**Step 3: Commit**

```bash
git add src/agents.ts
git commit -m "feat: add agent registry with Claude Code, Cursor, and OpenCode paths"
```

---

### Task 6: Installer

**Files:**
- Create: `src/install.ts`

**What it does:** For each discovered item:
1. Copy to canonical `.agents/{type}/{name}` (file or folder)
2. Create symlinks in each agent tool's directory

**Step 1: Write `src/install.ts`**

```typescript
import { mkdir, copyFile, symlink, rm, readdir, stat } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { platform } from 'os';
import type { DiscoveredItem, ContentType } from './discover.js';
import { AGENTS } from './agents.js';

export interface InstallResult {
  item: DiscoveredItem;
  canonicalPath: string;
  symlinks: string[];
}

export function getCanonicalPath(cwd: string, item: DiscoveredItem): string {
  const dir = typeDir(item.type);
  const ext = itemExt(item.type);
  return join(cwd, '.agents', dir, item.name + ext);
}

function typeDir(type: ContentType): string {
  if (type === 'agent') return 'agents';
  if (type === 'instruction') return 'instructions';
  return 'skills';
}

function itemExt(type: ContentType): string {
  if (type === 'agent') return '.agent.md';
  if (type === 'instruction') return '.instructions.md';
  return ''; // skills are folders
}

async function copyItem(src: string, dest: string): Promise<void> {
  const s = await stat(src);
  if (s.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);
    for (const entry of entries) {
      await copyItem(join(src, entry), join(dest, entry));
    }
  } else {
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(src, dest);
  }
}

async function createSymlink(target: string, linkPath: string): Promise<void> {
  await mkdir(dirname(linkPath), { recursive: true });

  // Remove existing symlink if present
  try {
    await rm(linkPath, { recursive: true, force: true });
  } catch {
    // ignore
  }

  const rel = relative(dirname(linkPath), target);
  const symlinkType = platform() === 'win32' ? 'junction' : undefined;
  await symlink(rel, linkPath, symlinkType);
}

export async function installItem(
  item: DiscoveredItem,
  cwd: string
): Promise<InstallResult> {
  const canonicalPath = getCanonicalPath(cwd, item);

  // Copy to canonical
  await copyItem(item.sourcePath, canonicalPath);

  // Create symlinks for each agent tool
  const symlinks: string[] = [];
  for (const agent of AGENTS) {
    const linkPath = agent.getPath(cwd, item.type, item.name);
    if (linkPath === null) continue; // OpenCode project-local reads canonical directly

    await createSymlink(canonicalPath, linkPath);
    symlinks.push(linkPath);
  }

  return { item, canonicalPath, symlinks };
}

export async function installAll(
  items: DiscoveredItem[],
  cwd: string
): Promise<InstallResult[]> {
  const results: InstallResult[] = [];
  for (const item of items) {
    const result = await installItem(item, cwd);
    results.push(result);
  }
  return results;
}
```

**Step 2: Build**

```bash
npm run build
```

Expected: No TypeScript errors.

**Step 3: Commit**

```bash
git add src/install.ts
git commit -m "feat: add installer with canonical copy and symlinks"
```

---

### Task 7: Wire up the `add` command

**Files:**
- Create: `src/add.ts`
- Modify: `src/cli.ts`

**Step 1: Write `src/add.ts`**

```typescript
import { parseSource } from './source-parser.js';
import { cloneRepo } from './git.js';
import { discoverContent } from './discover.js';
import { installAll } from './install.js';

export async function add(source: string): Promise<void> {
  console.log(`Fetching ${source}...`);

  const parsed = parseSource(source);
  const { dir, cleanup } = await cloneRepo(parsed.cloneUrl);

  try {
    console.log(`Discovering content...`);
    const items = await discoverContent(dir, parsed.subpath);

    console.log(`Found ${items.length} item(s):`);
    for (const item of items) {
      console.log(`  ${item.type}: ${item.name}`);
    }

    console.log(`\nInstalling...`);
    const cwd = process.cwd();
    const results = await installAll(items, cwd);

    console.log(`\n✓ Installed ${results.length} item(s):`);
    for (const result of results) {
      console.log(`  ${result.item.type}: ${result.item.name}`);
      console.log(`    canonical: ${result.canonicalPath}`);
      for (const link of result.symlinks) {
        console.log(`    symlink:   ${link}`);
      }
    }
  } finally {
    await cleanup();
  }
}
```

**Step 2: Update `src/cli.ts`**

```typescript
import { Command } from 'commander';
import { add } from './add.js';

const program = new Command();

program
  .name('agentsmd')
  .description('Install AI agents from GitHub repos')
  .version('0.1.0');

program
  .command('add <source>')
  .description('Install agents from a GitHub repo (e.g. owner/repo or owner/repo/subpath)')
  .action(async (source: string) => {
    try {
      await add(source);
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
```

**Step 3: Build**

```bash
npm run build
```

Expected: No TypeScript errors.

**Step 4: Smoke test — run end to end**

```bash
mkdir -p /tmp/agentsmd-test && cd /tmp/agentsmd-test
node /home/joeyism/Programming/node/agentsmd/bin/cli.mjs add github/awesome-copilot
```

Expected:
```
Fetching github/awesome-copilot...
Discovering content...
Found N item(s):
  agent: 4.1-Beast
  instruction: a11y
  skill: add-educational-comments
  ...

Installing...
✓ Installed N item(s):
  agent: 4.1-Beast
    canonical: /tmp/agentsmd-test/.agents/agents/4.1-Beast.agent.md
    symlink:   /tmp/agentsmd-test/.claude/agents/4.1-Beast.agent.md
    symlink:   /tmp/agentsmd-test/.cursor/agents/4.1-Beast.agent.md
    symlink:   /home/joeyism/.config/opencode/agents/4.1-Beast.agent.md
  ...
```

**Step 5: Commit**

```bash
cd /home/joeyism/Programming/node/agentsmd
git add src/add.ts src/cli.ts
git commit -m "feat: wire up add command end to end"
```

---

### Task 8: README

**Files:**
- Create: `README.md`

**Step 1: Write `README.md`**

```markdown
# agentsmd

Install AI agents, instructions, and skills from GitHub repos into your project.

## Usage

\`\`\`bash
npx agentsmd add owner/repo
npx agentsmd add github/awesome-copilot
npx agentsmd add owner/repo/subpath
\`\`\`

## What it installs

Content is discovered from these patterns in the target repo:

| Type | Pattern |
|---|---|
| Agents | `agents/*.agent.md` |
| Instructions | `instructions/*.instructions.md` |
| Skills | `skills/*/SKILL.md` (whole folder) |
| Plugins | `plugins/*/` (expanded recursively) |

## Where files go

**Canonical (source of truth):**
\`\`\`
.agents/agents/<name>.agent.md
.agents/instructions/<name>.instructions.md
.agents/skills/<name>/
\`\`\`

**Symlinked into agent tools:**

| Tool | Path |
|---|---|
| Claude Code | `.claude/{agents,instructions,skills}/` |
| Cursor | `.cursor/{agents,instructions,skills}/` |
| OpenCode (project) | reads `.agents/` directly |
| OpenCode (global) | `~/.config/opencode/{agents,instructions,skills}/` |
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README"
```
