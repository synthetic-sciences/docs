// Validates the docs navigation and internal links after the section restructure.
// - Every page referenced in a section's docs.json must exist on disk.
// - Every internal MDX link / Card href (/section/page or /page) must resolve.
// - Warns about page files that no nav references (orphans).
// Exits non-zero on any hard error so it can gate a build.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "src", "content");

const SECTIONS = ["getting-started", "graphs", "library", "agent-cli"];

function flattenPages(items) {
  return items.flatMap((item) => (typeof item === "string" ? [item] : flattenPages(item.pages)));
}

function listPageFiles(section) {
  const dir = join(contentDir, section);
  const out = [];
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(mdx|md)$/.test(entry)) out.push(relative(dir, full).replace(/\.(mdx|md)$/, ""));
    }
  };
  walk(dir);
  return out;
}

const errors = [];
const warnings = [];

// section -> Set of page paths that exist on disk
const filesBySection = {};
for (const section of SECTIONS) {
  filesBySection[section] = new Set(listPageFiles(section));
}

const pageExists = (section, path) =>
  SECTIONS.includes(section) && filesBySection[section].has(path || "index");

// 1. Nav config references resolve, and collect referenced pages.
const navReferenced = {};
for (const section of SECTIONS) {
  navReferenced[section] = new Set();
  const configPath = join(contentDir, section, "docs.json");
  if (!existsSync(configPath)) {
    errors.push(`Missing docs.json for section "${section}"`);
    continue;
  }
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const pages = config.navigation.tabs.flatMap((tab) =>
    tab.groups.flatMap((group) => flattenPages(group.pages)),
  );
  for (const page of pages) {
    navReferenced[section].add(page);
    if (!filesBySection[section].has(page)) {
      errors.push(`[nav] ${section}/docs.json references "${page}" but src/content/${section}/${page}.mdx is missing`);
    }
  }
}

// 2. Orphans: page files not referenced by their section nav.
for (const section of SECTIONS) {
  for (const file of filesBySection[section]) {
    if (!navReferenced[section].has(file)) {
      warnings.push(`[orphan] src/content/${section}/${file}.mdx is not referenced in ${section}/docs.json`);
    }
  }
}

// 3. Internal links in MDX (markdown links + Card/href).
const linkRe = /\]\((\/[^)\s]+)\)/g;
const hrefRe = /href=["'](\/[^"']+)["']/g;

for (const section of SECTIONS) {
  for (const file of filesBySection[section]) {
    const filePath = existsSync(join(contentDir, section, `${file}.mdx`))
      ? join(contentDir, section, `${file}.mdx`)
      : join(contentDir, section, `${file}.md`);
    const src = readFileSync(filePath, "utf8");
    const hrefs = new Set();
    let m;
    while ((m = linkRe.exec(src))) hrefs.add(m[1]);
    while ((m = hrefRe.exec(src))) hrefs.add(m[1]);

    for (const href of hrefs) {
      const clean = href.split("#")[0].replace(/\/$/, "");
      if (!clean || clean === "/") continue;
      const segments = clean.slice(1).split("/");
      let targetSection;
      let targetPath;
      if (SECTIONS.includes(segments[0])) {
        targetSection = segments[0];
        targetPath = segments.slice(1).join("/") || "index";
      } else {
        targetSection = section;
        targetPath = segments.join("/");
      }
      if (!pageExists(targetSection, targetPath)) {
        errors.push(`[link] ${section}/${file}.mdx -> "${href}" does not resolve (${targetSection}/${targetPath})`);
      }
    }
  }
}

const total = SECTIONS.reduce((n, s) => n + filesBySection[s].size, 0);
console.log(`Checked ${total} pages across ${SECTIONS.length} sections.`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log("  " + w);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}
console.log("\nAll nav entries and internal links resolve. No 404s.");
