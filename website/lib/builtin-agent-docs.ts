import "server-only";

import fs from "node:fs";
import path from "node:path";

import {
  BUILTIN_AGENTS,
  getBuiltinAgentBySlug,
  type BuiltinAgent,
} from "@/lib/builtin-agents";

export interface BuiltinAgentDocSection {
  title: string;
  body: string;
}

export interface BuiltinAgentDoc extends BuiltinAgent {
  title: string;
  intro: string;
  sections: BuiltinAgentDocSection[];
  githubUrl: string;
}

const AGENTS_DIR = path.join(process.cwd(), "..", "agents");

function parseTitle(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "Builtin Agent";
}

function parseIntro(markdown: string) {
  const quoteLines = markdown
    .split(/\r?\n/)
    .filter((line) => line.startsWith(">"))
    .map((line) => line.replace(/^>\s?/, "").trim())
    .filter(Boolean);

  return quoteLines.join(" ");
}

function parseSections(markdown: string) {
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)];

  return matches
    .map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const end = matches[index + 1]?.index ?? markdown.length;
      const body = markdown.slice(start, end).replace(/^\s+/, "").trim();

      return {
        title: match[1].trim(),
        body,
      };
    })
    .filter((section) => section.body.length > 0);
}

function readBuiltinAgentDoc(agent: BuiltinAgent): BuiltinAgentDoc {
  const filePath = path.join(AGENTS_DIR, agent.sourceFile);

  if (!fs.existsSync(filePath)) {
    return {
      ...agent,
      title: agent.name,
      intro: agent.summary,
      sections: [
        {
          title: "Overview",
          body:
            "This builtin agent is included in agentget, but its long-form markdown source is not present in this repository snapshot. Use the summary and install command on this page as the current reference.",
        },
      ],
      githubUrl: "https://github.com/joeyism/agentget/tree/main/agents",
    };
  }

  const markdown = fs.readFileSync(filePath, "utf8");

  return {
    ...agent,
    title: parseTitle(markdown),
    intro: parseIntro(markdown),
    sections: parseSections(markdown),
    githubUrl: `https://github.com/joeyism/agentget/blob/main/agents/${agent.sourceFile}`,
  };
}

export function getBuiltinAgentDocs() {
  return BUILTIN_AGENTS.map(readBuiltinAgentDoc);
}

export function getBuiltinAgentDoc(slug: string) {
  const agent = getBuiltinAgentBySlug(slug);

  if (!agent) {
    return undefined;
  }

  return readBuiltinAgentDoc(agent);
}
