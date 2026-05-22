---
name: atlas
description: Operate Atlas by Synthetic Sciences from the CLI. Use for map research workflows, library indexing, Nia-backed search, Oracle, async deep research, evidence, exports, keys, and bundled agent skills.
license: MIT
compatibility: Requires Node.js 18+ and the @synsci/atlas CLI.
metadata:
  author: Synthetic Sciences
  package: "@synsci/atlas"
---

# Atlas skill

Use this skill when an agent needs to operate Atlas by Synthetic Sciences.

## Install and verify

```bash
npm i -g @synsci/atlas@latest
atlas login
atlas doctor --format=json
atlas whoami --format=json
atlas help --format=json
```

## Product rules

- Atlas is a graph-native research workspace.
- Use the `atlas` CLI for maps, nodes, library search, research, evidence, export, integration, and key work.
- Skills are bundled inside `@synsci/atlas`; do not install a separate Atlas skill bundle.
- Prefer `--format=json` for agent automation.
- Do not print full Atlas API keys into shared logs.
- Use `research_paper` for paper sources.

## Core command families

- `nodes:*, map:*, link:*, access:*, draft:*`, `labels:*`, `evidence:link/refresh`
- `library:*`, `research:*`, `usage:summary` for indexing, tree/read/grep, search, ask, Oracle, async deep research, and usage
- `evidence:*`, `evidence:files`
- `history:export`, `map:export`, `map:summary:*`, `map:import`
- `github:*`, `integrations:*`, `keys:*`, `config:*`, `secrets:*`

## Bundled Atlas skills

- `atlas`
- `atlas-auto`
- `atlas-lookahead`
- `atlas-prove`
- `atlas-reproduce`
- `atlas-search`
- `atlas-to-graph`
- `atlas-tree`
