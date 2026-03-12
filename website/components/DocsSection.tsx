import Link from "next/link";

export function DocsSection() {
  return (
    <div
      data-testid="docs-section"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
    >
      {/* Section header */}
      <div className="mb-14">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
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
          <pre className="bg-neutral-900 border border-white/[0.06] text-neutral-100 rounded-lg p-4 overflow-x-auto font-mono text-sm leading-relaxed">
            <code>
              <span className="text-neutral-500"># npm</span>
              {"\n"}npm install -g agentget{"\n"}
              {"\n"}
              <span className="text-neutral-500"># bun</span>
              {"\n"}bun add -g agentget{"\n"}
              {"\n"}
              <span className="text-neutral-500">
                # Or use without installing:
              </span>
              {"\n"}npx agentget add owner/repo{"\n"}bunx agentget add
              owner/repo
            </code>
          </pre>
        </div>

        {/* ── Basic Usage ── */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200">
            Basic Usage
          </h3>
          <pre className="bg-neutral-900 border border-white/[0.06] text-neutral-100 rounded-lg p-4 overflow-x-auto font-mono text-sm leading-relaxed">
            <code>
              <span className="text-neutral-500">
                # Install all agents (default)
              </span>
              {"\n"}npx agentget add owner/repo{"\n"}
              {"\n"}
              <span className="text-neutral-500">
                # Install everything (agents, skills, instructions, rules)
              </span>
              {"\n"}npx agentget add owner/repo --all{"\n"}
              {"\n"}
              <span className="text-neutral-500">
                # Install a specific agent + all skills/instructions/rules
              </span>
              {"\n"}npx agentget add owner/repo --agent code-reviewer{"\n"}
              {"\n"}
              <span className="text-neutral-500"># Install only skills</span>
              {"\n"}npx agentget add owner/repo --skills-only{"\n"}
              {"\n"}
              <span className="text-neutral-500">
                # Install specific agent only (no extras)
              </span>
              {"\n"}npx agentget add owner/repo --agent code-reviewer
              --agents-only
            </code>
          </pre>
        </div>

        {/* ── Filtering Flags ── */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200">
            Filtering Flags
          </h3>
          <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-900 text-left">
                  <th className="px-4 py-3 font-medium text-neutral-400 whitespace-nowrap">
                    Flag
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-400">
                    Behavior
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  ["(none)", "Installs agents only (default)"],
                  ["--all", "Installs everything"],
                  [
                    "--agent <name>",
                    "Installs specified agent + all skills/instructions/rules",
                  ],
                  ["--agents-only", "Installs agents only (explicit)"],
                  ["--skills-only", "Installs skills only"],
                  ["--instructions-only", "Installs instructions only"],
                  ["--rules-only", "Installs rules only"],
                ].map(([flag, behavior], i) => (
                  <tr
                    key={flag}
                    className={
                      `${i % 2 === 0 ? "bg-white/[0.02]" : ""} hover:bg-white/[0.04] transition-colors`
                    }
                  >
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
            agentget supports <span className="text-white font-medium">41 AI coding tools</span>.
            Content is written to a canonical location, then symlinked to detected tool directories.
          </p>

          {/* Supported vs Detected explanation */}
          <div className="bg-neutral-900/50 border border-white/[0.06] rounded-lg p-4 mb-6 space-y-2">
            <p className="text-sm text-neutral-300">
              <span className="text-emerald-400 font-medium">Supported</span>{" "}
              — all 41 tools agentget knows how to install into
            </p>
            <p className="text-sm text-neutral-300">
              <span className="text-emerald-400 font-medium">Detected</span>{" "}
              — the subset whose config directories exist on your machine now. Only these receive symlinks.
            </p>
            <p className="text-sm text-neutral-300">
              <span className="text-emerald-400 font-medium">Canonical</span>{" "}
              — 10 tools that read <code className="text-neutral-400 bg-neutral-800 px-1 rounded">.agents/</code> directly. Always active, no symlink needed.
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
            {[
              "AMP", "Cline", "Codex", "Cursor", "Gemini CLI",
              "GitHub Copilot", "Kimi Code CLI", "OpenCode", "Replit", "Universal",
            ].map((name) => (
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
              Project targets (31 tools) — symlinked when detected
            </summary>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06] mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-900 text-left">
                    <th className="px-4 py-3 font-medium text-neutral-400">
                      Tool
                    </th>
                    <th className="px-4 py-3 font-medium text-neutral-400">
                      Path
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {([
                    ["AdaL", ".adal/"],
                    ["Antigravity", ".agent/"],
                    ["Augment", ".augment/"],
                    ["Claude Code", ".claude/"],
                    ["CodeBuddy", ".codebuddy/"],
                    ["Command Code", ".commandcode/"],
                    ["Continue", ".continue/"],
                    ["Cortex Code", ".cortex/"],
                    ["Crush", ".crush/"],
                    ["Droid", ".factory/"],
                    ["Goose", ".goose/"],
                    ["iFlow CLI", ".iflow/"],
                    ["Junie", ".junie/"],
                    ["Kilo Code", ".kilocode/"],
                    ["Kiro CLI", ".kiro/"],
                    ["Kode", ".kode/"],
                    ["MCPJam", ".mcpjam/"],
                    ["Mistral Vibe", ".vibe/"],
                    ["Mux", ".mux/"],
                    ["Neovate", ".neovate/"],
                    ["OpenClaw", "* (marker-gated)"],
                    ["OpenHands", ".openhands/"],
                    ["Pi", ".pi/"],
                    ["Pochi", ".pochi/"],
                    ["Qoder", ".qoder/"],
                    ["Qwen Code", ".qwen/"],
                    ["Roo Code", ".roo/"],
                    ["Trae", ".trae/"],
                    ["Trae CN", ".trae/"],
                    ["Windsurf", ".windsurf/"],
                    ["Zencoder", ".zencoder/"],
                  ] as const).map(([tool, path], i) => (
                    <tr
                      key={tool}
                      className={
                        `${i % 2 === 0 ? "bg-white/[0.02]" : ""} hover:bg-white/[0.04] transition-colors`
                      }
                    >
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
              Global targets (41 tools) — symlinked when config directory exists
            </summary>
            <p className="text-xs text-neutral-600 mb-2 mt-2">
              Only created when the tool&apos;s home directory exists or an env var points to it.
            </p>
            <div className="overflow-x-auto rounded-lg border border-white/[0.06] mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-900 text-left">
                    <th className="px-4 py-3 font-medium text-neutral-400">
                      Tool
                    </th>
                    <th className="px-4 py-3 font-medium text-neutral-400">
                      Global path
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {([
                    ["AdaL", "~/.adal/"],
                    ["AMP / Kimi Code CLI / Replit / Universal", "~/.config/agents/"],
                    ["Antigravity", "~/.gemini/antigravity/"],
                    ["Augment", "~/.augment/"],
                    ["Claude Code", "${CLAUDE_CONFIG_DIR:-~/.claude}/"],
                    ["Cline", "~/.agents/"],
                    ["CodeBuddy", "~/.codebuddy/"],
                    ["Codex", "${CODEX_HOME:-~/.codex}/"],
                    ["Command Code", "~/.commandcode/"],
                    ["Continue", "~/.continue/"],
                    ["Cortex Code", "~/.snowflake/cortex/"],
                    ["Crush", "~/.config/crush/"],
                    ["Cursor", "~/.cursor/"],
                    ["Droid", "~/.factory/"],
                    ["Gemini CLI", "~/.gemini/"],
                    ["GitHub Copilot", "~/.copilot/"],
                    ["Goose", "~/.config/goose/"],
                    ["iFlow CLI", "~/.iflow/"],
                    ["Junie", "~/.junie/"],
                    ["Kilo Code", "~/.kilocode/"],
                    ["Kiro CLI", "~/.kiro/"],
                    ["Kode", "~/.kode/"],
                    ["MCPJam", "~/.mcpjam/"],
                    ["Mistral Vibe", "~/.vibe/"],
                    ["Mux", "~/.mux/"],
                    ["Neovate", "~/.neovate/"],
                    ["OpenClaw", "~/.openclaw/"],
                    ["OpenCode", "~/.config/opencode/"],
                    ["OpenHands", "~/.openhands/"],
                    ["Pi", "~/.pi/agent/"],
                    ["Pochi", "~/.pochi/"],
                    ["Qoder", "~/.qoder/"],
                    ["Qwen Code", "~/.qwen/"],
                    ["Roo Code", "~/.roo/"],
                    ["Trae", "~/.trae/"],
                    ["Trae CN", "~/.trae-cn/"],
                    ["Windsurf", "~/.codeium/windsurf/"],
                    ["Zencoder", "~/.zencoder/"],
                  ] as const).map(([tool, path], i) => (
                    <tr
                      key={tool}
                      className={
                        `${i % 2 === 0 ? "bg-white/[0.02]" : ""} hover:bg-white/[0.04] transition-colors`
                      }
                    >
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
          <pre className="bg-neutral-900 border border-white/[0.06] text-neutral-100 rounded-lg p-4 overflow-x-auto font-mono text-sm leading-relaxed">
            <code>
              <span className="text-neutral-500"># See all supported targets and which are detected on your machine</span>
              {"\n"}npx agentget targets
            </code>
          </pre>
        </div>

        {/* ── What It Installs ── */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-neutral-200">
            What It Installs
          </h3>
          <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-900 text-left">
                  <th className="px-4 py-3 font-medium text-neutral-400">
                    Type
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-400">
                    Pattern
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  ["Agents", "agents/*.agent.md"],
                  ["Instructions", "instructions/*.instructions.md"],
                  ["Skills", "skills/*/SKILL.md (whole folder)"],
                  ["Rules", "rules/*.rules.md"],
                  ["Plugins", "plugins/*/ (expanded recursively)"],
                ].map(([type, pattern], i) => (
                  <tr
                    key={type}
                    className={
                      `${i % 2 === 0 ? "bg-white/[0.02]" : ""} hover:bg-white/[0.04] transition-colors`
                    }
                  >
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
    </div>
  );
}
