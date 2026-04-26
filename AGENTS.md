# Documentation project instructions

## About this project

- Source for the Synthetic Sciences docs site (Thesis + Synsci CLI + per-mode tabs).
- Pages are MDX with YAML frontmatter.
- Site configuration is in `docs.json`.
- Run `mint dev` to preview locally.
- Run `mint broken-links` to check for broken cross-links.

## Style preferences

- Active voice and second person ("you").
- Concise sentences, one idea per sentence.
- Sentence case for headings.
- Bold for UI elements (e.g. "Click **Settings**").
- Code formatting for filenames, commands, paths, and code references.
- No em dashes anywhere. Use periods, commas, or restructure.
- Avoid promotional language and AI-sounding phrasing.

## Structural conventions

- Each mode tab (chemistry, biology, physics, materials, ml, math) ships an `introduction.mdx` and a `workflows.mdx`.
- The Synsci CLI tab covers install, agents, operations, integrations, and reference.
- Thesis and Thesis MCP each have their own tab with their own concepts and reference.
- Cross-link liberally between tabs where it helps the reader.

## Things not to write about

- Do not document any internal "skill" system. Talk directly about the tools and frameworks the agent uses.
- Do not list specific underlying model providers (Claude, GPT, Gemini). The CLI abstracts the model layer behind research modes.
