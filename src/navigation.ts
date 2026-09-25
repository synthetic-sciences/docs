export type SectionKey = "openscience" | "account";
export type Route = { section: SectionKey; path: string; anchor?: string };

export const aliases: Record<string, string> = {
  "first-session": "sessions",
  "sub-agents": "agents",
  "web-ui": "workspace",
  "server-mode": "workspace",
  "cli-runtime": "commands",
  "feature-map": "commands",
  codex: "models",
  credentials: "ace",
  connect: "ace",
  gateway: "ace",
  atlas: "ace",
  security: "permissions",
  sandbox: "permissions",
  artifacts: "results",
  "scientific-data": "databases",
};

export const atlasAliases: Record<string, Route> = {
  index: { section: "account", path: "compatibility" },
  installation: { section: "account", path: "quickstart" },
  quickstart: { section: "account", path: "graphs" },
  "graph-model": { section: "account", path: "graphs" },
  authentication: { section: "account", path: "authentication" },
  "api-keys": { section: "account", path: "api-keys" },
  billing: { section: "account", path: "billing" },
  "research-loop": { section: "openscience", path: "experiment-tracking" },
  runs: { section: "openscience", path: "experiment-tracking" },
  optimize: { section: "openscience", path: "autoresearch" },
  reproduction: { section: "openscience", path: "reproduction" },
  evidence: { section: "account", path: "evidence" },
  forking: { section: "account", path: "evidence" },
  "web-views": { section: "account", path: "graphs" },
  skills: { section: "openscience", path: "skills" },
  "onboard-agent": { section: "account", path: "compatibility" },
  "cli-overview": { section: "account", path: "compatibility" },
  commands: { section: "account", path: "compatibility" },
  "rest-api": { section: "account", path: "api" },
  "agent-onboarding": { section: "account", path: "compatibility" },
  "auth-config": { section: "account", path: "authentication" },
  "cli-runtime": { section: "account", path: "compatibility" },
  "feature-map": { section: "account", path: "compatibility" },
  "api-reference/introduction": { section: "account", path: "api" },
  "api-reference/atlas-rest": { section: "account", path: "api" },
  "first-graph": { section: "account", path: "graphs" },
  graph: { section: "account", path: "graphs" },
  "artifacts-files": { section: "account", path: "evidence" },
  "exports-imports": { section: "account", path: "evidence" },
  safety: { section: "account", path: "compatibility" },
};

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function parseRoute(hash: string, legacyProduct = "cli"): Route {
  const raw = hash.replace(/^#?\/?/, "");
  const split = raw.indexOf("#");
  const location = decode(split < 0 ? raw : raw.slice(0, split)).replace(/\/$/, "");
  const anchor = split < 0 ? undefined : decode(raw.slice(split + 1)) || undefined;
  const segments = location.split("/");
  const section = segments[0];
  const path = segments.slice(1).join("/") || "index";
  if (["atlas", "graphs", "getting-started"].includes(section)) {
    return { ...(atlasAliases[path] ?? { section: "account", path }), ...(anchor ? { anchor } : {}) };
  }
  if (section === "account") return { section, path, ...(anchor ? { anchor } : {}) };
  if (["openscience", "agent-cli", "cli"].includes(section)) {
    if (path === "agent-onboarding") return { section: "account", path: "compatibility" };
    return { section: "openscience", path: aliases[path] ?? path, ...(anchor ? { anchor } : {}) };
  }
  if (legacyProduct === "atlas" && location && atlasAliases[location]) {
    return { ...atlasAliases[location], ...(anchor ? { anchor } : {}) };
  }
  if (location === "agent-onboarding") return { section: "account", path: "compatibility" };
  if (["auth-config", "api-reference/introduction", "api-reference/atlas-rest", "first-graph", "graph", "artifacts-files", "exports-imports", "safety"].includes(location)) {
    return { ...atlasAliases[location], ...(anchor ? { anchor } : {}) };
  }
  return { section: "openscience", path: aliases[location] ?? (location || "index"), ...(anchor ? { anchor } : {}) };
}

export function pageHref(section: SectionKey, path: string, anchor?: string): string {
  return `#/${section}/${path}${anchor ? "#" + encodeURIComponent(anchor) : ""}`;
}

export function resolveLink(href: string | undefined, current: Route): string | undefined {
  if (!href || /^(https?:|mailto:|tel:)/.test(href)) return href;
  if (href.startsWith("#") && !href.startsWith("#/")) return pageHref(current.section, current.path, decode(href.slice(1)));
  const raw = href.replace(/^#?\/?/, "");
  const qualified = /^(openscience|account|atlas|graphs|getting-started|agent-cli|cli)(\/|$)/.test(raw);
  const route = parseRoute(qualified ? raw : `${current.section}/${raw}`);
  return pageHref(route.section, route.path.replace(/\.(mdx|md)$/, ""), route.anchor);
}

export function headings(markdown: string, depth = 2): string[] {
  const state = { fence: "" };
  return markdown.split("\n").flatMap((line) => {
    const fence = line.match(/^\s*([\x60]{3,}|~{3,})/);
    if (fence) {
      if (!state.fence) state.fence = fence[1];
      else if (fence[1][0] === state.fence[0] && fence[1].length >= state.fence.length) state.fence = "";
      return [];
    }
    const heading = line.match(/^(#{2,3}) (.+)$/);
    return !state.fence && heading && heading[1].length <= depth ? [heading[2].trim()] : [];
  });
}
