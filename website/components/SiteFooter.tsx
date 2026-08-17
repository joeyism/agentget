import Link from 'next/link';

import { AGENT_SUBMISSION_URL } from '@/lib/github';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
        <p>&copy; {year} agentget</p>
        <nav aria-label="Footer" className="flex items-center gap-4 sm:gap-5 whitespace-nowrap">
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/audits" className="hover:text-white transition-colors">
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
    </footer>
  );
}
