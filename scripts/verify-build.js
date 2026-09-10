const fs = require("fs");
const path = require("path");

const site = path.join(__dirname, "..", "_site");
function mustExist(rel) {
  const p = path.join(site, rel);
  if (!fs.existsSync(p)) throw new Error("missing " + rel);
}

mustExist("index.html");
mustExist("robots.txt");
mustExist("llms.txt");
mustExist("sitemap.xml");
mustExist("check/index.html");
mustExist("contact/index.html");
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
if (pages !== 48) throw new Error("expected 48 index.html pages, got " + pages);

const robots = fs.readFileSync(path.join(site, "robots.txt"), "utf8");
for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
  if (!robots.includes(bot)) throw new Error("robots.txt missing " + bot);
}

const css = fs.readFileSync(path.join(__dirname, "..", "src/_includes/styles.css"), "utf8");
if (!/font-size:\s*18px/.test(css)) throw new Error("body 18px rule missing");
if (!/:focus-visible/.test(css)) throw new Error("focus-visible rule missing");
if (!css.includes(".scroll") || !css.includes("overflow-x:auto")) {
  throw new Error("scroll overflow wrapper missing");
}

const report = path.join(__dirname, "..", "slug-flatten-report.txt");
if (!fs.existsSync(report)) throw new Error("slug-flatten-report.txt missing — run build first");
const reportText = fs.readFileSync(report, "utf8");
if (!reportText.includes("arizona/coconino-county -> arizona-coconino-county")) {
  throw new Error("flatten report missing coconino mapping");
}

const sample = fs.readFileSync(path.join(site, "covered-areas/not-covered/index.html"), "utf8");
if (!sample.includes("<h1>") || (sample.match(/<h1>/g) || []).length !== 1) {
  throw new Error("not-covered page must have exactly one h1");
}
if (!sample.includes('rel="canonical"')) throw new Error("canonical missing");
if (!sample.includes("/check/")) throw new Error("missing /check link");
if (!sample.includes("/free-help/")) throw new Error("missing /free-help link");
if (!sample.includes("application/ld+json")) throw new Error("JSON-LD missing");

console.log("PASS verify-build (48 pages + SEO + a11y CSS checks)");
