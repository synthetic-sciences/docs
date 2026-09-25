import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { parseRoute, resolveLink } from "../src/navigation.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const base = "https://docs.syntheticsciences.ai/";
const index = ["# Synthetic Sciences documentation", "", "> OpenScience research guides, Ace, account workspaces, and private Graphs.", "", `Full text: ${base}llms-full.txt`, ""];
const full = ["# Synthetic Sciences documentation", "", `Source: ${base}`, ""];
for (const section of ["openscience", "account"]) {
  const directory = join(root, "src/content", section);
  const config = JSON.parse(await readFile(join(directory, "docs.json"), "utf8"));
  index.push(`## ${config.name}`, "");
  for (const tab of config.navigation.tabs) {
    for (const group of tab.groups) {
      index.push(`### ${group.group}`, "");
      for (const path of group.pages) {
        const raw = await readFile(join(directory, path + ".mdx"), "utf8");
        const title = raw.match(/^title: "(.+)"$/m)[1];
        const description = raw.match(/^description: "(.+)"$/m)[1];
        const url = `${base}#/${section}/${path}`;
        const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, "")
          .replace(/<Card\s+title="([^"]+)"\s+href="([^"]+)">\s*([\s\S]*?)\s*<\/Card>/g, "[$1]($2): $3")
          .replace(/<\/?(?:Columns|CardGroup)\b[^>]*>/g, "")
          .replace(/\]\(([\/#][^)]*)\)/g, (_, href) => {
            const route = parseRoute(resolveLink(href, { section, path }));
            return `](${base}#/${route.section}/${route.path}${route.anchor ? "#" + route.anchor : ""})`;
          });
        index.push(`- [${title}](${url}): ${description}`);
        full.push(`# ${title}`, "", description, "", `URL: ${url}`, "", body.trim(), "");
      }
      index.push("");
    }
  }
}
await writeFile(join(root, "public/llms.txt"), index.join("\n"));
await writeFile(join(root, "public/llms-full.txt"), full.join("\n"));
console.log("Generated documentation index and full-text exports.");
