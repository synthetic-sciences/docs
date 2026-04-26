# Synthetic Sciences documentation

Source for the docs site covering [Thesis](https://thesis.syntheticsciences.ai), the [Synsci CLI](https://cli.syntheticsciences.ai), and per-domain research mode pages (chemistry, biology, physics, materials, machine learning, mathematics).

Pages are MDX with YAML frontmatter. Site configuration lives in `docs.json`.

## Local preview

```bash
npm i -g mint
mint dev
```

The preview serves on `http://localhost:3000` (or the next free port). Edits to `.mdx` files hot-reload.

## Layout

```
docs.json              Navigation, theme, colors, logo
index.mdx              Overview landing page
introduction.mdx       Thesis introduction
quickstart.mdx         Thesis quickstart
web-app.mdx            Thesis web app tour
concepts/              Thesis core concepts
guides/                Thesis practical guides
integrations/          Thesis integrations
mcp/                   Thesis MCP server reference
cli/                   Synsci CLI core (install, agents, web, credentials, etc.)
chemistry/             Chemistry mode
biology/               Biology mode
physics/               Physics mode
materials/             Materials science mode
ml/                    Machine learning mode
math/                  Mathematics mode
logo/                  Brand assets
```

## Conventions

- Active voice, second person.
- One idea per sentence.
- Sentence case for headings.
- Bold for UI elements.
- Code formatting for filenames, commands, and code references.
- No em dashes. Use periods, commas, or restructure the sentence.

## Deployment

The default branch deploys automatically. Open a PR for any change, merge to deploy.
