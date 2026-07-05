<div align="center">

```text
 _______ ___ ___ _______ _______ _______ _______ _______ _______ ______
|     __|   |   |    |  |_     _|   |   |    ___|_     _|_     _|      |
|__     |\     /|       | |   | |       |    ___| |   |  _|   |_|   ---|
|_______| |___| |__|____| |___| |___|___|_______| |___| |_______|______|

     _______ ______ _______ _______ _______ ______ _______ _______
    |     __|      |_     _|    ___|    |  |      |    ___|     __|
    |__     |   ---|_|   |_|    ___|       |   ---|    ___|__     |
    |_______|______|_______|_______|__|____|______|_______|_______|
                                                               docs
```

**the words behind [docs.syntheticsciences.ai](https://docs.syntheticsciences.ai)**

[![site](https://img.shields.io/badge/live-docs.syntheticsciences.ai-2f6f54)](https://docs.syntheticsciences.ai)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![OpenScience](https://img.shields.io/github/stars/synthetic-sciences/openscience?label=openscience&style=social)](https://github.com/synthetic-sciences/openscience)

</div>

---

This is the whole docs site. No docs framework, no CMS, no server — one small Vite + React app that turns a folder of MDX into [docs.syntheticsciences.ai](https://docs.syntheticsciences.ai). Merges to `main` deploy automatically.

## what's inside

**[Atlas](https://docs.syntheticsciences.ai/#/atlas/index)** — the research graph: hypotheses, runs, evidence, and decisions that outlive any one chat. Try it at [tryatlas.sh](https://tryatlas.sh).

**[OpenScience](https://docs.syntheticsciences.ai/#/openscience/index)** — the [open-source AI workbench](https://github.com/synthetic-sciences/openscience) for scientific research. Try it at [openscience.sh](https://openscience.sh).

**[Library](https://docs.syntheticsciences.ai/#/library/index)** — indexed knowledge sources that graphs can search and cite. [Delphi](https://github.com/synthetic-sciences/delphi) is the open-source engine; try it at [trydelphi.ai](https://trydelphi.ai).

Each section lives in `src/content/<section>/` as `.mdx` pages plus a `docs.json` for the sidebar. That's the entire content model.

## run it

```bash
npm install
npm run dev        # hot-reloads .mdx edits
```

```bash
npm run validate   # link check + production build — run before every PR
```

## add a page

1. Drop `src/content/<section>/<page>.mdx` with `title` + `description` frontmatter.
2. Add it to that section's `docs.json` under the right group.
3. `npm run check-links` — green means the nav and every internal link resolve.

Routing is hash-based (`#/<section>/<page>`), and URLs from older layouts redirect via the alias maps in `src/DocsApp.tsx`, so old links never die.

## house style

- copy says "Atlas", "OpenScience", or "Synthetic Sciences" — no internal vendor names
- OpenScience docs are bring-your-own-key first; Atlas is optional, never required
- canonical singular command names; installs always use `@latest`
- active voice, second person, sentence case headings

## license

MIT for this site — see [LICENSE](LICENSE). The products keep their own licenses (OpenScience is Apache-2.0).
