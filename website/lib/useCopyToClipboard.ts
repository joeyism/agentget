'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        setCopied(false);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetAfterMs);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetAfterMs]
  );

  return { copied, copy };
}
