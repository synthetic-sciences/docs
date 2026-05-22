import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  FileText,
  GitBranch,
  KeyRound,
  Map,
  Moon,
  PackageCheck,
  Search,
  ShieldCheck,
  Sun,
  Terminal,
} from "lucide-react";
import { useTheme } from "./theme";
import atlasDocsConfig from "./content/atlas/docs.json";
import cliDocsConfig from "./content/cli/docs.json";
import atlasIndexMdx from "./content/atlas/index.mdx?raw";
import atlasQuickstartMdx from "./content/atlas/quickstart.mdx?raw";
import atlasFirstGraphMdx from "./content/atlas/first-graph.mdx?raw";
import atlasSourceToGraphMdx from "./content/atlas/source-to-graph.mdx?raw";
import atlasAgentOnboardingMdx from "./content/atlas/agent-onboarding.mdx?raw";
import atlasGraphMdx from "./content/atlas/graph.mdx?raw";
import atlasSourcesSearchMdx from "./content/atlas/sources-search.mdx?raw";
import atlasArtifactsFilesMdx from "./content/atlas/artifacts-files.mdx?raw";
import atlasExportsImportsMdx from "./content/atlas/exports-imports.mdx?raw";
import atlasAuthConfigMdx from "./content/atlas/auth-config.mdx?raw";
import atlasCliRuntimeMdx from "./content/atlas/cli-runtime.mdx?raw";
import atlasFeatureMapMdx from "./content/atlas/feature-map.mdx?raw";
import atlasCommandsMdx from "./content/atlas/commands.mdx?raw";
import atlasSkillsMdx from "./content/atlas/skills.mdx?raw";
import atlasApiIntroductionMdx from "./content/atlas/api-reference/introduction.mdx?raw";
import atlasRestMdx from "./content/atlas/api-reference/atlas-rest.mdx?raw";
import atlasSafetyMdx from "./content/atlas/safety.mdx?raw";
import cliIndexMdx from "./content/cli/index.mdx?raw";
import cliInstallationMdx from "./content/cli/installation.mdx?raw";
import cliQuickstartMdx from "./content/cli/quickstart.mdx?raw";
import cliFirstSessionMdx from "./content/cli/first-session.mdx?raw";
import cliAgentOnboardingMdx from "./content/cli/agent-onboarding.mdx?raw";
import cliSessionsMdx from "./content/cli/sessions.mdx?raw";
import cliModelsMdx from "./content/cli/models.mdx?raw";
import cliSubAgentsMdx from "./content/cli/sub-agents.mdx?raw";
import cliSkillsMdx from "./content/cli/skills.mdx?raw";
import cliCliRuntimeMdx from "./content/cli/cli-runtime.mdx?raw";
import cliConnectMdx from "./content/cli/connect.mdx?raw";
import cliCodexMdx from "./content/cli/codex.mdx?raw";
import cliCredentialsMdx from "./content/cli/credentials.mdx?raw";
import cliSecurityMdx from "./content/cli/security.mdx?raw";
import cliFeatureMapMdx from "./content/cli/feature-map.mdx?raw";
import cliCommandsMdx from "./content/cli/commands.mdx?raw";
import cliWebUiMdx from "./content/cli/web-ui.mdx?raw";
import cliServerModeMdx from "./content/cli/server-mode.mdx?raw";

const mono = `"JetBrains Mono", "SF Mono", ui-monospace, monospace`;

const DOCS_SERIF = `"Computer Modern Concrete", "Concrete Roman", Georgia, "Times New Roman", serif`;

type DocsConfig = {
  name?: string;
  navigation: {
    tabs: Array<{
      tab: string;
      groups: Array<{
        group: string;
        pages: Array<string | { group: string; pages: string[] }>;
      }>;
    }>;
    global?: {
      anchors?: Array<{
        anchor: string;
        href: string;
      }>;
    };
  };
  navbar?: {
    links?: Array<{
      label: string;
      href: string;
    }>;
    primary?: {
      label: string;
      href: string;
    };
  };
};

type DocsPage = {
  path: string;
  title: string;
  description: string;
  icon: ReactNode;
  body: string;
  headings: string[];
};

type SearchResult = Pick<DocsPage, "path" | "title" | "description" | "icon">;

type MintlifyCard = {
  title: string;
  href: string;
  icon?: string;
  body: string;
  horizontal?: boolean;
};

type ProductKey = "atlas" | "cli";

const PRODUCT_LABELS: Record<ProductKey, string> = {
  atlas: "Atlas @synsci/atlas@0.5.11",
  cli: "CLI synsci@1.1.125",
};

const PRODUCT_DOC_NAMES: Record<ProductKey, string> = {
  atlas: "Atlas Docs",
  cli: "Synci CLI Docs",
};

const ATLAS_SOURCES: Record<string, string> = {
  index: atlasIndexMdx,
  quickstart: atlasQuickstartMdx,
  "first-graph": atlasFirstGraphMdx,
  "source-to-graph": atlasSourceToGraphMdx,
  "agent-onboarding": atlasAgentOnboardingMdx,
  graph: atlasGraphMdx,
  "sources-search": atlasSourcesSearchMdx,
  "artifacts-files": atlasArtifactsFilesMdx,
  "exports-imports": atlasExportsImportsMdx,
  "auth-config": atlasAuthConfigMdx,
  "cli-runtime": atlasCliRuntimeMdx,
  "feature-map": atlasFeatureMapMdx,
  commands: atlasCommandsMdx,
  skills: atlasSkillsMdx,
  "api-reference/introduction": atlasApiIntroductionMdx,
  "api-reference/atlas-rest": atlasRestMdx,
  safety: atlasSafetyMdx,
};

const CLI_SOURCES: Record<string, string> = {
  index: cliIndexMdx,
  installation: cliInstallationMdx,
  quickstart: cliQuickstartMdx,
  "first-session": cliFirstSessionMdx,
  "agent-onboarding": cliAgentOnboardingMdx,
  sessions: cliSessionsMdx,
  models: cliModelsMdx,
  "sub-agents": cliSubAgentsMdx,
  skills: cliSkillsMdx,
  "cli-runtime": cliCliRuntimeMdx,
  connect: cliConnectMdx,
  codex: cliCodexMdx,
  credentials: cliCredentialsMdx,
  security: cliSecurityMdx,
  "feature-map": cliFeatureMapMdx,
  commands: cliCommandsMdx,
  "web-ui": cliWebUiMdx,
  "server-mode": cliServerModeMdx,
};

const PRODUCT_SOURCES: Record<ProductKey, Record<string, string>> = {
  atlas: ATLAS_SOURCES,
  cli: CLI_SOURCES,
};

const PRODUCT_CONFIGS: Record<ProductKey, DocsConfig> = {
  atlas: atlasDocsConfig as DocsConfig,
  cli: cliDocsConfig as DocsConfig,
};

const ICONS: Record<string, ReactNode> = {
  index: <GitBranch size={17} strokeWidth={1.8} />,
  quickstart: <Terminal size={17} strokeWidth={1.8} />,
  installation: <PackageCheck size={17} strokeWidth={1.8} />,
  connect: <KeyRound size={17} strokeWidth={1.8} />,
  codex: <KeyRound size={17} strokeWidth={1.8} />,
  credentials: <KeyRound size={17} strokeWidth={1.8} />,
  "first-session": <Terminal size={17} strokeWidth={1.8} />,
  sessions: <Terminal size={17} strokeWidth={1.8} />,
  models: <PackageCheck size={17} strokeWidth={1.8} />,
  "sub-agents": <PackageCheck size={17} strokeWidth={1.8} />,
  "web-ui": <Terminal size={17} strokeWidth={1.8} />,
  "server-mode": <Terminal size={17} strokeWidth={1.8} />,
  "first-graph": <GitBranch size={17} strokeWidth={1.8} />,
  "source-to-graph": <Search size={17} strokeWidth={1.8} />,
  "agent-onboarding": <PackageCheck size={17} strokeWidth={1.8} />,
  graph: <GitBranch size={17} strokeWidth={1.8} />,
  "sources-search": <Search size={17} strokeWidth={1.8} />,
  "artifacts-files": <FileText size={17} strokeWidth={1.8} />,
  "exports-imports": <ArrowUpRight size={17} strokeWidth={1.8} />,
  "auth-config": <KeyRound size={17} strokeWidth={1.8} />,
  "cli-runtime": <Terminal size={17} strokeWidth={1.8} />,
  "feature-map": <Map size={17} strokeWidth={1.8} />,
  commands: <Terminal size={17} strokeWidth={1.8} />,
  skills: <BookOpen size={17} strokeWidth={1.8} />,
  "api-reference/introduction": <BookOpen size={17} strokeWidth={1.8} />,
  "api-reference/atlas-rest": <BookOpen size={17} strokeWidth={1.8} />,
  safety: <ShieldCheck size={17} strokeWidth={1.8} />,
  security: <ShieldCheck size={17} strokeWidth={1.8} />,
};

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;

function parseFrontmatter(source: string): { title: string; description: string; body: string } {
  const match = source.match(FRONTMATTER_RE);
  if (!match) return { title: "Untitled", description: "", body: source };
  const frontmatter = match[1];
  const body = source.slice(match[0].length);
  const field = (name: string) => {
    const line = frontmatter
      .split("\n")
      .find((entry) => entry.trim().startsWith(`${name}:`));
    return line
      ? line.split(":").slice(1).join(":").trim().replace(/^["']|["']$/g, "")
      : "";
  };
  return {
    title: field("title") || "Untitled",
    description: field("description"),
    body,
  };
}

function extractHeadings(markdown: string): string[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace(/^##\s+/, "").trim())
    .slice(0, 8);
}

function flattenPages(items: Array<string | { group: string; pages: string[] }>): string[] {
  return items.flatMap((item) => (typeof item === "string" ? [item] : item.pages));
}

function buildDocPages(sources: Record<string, string>): Record<string, DocsPage> {
  return Object.fromEntries(
    Object.entries(sources).map(([path, source]) => {
      const parsed = parseFrontmatter(source);
      return [
        path,
        {
          path,
          title: parsed.title,
          description: parsed.description,
          icon: ICONS[path] ?? <BookOpen size={17} strokeWidth={1.8} />,
          body: parsed.body,
          headings: extractHeadings(parsed.body),
        },
      ];
    }),
  );
}

const PRODUCT_DOC_PAGES: Record<ProductKey, Record<string, DocsPage>> = {
  atlas: buildDocPages(ATLAS_SOURCES),
  cli: buildDocPages(CLI_SOURCES),
};

let CURRENT_DOC_PAGES: Record<string, DocsPage> = PRODUCT_DOC_PAGES.atlas;

function pageFromHash(productPages: Record<string, DocsPage>): string {
  if (typeof window === "undefined") return "index";
  const value = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
  return value && productPages[value] ? value : "index";
}

function pageHref(path: string): string {
  return `#/${path}`;
}

function docsHref(href: string): string {
  const docsPath = href.startsWith("/") ? href.slice(1).replace(/\/$/, "") : "";
  return docsPath && CURRENT_DOC_PAGES[docsPath] ? pageHref(docsPath) : href;
}

function parseMdxAttrs(attrs: string): Record<string, string | boolean> {
  const parsed: Record<string, string | boolean> = {};
  for (const match of attrs.matchAll(/([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}))?/g)) {
    const key = match[1];
    if (!key) continue;
    parsed[key] = match[2] ?? match[3] ?? match[4] ?? true;
  }
  return parsed;
}

function dedent(source: string): string {
  const lines = source.replace(/\t/g, "  ").split("\n");
  let min = Infinity;
  for (const line of lines) {
    if (line.trim() === "") continue;
    const leading = line.match(/^( *)/);
    if (leading) min = Math.min(min, leading[1].length);
  }
  if (!Number.isFinite(min) || min === 0) return source;
  return lines.map((line) => (line.length >= min ? line.slice(min) : line)).join("\n");
}

function parseCards(source: string): MintlifyCard[] {
  return Array.from(source.matchAll(/<Card\b([^>]*)>\s*([\s\S]*?)\s*<\/Card>/g)).map((match) => {
    const attrs = parseMdxAttrs(match[1] ?? "");
    return {
      title: String(attrs.title ?? "Untitled"),
      href: String(attrs.href ?? "#"),
      icon: attrs.icon ? String(attrs.icon) : undefined,
      horizontal: Boolean(attrs.horizontal),
      body: dedent(match[2] ?? "").trim(),
    };
  });
}

function iconForCard(card: MintlifyCard): ReactNode {
  const docsPath = card.href.startsWith("/") ? card.href.slice(1).replace(/\/$/, "") : "";
  return CURRENT_DOC_PAGES[docsPath]?.icon ?? <BookOpen size={17} strokeWidth={1.8} />;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="docs-copy"
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
      aria-label="copy code"
      title="copy code"
    >
      {copied ? <Check size={13} strokeWidth={1.8} /> : <Copy size={13} strokeWidth={1.8} />}
      <span>{copied ? "copied" : "copy"}</span>
    </button>
  );
}

const markdownComponents: Components = {
  h2({ children }) {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return <h2 id={id}>{children}</h2>;
  },
  a({ href, children }) {
    const external = href?.startsWith("http");
    const internalDocsHref = href ? docsHref(href) : undefined;
    return (
      <a
        href={internalDocsHref}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {children}
        {external ? <ArrowUpRight size={12} strokeWidth={1.8} /> : null}
      </a>
    );
  },
  pre({ children }) {
    const text = extractCodeText(children);
    return (
      <div className="docs-code-wrap">
        <CopyButton text={text} />
        <pre>{children}</pre>
      </div>
    );
  },
  code({ className, children }) {
    const isBlock = className?.startsWith("language-");
    return (
      <code className={isBlock ? className : "docs-inline-code"}>
        {children}
      </code>
    );
  },
  table({ children }) {
    return <div className="docs-table-wrap"><table>{children}</table></div>;
  },
  blockquote({ children }) {
    return <blockquote className="docs-callout">{children}</blockquote>;
  },
};

function extractCodeText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractCodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return extractCodeText(props?.children ?? "");
  }
  return "";
}

function MarkdownChunk({ children }: { children: string }) {
  if (!children.trim()) return null;
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {children}
    </ReactMarkdown>
  );
}

function MintlifyCardView({ card }: { card: MintlifyCard }) {
  const external = card.href.startsWith("http");
  return (
    <a
      className={card.horizontal ? "docs-card docs-card-horizontal" : "docs-card"}
      href={docsHref(card.href)}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span className="docs-card-icon">{iconForCard(card)}</span>
      <span className="docs-card-copy">
        <strong>{card.title}</strong>
        <small>{card.body}</small>
      </span>
      <ArrowUpRight size={14} strokeWidth={1.8} />
    </a>
  );
}

function MintlifyCardGrid({ source, cols }: { source: string; cols: number }) {
  const cards = parseCards(source);
  if (cards.length === 0) return null;
  return (
    <div className="docs-card-grid" style={{ "--docs-card-cols": String(cols) } as CSSProperties}>
      {cards.map((card) => (
        <MintlifyCardView key={`${card.title}-${card.href}`} card={card} />
      ))}
    </div>
  );
}

function MintlifySteps({ source }: { source: string }) {
  const steps = Array.from(source.matchAll(/<Step\s+([^>]*)>\s*([\s\S]*?)\s*<\/Step>/g)).map((match) => {
    const attrs = parseMdxAttrs(match[1] ?? "");
    return {
      title: String(attrs.title ?? "Step"),
      body: dedent(match[2] ?? "").trim(),
    };
  });
  if (steps.length === 0) return null;
  return (
    <div className="docs-step-list">
      {steps.map((step, index) => (
        <section key={`${step.title}-${index}`} className="docs-step">
          <span>{index + 1}</span>
          <div>
            <h3>{step.title}</h3>
            <MarkdownChunk>{step.body}</MarkdownChunk>
          </div>
        </section>
      ))}
    </div>
  );
}

function MintlifyCallout({ children }: { children: string }) {
  return (
    <blockquote className="docs-callout docs-callout-warning">
      <MarkdownChunk>{dedent(children).trim()}</MarkdownChunk>
    </blockquote>
  );
}

function renderMintlifyContent(source: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const componentRe = /<(Columns|CardGroup)\b([^>]*)>\s*([\s\S]*?)\s*<\/\1>|<Card\b([^>]*)>\s*([\s\S]*?)\s*<\/Card>|<Steps>\s*([\s\S]*?)\s*<\/Steps>|<Warning>\s*([\s\S]*?)\s*<\/Warning>/g;
  let lastIndex = 0;
  let index = 0;

  for (const match of source.matchAll(componentRe)) {
    const matchIndex = match.index ?? 0;
    const before = source.slice(lastIndex, matchIndex);
    if (before.trim()) nodes.push(<MarkdownChunk key={`md-${index++}`}>{before}</MarkdownChunk>);

    if (match[1]) {
      const attrs = parseMdxAttrs(match[2] ?? "");
      const cols = Number(attrs.cols ?? 2);
      nodes.push(
        <MintlifyCardGrid
          key={`cards-${index++}`}
          source={match[3] ?? ""}
          cols={Number.isFinite(cols) && cols > 0 ? cols : 2}
        />,
      );
    } else if (match[4] !== undefined) {
      const card = parseCards(`<Card ${match[4]}>${match[5] ?? ""}</Card>`)[0];
      if (card) nodes.push(<MintlifyCardView key={`card-${index++}`} card={card} />);
    } else if (match[6] !== undefined) {
      nodes.push(<MintlifySteps key={`steps-${index++}`} source={match[6] ?? ""} />);
    } else if (match[7] !== undefined) {
      nodes.push(<MintlifyCallout key={`warning-${index++}`}>{match[7] ?? ""}</MintlifyCallout>);
    }

    lastIndex = matchIndex + match[0].length;
  }

  const tail = source.slice(lastIndex);
  if (tail.trim()) nodes.push(<MarkdownChunk key={`md-${index++}`}>{tail}</MarkdownChunk>);
  return nodes;
}

function loadProductFromStorage(): ProductKey {
  if (typeof window === "undefined") return "atlas";
  try {
    const stored = window.localStorage.getItem("docs-product");
    if (stored === "cli" || stored === "atlas") return stored;
  } catch {
    /* localStorage may be unavailable */
  }
  return "atlas";
}

export function DocumentationPage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [product, setProductState] = useState<ProductKey>(loadProductFromStorage);
  const docPages = PRODUCT_DOC_PAGES[product];
  CURRENT_DOC_PAGES = docPages;
  const setProduct = (next: ProductKey) => {
    if (next === product) return;
    CURRENT_DOC_PAGES = PRODUCT_DOC_PAGES[next];
    try {
      window.localStorage.setItem("docs-product", next);
    } catch {
      /* ignore */
    }
    window.location.hash = pageHref("index");
    setProductState(next);
    setActivePath("index");
  };
  const [activePath, setActivePath] = useState(() => pageFromHash(docPages));
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const activePage = docPages[activePath] ?? docPages.index;
  const config = PRODUCT_CONFIGS[product];
  const navTabs = config.navigation.tabs;
  const docsSourceName = PRODUCT_DOC_NAMES[product];
  const orderedPaths = useMemo(
    () =>
      navTabs
        .flatMap((tab) => tab.groups.flatMap((group) => flattenPages(group.pages)))
        .filter((path) => docPages[path]),
    [navTabs, docPages],
  );
  const activeTab = useMemo(
    () =>
      navTabs.find((tab) =>
        tab.groups.some((group) => flattenPages(group.pages).includes(activePage.path)),
      ) ?? navTabs[0],
    [activePage.path, navTabs],
  );
  const activeGroup = useMemo(
    () =>
      activeTab?.groups
        .find((group) => flattenPages(group.pages).includes(activePage.path)),
    [activePage.path, activeTab],
  );
  const activeIndex = orderedPaths.indexOf(activePage.path);
  const previousPage = activeIndex > 0 ? docPages[orderedPaths[activeIndex - 1]] : null;
  const nextPage =
    activeIndex >= 0 && activeIndex < orderedPaths.length - 1
      ? docPages[orderedPaths[activeIndex + 1]]
      : null;
  const searchResults = useMemo<SearchResult[]>(() => {
    const pages = orderedPaths.map((path) => docPages[path]).filter(Boolean);
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return pages.slice(0, 6);
    return pages
      .filter((page) => {
        const haystack = `${page.title} ${page.description} ${page.body}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [orderedPaths, query, docPages]);

  useEffect(() => {
    const onHashChange = () => setActivePath(pageFromHash(docPages));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [docPages]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        document.querySelector<HTMLInputElement>(".docs-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="atlas-docs-page">
      <header className="docs-topbar">
        <a href="https://app.syntheticsciences.ai" className="docs-brand">
          <img src="/synsc-logo.png" alt="" />
          <span className="docs-brand-text">
            <small>Synthetic Sciences</small>
            <strong>{product === "atlas" ? "Atlas docs" : "Synci CLI docs"}</strong>
          </span>
        </a>
        <div className="docs-version-toggle" role="tablist" aria-label="documentation product">
          <button
            type="button"
            role="tab"
            aria-selected={product === "atlas"}
            className={product === "atlas" ? "active" : undefined}
            onClick={() => setProduct("atlas")}
          >
            {PRODUCT_LABELS.atlas}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={product === "cli"}
            className={product === "cli" ? "active" : undefined}
            onClick={() => setProduct("cli")}
          >
            {PRODUCT_LABELS.cli}
          </button>
        </div>
        <div className="docs-search" role="search">
          <Search size={14} strokeWidth={1.8} />
          <input
            className="docs-search-input"
            aria-label="Search documentation"
            value={query}
            onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search or jump to..."
            type="search"
          />
          <kbd>⌘K</kbd>
          {searchOpen ? (
            <div className="docs-search-results" role="listbox" aria-label="documentation search results">
              {searchResults.length > 0 ? (
                searchResults.map((page) => (
                  <a
                    key={page.path}
                    href={pageHref(page.path)}
                    role="option"
                    aria-selected={activePath === page.path}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      window.location.hash = pageHref(page.path);
                      setActivePath(page.path);
                      setQuery("");
                      setSearchOpen(false);
                    }}
                  >
                    <span>{page.icon}</span>
                    <strong>{page.title}</strong>
                    <small>{page.description}</small>
                  </a>
                ))
              ) : (
                <span className="docs-search-empty">No docs match that query.</span>
              )}
            </div>
          ) : null}
        </div>
        <nav className="docs-actions" aria-label="documentation actions">
          <button
            type="button"
            className="docs-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "switch to light mode" : "switch to dark mode"}
            title={theme === "dark" ? "light mode" : "dark mode"}
          >
            {theme === "dark" ? (
              <Sun size={14} strokeWidth={1.8} />
            ) : (
              <Moon size={14} strokeWidth={1.8} />
            )}
            <span>{theme === "dark" ? "light" : "dark"}</span>
          </button>
          {config.navbar?.primary ? (
            <a className="docs-topbar-cta" href={config.navbar.primary.href}>
              {config.navbar.primary.label.toLowerCase()}
              <ArrowUpRight size={13} strokeWidth={1.8} />
            </a>
          ) : (
            <a className="docs-topbar-cta" href="/atlas">
              open app
              <ArrowUpRight size={13} strokeWidth={1.8} />
            </a>
          )}
        </nav>
      </header>

      <div className="docs-shell">
        <aside className="docs-sidebar" aria-label="documentation navigation">
          <div className="docs-sidebar-title">
            <span>{docsSourceName}</span>
            <small>{PRODUCT_LABELS[product]}</small>
          </div>
          <nav className="docs-section-tabs" aria-label="documentation sections">
            {navTabs.map((tab) => {
              const firstPage = tab.groups.flatMap((group) => flattenPages(group.pages)).find((path) => docPages[path]);
              return firstPage ? (
                <a
                  key={tab.tab}
                  className={activeTab?.tab === tab.tab ? "active" : undefined}
                  href={pageHref(firstPage)}
                  onClick={() => setActivePath(firstPage)}
                >
                  {tab.tab}
                </a>
              ) : null;
            })}
          </nav>
          {activeTab ? (
            <div key={activeTab.tab}>
              {activeTab.groups.map((group) => (
                <div key={group.group} className="docs-sidebar-group">
                  <span>{group.group}</span>
                  {flattenPages(group.pages).map((path) => {
                    const page = docPages[path];
                    if (!page) return null;
                    return (
                      <a
                        key={path}
                        href={pageHref(path)}
                        className={activePath === path ? "active" : undefined}
                        onClick={() => setActivePath(path)}
                      >
                        <span>{page.icon}</span>
                        {page.title}
                      </a>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : null}
        </aside>

        <main className="docs-main">
          <nav className="docs-breadcrumbs" aria-label="breadcrumbs">
            <a href="#/index">Docs</a>
            <ChevronRight size={13} strokeWidth={1.8} />
            {activeGroup ? <span>{activeGroup.group}</span> : null}
          </nav>
          <section className="docs-hero">
            <h1>{activePage.title}</h1>
            {activePage.description ? <p>{activePage.description}</p> : null}
          </section>

          <article className="docs-markdown">
            {renderMintlifyContent(activePage.body)}
          </article>

          <nav className="docs-pagination" aria-label="documentation pagination">
            {previousPage ? (
              <a href={pageHref(previousPage.path)} onClick={() => setActivePath(previousPage.path)}>
                <ChevronLeft size={16} strokeWidth={1.8} />
                <span>
                  <small>Previous</small>
                  {previousPage.title}
                </span>
              </a>
            ) : <span />}
            {nextPage ? (
              <a href={pageHref(nextPage.path)} onClick={() => setActivePath(nextPage.path)}>
                <span>
                  <small>Next</small>
                  {nextPage.title}
                </span>
                <ChevronRight size={16} strokeWidth={1.8} />
              </a>
            ) : <span />}
          </nav>
        </main>

        <aside className="docs-toc" aria-label="on this page">
          <span>On this page</span>
          {activePage.headings.length > 0 ? (
            activePage.headings.map((heading) => (
              <a key={heading} href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}>
                {heading}
              </a>
            ))
          ) : (
            <span className="docs-toc-empty">No sections</span>
          )}
          <div className="docs-agent-links">
            {(config.navigation.global?.anchors ?? []).map((anchor) => (
              <a key={anchor.href} href={anchor.href}>
                {anchor.anchor}
              </a>
            ))}
          </div>
        </aside>
      </div>

      <style>{docsCss}</style>
    </div>
  );
}

const docsCss = `
  .atlas-docs-page {
    --color-bg: #fafbfc;
    --color-bg-subtle: #f1f3f5;
    --color-bg-elevated: #ffffff;
    --color-border: rgba(15, 23, 42, 0.10);
    --color-text: #0f172a;
    --color-text-muted: #475569;
    --color-text-faint: #94a3b8;
    --docs-accent: #0f172a;
    min-height: 100dvh;
    color: var(--color-text);
    background: var(--color-bg);
    font-family: ${DOCS_SERIF};
    font-feature-settings: "kern", "liga";
  }

  /* No italics anywhere - the font family ships regular and bold only. */
  .atlas-docs-page em,
  .atlas-docs-page i,
  .atlas-docs-page cite,
  .atlas-docs-page dfn,
  .atlas-docs-page address {
    font-style: normal;
  }

  .dark .atlas-docs-page {
    --color-bg: #0a0a0b;
    --color-bg-subtle: #141417;
    --color-bg-elevated: #1c1c20;
    --color-border: rgba(255, 255, 255, 0.10);
    --color-text: #f1f5f9;
    --color-text-muted: #b8bbc4;
    --color-text-faint: #6c7280;
    --docs-accent: #e2e8f0;
  }

  .docs-topbar {
    height: 60px;
    display: grid;
    grid-template-columns: minmax(220px, 1fr) auto minmax(260px, 460px) minmax(220px, 1fr);
    align-items: center;
    gap: 20px;
    padding: 0 28px;
    border-bottom: 1px solid var(--color-border);
    background: color-mix(in srgb, var(--color-bg) 94%, transparent);
    backdrop-filter: blur(14px);
    position: sticky;
    top: 0;
    z-index: 30;
  }

  .docs-topbar nav,
  .docs-topbar nav a,
  .docs-search,
  .docs-copy,
  .docs-markdown a {
    display: flex;
    align-items: center;
  }

  .docs-brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: var(--color-text);
    text-decoration: none;
    min-width: 0;
    padding: 4px 6px;
    border-radius: 6px;
    transition: background 120ms ease;
  }

  .docs-brand:hover {
    background: var(--color-bg-elevated);
  }

  .docs-brand img {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    mix-blend-mode: multiply;
  }

  .dark .docs-brand img {
    mix-blend-mode: screen;
  }

  .docs-brand-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    line-height: 1.1;
  }

  .docs-brand-text small {
    font-family: ${mono};
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-faint);
  }

  .docs-brand-text strong {
    font-family: ${DOCS_SERIF};
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 0;
    color: var(--color-text);
  }

  .docs-search {
    position: relative;
    height: 34px;
    gap: 9px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-bg-elevated);
    padding: 0 8px 0 12px;
    color: var(--color-text-faint);
    transition: border-color 120ms ease, background 120ms ease;
  }

  .docs-search:focus-within {
    border-color: var(--color-text-faint);
    background: var(--color-bg);
  }

  .docs-search input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--color-text);
    font-family: ${DOCS_SERIF};
    font-size: 14px;
  }

  .docs-search input::placeholder {
    color: var(--color-text-faint);
    font-family: ${DOCS_SERIF};
  }

  .docs-search kbd {
    min-width: 32px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg);
    color: var(--color-text-faint);
    font-family: ${mono};
    font-size: 10.5px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .docs-search-results {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-elevated);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.12);
    z-index: 50;
  }

  .docs-search-results a {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    gap: 1px 8px;
    align-items: center;
    padding: 8px;
    border-radius: 7px;
    color: var(--color-text);
    text-decoration: none;
  }

  .docs-search-results a:hover {
    background: var(--color-bg-subtle);
  }

  .docs-search-results a > span {
    grid-row: span 2;
    color: var(--color-text-faint);
  }

  .docs-search-results strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 700;
  }

  .docs-search-results small,
  .docs-search-empty {
    overflow: hidden;
    color: var(--color-text-muted);
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }

  .docs-search-empty {
    padding: 10px;
  }

  .docs-topbar nav {
    gap: 8px;
    justify-content: flex-end;
  }

  .docs-actions {
    justify-content: flex-end;
    gap: 8px;
  }

  .docs-topbar nav a {
    gap: 6px;
    height: 34px;
    padding: 0 14px;
    border-radius: 6px;
    color: var(--color-text-muted);
    text-decoration: none;
    font-family: ${DOCS_SERIF};
    font-size: 14px;
    font-weight: 400;
    border: 1px solid transparent;
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  }

  .docs-topbar nav a:hover {
    color: var(--color-text);
    background: var(--color-bg-elevated);
    border-color: var(--color-border);
  }

  .docs-topbar-cta {
    color: var(--color-text) !important;
    border-color: var(--color-border) !important;
    background: var(--color-bg-elevated);
  }

  .docs-version-toggle {
    justify-self: center;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-elevated);
  }

  .docs-version-toggle button {
    height: 28px;
    padding: 0 12px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--color-text-muted);
    font-family: ${DOCS_SERIF};
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
  }

  .docs-version-toggle button:hover {
    color: var(--color-text);
  }

  .docs-version-toggle button.active {
    background: var(--color-bg);
    color: var(--color-text);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
  }

  .docs-theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    height: 34px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text-muted);
    font-family: ${DOCS_SERIF};
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  }

  .docs-theme-toggle:hover {
    color: var(--color-text);
    border-color: var(--color-text-faint);
    background: var(--color-bg-elevated);
  }

  .docs-shell {
    display: grid;
    grid-template-columns: 236px minmax(0, 760px) 176px;
    gap: 34px;
    max-width: 1240px;
    margin: 0 auto;
    padding: 30px 28px 84px;
  }

  .docs-sidebar,
  .docs-toc {
    position: sticky;
    top: 86px;
    align-self: start;
    max-height: calc(100dvh - 106px);
    overflow: auto;
  }

  .docs-sidebar {
    padding-right: 4px;
  }

  .docs-sidebar-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0 0 14px 4px;
  }

  .docs-sidebar-title span {
    font-size: 13px;
    font-weight: 700;
  }

  .docs-sidebar-title small {
    color: var(--color-text-faint);
    font-family: ${mono};
    font-size: 11px;
  }

  .docs-section-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
    margin: 0 0 20px;
    padding: 3px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-subtle);
  }

  .docs-section-tabs a {
    display: flex;
    min-height: 28px;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: 12px;
  }

  .docs-section-tabs a.active {
    color: var(--color-text);
    background: var(--color-bg-elevated);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
  }

  .docs-sidebar-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 20px;
  }

  .docs-sidebar-group > span,
  .docs-toc > span,
  .docs-toc-empty,
  .docs-copy {
    font-family: ${mono};
    font-size: 11px;
    letter-spacing: 0;
  }

  .docs-sidebar-group > span,
  .docs-toc > span,
  .docs-toc-empty {
    color: var(--color-text-faint);
  }

  .docs-sidebar-group > span {
    margin: 0 0 7px 4px;
    text-transform: uppercase;
  }

  .docs-sidebar a,
  .docs-toc a {
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: 13px;
    line-height: 1.45;
  }

  .docs-sidebar a {
    display: flex;
    align-items: center;
    gap: 9px;
    min-height: 30px;
    padding: 0 6px;
    border-radius: 6px;
  }

  .docs-sidebar a span {
    color: var(--color-text-faint);
    line-height: 0;
  }

  .docs-sidebar a:hover {
    color: var(--color-text);
    background: var(--color-bg-subtle);
  }

  .docs-sidebar a.active {
    color: var(--color-text);
    background: color-mix(in srgb, var(--color-bg-subtle) 82%, var(--docs-accent) 8%);
    font-weight: 700;
  }

  .docs-sidebar a.active span {
    color: var(--color-text);
  }

  .docs-main {
    min-width: 0;
  }

  .docs-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 2px 0 16px;
    color: var(--color-text-faint);
    font-size: 13px;
  }

  .docs-breadcrumbs a {
    color: inherit;
    text-decoration: none;
  }

  .docs-breadcrumbs a:hover {
    color: var(--color-text);
  }

  .docs-hero {
    padding: 0 0 24px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 30px;
  }

  .docs-hero h1 {
    margin: 0;
    font-family: ${DOCS_SERIF};
    font-size: 40px;
    line-height: 1.08;
    font-weight: 700;
    letter-spacing: -0.005em;
    color: var(--color-text);
  }

  .docs-hero p {
    max-width: 680px;
    margin: 12px 0 0;
    font-family: ${DOCS_SERIF};
    color: var(--color-text-muted);
    font-size: 17px;
    line-height: 1.55;
  }

  .docs-markdown {
    color: var(--color-text);
    font-family: ${DOCS_SERIF};
  }

  .docs-markdown > *:first-child {
    margin-top: 0;
  }

  .docs-markdown p,
  .docs-markdown li,
  .docs-markdown td {
    color: var(--color-text-muted);
    font-family: ${DOCS_SERIF};
    font-size: 16px;
    line-height: 1.7;
    font-feature-settings: "kern", "liga", "onum";
  }

  .docs-markdown p {
    margin: 0 0 16px;
  }

  .docs-markdown h2 {
    margin: 36px 0 12px;
    padding-top: 6px;
    font-family: ${DOCS_SERIF};
    font-size: 24px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: 0;
    color: var(--color-text);
    scroll-margin-top: 86px;
  }

  .docs-markdown h3 {
    margin: 26px 0 10px;
    font-family: ${DOCS_SERIF};
    font-size: 18px;
    line-height: 1.28;
    font-weight: 700;
    letter-spacing: 0;
    color: var(--color-text);
  }

  .docs-markdown strong {
    font-weight: 700;
    color: var(--color-text);
  }

  .docs-markdown em {
    font-style: normal;
    color: var(--color-text);
    font-weight: 700;
  }

  .docs-markdown ul,
  .docs-markdown ol {
    margin: 0 0 18px;
    padding-left: 20px;
  }

  .docs-markdown a {
    display: inline-flex;
    gap: 5px;
    color: var(--color-text);
    text-decoration: underline;
    text-decoration-color: var(--color-text-faint);
    text-underline-offset: 3px;
  }

  .docs-card-grid {
    display: grid;
    grid-template-columns: repeat(var(--docs-card-cols, 2), minmax(0, 1fr));
    gap: 10px;
    margin: 18px 0 26px;
  }

  .docs-card {
    position: relative;
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) 14px;
    gap: 10px;
    align-items: start !important;
    min-height: 96px;
    padding: 15px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-elevated);
    color: var(--color-text) !important;
    text-decoration: none !important;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
  }

  .docs-card:hover {
    border-color: color-mix(in srgb, var(--docs-accent) 34%, var(--color-border));
    background: var(--color-bg-subtle);
  }

  .docs-card-horizontal {
    min-height: 78px;
  }

  .docs-card-icon {
    display: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    background: var(--color-bg);
  }

  .docs-card-copy {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 0;
  }

  .docs-card-copy strong {
    font-size: 13.5px;
    line-height: 1.25;
    font-weight: 700;
  }

  .docs-card-copy small {
    color: var(--color-text-muted);
    font-size: 12.75px;
    line-height: 1.55;
  }

  .docs-code-wrap {
    position: relative;
    margin: 16px 0 22px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: #11150f;
  }

  .docs-code-wrap pre {
    margin: 0;
    padding: 18px 16px;
    overflow: auto;
    font-family: ${mono};
    font-size: 12px;
    line-height: 1.72;
    color: #eef4ee;
  }

  .docs-copy {
    position: absolute;
    top: 8px;
    right: 8px;
    gap: 6px;
    min-height: 25px;
    padding: 0 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(238, 244, 238, 0.78);
    cursor: pointer;
  }

  .docs-inline-code {
    font-family: ${mono};
    font-size: 12px;
    border: 1px solid var(--color-border);
    background: var(--color-bg-subtle);
    border-radius: 5px;
    color: var(--color-text);
    padding: 1px 5px;
  }

  .docs-table-wrap {
    overflow: auto;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    margin: 16px 0 22px;
  }

  .docs-table-wrap table {
    width: 100%;
    border-collapse: collapse;
    min-width: 560px;
  }

  .docs-table-wrap th,
  .docs-table-wrap td {
    padding: 10px 13px;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
    vertical-align: top;
  }

  .docs-table-wrap th {
    font-family: ${mono};
    font-size: 11px;
    color: var(--color-text-faint);
    background: var(--color-bg-subtle);
  }

  .docs-callout {
    margin: 18px 0;
    padding: 14px 16px;
    border: 1px solid rgba(164, 120, 48, 0.28);
    border-left: 3px solid rgba(164, 120, 48, 0.64);
    border-radius: 7px;
    background: color-mix(in srgb, var(--color-bg-subtle) 74%, rgba(164, 120, 48, 0.12));
  }

  .docs-callout p {
    margin: 0;
    color: var(--color-text);
  }

  .docs-callout .docs-markdown p {
    margin: 0;
  }

  .docs-step-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 18px 0 28px;
  }

  .docs-step {
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 13px;
    padding: 15px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg-elevated);
  }

  .docs-step > span {
    width: 27px;
    height: 27px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    background: var(--color-bg-subtle);
    color: var(--color-text);
    font-family: ${mono};
    font-size: 12px;
    font-weight: 700;
  }

  .docs-step h3 {
    margin: 2px 0 8px;
  }

  .docs-toc {
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding-left: 4px;
  }

  .docs-toc > span {
    margin-bottom: 4px;
  }

  .docs-toc a {
    line-height: 1.45;
  }

  .docs-agent-links {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid var(--color-border);
  }

  .docs-pagination {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
  }

  .docs-pagination a {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 68px;
    padding: 13px 14px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    text-decoration: none;
    background: var(--color-bg);
  }

  .docs-pagination a:hover {
    background: var(--color-bg-subtle);
  }

  .docs-pagination a:last-child {
    justify-content: flex-end;
    text-align: right;
  }

  .docs-pagination small {
    display: block;
    margin-bottom: 4px;
    color: var(--color-text-faint);
    font-family: ${mono};
    font-size: 11px;
  }

  @media (max-width: 1180px) {
    .docs-shell {
      grid-template-columns: 224px minmax(0, 1fr);
      gap: 30px;
    }
    .docs-toc {
      display: none;
    }
  }

  @media (max-width: 860px) {
    .docs-topbar {
      grid-template-columns: minmax(0, 1fr) auto;
      padding: 0 16px;
    }

    .docs-search {
      grid-column: 1 / -1;
      order: 2;
      display: none;
    }

    .docs-topbar nav a:not(.docs-topbar-cta) {
      display: none;
    }

    .docs-shell {
      display: block;
      padding: 22px 16px 64px;
    }

    .docs-sidebar {
      position: static;
      border: 1px solid var(--color-border);
      border-radius: 10px;
      padding: 14px 12px;
      margin-bottom: 22px;
      max-height: none;
    }

    .docs-hero h1 {
      font-size: 34px;
    }

    .docs-pagination {
      grid-template-columns: 1fr;
    }

    .docs-card-grid {
      grid-template-columns: 1fr;
    }
  }
`;
