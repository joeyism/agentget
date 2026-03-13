import Image from "next/image";
import supportedTargets from "@/public/supported-targets.json";

const marqueeTargets = supportedTargets as Array<{ name: string }>;

const TARGET_ICONS: Record<string, string> = {
  "Claude Code": "/agents/claude-code.svg",
  Cursor: "/agents/cursor.svg",
  OpenCode: "/agents/opencode.svg",
};

function getTargetFallback(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "AI";
  }

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function TargetBadge({ name }: { name: string }) {
  const iconSrc = TARGET_ICONS[name];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-neutral-900 text-[10px] font-semibold tracking-[0.14em] text-neutral-400 uppercase">
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt={name}
            width={36}
            height={36}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <span>{getTargetFallback(name)}</span>
        )}
      </div>

      <span className="whitespace-nowrap text-xs sm:text-sm font-mono text-neutral-400">
        {name}
      </span>
    </div>
  );
}

export function SupportedTargetsMarquee() {
  return (
    <section data-testid="marquee-section" className="w-full max-w-full pt-16 sm:pt-24">
      <h2 className="text-left text-sm font-medium uppercase tracking-widest text-neutral-500 mb-6 pl-1">
        Compatible with these coding tools
      </h2>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-black to-transparent" />
        <div className="marquee-track flex w-max items-center gap-4 px-10 sm:gap-6 sm:px-12">
          {[0, 1].map((set) => (
            <div key={set} className="flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
              {marqueeTargets.map((target) => (
                <TargetBadge key={`${set}-${target.name}`} name={target.name} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
