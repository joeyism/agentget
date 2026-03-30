'use client';

import { useState } from 'react';

interface CopyableCommandProps {
  command: string;
}

export function CopyableCommand({ command }: CopyableCommandProps) {
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      className="mt-4 group/cmd flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 cursor-pointer hover:border-neutral-700 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none transition-colors"
      onClick={copyCommand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && copyCommand()}
      title="Click to copy install command"
    >
      <code className="font-mono text-xs text-neutral-500 truncate flex-1">
        <span className="text-neutral-600">$ </span>
        {command}
      </code>
      <span className="text-neutral-600 group-hover/cmd:text-neutral-400 transition-colors shrink-0">
        {copied ? (
          <svg
            className="w-3.5 h-3.5 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5"
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
