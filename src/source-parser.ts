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
