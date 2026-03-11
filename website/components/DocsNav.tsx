import Link from "next/link";

type DocsNavTab = "overview" | "agents";

export function DocsNav({ active }: { active: DocsNavTab }) {
  const getClassName = (tab: DocsNavTab) =>
    tab === active
      ? "rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1.5 text-sm text-white"
      : "rounded-full border border-white/[0.06] px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:border-white/[0.12] transition-colors";

  return (
    <div className="flex items-center gap-3 mb-8">
      <Link href="/docs" className={getClassName("overview")}>
        Overview
      </Link>
      <Link href="/docs/agents" className={getClassName("agents")}>
        Agents
      </Link>
    </div>
  );
}
