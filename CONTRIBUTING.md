# Contribute to the documentation

## How to contribute

### Edit on GitHub

1. Open the page on GitHub.
2. Click the pencil icon to edit in place.
3. Submit a pull request.

### Local development

1. Fork and clone this repository.
2. Install the docs CLI: `npm i -g mint`.
3. Create a branch off `main`.
4. Make changes to `.mdx` files.
5. Run `mint dev` from the repo root and preview at `http://localhost:3000`.
6. Commit and open a pull request against `main`.

## Writing guidelines

- Active voice. "Run the command", not "the command should be run".
- Second person. "You" rather than "the user".
- One idea per sentence. Break up long ones.
- Lead with the goal. Start instructions with what the reader wants to accomplish.
- Consistent terminology. Don't alternate between synonyms for the same concept.
- Show, don't just tell. Add examples wherever they clarify.
- No em dashes. Use periods, commas, colons, or restructure.

## Preview before merging

Before opening a PR, run `mint dev` locally and click through every page you touched. The default branch deploys automatically once the PR merges.
