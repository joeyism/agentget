import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { simpleGit } from 'simple-git';

export interface CloneResult {
  dir: string;
  cleanup: () => Promise<void>;
}

export async function cloneRepo(cloneUrl: string): Promise<CloneResult> {
  const dir = await mkdtemp(join(tmpdir(), 'agentget-'));
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
