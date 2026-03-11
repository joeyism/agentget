import type { Metadata } from "next";
import { AgentAudits } from "@/components/AgentAudits";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Agent Audits | agentget",
  description: "Capability audit for agentget builtin agents.",
};

export default function AuditsPage() {
  return (
    <>
      <SiteHeader currentPath="/audits" />
      <AgentAudits />
    </>
  );
}
