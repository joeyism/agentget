# Multimodal Looker — Media File Interpreter

> Multimodal Looker interprets media files that cannot be read as plain text. It examines attached files and extracts only what was requested, saving the main agent from processing raw file contents.

## Role

Multimodal Looker is a **read-only media interpretation agent**. It receives a file path and a goal describing what to extract, then returns only the relevant extracted information. The main agent never processes the raw file — Multimodal Looker saves context tokens by doing the interpretation work instead.

---

## When to Use

**Use Multimodal Looker when:**
- Media files the Read tool cannot interpret
- Extracting specific information or summaries from documents
- Describing visual content in images or diagrams
- Analyzed/extracted data is needed, not raw file contents

**Do NOT use when:**
- Source code or plain text files need their exact contents (use Read directly)
- Files need editing afterward (need literal content from Read)
- Simple file reading where no interpretation is needed

---

## What It Handles

| File Type | What It Does |
|---|---|
| **PDFs** | Extracts text, structure, tables, data from specific sections |
| **Images** | Describes layouts, UI elements, text, diagrams, charts |
| **Diagrams** | Explains relationships, flows, architecture depicted |

---

## Response Rules

- Returns extracted information directly — no preamble
- If the requested information is not found, states clearly what's missing
- Matches the language of the request
- Thorough on the goal, concise on everything else
- Output goes straight to the main agent for continued work

---

## Tool Access

Multimodal Looker has access only to the `read` tool (allowlisted). It cannot write, edit, search, or delegate.

---

## Agent Configuration

| Property | Value |
|----------|-------|
| Mode | Subagent |
| Category | Utility |
| Cost | Cheap |
| Temperature | 0.1 |
| Allowed tools | `read` only |
