"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface Agent {
  key: string;
  name: string;
  repo: string;
  owner: string;
  shortDescription: string;
  hasSkills: boolean;
  hasInstructions: boolean;
  installCommand: string;
  url: string;
}

const PAGE_SIZE = 50;

export function AgentsDirectory({ agents }: { agents: Agent[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(
    () => [...agents].sort((a, b) => a.name.localeCompare(b.name)),
    [agents]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.repo.toLowerCase().includes(q) ||
        a.shortDescription.toLowerCase().includes(q)
    );
  }, [search, sorted]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName
        )
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const copyInstall = async (cmd: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      void 0;
    }
  };

  return (
    <section
      data-testid="agents-directory"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
    >
      {/* ── Heading ── */}
      <div className="flex items-baseline gap-3 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Agents Directory
        </h2>
        <span className="inline-flex items-center bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium px-2.5 py-1 rounded-full ring-1 ring-emerald-500/20">
          {agents.length.toLocaleString()}
        </span>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-6">
        {/* Magnifying glass */}
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>

        <input
          ref={searchRef}
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="agents-search"
          className="w-full bg-neutral-900/60 border border-white/[0.08] rounded-lg pl-10 pr-14 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400/30 transition-all"
        />

        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-600 bg-neutral-800/80 border border-neutral-700/60 px-1.5 py-0.5 rounded font-mono leading-none select-none">
          /
        </kbd>
      </div>

      {/* ── Table header ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 text-[11px] uppercase tracking-wider text-neutral-600 font-medium border-b border-white/[0.08] select-none">
        <span className="w-10 shrink-0 text-right">#</span>
        <span className="w-44 sm:w-48 shrink-0">Agent</span>
        <span className="w-40 shrink-0 hidden sm:block">Repo</span>
        <span className="flex-1 min-w-0 hidden md:block">Description</span>
        <span className="w-32 shrink-0 text-right hidden sm:block">
          Badges
        </span>
      </div>

      {/* ── Rows ── */}
      <div data-testid="agents-table-body" role="list">
        {rows.map((agent, i) => {
          const globalIdx = (page - 1) * PAGE_SIZE + i;
          const isCopied = copiedIdx === globalIdx;

          return (
            <div
              key={agent.key}
              role="listitem"
              data-testid="agent-row"
              className="group relative flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
            >
              {/* Rank */}
              <span className="w-10 shrink-0 text-right text-neutral-600 text-sm font-mono tabular-nums">
                {globalIdx + 1}
              </span>

              {/* Name */}
              <div className="w-44 sm:w-48 shrink-0 min-w-0">
                <a
                  href={agent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sm text-neutral-200 hover:text-white transition-colors truncate block"
                >
                  {agent.name}
                </a>
              </div>

              {/* Repo */}
              <span className="w-40 shrink-0 text-neutral-500 text-xs font-mono truncate hidden sm:block">
                {agent.repo}
              </span>

              {/* Description */}
              <p className="flex-1 min-w-0 text-neutral-500 text-sm truncate hidden md:block">
                {agent.shortDescription}
              </p>

              {/* Badges */}
              <div className="w-32 shrink-0 flex items-center justify-end gap-2.5 hidden sm:flex">
                {agent.hasSkills && (
                  <span className="text-[11px] text-emerald-400/70 font-mono whitespace-nowrap">
                    ✓ skills
                  </span>
                )}
                {agent.hasInstructions && (
                  <span className="text-[11px] text-emerald-400/70 font-mono whitespace-nowrap">
                    ✓ instructions
                  </span>
                )}
              </div>

              {/* ── Hover overlay: install command ── */}
              <div className="absolute inset-0 items-center gap-3 px-4 bg-neutral-950/95 backdrop-blur-sm border-b border-white/[0.04] hidden group-hover:flex">
                <span className="w-10 shrink-0 text-right text-neutral-600 text-sm font-mono tabular-nums">
                  {globalIdx + 1}
                </span>
                <code className="text-xs text-neutral-400 font-mono truncate flex-1 min-w-0">
                  <span className="text-neutral-600">$ </span>
                  {agent.installCommand}
                </code>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyInstall(agent.installCommand, globalIdx);
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono px-3 py-1.5 rounded-md ring-1 ring-white/[0.06] transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <svg
                        className="w-3.5 h-3.5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <polyline
                          points="20 6 9 17 4 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-neutral-600 text-sm">
          No agents found for &ldquo;{search}&rdquo;
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between mt-6 pt-5"
          data-testid="pagination"
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            data-testid="prev-page"
            className="text-sm font-mono text-neutral-400 hover:text-white disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-md hover:bg-white/[0.04] disabled:hover:bg-transparent"
          >
            &larr; Previous
          </button>

          <span
            className="text-sm text-neutral-600 font-mono tabular-nums"
            data-testid="page-indicator"
          >
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            data-testid="next-page"
            className="text-sm font-mono text-neutral-400 hover:text-white disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-md hover:bg-white/[0.04] disabled:hover:bg-transparent"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* ── Search result count ── */}
      {search.trim() && filtered.length > 0 && (
        <p className="mt-3 text-xs text-neutral-600 font-mono text-center">
          {filtered.length.toLocaleString()} result
          {filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
        </p>
      )}
    </section>
  );
}
