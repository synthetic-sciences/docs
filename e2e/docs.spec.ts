import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { aliases, atlasAliases, headings, slug } from "../src/navigation";

const sections = ["openscience", "account"];
const pages = sections.flatMap((section) => {
  const config = JSON.parse(readFileSync(new URL(`../src/content/${section}/docs.json`, import.meta.url), "utf8")) as {
    navigation: { tabs: { groups: { pages: string[] }[] }[] };
  };
  return config.navigation.tabs.flatMap((tab) => tab.groups.flatMap((group) => group.pages.map((path) => ({ section, path }))));
});

test("every page renders with metadata, real anchors, and no viewport overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const item of pages) {
    const source = readFileSync(new URL(`../src/content/${item.section}/${item.path}.mdx`, import.meta.url), "utf8");
    const title = source.match(/^title: "(.+)"$/m)![1];
    await page.goto(`#/${item.section}/${item.path}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(title + " · Synthetic Sciences Docs");
    for (const heading of headings(source, 3)) await expect(page.locator(`[id="${slug(heading)}"]`)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), `${item.section}/${item.path}`).toBe(false);
  }
  expect(errors).toEqual([]);
});

test("section links retain their page through refresh and browser history", async ({ page }) => {
  await page.goto("#/account/billing");
  await page.getByRole("complementary", { name: "on this page" }).getByRole("link", { name: "Optional auto reload" }).click();
  await expect(page).toHaveURL(/account\/billing#optional-auto-reload$/);
  await expect(page.getByRole("heading", { name: "Optional auto reload", exact: true })).toBeInViewport();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Optional auto reload", exact: true })).toBeInViewport();
  await page.getByRole("link", { name: "Usage reports", exact: true }).first().click();
  await page.goBack();
  await expect(page).toHaveURL(/account\/billing#optional-auto-reload$/);
  await page.goto("#/openscience/tool-catalog#rdkit");
  await expect(page.getByRole("heading", { name: "RDKit", exact: true })).toBeInViewport();
});

test("all legacy guides redirect and unknown routes remain recoverable", async ({ page }) => {
  for (const [old, target] of Object.entries(atlasAliases)) {
    await page.goto(`#/atlas/${old}`);
    await expect(page).toHaveURL(new RegExp(`/${target.section}/${target.path}$`));
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText("Page not found");
  }
  for (const [old, path] of Object.entries(aliases)) {
    await page.goto(`#/openscience/${old}`);
    await expect(page).toHaveURL(new RegExp(`/openscience/${path}$`));
  }
  await page.goto("#/account/missing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await page.goto("#/openscience/%E0%A4%A");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
});

test("keyboard search works across account and workbench guides", async ({ page }) => {
  await page.goto("#/openscience/index");
  const search = page.getByRole("combobox", { name: "Search documentation" });
  await search.fill("Ascent access");
  await search.press("ArrowDown");
  await search.press("ArrowUp");
  await search.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ascent access");
  await search.fill("no-results-for-this-query");
  await expect(page.getByText("No docs match that query.")).toBeVisible();
  await search.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
});

test("mobile search, collapsible navigation, and catalog tables remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("#/account/index");
  await expect(page.getByRole("combobox", { name: "Search documentation" })).toBeVisible();
  const menu = page.getByRole("button", { name: "Browse documentation" });
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page.getByRole("complementary", { name: "documentation navigation" }).getByRole("link", { name: "Wallet and billing", exact: true }).click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Wallet and billing");
  for (const route of ["account/billing", "openscience/ace-models", "openscience/tool-catalog", "openscience/skill-library"]) {
    await page.goto(`#/${route}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), route).toBe(false);
  }
  await page.goto("#/account/billing#optional-auto-reload");
  await expect(page.getByRole("heading", { name: "Optional auto reload", exact: true })).toBeInViewport();
  const nav = await page.getByRole("navigation", { name: "product sections" }).boundingBox();
  const header = await page.getByRole("banner").boundingBox();
  expect(nav!.y).toBeGreaterThanOrEqual(Math.max(0, header!.y + header!.height));
  await page.goto("#/account/billing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Wallet and billing");
  await expect(page.getByRole("button", { name: /Account & Graphs/ })).toHaveAttribute("aria-current", "page");
  await page.screenshot({ path: "test-results/account-mobile.png", fullPage: false, animations: "disabled" });
});

test("copy and generated exports include current content", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("#/openscience/quickstart");
  await page.getByRole("button", { name: "copy code", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "copy code", exact: true }).first()).toContainText("copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("@synsci/openscience@latest");
  for (const name of ["llms.txt", "llms-full.txt"]) {
    const response = await page.request.get(name);
    expect(response.ok()).toBe(true);
    const body = await response.text();
    expect(body).toContain("Ace model directory");
    expect(body).toContain("Atlas compatibility and migration");
  }
  await page.goto("#/account/index");
  await page.screenshot({ path: "test-results/account-desktop.png", fullPage: false, animations: "disabled" });
});
