"use client";

import Link from "next/link";

import { AGENT_SUBMISSION_URL } from "@/lib/github";

type ActiveTab = "home" | "docs" | "audits";

export interface SiteHeaderProps {
  active?: ActiveTab;
  currentPath?: string;
}

export function SiteHeader({ active, currentPath }: SiteHeaderProps) {
  const resolvedActive =
    active ??
    (currentPath?.startsWith("/docs")
      ? "docs"
      : currentPath === "/audits"
        ? "audits"
        : "home");

  const navLinkClass = (isActive: boolean) =>
    isActive
      ? "text-white"
      : "text-neutral-400 hover:text-white transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-white/[0.06]">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-emerald-400 font-mono font-bold text-sm select-none">
            &gt;_
          </span>
          <svg
            className="h-4 w-[7px] text-neutral-700"
            viewBox="0 0 7 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="6" y1="1" x2="1" y2="15" />
          </svg>
          <Link href="/" className="font-semibold tracking-tight truncate">
            agentget
          </Link>
        </div>

        <nav className="flex items-center gap-4 sm:gap-5 text-sm whitespace-nowrap">
          <Link href="/" className={navLinkClass(resolvedActive === "home")}>
            Home
          </Link>
          <Link href="/docs" className={navLinkClass(resolvedActive === "docs")}>
            Docs
          </Link>
          <Link
            href="/audits"
            className={navLinkClass(resolvedActive === "audits")}
          >
            Audits
          </Link>
          <a
            href={AGENT_SUBMISSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-300 transition-colors hover:border-emerald-300/40 hover:bg-emerald-400/15 hover:text-emerald-200"
          >
            Submit Agent
          </a>
          <a
            href="https://github.com/joeyism/agentget"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/agentget"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            npm
          </a>
        </nav>
      </div>
    </header>
  );
}
