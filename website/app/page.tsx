"use client";

import { CSSProperties, useState } from "react";
import Image from "next/image";
import { AgentsDirectory } from "@/components/AgentsDirectory";
import { BuiltinAgents } from "@/components/BuiltinAgents";
import { DocsSection } from "@/components/DocsSection";
import agentsData from "@/public/agents-index.json";

const WORDMARK_LAYERS: CSSProperties[] = [
  {
    color: "rgba(245, 245, 245, 0.22)",
    transform: "translate(10px, 10px)",
    WebkitTextStroke: "1px rgba(255,255,255,0.16)",
  },
  {
    color: "rgba(212, 212, 212, 0.34)",
    transform: "translate(5px, 5px)",
    WebkitTextStroke: "1px rgba(255,255,255,0.20)",
  },
];

const COMMAND = "npx agentget add <owner/repo>";

const AGENT_ITEMS = [
  {
    href: "https://claude.ai",
    src: "/agents/claude-code.svg",
    alt: "Claude Code",
  },
  {
    href: "https://cursor.sh",
    src: "/agents/cursor.svg",
    alt: "Cursor",
  },
  {
    href: "https://opencode.ai",
    src: "/agents/opencode.svg",
    alt: "OpenCode",
  },
];

export default function Home() {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
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
            <span className="font-semibold tracking-tight">agentget</span>
          </div>

          <nav className="flex items-center gap-5 text-sm text-neutral-400">
            <a
              href="https://github.com/joeyism/agentget"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/agentget"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              npm
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-10 sm:pb-12">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.16fr)_minmax(340px,0.9fr)] xl:gap-12 min-h-[calc(100vh-3.5rem)]">
              <div className="flex min-w-0 flex-col justify-between gap-8">
                <div className="min-w-0">
                  <div className="relative inline-flex max-w-full flex-col">
                    <div className="relative inline-block max-w-full">
                      {WORDMARK_LAYERS.map((style, index) => (
                        <span
                          key={index}
                          aria-hidden="true"
                          style={style}
                          className="pointer-events-none absolute left-0 top-0 font-mono text-[clamp(3.5rem,12vw,9.2rem)] font-black uppercase leading-[0.82] tracking-[-0.12em] text-nowrap"
                        >
                          AGENTGET
                        </span>
                      ))}
                      <span
                        className="relative block font-mono text-[clamp(3.5rem,12vw,9.2rem)] font-black uppercase leading-[0.82] tracking-[-0.12em] text-neutral-300 text-nowrap"
                        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}
                      >
                        AGENTGET
                      </span>
                    </div>
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.42em] text-neutral-400 sm:text-sm">
                      The AI agents package manager
                    </p>
                  </div>
                </div>

                <div className="max-w-xl">
                  <p className="mb-4 font-mono text-sm uppercase tracking-[0.18em] text-neutral-200 sm:text-[15px]">
                    Try it now
                  </p>
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-neutral-950 px-5 py-3.5 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-colors hover:border-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    onClick={copyCommand}
                  >
                    <code className="font-mono text-sm text-neutral-300 sm:text-[15px]">
                      <span className="text-neutral-600">$ </span>
                      {COMMAND}
                    </code>
                    <span className="shrink-0 text-neutral-600 transition-colors group-hover:text-neutral-400">
                      {copied ? (
                        <svg
                          className="h-5 w-5 text-emerald-400"
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
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex min-w-0 flex-col justify-between gap-8 xl:pt-2">
                <div>
                  <div className="mb-4 h-px w-16 bg-white/10" />
                  <p className="max-w-xl text-[clamp(1.8rem,3.8vw,2.9rem)] font-medium leading-[1.04] tracking-tight text-neutral-100">
                    Install AI agents, instructions, skills, and rules from
                    GitHub repos into your project with a single command.
                  </p>
                </div>

                <div>
                  <p className="mb-4 font-mono text-sm uppercase tracking-[0.18em] text-neutral-200 sm:text-[15px]">
                    Available for these agents
                  </p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-5 sm:gap-x-10">
                    {AGENT_ITEMS.map((agent) => (
                      <a
                        key={agent.alt}
                        href={agent.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center opacity-80 transition-opacity hover:opacity-100"
                      >
                        <Image
                          src={agent.src}
                          alt={agent.alt}
                          width={48}
                          height={48}
                          className="rounded-lg grayscale transition-all group-hover:grayscale-0"
                        />
                      </a>
                    ))}
                    <span className="h-10 w-px bg-white/6" aria-hidden="true" />
                  </div>
                  <p className="mt-8 max-w-md font-mono text-xs uppercase tracking-[0.34em] text-neutral-500 sm:text-sm">
                    Pull agents straight into your repo without leaving the
                    terminal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06]">
          <AgentsDirectory agents={agentsData} />
        </section>

        <section data-testid="builtin-agents-section" className="border-t border-white/[0.06]">
          <BuiltinAgents />
        </section>

        <section data-testid="docs-section" className="border-t border-white/[0.06]">
          <DocsSection />
        </section>
      </main>
    </>
  );
}
