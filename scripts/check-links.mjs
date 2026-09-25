import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { aliases, atlasAliases, headings, parseRoute, resolveLink, slug } from "../src/navigation.ts";

const root = fileURLToPath(new URL("../src/content/", import.meta.url));
const sections = ["openscience", "account"];
const pages = new Map();
const errors = [];
const flatten = (items) => items.flatMap((item) => typeof item === "string" ? [item] : flatten(item.pages));

for (const section of sections) {
  const directory = join(root, section);
  const config = JSON.parse(readFileSync(join(directory, "docs.json"), "utf8"));
  const order = config.navigation.tabs.flatMap((tab) => tab.groups.flatMap((group) => flatten(group.pages)));
  if (new Set(order).size !== order.length) errors.push(`${section}: duplicate navigation entry`);
  for (const file of readdirSync(directory).filter((name) => name.endsWith(".mdx"))) {
    const path = file.slice(0, -4);
    const source = readFileSync(join(directory, file), "utf8");
    if (!/^---\ntitle: ".+"\ndescription: ".+"\n(?:[\s\S]*?\n)?---/m.test(source)) errors.push(`${section}/${path}: missing quoted title or description`);
    const body = source.replace(/^---\n[\s\S]*?\n---\n?/, "");
    const anchors = headings(body, 3).map(slug);
    if (new Set(anchors).size !== anchors.length) errors.push(`${section}/${path}: duplicate heading anchors`);
    if (!order.includes(path)) errors.push(`${section}/${path}: missing from navigation`);
    const state = { fence: false };
    for (const line of body.split("\n")) {
      const fence = line.match(/^\s*```(.*)$/);
      if (!fence) continue;
      if (!state.fence && !fence[1].trim()) errors.push(`${section}/${path}: code block needs a language`);
      state.fence = !state.fence;
    }
    if (state.fence) errors.push(`${section}/${path}: unclosed code block`);
    pages.set(`${section}/${path}`, { body, anchors, section, path });
  }
  for (const path of order) if (!pages.has(`${section}/${path}`)) errors.push(`${section}: missing page ${path}`);
}

let links = 0;
for (const [name, page] of pages) {
  const prose = page.body.replace(/```[\s\S]*?```/g, "");
  const hrefs = [...prose.matchAll(/\[[^\]]*\]\(([^)\s]+)\)|href=["']([^"']+)["']/g)].map((match) => match[1] ?? match[2]);
  for (const href of hrefs) {
    links++;
    if (/^(https?:|mailto:|tel:)/.test(href)) { new URL(href); continue; }
    const route = parseRoute(resolveLink(href, page));
    const target = pages.get(`${route.section}/${route.path}`);
    if (!target) errors.push(`${name}: broken link ${href}`);
    else if (route.anchor && !target.anchors.includes(route.anchor)) errors.push(`${name}: missing anchor ${href}`);
  }
}
for (const [old, path] of Object.entries(aliases)) {
  if (!pages.has(`openscience/${path}`)) errors.push(`Missing OpenScience redirect target: ${old} -> ${path}`);
  if (pages.has(`openscience/${old}`)) errors.push(`OpenScience redirect shadows page: ${old}`);
}
for (const [old, route] of Object.entries(atlasAliases)) {
  if (!pages.has(`${route.section}/${route.path}`)) errors.push(`Missing Atlas redirect target: ${old}`);
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(`Validated ${pages.size} pages, ${links} links, heading anchors, navigation, and legacy redirects.`);
