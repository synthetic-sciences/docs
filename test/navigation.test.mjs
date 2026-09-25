import { test } from "node:test";
import assert from "node:assert/strict";
import { aliases, atlasAliases, headings, parseRoute, resolveLink, pageHref } from "../src/navigation.ts";

test("section links retain their page and survive a canonical round trip", () => {
  const route = parseRoute("#/openscience/usage#export-the-matching-records");
  assert.deepEqual(route, { section: "openscience", path: "usage", anchor: "export-the-matching-records" });
  assert.equal(pageHref(route.section, route.path, route.anchor), "#/openscience/usage#export-the-matching-records");
  assert.equal(resolveLink("#rates", { section: "account", path: "billing" }), "#/account/billing#rates");
  assert.equal(resolveLink("/openscience/usage#choose-a-source", route), "#/openscience/usage#choose-a-source");
});

test("legacy product and page URLs resolve without reviving retired instructions", () => {
  for (const [old, path] of Object.entries(aliases)) {
    for (const section of ["openscience", "agent-cli", "cli"]) assert.deepEqual(parseRoute(`#/${section}/${old}`), { section: "openscience", path });
  }
  for (const [old, target] of Object.entries(atlasAliases)) {
    for (const section of ["atlas", "graphs", "getting-started"]) assert.deepEqual(parseRoute(`#/${section}/${old}`), target);
    assert.deepEqual(parseRoute(`#/${old}`, "atlas"), target);
  }
});

test("unknown and malformed URLs stay recoverable", () => {
  assert.deepEqual(parseRoute("#/api-reference/atlas-rest"), { section: "account", path: "api" });
  assert.deepEqual(parseRoute("#/first-graph"), { section: "account", path: "graphs" });
  assert.deepEqual(parseRoute("#/account/missing"), { section: "account", path: "missing" });
  assert.deepEqual(parseRoute("#/openscience/%E0%A4%A"), { section: "openscience", path: "%E0%A4%A" });
  assert.deepEqual(parseRoute(""), { section: "openscience", path: "index" });
  assert.equal(resolveLink("https://example.com/#part", { section: "account", path: "index" }), "https://example.com/#part");
  assert.equal(resolveLink("/billing", { section: "account", path: "index" }), "#/account/billing");
});

test("table of contents ignores examples and supports third-level targets", () => {
  const source = "## Real\n```markdown\n## Example\n```\n### Detail\n~~~text\n### Also an example\n~~~\n## End";
  assert.deepEqual(headings(source), ["Real", "End"]);
  assert.deepEqual(headings(source, 3), ["Real", "Detail", "End"]);
});
