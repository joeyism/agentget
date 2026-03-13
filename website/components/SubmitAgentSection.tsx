import { AGENT_SUBMISSION_URL } from "@/lib/github";

export function SubmitAgentSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="rounded-3xl border border-emerald-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(10,10,10,0.92))] p-8 sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-emerald-400">
              Submit your agent
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Got a public repo others should install?
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-300 sm:text-base">
              Open a prefilled GitHub submission issue in one click. Share the
              repo, describe the agent, and confirm the supported layout so it
              can be reviewed for the directory.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={AGENT_SUBMISSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-300"
              >
                Submit on GitHub
              </a>
              <a
                href="/docs"
                className="inline-flex items-center justify-center rounded-xl border border-white/[0.1] px-5 py-3 text-sm font-semibold text-neutral-200 transition-colors hover:border-white/[0.18] hover:text-white"
              >
                Review docs first
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-5 sm:p-6">
            <p className="text-sm font-semibold text-white">Before submitting</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-300">
              <li>• Use a public GitHub repository</li>
              <li>• Include the install command or repo URL</li>
              <li>• Confirm the agentget-compatible folder structure</li>
              <li>• Explain why the agent is useful to others</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
