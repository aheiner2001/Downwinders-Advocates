const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const site = path.join(root, "_site");

function mustExist(rel) {
  const p = path.join(site, rel);
  if (!fs.existsSync(p)) throw new Error("missing " + rel);
}

mustExist("index.html");
mustExist("robots.txt");
mustExist("llms.txt");
mustExist("sitemap.xml");
mustExist("og-image.jpg");
mustExist("img/og-image.jpg");
mustExist("img/people/jaxon.jpg");
mustExist("img/people/jonny.jpg");
mustExist("img/people/laura.jpg");
mustExist("check/index.html");
mustExist("contact/index.html");
mustExist("standards/index.html");
mustExist("what-it-costs/index.html");
mustExist("covered-areas/arizona-coconino-county/index.html");
mustExist("covered-areas/not-covered/index.html");
mustExist("conditions/leukemia/index.html");

function countIndexHtml(dir) {
  let n = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) n += countIndexHtml(p);
    else if (ent.name === "index.html") n += 1;
  }
  return n;
}

const pages = countIndexHtml(site);
if (pages !== 96) throw new Error("expected 96 index.html pages, got " + pages);

mustExist("es/index.html");
mustExist("es/check/index.html");
mustExist("es/covered-areas/arizona-coconino-county/index.html");
mustExist("es/conditions/leukemia/index.html");

function assertSpanishDraft(rel) {
  const html = fs.readFileSync(path.join(site, rel), "utf8");
  if (!html.includes('lang="es"')) throw new Error(rel + " missing lang=es");
  if (!/noindex/i.test(html)) throw new Error(rel + " missing noindex");
  if (!html.includes("Borrador de traducción automática para revisión")) {
    throw new Error(rel + " missing draft banner");
  }
  if (!html.includes('hreflang="en"') || !html.includes('hreflang="es"')) {
    throw new Error(rel + " missing hreflang");
  }
}

assertSpanishDraft("es/index.html");
assertSpanishDraft("es/covered-areas/arizona-coconino-county/index.html");

const sitemap = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
if (sitemap.includes("/es/")) throw new Error("sitemap must not list /es/ while draft");

const robots = fs.readFileSync(path.join(site, "robots.txt"), "utf8");
for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
  if (!robots.includes(bot)) throw new Error("robots.txt missing " + bot);
}

const css = fs.readFileSync(path.join(root, "src/_includes/styles.css"), "utf8");
if (!/font-size:\s*18px/.test(css)) throw new Error("body 18px rule missing");
if (!/:focus-visible/.test(css)) throw new Error("focus-visible rule missing");
if (!css.includes(".scroll") || !css.includes("overflow-x:auto")) {
  throw new Error("scroll overflow wrapper missing");
}
if (/outline:\s*none/.test(css) && !/:focus-visible/.test(css)) {
  throw new Error("outline:none without focus-visible replacement");
}

const report = path.join(root, "slug-flatten-report.txt");
if (!fs.existsSync(report)) throw new Error("slug-flatten-report.txt missing — run build first");
const reportText = fs.readFileSync(report, "utf8");
if (!reportText.includes("arizona/coconino-county -> arizona-coconino-county")) {
  throw new Error("flatten report missing coconino mapping");
}

const forbidden = [/content for this page is coming/i, /copy coming/i, /checklist copy coming/i];
const shellPaths = [
  "is-this-real/index.html",
  "siblings/index.html",
  "someone-told-me-about-this/index.html",
  "documents/index.html",
  "free-help/index.html",
  "deadline/index.html",
  "survivors/index.html",
];
for (const rel of shellPaths) {
  const html = fs.readFileSync(path.join(site, rel), "utf8");
  for (const re of forbidden) {
    if (re.test(html)) throw new Error("invented shell copy in " + rel + " matched " + re);
  }
  if (!html.includes('href="/check/"') || !html.includes('href="/free-help/"')) {
    throw new Error(rel + " missing /check or /free-help link");
  }
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) {
    throw new Error(rel + " must have exactly one h1");
  }
}

const esShellPaths = shellPaths.map((p) => "es/" + p);
for (const rel of esShellPaths) {
  const html = fs.readFileSync(path.join(site, rel), "utf8");
  for (const re of forbidden) {
    if (re.test(html)) throw new Error("invented shell copy in " + rel);
  }
  if (!html.includes('href="/es/check/"') || !html.includes('href="/es/free-help/"')) {
    throw new Error(rel + " missing /es/check or /es/free-help link");
  }
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) {
    throw new Error(rel + " must have exactly one h1");
  }
}

function assertCmsMinimal(rel) {
  const html = fs.readFileSync(path.join(site, rel), "utf8");
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) {
    throw new Error(rel + " must have exactly one h1");
  }
  if (!html.includes('rel="canonical"')) throw new Error(rel + " canonical missing");
  if (!html.includes('href="/check/"') || !html.includes('href="/free-help/"')) {
    throw new Error(rel + " missing CTA links");
  }
  if (!html.includes("application/ld+json")) throw new Error(rel + " JSON-LD missing");
  if (!html.includes("data-cms-body")) throw new Error(rel + " missing empty Body container");
  if (/Key towns:/i.test(html)) throw new Error(rel + " must not show Key Towns as prose");
  if (/class="lede"/.test(html)) throw new Error(rel + " must not show meta as lede prose");
}

assertCmsMinimal("covered-areas/not-covered/index.html");
assertCmsMinimal("covered-areas/arizona-coconino-county/index.html");
assertCmsMinimal("conditions/leukemia/index.html");

function assertCmsMinimalEs(rel) {
  const html = fs.readFileSync(path.join(site, rel), "utf8");
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) {
    throw new Error(rel + " must have exactly one h1");
  }
  if (!html.includes('href="/es/check/"') || !html.includes('href="/es/free-help/"')) {
    throw new Error(rel + " missing ES CTA links");
  }
  if (!html.includes("data-cms-body")) throw new Error(rel + " missing empty Body container");
}

assertCmsMinimalEs("es/covered-areas/not-covered/index.html");
assertCmsMinimalEs("es/conditions/leukemia/index.html");

const contentPages = ["index.html", "check/index.html", "standards/index.html", "what-it-costs/index.html", "contact/index.html"];
for (const rel of contentPages) {
  const html = fs.readFileSync(path.join(site, rel), "utf8");
  for (const re of forbidden) {
    if (re.test(html)) throw new Error("invented placeholder in " + rel);
  }
}

console.log("PASS verify-build (96 pages + SEO + strict copy + ES draft + a11y CSS)");
