# Static Site Pipeline (Phases 5–8) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Eleventy pipeline that compiles the reference HTML + CSVs into `_site/` with 48 pages, root SEO files, and Phase 8 a11y polish for GitHub Pages.

**Architecture:** Eleventy reads `counties.csv` / `conditions.csv`, flattens slash-slugs, and generates Covered Areas + Conditions templates plus 12 static shells from shared Nunjucks layouts that reuse the reference site CSS, header, footer disclaimer, and head SEO. Output is trailing-slash directories with `index.html`.

**Tech Stack:** Node.js 20+, Eleventy 3.x, `csv-parse`, Nunjucks templates, plain CSS from `index.html`.

## Global Constraints

- Canonical base URL: `https://downwindersadvocates.com` (no trailing slash on origin)
- Body text ≥ 18px; never gold (`#DEA244`) as text on light backgrounds
- Visible `:focus-visible` focus ring required; no bare `outline: none` without replacement
- Do not invent CMS Body copy or rewrite compliance language
- Screener stays client-side only (no network, no per-answer analytics)
- Lawmatics live embed deferred; `/contact` three-field shell only
- Flatten CSV slugs containing `/` to `-` and write `slug-flatten-report.txt`
- Do not add chatbot, exit-intent, countdown, stock doctor photos, gov seals, fake testimonials, or blog
- Keep `index.html` in repo as the visual/copy reference (do not delete)

---

## File structure (create)

```
package.json
.eleventy.js
.gitignore
scripts/verify-build.js
scripts/load-csv.js
src/_data/site.js
src/_data/counties.js
src/_data/conditions.js
src/_includes/styles.css          # extracted from index.html <style>
src/_includes/layouts/base.njk
src/_includes/partials/head.njk
src/_includes/partials/header.njk
src/_includes/partials/footer.njk
src/pages/index.njk
src/pages/check.njk
src/pages/standards.njk
src/pages/what-it-costs.njk
src/pages/contact.njk
src/pages/is-this-real.njk
src/pages/siblings.njk
src/pages/someone-told-me-about-this.njk
src/pages/documents.njk
src/pages/free-help.njk
src/pages/deadline.njk
src/pages/survivors.njk
src/covered-areas/page.njk
src/conditions/page.njk
src/assets/robots.txt
src/assets/llms.txt
src/assets/js/screener.js         # ported from index.html
counties.csv                      # already at repo root (keep)
conditions.csv                    # already at repo root (keep)
```

---

### Task 1: Scaffold Eleventy project

**Files:**
- Create: `package.json`
- Create: `.eleventy.js`
- Create: `.gitignore`
- Create: `scripts/verify-build.js` (stub that exits 1 until wired)

**Interfaces:**
- Consumes: none
- Produces: `npm run build` → Eleventy CLI; `npm run verify` → `node scripts/verify-build.js`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "downwinders-advocates",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve",
    "verify": "node scripts/verify-build.js"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0",
    "csv-parse": "^5.6.0"
  }
}
```

- [ ] **Step 2: Write .gitignore**

```
node_modules/
_site/
.DS_Store
slug-flatten-report.txt
```

- [ ] **Step 3: Write .eleventy.js**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/assets/llms.txt": "llms.txt" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "js" });

  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    const root = (base || "https://downwindersadvocates.com").replace(/\/$/, "");
    if (!path || path === "/") return root + "/";
    return root + (path.startsWith("/") ? path : "/" + path);
  });

  eleventyConfig.addFilter("jsonLd", (obj) => JSON.stringify(obj));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/",
  };
};
```

- [ ] **Step 4: Write verify stub**

```js
// scripts/verify-build.js
console.error("verify-build not implemented yet");
process.exit(1);
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`  
Expected: `node_modules/@11ty/eleventy` and `csv-parse` installed; `package-lock.json` created.

- [ ] **Step 6: Commit**

```bash
/usr/bin/git add package.json package-lock.json .eleventy.js .gitignore scripts/verify-build.js
/usr/bin/git commit -m "Scaffold Eleventy project for static site pipeline."
```

---

### Task 2: CSV loader + slug flattening

**Files:**
- Create: `scripts/load-csv.js`
- Create: `src/_data/site.js`
- Create: `src/_data/counties.js`
- Create: `src/_data/conditions.js`
- Create: `scripts/test-load-csv.js`
- Keep: `counties.csv`, `conditions.csv` at repo root

**Interfaces:**
- Consumes: repo-root CSVs
- Produces:
  - `loadCsvCollection(filePath, { slugField })` → `{ items: Array<{...fields, slug, originalSlug, body: ""}>, flattened: Array<{original, flattened}> }`
  - `site.url` = `"https://downwindersadvocates.com"`
  - Eleventy data: `counties` = array of 19 items; `conditions` = array of 17 items
  - Side effect on build data load: write `slug-flatten-report.txt` at repo root

- [ ] **Step 1: Write failing test**

```js
// scripts/test-load-csv.js
const path = require("path");
const { loadCsvCollection } = require("./load-csv");

const counties = loadCsvCollection(path.join(__dirname, "..", "counties.csv"), {
  slugField: "Slug",
});
const conditions = loadCsvCollection(path.join(__dirname, "..", "conditions.csv"), {
  slugField: "Slug",
});

if (counties.items.length !== 19) throw new Error("expected 19 counties, got " + counties.items.length);
if (conditions.items.length !== 17) throw new Error("expected 17 conditions, got " + conditions.items.length);

const coconino = counties.items.find((r) => r.slug === "arizona-coconino-county");
if (!coconino) throw new Error("missing flattened arizona-coconino-county");
if (coconino.originalSlug !== "arizona/coconino-county") throw new Error("originalSlug mismatch");
if (coconino.body !== "") throw new Error("body must be empty string");

const slashLeft = counties.items.some((r) => r.slug.includes("/"));
if (slashLeft) throw new Error("flattened slug still contains slash");

if (counties.flattened.length < 1) throw new Error("expected at least one flattened slug report entry");

console.log("PASS load-csv");
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `node scripts/test-load-csv.js`  
Expected: FAIL with `Cannot find module './load-csv'` (or similar).

- [ ] **Step 3: Implement load-csv.js**

```js
const fs = require("fs");
const { parse } = require("csv-parse/sync");

function flattenSlug(slug) {
  return String(slug || "").replace(/\//g, "-");
}

function loadCsvCollection(filePath, { slugField = "Slug" } = {}) {
  const raw = fs.readFileSync(filePath, "utf8");
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  const flattened = [];
  const items = rows.map((row) => {
    const originalSlug = row[slugField];
    const slug = flattenSlug(originalSlug);
    if (slug !== originalSlug) {
      flattened.push({ original: originalSlug, flattened: slug });
    }
    return {
      ...row,
      slug,
      originalSlug,
      body: "",
    };
  });

  return { items, flattened };
}

function writeFlattenReport(entries, outPath) {
  const lines = [
    "Slug flatten report — confirm with Jaxon (SEO URL plan change)",
    "Generated by scripts/load-csv.js",
    "",
    ...entries.map((e) => `${e.original} -> ${e.flattened}`),
    "",
  ];
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
}

module.exports = { flattenSlug, loadCsvCollection, writeFlattenReport };
```

- [ ] **Step 4: Wire Eleventy data files**

```js
// src/_data/site.js
module.exports = {
  name: "Downwinders Advocates",
  url: "https://downwindersadvocates.com",
  phoneDisplay: "(801) 400-8270",
  phoneTel: "+18014008270",
  email: "info@downwindersadvocates.com",
  ogImage: "https://downwindersadvocates.com/og-image.jpg",
};
```

```js
// src/_data/counties.js
const path = require("path");
const { loadCsvCollection, writeFlattenReport } = require("../../scripts/load-csv");

const result = loadCsvCollection(path.join(__dirname, "..", "..", "counties.csv"), {
  slugField: "Slug",
});

module.exports = result.items;
module.exports.flattened = result.flattened;
```

```js
// src/_data/conditions.js
const path = require("path");
const { loadCsvCollection } = require("../../scripts/load-csv");

const result = loadCsvCollection(path.join(__dirname, "..", "..", "conditions.csv"), {
  slugField: "Slug",
});

module.exports = result.items;
```

Also update `src/_data/counties.js` after load to write the report (counties are the only source of slash slugs):

```js
writeFlattenReport(
  result.flattened,
  path.join(__dirname, "..", "..", "slug-flatten-report.txt")
);
```

- [ ] **Step 5: Run test — expect PASS**

Run: `node scripts/test-load-csv.js`  
Expected: `PASS load-csv`

- [ ] **Step 6: Commit**

```bash
/usr/bin/git add scripts/load-csv.js scripts/test-load-csv.js src/_data/site.js src/_data/counties.js src/_data/conditions.js
/usr/bin/git commit -m "Add CSV loaders with slash-slug flattening and report."
```

---

### Task 3: Shared layout, CSS, header, footer, head

**Files:**
- Create: `src/_includes/styles.css` (copy full `<style>` block contents from `index.html` lines ~37–194)
- Create: `src/_includes/partials/head.njk`
- Create: `src/_includes/partials/header.njk`
- Create: `src/_includes/partials/footer.njk`
- Create: `src/_includes/layouts/base.njk`

**Interfaces:**
- Consumes: `site.*`, page front matter `title`, `description`, `permalink` / `page.url`, optional `faqJsonLd`
- Produces: base layout wrapping all pages with global SEO + footer disclaimer

- [ ] **Step 1: Extract CSS**

Copy the entire CSS from the `<style>`…`</style>` block in `index.html` into `src/_includes/styles.css` unchanged. Confirm these rules exist:

- `body{...font-size:18px...}`
- `:focus-visible{outline:3px solid var(--focus);...}`
- `.scroll{overflow-x:auto}`
- `@media (prefers-reduced-motion:reduce)...`
- Gold is only used for accents/focus, not `color:var(--gold)` / `color:var(--accent)` on light body text classes

If any `.field input:focus` uses `outline: none`, keep the accent border but ensure `:focus-visible` still applies globally (already in reference).

- [ ] **Step 2: Write head.njk**

```njk
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">

<title>{{ title }}</title>
<meta name="description" content="{{ description }}">
<link rel="canonical" href="{{ page.url | absoluteUrl(site.url) }}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">

<meta property="og:type" content="website">
<meta property="og:site_name" content="{{ site.name }}">
<meta property="og:title" content="{{ ogTitle or title }}">
<meta property="og:description" content="{{ ogDescription or description }}">
<meta property="og:url" content="{{ page.url | absoluteUrl(site.url) }}">
<meta property="og:image" content="{{ site.ogImage }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ ogTitle or title }}">
<meta name="twitter:description" content="{{ ogDescription or description }}">
<meta name="twitter:image" content="{{ site.ogImage }}">

<meta name="geo.region" content="US-UT">
<meta name="geo.placename" content="Utah, New Mexico, Idaho, Arizona, Nevada">

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap">
<style>{% include "styles.css" %}</style>

<script type="application/ld+json">
{{ {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": site.url + "/#org",
      "name": site.name,
      "url": site.url + "/",
      "description": "Independent company helping families prepare and file federal Radiation Exposure Compensation Act claims.",
      "disambiguatingDescription": "Downwinders Advocates is an independent, privately owned company. It is not affiliated with or endorsed by the United States Department of Justice or any government agency, and it is not a law firm.",
      "telephone": "+1-801-400-8270",
      "email": site.email
    },
    {
      "@type": "WebSite",
      "@id": site.url + "/#website",
      "url": site.url + "/",
      "name": site.name,
      "publisher": { "@id": site.url + "/#org" },
      "inLanguage": "en-US"
    }
  ]
} | jsonLd | safe }}
</script>
{% if faqJsonLd %}
<script type="application/ld+json">
{{ faqJsonLd | jsonLd | safe }}
</script>
{% endif %}
```

- [ ] **Step 3: Write header.njk**

Use the shield SVG and brand from `index.html`. Nav links (sitewide):

```njk
<a class="skip" href="#main">Skip to content</a>
<header>
  <div class="bar">
    <a class="brand" href="/">
      {# shield SVG from index.html #}
      <span>Downwinders Advocates<small>RECA Claim Help</small></span>
    </a>
    <nav>
      <a href="/check/">Check eligibility</a>
      <a href="/free-help/">Free help</a>
      <a href="/standards/">Our standards</a>
      <a href="/contact/">Contact</a>
      <a class="tel" href="tel:{{ site.phoneTel }}">{{ site.phoneDisplay }}</a>
    </nav>
  </div>
</header>
```

Copy the exact shield SVG markup from `index.html` into the brand link (do not invent a new logo).

- [ ] **Step 4: Write footer.njk**

Paste the footer disclaimer paragraph **verbatim** from `index.html` (the long legal paragraph). Include links to `/check/` and `/free-help/` in the footer chrome:

```njk
<footer>
  <div class="wrap stack">
    <div class="brand" style="color:#EAF0F7">
      {# same shield SVG #}
      <span>Downwinders Advocates<small>You do not have to figure this out alone.</small></span>
    </div>
    <p class="legal" style="max-width:78ch">Downwinders Advocates is an independent, privately owned company. It is not affiliated with the United States government or the Department of Justice and is not a law firm. We do not provide legal advice. Submitting information does not create an attorney-client relationship and does not guarantee eligibility, approval, or compensation. Eligibility and compensation decisions are made solely by the U.S. Department of Justice. Free assistance with these claims is available from RESEP clinics.</p>
    <p class="legal">
      <a href="/check/">Check eligibility</a> &nbsp;·&nbsp;
      <a href="/free-help/">Free help (RESEP)</a> &nbsp;·&nbsp;
      <a href="/standards/">Our public standards</a>
    </p>
    <p class="legal">{{ site.phoneDisplay }} &nbsp;·&nbsp; {{ site.email }}</p>
  </div>
</footer>
```

- [ ] **Step 5: Write base.njk**

```njk
<!DOCTYPE html>
<html lang="en-US">
<head>
{% include "partials/head.njk" %}
</head>
<body>
{% include "partials/header.njk" %}
<main id="main">
{{ content | safe }}
</main>
{% include "partials/footer.njk" %}
{% if extraScripts %}{{ extraScripts | safe }}{% endif %}
</body>
</html>
```

- [ ] **Step 6: Commit**

```bash
/usr/bin/git add src/_includes
/usr/bin/git commit -m "Add shared layout, head SEO, header, and footer disclaimer."
```

---

### Task 4: Twelve static page shells

**Files:**
- Create: `src/pages/*.njk` for all 12 URLs listed in the spec

**Interfaces:**
- Consumes: `layouts/base.njk`
- Produces: 12 HTML pages under `_site/`

Front-matter pattern for each shell (adjust title/description/permalink):

```njk
---
layout: layouts/base.njk
title: "…"
description: "…"
permalink: /path/
---
<section class="sec">
  <div class="wrap stack">
    <h1>…</h1>
    <p class="lede">…placeholder or lifted copy…</p>
    <div class="btns">
      <a class="btn" href="/check/">Check eligibility, free, no sign-up</a>
      <a class="btn btn--ghost" href="/free-help/">Free help from RESEP clinics</a>
    </div>
  </div>
</section>
```

- [ ] **Step 1: Create SEO front matter for all 12**

| permalink | title | description |
|---|---|---|
| `/` | `RECA Claim Help for Downwinders and Uranium Workers \| Downwinders Advocates` | Use home meta from `index.html` |
| `/check/` | `Free RECA Eligibility Check \| Downwinders Advocates` | `Six questions. No name, no email. Runs in your browser. Nothing is sent anywhere.` |
| `/standards/` | `Our Public Standards \| Downwinders Advocates` | `The rules we publish and hold ourselves to when helping families with RECA claims.` |
| `/what-it-costs/` | `What It Costs \| Downwinders Advocates` | `Nothing up front. Nothing if the claim is not paid. Fee details pending counsel review.` |
| `/contact/` | `Contact \| Downwinders Advocates` | `Request a callback. Name, phone, and best time to reach you.` |
| `/is-this-real/` | `Is This Real? \| Downwinders Advocates` | `Why families ask if RECA help is a scam, and how we answer. Copy coming.` |
| `/siblings/` | `Talking With Siblings \| Downwinders Advocates` | `When more than one family member needs to be part of a RECA claim conversation. Copy coming.` |
| `/someone-told-me-about-this/` | `Someone Told Me About This \| Downwinders Advocates` | `You heard about RECA from a call, a neighbor, or a post. What to do next. Copy coming.` |
| `/documents/` | `Document Checklist \| Downwinders Advocates` | `What records families usually need for a RECA claim. Checklist copy coming.` |
| `/free-help/` | `Free RECA Help (RESEP) \| Downwinders Advocates` | `Federally funded RESEP clinics help with these claims at no cost. Directory copy coming.` |
| `/deadline/` | `RECA Filing Deadline \| Downwinders Advocates` | `Claims must be filed with the U.S. Department of Justice on or before December 31, 2027.` |
| `/survivors/` | `Filing for a Deceased Family Member \| Downwinders Advocates` | `Surviving spouses, children, parents, and in some cases grandchildren may file. Copy coming.` |

For placeholder pages, body text must be only: `Content for this page is coming. Use the links below for the free eligibility check or free RESEP help.` — do not invent legal/eligibility claims.

- [ ] **Step 2: Home page (`src/pages/index.njk`)**

Lift **only** these sections from `index.html` (verbatim copy, no rewrites): hero, honest block, offer summary, covered-areas table (keep `.scroll` wrapper), standards teaser link, contact CTA. Remove long screener from home (lives on `/check/`). Keep one `<h1>` in the hero.

- [ ] **Step 3: Create the other 10 shells** with the front-matter table above and the shared placeholder pattern (except home, check, contact which Task 5–6 specialize).

For now create check/contact as shells too; Task 5–6 replace their bodies.

- [ ] **Step 4: Smoke-build**

Run: `npm run build`  
Expected: `_site/index.html` and the other static paths exist (CMS pages may not yet). Fix Nunjucks errors if any.

- [ ] **Step 5: Commit**

```bash
/usr/bin/git add src/pages
/usr/bin/git commit -m "Add twelve static page shells with SEO front matter."
```

---

### Task 5: `/check` screener page

**Files:**
- Modify: `src/pages/check.njk`
- Create: `src/assets/js/screener.js`

**Interfaces:**
- Consumes: screener form markup + JS from `index.html` (`#screener` section and bottom `<script>`)
- Produces: `/check/index.html` with client-side-only screener

- [ ] **Step 1: Extract JS**

Copy the screener `<script>` body from `index.html` into `src/assets/js/screener.js` as an IIFE or DOMContentLoaded handler. Do not change branch order or answer values. Do not add fetch/analytics.

- [ ] **Step 2: Port form markup into check.njk**

Include the full `#check` section form from `index.html` (all six fieldsets, covered areas table in `.scroll`, `aria-live` result). Keep exactly one page `<h1>`.

Add at bottom of template via front matter or inline:

```njk
<script src="/js/screener.js" defer></script>
```

- [ ] **Step 3: Build and spot-check**

Run: `npm run build`  
Open `_site/check/index.html` and confirm `#screener`, six legends, and script tag exist.

- [ ] **Step 4: Commit**

```bash
/usr/bin/git add src/pages/check.njk src/assets/js/screener.js
/usr/bin/git commit -m "Port client-side RECA screener to /check page."
```

---

### Task 6: `/contact` three-field shell (Lawmatics deferred)

**Files:**
- Modify: `src/pages/contact.njk`

- [ ] **Step 1: Implement form shell**

```njk
---
layout: layouts/base.njk
title: "Contact | Downwinders Advocates"
description: "Request a callback. Name, phone, and best time to reach you."
permalink: /contact/
---
<section class="sec">
  <div class="wrap stack">
    <h1>Request a callback</h1>
    <p class="lede">Three fields. We aim to call within one business day. Lawmatics embed pending — this form does not submit yet.</p>
    <form class="tool" id="callback" onsubmit="return false;">
      <div class="field">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" required autocomplete="name">
      </div>
      <div class="field">
        <label for="phone">Phone</label>
        <input id="phone" name="phone" type="tel" required autocomplete="tel">
      </div>
      <div class="field">
        <label for="best-time">Best time to reach you</label>
        <select id="best-time" name="best_time">
          <option value="">Select…</option>
          <option>Any time</option>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
          <option>Weekend</option>
        </select>
      </div>
      <button class="btn" type="submit" disabled>Callback form coming soon</button>
    </form>
    <p class="legal">Or call {{ site.phoneDisplay }} now. Do not add fields beyond name, phone, and best time when the Lawmatics embed is wired.</p>
    <div class="btns">
      <a class="btn" href="/check/">Check eligibility first</a>
      <a class="btn btn--ghost" href="/free-help/">Free RESEP help</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
/usr/bin/git add src/pages/contact.njk
/usr/bin/git commit -m "Add /contact three-field callback shell without Lawmatics."
```

---

### Task 7: Covered Areas + Conditions CMS templates

**Files:**
- Create: `src/covered-areas/page.njk`
- Create: `src/conditions/page.njk`

**Interfaces:**
- Consumes: `counties` / `conditions` data arrays (`slug`, `Name`, `SEO Title`, `Meta Description`, …)
- Produces: 19 + 17 pages

- [ ] **Step 1: Covered Areas template**

```njk
---
pagination:
  data: counties
  size: 1
  alias: area
permalink: "/covered-areas/{{ area.slug }}/"
layout: layouts/base.njk
eleventyComputed:
  title: "{{ area['SEO Title'] }}"
  description: "{{ area['Meta Description'] }}"
  faqJsonLd:
    "@context": "https://schema.org"
    "@type": "FAQPage"
    "mainEntity":
      - "@type": "Question"
        "name": "Is {{ area.Name }} covered under RECA?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "{{ area['Coverage Status'] }}. {{ area['Meta Description'] }}"
      - "@type": "Question"
        "name": "Which towns are often associated with {{ area.Name }}?"
        "acceptedAnswer":
          "@type": "Answer"
          "text": "{{ area['Key Towns'] }}"
---
<section class="sec">
  <div class="wrap stack">
    <p class="eyebrow">{{ area.State }} · {{ area['Coverage Status'] }}</p>
    <h1>{{ area.Name }}</h1>
    <p class="lede">{{ area['Meta Description'] }}</p>
    <p class="muted">Key towns: {{ area['Key Towns'] }}</p>
    <div class="rich-text body-content" data-cms-body>
      {{ area.body }}
    </div>
    <div class="btns">
      <a class="btn" href="/check/">Check eligibility</a>
      <a class="btn btn--ghost" href="/free-help/">Free help</a>
    </div>
  </div>
</section>
```

Note: If Nunjucks/`eleventyComputed` FAQ nesting is awkward, build `faqJsonLd` in `src/_data/counties.js` per item as `item.faqJsonLd` and reference `area.faqJsonLd` in front matter instead. Prefer attaching FAQ objects in the data file for reliability:

```js
item.faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [ /* same two questions */ ],
};
```

Then in template front matter: `eleventyComputed: { title: "...", description: "...", faqJsonLd: "{{ area.faqJsonLd | dump | safe }}" }` — better: set `faqJsonLd` via:

```njk
eleventyComputed:
  title: "{{ area['SEO Title'] }}"
  description: "{{ area['Meta Description'] }}"
  faqJsonLd: "{{ area.faqJsonLd }}"
```

Eleventy passes objects if `faqJsonLd` is set on the pagination item and referenced carefully; simplest approach: in the template body head override is already in layout — set in pagination template:

```njk
---
pagination: ...
permalink: ...
layout: layouts/base.njk
eleventyComputed:
  title: data => data.area["SEO Title"]
  description: data => data.area["Meta Description"]
  faqJsonLd: data => data.area.faqJsonLd
---
```

Use JavaScript `eleventyComputed` functions in front matter **or** a thin `src/covered-areas/covered-areas.11ty.js` template if Nunjucks front matter proves fragile. Prefer `.11ty.js` if needed:

```js
exports.data = {
  pagination: { data: "counties", size: 1, alias: "area" },
  permalink: (data) => `/covered-areas/${data.area.slug}/`,
  layout: "layouts/base.njk",
  eleventyComputed: {
    title: (data) => data.area["SEO Title"],
    description: (data) => data.area["Meta Description"],
    faqJsonLd: (data) => data.area.faqJsonLd,
  },
};
exports.render = function (data) { /* return HTML string using same structure */ };
```

Pick **one** approach and stick to it for both collections. Recommended: `.11ty.js` for CMS templates to avoid Nunjucks computed-object pain.

- [ ] **Step 2: Conditions template** (same pattern)

FAQ questions:

1. `What is {{ name }} under RECA?` → Meta Description  
2. `Which RECA category applies?` → Category field

URL: `/conditions/{{ slug }}/`

- [ ] **Step 3: Attach faqJsonLd in data loaders** for each item in `counties.js` / `conditions.js`.

- [ ] **Step 4: Build and count**

Run: `npm run build`  
Then:

```bash
find _site/covered-areas -name index.html | wc -l   # 19
find _site/conditions -name index.html | wc -l      # 17
test -f _site/covered-areas/arizona-coconino-county/index.html
test -f _site/covered-areas/not-covered/index.html
test -f _site/conditions/leukemia/index.html
```

- [ ] **Step 5: Commit**

```bash
/usr/bin/git add src/covered-areas src/conditions src/_data/counties.js src/_data/conditions.js
/usr/bin/git commit -m "Generate Covered Areas and Conditions CMS pages from CSV."
```

---

### Task 8: robots.txt, llms.txt, sitemap

**Files:**
- Create: `src/assets/robots.txt`
- Create: `src/assets/llms.txt`
- Create: `src/sitemap.njk` (or `src/sitemap.11ty.js`)

- [ ] **Step 1: robots.txt** (exact)

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://downwindersadvocates.com/sitemap.xml
```

- [ ] **Step 2: llms.txt**

Copy verbatim from `/Users/aaronheiner/Sandbox/Downwinders-Internship/Aaron-Website-Handoff/reference/llms.txt` into `src/assets/llms.txt`. Do not rewrite facts.

- [ ] **Step 3: sitemap**

```njk
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{% for page in collections.all %}
{% if page.url %}
  <url><loc>{{ page.url | absoluteUrl(site.url) }}</loc></url>
{% endif %}
{% endfor %}
</urlset>
```

Ensure CMS pages are in `collections.all` (default). If sitemap misses CMS pages, generate URLs explicitly from `counties` + `conditions` + a hardcoded static path list in `src/sitemap.11ty.js`.

Static path list if needed:

```js
const staticPaths = [
  "/", "/check/", "/standards/", "/what-it-costs/", "/contact/",
  "/is-this-real/", "/siblings/", "/someone-told-me-about-this/",
  "/documents/", "/free-help/", "/deadline/", "/survivors/",
];
```

- [ ] **Step 4: Build and confirm**

```bash
npm run build
test -f _site/robots.txt
test -f _site/llms.txt
test -f _site/sitemap.xml
rg -c "<url>" _site/sitemap.xml
```

Expected: at least 48 `<url>` entries (sitemap may also include itself — exclude `/sitemap.xml` from the list).

- [ ] **Step 5: Commit**

```bash
/usr/bin/git add src/assets/robots.txt src/assets/llms.txt src/sitemap.njk
/usr/bin/git commit -m "Add robots.txt, llms.txt, and sitemap for all pages."
```

---

### Task 9: verify-build script + Phase 8 checks

**Files:**
- Modify: `scripts/verify-build.js`

- [ ] **Step 1: Implement verifier**

```js
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
if (!/\.scroll\s*\{[^}]*overflow-x:\s*auto/.test(css.replace(/\n/g, ""))) {
  // fallback loose check
  if (!css.includes(".scroll") || !css.includes("overflow-x:auto")) {
    throw new Error("scroll overflow wrapper missing");
  }
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
```

- [ ] **Step 2: Run full pipeline**

```bash
npm run build && npm run verify
```

Expected: `PASS verify-build (48 pages + SEO + a11y CSS checks)`

- [ ] **Step 3: Manual spot checks**

Confirm in one CMS HTML file and home:

1. Footer disclaimer paragraph present  
2. No `color:#DEA244` / `color:var(--accent)` used as primary paragraph text on light sections  
3. Form fields that set `outline:none` still have `:focus-visible` globally  

- [ ] **Step 4: Commit**

```bash
/usr/bin/git add scripts/verify-build.js
/usr/bin/git commit -m "Add build verifier for 48 pages and Phase 7-8 checks."
```

---

### Task 10: Final handoff note

**Files:**
- Create: `docs/superpowers/handoff-2026-09-10.md`

- [ ] **Step 1: Write short handoff**

Include:

- Done: Eleventy pipeline, 48 pages, robots/llms/sitemap, slug flatten report path
- Placeholder: shell page bodies, Lawmatics embed, CMS Body fields
- SEO flag: flattened county slugs (list from report) — confirm with Jaxon
- How to build: `npm install && npm run build && npm run verify`
- Output: `_site/`

- [ ] **Step 2: Commit**

```bash
/usr/bin/git add docs/superpowers/handoff-2026-09-10.md slug-flatten-report.txt
/usr/bin/git commit -m "Add pipeline handoff notes and slug flatten report."
```

(If `slug-flatten-report.txt` is gitignored, either remove it from `.gitignore` so the flagged URL change is tracked, or copy the report into the handoff doc. Prefer tracking the report: remove it from `.gitignore` in this task.)

---

## Spec coverage checklist (self-review)

| Spec requirement | Task |
|---|---|
| Read counties/conditions CSV | Task 2 |
| Flatten slash slugs + flag | Task 2, 9, 10 |
| Empty Body containers | Task 7 |
| CMS templates + SEO/canonical/h1/FAQ JSON-LD | Task 7 |
| Links to /check and /free-help | Tasks 3–7 |
| Footer disclaimer | Task 3 |
| 12 static shells | Task 4 |
| Screener client-side | Task 5 |
| Contact 3-field shell | Task 6 |
| Global head + OG/Twitter | Task 3 |
| robots.txt bot allows | Task 8 |
| llms.txt | Task 8 |
| sitemap 48 URLs | Task 8–9 |
| 18px, focus, scroll, contrast guard | Tasks 3, 9 |
| 48-page verify | Task 9 |
| Lawmatics deferred | Task 6 |
| No invented condition body copy | Tasks 7, Global Constraints |
