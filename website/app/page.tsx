"use client";

import { useState } from "react";
import { AgentsDirectory } from "@/components/AgentsDirectory";
import { BuiltinAgents } from "@/components/BuiltinAgents";
import { DocsSection } from "@/components/DocsSection";
import { SiteHeader } from "@/components/SiteHeader";
import { SupportedTargetsMarquee } from "@/components/SupportedTargetsMarquee";
import agentsData from "@/public/agents-index.json";

const ASCII_ART = ` █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝`;

export default function Home() {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText("npx agentget add <owner/repo>");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      <SiteHeader active="home" />

      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 sm:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-start">
            <div className="w-[56ch] max-w-full">
              <pre className="text-[11px] sm:text-[12px] lg:text-[13px] leading-[120%] text-white select-none whitespace-pre font-mono font-bold drop-shadow-[0_0_1px_rgba(255,255,255,0.35)]">
                {ASCII_ART}
              </pre>

              <SupportedTargetsMarquee />
            </div>

            <div className="flex flex-col gap-6 min-w-0">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                  The AI Agents Package Manager
                </h1>
                <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed max-w-lg">
                  Install AI agents, instructions, skills, and rules from
                  GitHub repos into your project with a single command.
                </p>
              </div>

              <div
                className="group flex items-center gap-3 bg-neutral-900 border border-white/[0.08] rounded-xl px-5 py-3.5 w-fit cursor-pointer hover:border-white/[0.14] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none transition-colors"
                onClick={copyCommand}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && copyCommand()}
              >
                <code className="font-mono text-sm text-neutral-300 whitespace-nowrap">
                  <span className="text-neutral-600">$ </span>
                  npx agentget add &lt;owner/repo&gt;
                </code>
                <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors shrink-0">
                  {copied ? (
                    <svg
                      className="w-4 h-4 text-emerald-400"
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
                      className="w-4 h-4"
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
