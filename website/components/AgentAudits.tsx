import Link from "next/link";
import { AGENT_AUDITS, AUDIT_SUMMARY } from "@/lib/agent-audits";

const AUDIT_DIMENSIONS = [
  {
    title: "Scope discipline",
    description:
      "Each agent is reviewed against its intended role so broad access is reserved for agents that truly need it.",
  },
  {
    title: "Tool boundaries",
    description:
      "Read-only specialists stay read-only, while writing agents are limited to the execution paths they are built for.",
  },
  {
    title: "Delegation surface",
    description:
      "Only orchestration-focused agents can fan out work, which keeps parallel execution contained to explicit coordinators.",
  },
  {
    title: "Verification posture",
    description:
      "Execution agents are expected to verify with diagnostics, checks, or explicit review steps before calling work complete.",
  },
] as const;

const CONTROL_STYLES = {
  Contained: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20",
  Guarded: "bg-amber-400/10 text-amber-200 border border-amber-400/20",
  Elevated: "bg-rose-400/10 text-rose-200 border border-rose-400/20",
} as const;

export function AgentAudits() {
  return (
    <main>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            Builtin agent review
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Agent Audits
          </h1>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg leading-relaxed">
            A capability audit for our builtin agents across scope, write access,
            delegation, and operational guardrails.
          </p>
          <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
            This is an internal posture view, not a third-party certification.
            It is meant to show where each agent sits on the spectrum from
            contained specialist to elevated orchestrator.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            ["Total agents", AUDIT_SUMMARY.total.toString()],
            ["Read-only", AUDIT_SUMMARY.readOnly.toString()],
            ["Write-capable", AUDIT_SUMMARY.writeCapable.toString()],
            ["Delegating", AUDIT_SUMMARY.delegating.toString()],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.08] bg-neutral-900 px-5 py-4"
            >
              <div className="text-2xl font-semibold text-white">{value}</div>
              <div className="mt-1 text-sm text-neutral-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              What we review
            </h2>
            <p className="mt-2 text-neutral-400 text-sm sm:text-base">
              Four simple dimensions keep the audit readable and make tradeoffs
              visible at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AUDIT_DIMENSIONS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/[0.08] bg-neutral-900 p-6"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Current posture by agent
            </h2>
            <p className="mt-2 text-neutral-400 text-sm sm:text-base">
              Higher control levels indicate broader execution authority or coordination surface.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-neutral-950">
            <table className="w-full min-w-[940px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-neutral-900/80 text-left">
                  <th className="px-4 py-3 font-medium text-neutral-400">Agent</th>
                  <th className="px-4 py-3 font-medium text-neutral-400">Scope</th>
                  <th className="px-4 py-3 font-medium text-neutral-400">Access</th>
                  <th className="px-4 py-3 font-medium text-neutral-400">Delegates</th>
                  <th className="px-4 py-3 font-medium text-neutral-400">Control</th>
                  <th className="px-4 py-3 font-medium text-neutral-400">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {AGENT_AUDITS.map((agent, index) => (
                  <tr
                    key={agent.flag}
                    className={index % 2 === 0 ? "bg-white/[0.02]" : undefined}
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-white">{agent.name}</div>
                      <div className="mt-1 max-w-xs text-xs leading-relaxed text-neutral-500">
                        {agent.summary}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-neutral-300">{agent.scope}</td>
                    <td className="px-4 py-4 align-top text-neutral-300">{agent.access}</td>
                    <td className="px-4 py-4 align-top text-neutral-300">
                      {agent.delegates ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${CONTROL_STYLES[agent.control]}`}
                      >
                        {agent.control}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top text-neutral-400 leading-relaxed">
                      {agent.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="rounded-2xl border border-white/[0.08] bg-neutral-900 px-6 py-8 sm:px-8 sm:py-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Want to install one of these agents?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-400 leading-relaxed">
                Browse the builtin catalog and copy the install command directly from the home page.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-400/15 transition-colors"
            >
              Back to agents
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
