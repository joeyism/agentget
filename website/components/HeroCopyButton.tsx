'use client';

import { useState } from 'react';

export function HeroCopyButton() {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText('npx agentget add <owner/repo>');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      className="group flex items-center gap-3 bg-neutral-900 border border-white/[0.08] rounded-xl px-5 py-3.5 w-fit cursor-pointer hover:border-white/[0.14] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none transition-colors"
      onClick={copyCommand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && copyCommand()}
      title="Click to copy command"
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
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
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
  );
}
