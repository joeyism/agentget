'use client';

import { useCopyToClipboard } from '@/lib/useCopyToClipboard';

interface CopyableCommandProps {
  command: string;
  variant?: 'card' | 'hero';
}

const CARD_CLASSES =
  'mt-4 group/cmd flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 hover:border-neutral-700 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none transition-colors';
const HERO_CLASSES =
  'group/cmd flex items-center gap-3 bg-neutral-900 border border-white/[0.08] rounded-xl px-5 py-3.5 w-fit hover:border-white/[0.14] focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none transition-colors';

export function CopyableCommand({ command, variant = 'card' }: CopyableCommandProps) {
  const { copied, copy } = useCopyToClipboard();
  const isHero = variant === 'hero';

  return (
    <>
      <button
        type="button"
        onClick={() => copy(command)}
        aria-label={copied ? `Copied: ${command}` : `Copy install command: ${command}`}
        title={copied ? 'Copied' : 'Click to copy install command'}
        className={isHero ? HERO_CLASSES : CARD_CLASSES}
      >
        <code
          className={`font-mono ${isHero ? 'text-sm text-neutral-300 whitespace-nowrap' : 'text-xs text-neutral-500 truncate flex-1'}`}
        >
          <span className="text-neutral-600">$ </span>
          {command}
        </code>
        <span className="text-neutral-600 group-hover/cmd:text-neutral-400 transition-colors shrink-0">
          {copied ? (
            <svg
              className={isHero ? 'w-4 h-4 text-emerald-400' : 'w-3.5 h-3.5 text-emerald-400'}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg
              className={isHero ? 'w-4 h-4' : 'w-3.5 h-3.5'}
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
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </>
  );
}
