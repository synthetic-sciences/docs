# Atlas documentation

Source for the Synthetic Sciences docs site at [docs.syntheticsciences.ai](https://docs.syntheticsciences.ai). It documents the Atlas suite: **Atlas Graphs**, **Atlas Library**, and the **Atlas Agent CLI**, plus shared getting-started material.

It is a small Vite + React app that renders MDX content. Pages are MDX with YAML frontmatter; navigation lives in a `docs.json` per section.

## Local preview

```bash
npm install
npm run dev
```

The dev server hot-reloads edits to `.mdx` files.

## Build

```bash
npm run build      # static build to dist/
npm run preview    # serve the build locally
```

## Validate before merging

```bash
npm run check-links   # nav + internal-link integrity (fails on any 404)
npm run validate      # check-links, then a production build
```

## Layout

```
src/
  App.tsx                 App entry
  DocsApp.tsx             The whole docs UI: section nav, routing, MDX rendering
  theme.ts                Light/dark theme
  content/
    getting-started/      Shared: install, auth, API keys, billing, CLI conventions, agent onboarding, REST API
    graphs/               Atlas Graphs: the research graph, research loop, runs, reproduction, forking, web views
    library/              Atlas Library: indexing, search modes, ask, jobs
    agent-cli/            Atlas Agent CLI: the autonomous agent (coming soon)
  styles/index.css        Base styles
scripts/
  check-links.mjs         Nav + internal-link checker
```

Each `content/<section>/` folder has its own `docs.json` (tabs, groups, page order, anchors) and a set of `.mdx` pages.

## Information architecture

The top-level navigation is a section bar: **Getting started** (shared) followed by the three product sections **Atlas Graphs**, **Atlas Library**, and **Atlas Agent CLI**.

Routing is hash-based: `#/<section>/<page>` (for example `#/graphs/quickstart`). Old single-segment URLs from the previous Atlas/CLI toggle redirect to their new homes via the `LEGACY_REDIRECTS` map in `DocsApp.tsx`.

### Adding a page

1. Create `src/content/<section>/<page>.mdx` with `title` and `description` frontmatter.
2. Add the page path to that section's `docs.json` under the right group.
3. Run `npm run check-links` to confirm nav and links resolve.

## Conventions

- Atlas is **a suite of tools that act as infrastructure for autonomous research**; Atlas Graphs is one product in it.
- Public copy says "Atlas" or "Synthetic Sciences". Do not name internal vendors.
- Atlas is **direct REST + CLI** — no MCP server docs. CLI auth is `atlas login` or `thk_*` API keys.
- Use canonical (singular) command names; legacy aliases are mentioned only on the CLI conventions page.
- Install commands always use `@latest`; never pin an old version.
- Active voice, second person. Sentence case headings. No em dashes.
```
