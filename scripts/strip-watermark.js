#!/usr/bin/env node
/**
 * Post-build step that injects CSS into every static HTML file under out/
 * to hide the "Powered by Mintlify" attribution from the deployed site.
 *
 * The watermark is rendered client-side as an <a> tag pointing to
 * https://www.mintlify.com with a utm_campaign=poweredBy query parameter,
 * inside a flex container with a 1px divider above it. The selectors below
 * hide the link itself and any container/divider that exists only to wrap
 * the link. They use href*= and :has() so they degrade gracefully if the
 * surrounding markup changes.
 */

const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");

const CSS =
  '<style id="synsci-strip-watermark">' +
  // 1. Hide the watermark link itself.
  'a[href*="utm_campaign=poweredBy"]{display:none!important}' +
  // 2. Hide any direct parent div that exists only to wrap the watermark.
  'div:has(>a[href*="utm_campaign=poweredBy"]),' +
  'div:has(>div>a[href*="utm_campaign=poweredBy"]),' +
  'div:has(>div>div>a[href*="utm_campaign=poweredBy"]){display:none!important}' +
  // 3. Hide the 1px divider that immediately precedes the watermark container.
  'div.h-\\[1px\\]:has(+div:has(a[href*="utm_campaign=poweredBy"])){display:none!important}' +
  "</style>";

let touched = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) inject(full);
  }
}

function inject(file) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes('id="synsci-strip-watermark"')) return;
  if (!html.includes("</head>")) return;
  html = html.replace("</head>", CSS + "</head>");
  fs.writeFileSync(file, html);
  touched += 1;
}

walk(OUT_DIR);
console.log(
  `Watermark CSS injected into ${touched} HTML files under ${OUT_DIR}`
);
