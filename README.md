# Synthetic Sciences Docs

Source for [docs.syntheticsciences.ai](https://docs.syntheticsciences.ai) — the documentation for **Atlas** (the research graph), **[OpenScience](https://github.com/synthetic-sciences/openscience)** (the open-source AI workbench for scientific research), and **Library** (indexed knowledge sources).

It is a small Vite + React app that renders MDX content. Pages are MDX with YAML frontmatter; navigation lives in a `docs.json` per section. No docs framework, no server — the whole site is one static bundle.

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
    atlas/                Atlas: install, auth, the research graph, the research loop,
                          runs, optimize, reproduction, CLI & API reference
    openscience/          OpenScience: the open-source AI workbench — workspace,
                          agents, models, skills, sessions, CLI reference
    library/              Library: indexing, search modes, ask, jobs
  styles/index.css        Base styles
scripts/
  check-links.mjs         Nav + internal-link checker
```

Each `content/<section>/` folder has its own `docs.json` (tabs, groups, page order, anchors) and a set of `.mdx` pages.

## Information architecture

The top-level navigation is a section bar with the three products: **Atlas**, **OpenScience**, and **Library**. Each section has a **Guides** and a **Reference** sidebar tab.

Routing is hash-based: `#/<section>/<page>` (for example `#/atlas/quickstart`). URLs from earlier layouts (`#/getting-started/*`, `#/graphs/*`, `#/agent-cli/*`, and the oldest single-segment scheme) redirect to their current homes via the alias maps in `DocsApp.tsx`.

### Adding a page

1. Create `src/content/<section>/<page>.mdx` with `title` and `description` frontmatter.
2. Add the page path to that section's `docs.json` under the right group.
3. Run `npm run check-links` to confirm nav and links resolve.

## Conventions

- Public copy says "Atlas", "OpenScience", or "Synthetic Sciences". Do not name internal vendors.
- Atlas is **direct REST + CLI** — no MCP server docs. CLI auth is `atlas login` or `thk_*` API keys.
- OpenScience is standalone and open source; docs present bring-your-own-key as the default and Atlas as optional.
- Use canonical (singular) command names; legacy aliases are mentioned only on the CLI conventions page.
- Install commands always use `@latest`; never pin an old version.
- Active voice, second person. Sentence case headings.

## License

MIT — see [LICENSE](LICENSE). The products the site documents carry their own licenses (OpenScience is Apache-2.0).
