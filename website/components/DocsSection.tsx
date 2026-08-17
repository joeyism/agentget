import Link from "next/link";

import supportedTargets from "@/public/supported-targets.json";
import {
  basicUsageLines,
  canonicalReaders,
  cliHintLines,
  filteringFlags,
  globalTargets,
  installationLines,
  projectTargets,
  whatItInstalls,
  type CodeLine,
} from "@/lib/docs-section-data";

const totalTools = (supportedTargets as Array<{ name: string }>).length;

function CodeBlock({ lines }: { lines: CodeLine[] }) {
  return (
    <pre className="bg-neutral-900 border border-white/[0.06] text-neutral-100 rounded-lg p-4 overflow-x-auto font-mono text-sm leading-relaxed">
      <code>
        {lines.map((line, i) => (
          <span key={i}>
            {i > 0 && "\n"}
            {line.type === "comment" ? (
              <span className="text-neutral-500">{line.text}</span>
            ) : (
              line.text
            )}
          </span>
        ))}
      </code>
    </pre>
  );
}

function zebraRowClass(index: number) {
  return `${index % 2 === 0 ? "bg-white/[0.02]" : ""} hover:bg-white/[0.04] transition-colors`;
}

export function DocsSection() {
  return (
    <section
      data-testid="docs-section"
      aria-labelledby="docs-section-title"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
    >
      {/* Section header */}
      <div className="mb-14">
        <h2
          id="docs-section-title"
          className="text-2xl sm:text-3xl font-bold tracking-tight"
        >
          Quick Reference
        </h2>
        <p className="mt-2 text-neutral-400 text-sm sm:text-base">
          Essential agentget commands and configuration
        </p>
      </div>

      <div className="space-y-14">
        {/* ── Installation ── */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200">
            Installation
          </h3>
          <CodeBlock lines={installationLines} />
        </div>

        {/* ── Basic Usage ── */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200">
            Basic Usage
          </h3>
          <CodeBlock lines={basicUsageLines} />
        </div>

        {/* ── Filtering Flags ── */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200">
            Filtering Flags
          </h3>
          <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Filtering flags and their install behavior
              </caption>
              <thead>
                <tr className="bg-neutral-900 text-left">
                  <th scope="col" className="px-4 py-3 font-medium text-neutral-400 whitespace-nowrap">
                    Flag
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium text-neutral-400">
                    Behavior
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteringFlags.map(({ flag, behavior }, i) => (
                  <tr key={flag} className={zebraRowClass(i)}>
                    <td className="px-4 py-2.5 font-mono text-emerald-400 whitespace-nowrap">
                      {flag}
                    </td>
                    <td className="px-4 py-2.5 text-neutral-300">{behavior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Where Files Go ── */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200">
            Where Files Go
          </h3>

          <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
            agentget supports <span className="text-white font-medium">{totalTools} AI coding tools</span>.
            Content is written to a canonical location, then symlinked to detected tool directories.
          </p>

          {/* Supported vs Detected explanation */}
          <div className="bg-neutral-900/50 border border-white/[0.06] rounded-lg p-4 mb-6 space-y-2">
            <p className="text-sm text-neutral-300">
              <span className="text-emerald-400 font-medium">Supported</span>{" "}
              — all {totalTools} tools agentget knows how to install into
            </p>
            <p className="text-sm text-neutral-300">
              <span className="text-emerald-400 font-medium">Detected</span>{" "}
              — the subset whose config directories exist on your machine now. Only these receive symlinks.
            </p>
            <p className="text-sm text-neutral-300">
              <span className="text-emerald-400 font-medium">Canonical</span>{" "}
              — {canonicalReaders.length} tools that read <code className="text-neutral-400 bg-neutral-800 px-1 rounded">.agents/</code> directly. Always active, no symlink needed.
            </p>
          </div>

          <p className="text-sm text-neutral-500 mb-3">
            Canonical paths (source of truth):
          </p>
          <pre className="bg-neutral-900 border border-white/[0.06] text-neutral-100 rounded-lg p-4 overflow-x-auto font-mono text-sm leading-relaxed mb-6">
            <code>
              {`.agents/agents/<name>.agent.md
.agents/instructions/<name>.instructions.md
.agents/skills/<name>/
.agents/rules/<name>.rules.md`}
            </code>
          </pre>

          {/* Canonical readers */}
          <p className="text-sm text-neutral-500 mb-3">
            Canonical readers (always active — read <code className="text-neutral-400 bg-neutral-800 px-1 rounded">.agents/</code> directly):
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {canonicalReaders.map((name) => (
              <span
                key={name}
                className="inline-block px-2.5 py-1 text-xs font-mono text-neutral-300 bg-neutral-800/60 border border-white/[0.06] rounded-md"
              >
                {name}
              </span>
            ))}
          </div>

          {/* Project targets (collapsible) */}
          <details className="group mb-4">
            <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-300 transition-colors mb-3 list-none flex items-center gap-2">
              <span className="text-neutral-600 group-open:rotate-90 transition-transform inline-block">&#9654;</span>
              Project targets ({projectTargets.length} tools) — symlinked when detected
            </summary>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06] mt-2">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Project target tools and their symlink paths
                </caption>
                <thead>
                  <tr className="bg-neutral-900 text-left">
                    <th scope="col" className="px-4 py-3 font-medium text-neutral-400">
                      Tool
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium text-neutral-400">
                      Path
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {projectTargets.map(({ tool, path }, i) => (
                    <tr key={tool} className={zebraRowClass(i)}>
                      <td className="px-4 py-2 text-neutral-300 whitespace-nowrap">
                        {tool}
                      </td>
                      <td className="px-4 py-2 font-mono text-neutral-400">
                        {path}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {/* Global targets (collapsible) */}
          <details className="group mb-6">
            <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-300 transition-colors mb-3 list-none flex items-center gap-2">
              <span className="text-neutral-600 group-open:rotate-90 transition-transform inline-block">&#9654;</span>
              Global targets ({totalTools} tools) — symlinked when config directory exists
            </summary>
            <p className="text-xs text-neutral-600 mb-2 mt-2">
              Only created when the tool&apos;s home directory exists or an env var points to it.
            </p>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06] mt-2">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Global target tools and their config paths
                </caption>
                <thead>
                  <tr className="bg-neutral-900 text-left">
                    <th scope="col" className="px-4 py-3 font-medium text-neutral-400">
                      Tool
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium text-neutral-400">
                      Global path
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {globalTargets.map(({ tool, path }, i) => (
                    <tr key={tool} className={zebraRowClass(i)}>
                      <td className="px-4 py-2 text-neutral-300 whitespace-nowrap">
                        {tool}
                      </td>
                      <td className="px-4 py-2 font-mono text-neutral-400">
                        {path}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {/* CLI hint */}
          <CodeBlock lines={cliHintLines} />
        </div>

        {/* ── What It Installs ── */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200">
            What It Installs
          </h3>
          <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Content types and the file patterns agentget installs
              </caption>
              <thead>
                <tr className="bg-neutral-900 text-left">
                  <th scope="col" className="px-4 py-3 font-medium text-neutral-400">
                    Type
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium text-neutral-400">
                    Pattern
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {whatItInstalls.map(({ type, pattern }, i) => (
                  <tr key={type} className={zebraRowClass(i)}>
                    <td className="px-4 py-2.5 text-neutral-300 font-medium whitespace-nowrap">
                      {type}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-neutral-400">
                      {pattern}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-14 pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors group"
        >
          View builtin agent docs
          <span className="inline-block transition-transform group-hover:translate-x-0.5">
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
