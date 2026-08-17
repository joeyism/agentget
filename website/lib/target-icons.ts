// Keep in sync with SVGs in website/public/agents/.
// A future PR will emit an icon field from website/scripts/build-data.ts
// once AgentTarget exposes one.

export const TARGET_ICONS: Record<string, string> = {
  "Claude Code": "/agents/claude-code.svg",
  Cursor: "/agents/cursor.svg",
  OpenCode: "/agents/opencode.svg",
};
