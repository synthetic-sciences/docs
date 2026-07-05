<div align="center">

```text
      ███████╗██╗   ██╗███╗   ██╗████████╗██╗  ██╗███████╗████████╗██╗ ██████╗
      ██╔════╝╚██╗ ██╔╝████╗  ██║╚══██╔══╝██║  ██║██╔════╝╚══██╔══╝██║██╔════╝
      ███████╗ ╚████╔╝ ██╔██╗ ██║   ██║   ███████║█████╗     ██║   ██║██║     
      ╚════██║  ╚██╔╝  ██║╚██╗██║   ██║   ██╔══██║██╔══╝     ██║   ██║██║     
      ███████║   ██║   ██║ ╚████║   ██║   ██║  ██║███████╗   ██║   ██║╚██████╗
      ╚══════╝   ╚═╝   ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝
           ███████╗ ██████╗██╗███████╗███╗   ██╗ ██████╗███████╗███████╗
           ██╔════╝██╔════╝██║██╔════╝████╗  ██║██╔════╝██╔════╝██╔════╝
           ███████╗██║     ██║█████╗  ██╔██╗ ██║██║     █████╗  ███████╗
           ╚════██║██║     ██║██╔══╝  ██║╚██╗██║██║     ██╔══╝  ╚════██║
           ███████║╚██████╗██║███████╗██║ ╚████║╚██████╗███████╗███████║
           ╚══════╝ ╚═════╝╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚══════╝
                                                                    docs
```

The source for [docs.syntheticsciences.ai](https://docs.syntheticsciences.ai).

[![site](https://img.shields.io/badge/live-docs.syntheticsciences.ai-2f6f54)](https://docs.syntheticsciences.ai)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![OpenScience](https://img.shields.io/github/stars/synthetic-sciences/openscience?label=openscience&style=social)](https://github.com/synthetic-sciences/openscience)

</div>

## About

This repository is the whole docs site: a small Vite + React app that renders a folder of MDX pages. There is no docs framework, no CMS, and no server. Merges to `main` deploy automatically.

It documents three products:

- **[Atlas](https://docs.syntheticsciences.ai/#/atlas/index)**: the research graph. Hypotheses, runs, evidence, and decisions that outlive any one chat. Try it at [tryatlas.sh](https://tryatlas.sh).
- **[OpenScience](https://docs.syntheticsciences.ai/#/openscience/index)**: the [open-source AI workbench](https://github.com/synthetic-sciences/openscience) for scientific research. Try it at [openscience.sh](https://openscience.sh).
- **[Library](https://docs.syntheticsciences.ai/#/library/index)**: indexed knowledge sources that graphs can search and cite. [Delphi](https://github.com/synthetic-sciences/delphi) is the open-source engine; try it at [trydelphi.ai](https://trydelphi.ai).

## Development

```bash
npm install
npm run dev        # hot-reloads .mdx edits
```

Before opening a PR:

```bash
npm run validate   # link check plus a production build
```

## Adding a page

1. Create `src/content/<section>/<page>.mdx` with `title` and `description` frontmatter.
2. Add the page to that section's `docs.json` under the right group.
3. Run `npm run check-links` to confirm the nav and every internal link resolve.

Each section lives in `src/content/<section>/` as `.mdx` pages plus a `docs.json` for the sidebar. Routing is hash-based (`#/<section>/<page>`), and URLs from older layouts redirect through the alias maps in `src/DocsApp.tsx`, so old links keep working.

## Style guide

- Copy says "Atlas", "OpenScience", or "Synthetic Sciences". No internal vendor names.
- OpenScience docs present bring-your-own-key as the default; Atlas is optional, never required.
- Use canonical singular command names. Installs always use `@latest`.
- Active voice, second person, sentence case headings.

## License

MIT for this site; see [LICENSE](LICENSE). The products keep their own licenses (OpenScience is Apache-2.0).
