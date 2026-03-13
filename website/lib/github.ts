const GITHUB_REPO = "joeyism/agentget";
const AGENT_SUBMISSION_TEMPLATE = "submit-agent.md";

export const AGENT_SUBMISSION_URL =
  `https://github.com/${GITHUB_REPO}/issues/new?template=${encodeURIComponent(AGENT_SUBMISSION_TEMPLATE)}`;
