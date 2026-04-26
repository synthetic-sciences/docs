# Synthetic Sciences documentation

Source for the docs site covering Thesis, the Synsci CLI, Delphi, and the research modes.

Pages are MDX with YAML frontmatter. Site configuration lives in `docs.json`.

## Local preview

```bash
npm install
npm run dev
```

The preview serves on `http://localhost:3000` (or the next free port). Edits to `.mdx` files hot-reload.

## Production build

```bash
npm run build
```

Exports a static site to `out/`. Open `out/index.html` directly, or serve the directory with any static file server.

## Validate before merging

```bash
npm run validate          # strict build check
npm run broken-links      # cross-link integrity
```

## Layout

```
docs.json              Navigation, theme, colors, logo
index.mdx              Overview landing page
introduction.mdx       Thesis introduction
quickstart.mdx         Thesis quickstart
web-app.mdx            Thesis web app tour
concepts/              Thesis core concepts
context/               Delphi context engine
guides/                Thesis practical guides
mcp/                   Thesis MCP server reference
cli/                   Synsci CLI (install, web, agents, operations, reference)
cli/research/          Per-mode pages: research, physics, chemistry, biology, flywheel
logo/                  Brand assets
package.json           Build scripts (dev / build / validate / broken-links)
vercel.json            Vercel deployment config
```

## Vercel deployment

The repo is set up for one-click Vercel hosting. Connect the repo to a new Vercel project. No settings needed: `vercel.json` already declares the build command and output directory.

| Setting | Value |
|---|---|
| Framework preset | Other |
| Build command | `npm run build` |
| Output directory | `out` |
| Install command | `npm install` |

Vercel auto-detects all of the above from `vercel.json`. Push to the connected branch and the new build deploys.

## Conventions

- Active voice, second person.
- One idea per sentence.
- Sentence case for headings.
- Bold for UI elements.
- Code formatting for filenames, commands, and code references.
- No em dashes. Use periods, commas, or restructure the sentence.
