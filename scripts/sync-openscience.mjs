import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile, readdir, mkdir, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const target = join(root, "src/content/openscience");
const manifestPath = join(root, "scripts/openscience-source.json");
const args = process.argv.slice(2);
const check = args.includes("--check");
const sourceArg = args.indexOf("--source");
const source = sourceArg >= 0 ? args[sourceArg + 1] : undefined;
if ((!check && !source) || (sourceArg >= 0 && (!source || source.startsWith("--")))) {
  throw new Error("Usage: npm run sync:openscience -- --source /path/to/openscience [--check], or --check alone");
}
const directory = source ? join(resolve(source), "frontend/docs/src/content/openscience") : target;
const names = (await readdir(directory)).filter((name) => name.endsWith(".mdx") || name === "docs.json").sort();
const files = Object.fromEntries(await Promise.all(names.map(async (name) => [name, await readFile(join(directory, name))])));
const hashes = Object.fromEntries(names.map((name) => [name, createHash("sha256").update(files[name]).digest("hex")]));

if (check) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const local = (await readdir(target)).filter((name) => name.endsWith(".mdx") || name === "docs.json").sort();
  if (JSON.stringify(names) !== JSON.stringify(local)) throw new Error("OpenScience page inventory differs; run sync:openscience.");
  for (const name of names) {
    if (source && !(await readFile(join(target, name))).equals(files[name])) throw new Error(`OpenScience mirror differs: ${name}`);
  }
  if (JSON.stringify(hashes) !== JSON.stringify(manifest.files)) throw new Error("OpenScience content differs from its recorded source; update the canonical repository and sync again.");
  console.log(`Verified ${names.length - 1} OpenScience pages and navigation against ${manifest.revision}.`);
} else {
  const revision = execFileSync("git", ["-C", resolve(source), "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const dirty = execFileSync("git", ["-C", resolve(source), "status", "--porcelain", "--", "frontend/docs/src/content/openscience"], { encoding: "utf8" }).trim();
  if (dirty) throw new Error("Commit canonical OpenScience content before syncing so provenance names an exact revision.");
  await mkdir(target, { recursive: true });
  for (const name of await readdir(target)) {
    if ((name.endsWith(".mdx") || name === "docs.json") && !names.includes(name)) await rm(join(target, name));
  }
  for (const name of names) await writeFile(join(target, name), files[name]);
  await writeFile(manifestPath, JSON.stringify({ repository: "https://github.com/synthetic-sciences/openscience", revision, directory: "frontend/docs/src/content/openscience", files: hashes }, null, 2) + "\n");
  console.log(`Synced ${names.length - 1} OpenScience pages and navigation from ${revision}.`);
}
