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

It documents:

- **[OpenScience](https://docs.syntheticsciences.ai/#/openscience/index)**: installation, models, Ace, research workflows, scientific tools, skills, and the local CLI/API.
- **[Synthetic Sciences](https://docs.syntheticsciences.ai/#/account/index)**: account access, workspaces, Wallet billing, usage, private Graphs, privacy, and Ascent access.

Atlas is retired as a public website and package offer. The account compatibility guide explains retained identifiers; old Atlas documentation URLs redirect to current workflows.

## Development

Use Node.js 24 or later. Validation scripts import the same typed route helpers as the browser using Node's built-in TypeScript stripping.

```bash
npm ci
npm run dev
npm run validate
npx playwright install chromium
npm run test:e2e
```

Validation checks the OpenScience mirror, every page and heading link, navigation and redirects, TypeScript, route behavior, and a production build. Browser tests visit every page and exercise search, anchors, legacy URLs, mobile navigation, copy, and plain-text exports. CI runs both gates on pull requests.

## Update OpenScience content

The canonical source is `frontend/docs/src/content/openscience` in [synthetic-sciences/openscience](https://github.com/synthetic-sciences/openscience). Edit and validate there first, then commit the source and sync it here:

```bash
npm run sync:openscience -- --source /path/to/openscience
npm run sync:openscience -- --source /path/to/openscience --check
npm run validate
```

The script copies every page and navigation file without rewriting content, removes obsolete mirror pages, and records the exact source revision and SHA-256 file hashes in `scripts/openscience-source.json`. It refuses uncommitted canonical content. CI rejects mirror drift. OpenScience behavior and schema examples are validated in the canonical repository; this site verifies the mirrored content and its rendering.

## Update account content

Create or edit `src/content/account/<page>.mdx` with quoted `title` and `description` frontmatter, then add it to `src/content/account/docs.json`. Check behavior against the current `synthetic-sciences/atlas` repository, especially its product-boundary instructions and server authorization. See [the source map](docs/content-map.md).

Use `/openscience/<page>` or `/account/<page>` internal links, optionally followed by `#<heading>`. Same-page anchors use `#<heading>`. Both second- and third-level headings have targets. The renderer accepts Markdown and the existing Card/Columns components; arbitrary MDX is not compiled.

Routing uses `#/<section>/<page>#<heading>`. `src/navigation.ts` owns current routes and old Atlas, agent-cli, and stored-product redirects. Unknown pages show a recoverable not-found view. `npm run check-links` validates links, anchors, page coverage, and redirect targets using that same implementation.

## Exports and deployment

Builds generate `public/llms.txt` and `public/llms-full.txt` from every navigation page. These are ignored by Git and included in `dist/`. Merges to `main` deploy through the existing hosting integration; check its deployment status before reporting the live site updated.

## Style and scope

- Use current product names: OpenScience and Synthetic Sciences. Atlas appears only in compatibility guidance.
- First-run OpenScience setup requires an account. Ace is optional; direct provider and local routes remain direct.
- Separate purchased Wallet funds, expiring promotional credit, managed usage, provider estimates, and card receipts.
- Enabling Ace access costs $0. Auto reload is separate consent for fixed $20 funding below $5, plus the disclosed processing fee.
- Describe supported user actions with exact labels, prerequisites, outcomes, and recovery steps. Do not advertise retained code as an active product.
- Use active voice, second person, sentence case headings, labelled code fences, and examples without real secrets.

## License

MIT for the site code and account guides; see [LICENSE](LICENSE). Mirrored OpenScience documentation retains its upstream Apache-2.0 license; see [NOTICE](NOTICE) and [LICENSE-OPENSCIENCE](LICENSE-OPENSCIENCE).
