# Strict-Copy Static Site Pipeline (Phases 5–8) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the existing Eleventy site in line with the restarted Phases 5–8 design: 48 pages, CSV-driven CMS, SEO roots, a11y polish — with **zero invented body copy**.

**Architecture:** Keep CSV loaders, slug flattening, `.eleventy.js`, and `package.json`. Replace layouts/templates/pages wholesale. Move verbatim sections from `index.html` onto `/`, `/check`, `/standards`, `/what-it-costs`, and `/contact`. Seven other static URLs are chrome-only shells. CMS templates render Name + empty Body + `/check` + `/free-help` only (SEO/FAQ JSON-LD stay in `<head>`).

**Tech Stack:** Eleventy 3, Nunjucks, Node `csv-parse`, GitHub Pages–style `_site/` output.

## Global Constraints

- Move reference copy only; never invent or paraphrase compliance/eligibility/money/deadline/“free” wording
- CMS Body fields stay empty; do not render Meta Description, Key Towns, Coverage Status, or Category as on-page prose
- Shell pages: structural title `{Page name} | Downwinders Advocates`; no invented meta; no “content coming” blurbs
- Screener: client-side only; do not reorder JS branches; send nothing
- Light mode only; body ≥ 18px; no gold text on light backgrounds; visible `:focus-visible`
- Footer disclaimer is one partial on every page
- Ask before changing URL structure, analytics, or going live
- Spec: `docs/superpowers/specs/2026-09-10-static-site-pipeline-design.md`
- Use `/usr/bin/git` for commits on this machine (old `/usr/local/bin/git` rejects `--trailer`)

---

## File map

| Path | Responsibility |
|---|---|
| `scripts/verify-build.js` | Build gates: 48 pages, SEO roots, flatten report, strict no-invented-copy greps, CMS body shape |
| `src/covered-areas/covered-areas.11ty.js` | Covered Areas CMS template (minimal body) |
| `src/conditions/conditions.11ty.js` | Conditions CMS template (minimal body) |
| `src/pages/*.njk` | 12 static pages (5 content + 7 shells) |
| `src/_includes/**` | Keep unless a content leak is found; head/footer/styles already mostly correct |
| `scripts/load-csv.js`, `src/_data/*` | Keep (Phase 5 plumbing) |
| `index.html` | Read-only reference for copy/CSS/JS moves |
| `src/assets/js/screener.js` | Must match reference screener logic order |

---

### Task 1: Strict verify gates (TDD)

**Files:**
- Modify: `scripts/verify-build.js`
- Test: `npm run build && npm run verify`

**Interfaces:**
- Consumes: `_site/**` after `eleventy` build; `slug-flatten-report.txt`
- Produces: exit 0 only when count/SEO/a11y/strict-copy gates pass

- [ ] **Step 1: Write the failing verify assertions**

Replace `scripts/verify-build.js` with:

```js
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
if (pages !== 48) throw new Error("expected 48 index.html pages, got " + pages);

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
  if (!html.includes('data-cms-body')) throw new Error(rel + " missing empty Body container");
  if (/Key towns:/i.test(html)) throw new Error(rel + " must not show Key Towns as prose");
  if (/class="lede"/.test(html)) throw new Error(rel + " must not show meta as lede prose");
}

assertCmsMinimal("covered-areas/not-covered/index.html");
assertCmsMinimal("covered-areas/arizona-coconino-county/index.html");
assertCmsMinimal("conditions/leukemia/index.html");

const contentPages = ["index.html", "check/index.html", "standards/index.html", "what-it-costs/index.html", "contact/index.html"];
for (const rel of contentPages) {
  const html = fs.readFileSync(path.join(site, rel), "utf8");
  for (const re of forbidden) {
    if (re.test(html)) throw new Error("invented placeholder in " + rel);
  }
}

console.log("PASS verify-build (48 pages + SEO + strict copy + a11y CSS)");
```

- [ ] **Step 2: Run verify and confirm it fails on current invented copy**

Run:

```bash
npm run build && npm run verify
```

Expected: FAIL mentioning invented shell copy and/or CMS `lede` / `Key towns`

- [ ] **Step 3: Commit the failing gate**

```bash
/usr/bin/git add scripts/verify-build.js
/usr/bin/git commit -F - <<'EOF'
Tighten verify-build for strict no-invented-copy gates.

EOF
```

---

### Task 2: Replace CMS templates (minimal body)

**Files:**
- Modify: `src/covered-areas/covered-areas.11ty.js`
- Modify: `src/conditions/conditions.11ty.js`
- Test: `npm run build && npm run verify` (CMS assertions should pass; shells may still fail)

**Interfaces:**
- Consumes: `data.counties` / `data.conditions` items with `Name`, `slug`, `body`, `faqJsonLd`, SEO fields
- Produces: `/covered-areas/{slug}/index.html` and `/conditions/{slug}/index.html`

- [ ] **Step 1: Replace covered-areas template**

```js
exports.data = {
  pagination: {
    data: "counties",
    size: 1,
    alias: "area",
  },
  permalink: (data) => `/covered-areas/${data.area.slug}/`,
  layout: "layouts/base.njk",
  eleventyComputed: {
    title: (data) => data.area["SEO Title"],
    description: (data) => data.area["Meta Description"],
    faqJsonLd: (data) => data.area.faqJsonLd,
  },
};

exports.render = function (data) {
  const area = data.area;
  return `
<section class="sec">
  <div class="wrap stack">
    <h1>${area.Name}</h1>
    <div class="rich-text body-content" data-cms-body>
      ${area.body || ""}
    </div>
    <div class="btns">
      <a class="btn" href="/check/">Check eligibility</a>
      <a class="btn btn--ghost" href="/free-help/">Free help</a>
    </div>
  </div>
</section>
`;
};
```

- [ ] **Step 2: Replace conditions template**

```js
exports.data = {
  pagination: {
    data: "conditions",
    size: 1,
    alias: "condition",
  },
  permalink: (data) => `/conditions/${data.condition.slug}/`,
  layout: "layouts/base.njk",
  eleventyComputed: {
    title: (data) => data.condition["SEO Title"],
    description: (data) => data.condition["Meta Description"],
    faqJsonLd: (data) => data.condition.faqJsonLd,
  },
};

exports.render = function (data) {
  const condition = data.condition;
  return `
<section class="sec">
  <div class="wrap stack">
    <h1>${condition.Name}</h1>
    <div class="rich-text body-content" data-cms-body>
      ${condition.body || ""}
    </div>
    <div class="btns">
      <a class="btn" href="/check/">Check eligibility</a>
      <a class="btn btn--ghost" href="/free-help/">Free help</a>
    </div>
  </div>
</section>
`;
};
```

- [ ] **Step 3: Build and spot-check**

Run:

```bash
npm run build
rg -n "Key towns:|class=\"lede\"|content for this page is coming" _site/covered-areas _site/conditions || true
```

Expected: no Key towns / lede matches under those dirs.

- [ ] **Step 4: Commit**

```bash
/usr/bin/git add src/covered-areas/covered-areas.11ty.js src/conditions/conditions.11ty.js
/usr/bin/git commit -F - <<'EOF'
Strip CMS templates to Name, empty Body, and required CTAs.

EOF
```

---

### Task 3: Replace seven shell pages

**Files:**
- Modify: `src/pages/is-this-real.njk`
- Modify: `src/pages/siblings.njk`
- Modify: `src/pages/someone-told-me-about-this.njk`
- Modify: `src/pages/documents.njk`
- Modify: `src/pages/free-help.njk`
- Modify: `src/pages/deadline.njk`
- Modify: `src/pages/survivors.njk`

**Interfaces:**
- Consumes: `layouts/base.njk`
- Produces: empty main with one structural h1 + two required links; no `description` front matter (or empty string)

- [ ] **Step 1: Write the shared shell body pattern**

For each file, use this shape (only title / permalink / h1 text change):

```njk
---
layout: layouts/base.njk
title: "PAGE_TITLE | Downwinders Advocates"
description: ""
permalink: /PAGE_SLUG/
---
<section class="sec">
  <div class="wrap stack">
    <h1>PAGE_H1</h1>
    <div class="btns">
      <a class="btn" href="/check/">Check eligibility</a>
      <a class="btn btn--ghost" href="/free-help/">Free help</a>
    </div>
  </div>
</section>
```

Exact values:

| File | title | permalink | h1 |
|---|---|---|---|
| `is-this-real.njk` | `Is This Real? \| Downwinders Advocates` | `/is-this-real/` | `Is this real?` |
| `siblings.njk` | `Siblings \| Downwinders Advocates` | `/siblings/` | `Siblings` |
| `someone-told-me-about-this.njk` | `Someone Told Me About This \| Downwinders Advocates` | `/someone-told-me-about-this/` | `Someone told me about this` |
| `documents.njk` | `Documents \| Downwinders Advocates` | `/documents/` | `Documents` |
| `free-help.njk` | `Free Help \| Downwinders Advocates` | `/free-help/` | `Free help` |
| `deadline.njk` | `Deadline \| Downwinders Advocates` | `/deadline/` | `Deadline` |
| `survivors.njk` | `Survivors \| Downwinders Advocates` | `/survivors/` | `Survivors` |

Do **not** invent meta descriptions. Leave `description: ""`. Flag empty shell metas in the final handoff note (Task 7).

Button labels `Check eligibility` / `Free help` match the footer partial wording already in the reference footer path — do not invent longer marketing CTAs on shells.

- [ ] **Step 2: Build and confirm shells pass invented-copy grep**

```bash
npm run build
rg -ni "content for this page is coming|copy coming" _site/is-this-real _site/siblings _site/someone-told-me-about-this _site/documents _site/free-help _site/deadline _site/survivors
```

Expected: no matches.

- [ ] **Step 3: Commit**

```bash
/usr/bin/git add src/pages/is-this-real.njk src/pages/siblings.njk src/pages/someone-told-me-about-this.njk src/pages/documents.njk src/pages/free-help.njk src/pages/deadline.njk src/pages/survivors.njk
/usr/bin/git commit -F - <<'EOF'
Replace empty static shells with chrome-only strict templates.

EOF
```

---

### Task 4: Move `/standards` and `/what-it-costs` from reference

**Files:**
- Modify: `src/pages/standards.njk`
- Modify: `src/pages/what-it-costs.njk`
- Read-only: `index.html` lines 436–467 (`#cost`, `#standards`)

**Interfaces:**
- Produces: full moved standards list; full moved cost section; titles from reference page purpose (structural + brand)

- [ ] **Step 1: Replace `what-it-costs.njk`**

Front matter:

```yaml
---
layout: layouts/base.njk
title: "What It Costs | Downwinders Advocates"
description: ""
permalink: /what-it-costs/
---
```

Body: paste the `<section class="sec" id="cost">…</section>` block from `index.html` **verbatim** (currently ~lines 436–446). Change `id="cost"` to `id="top"` or leave `id="cost"`. Do not rewrite sentences. Keep the pending fee line exactly.

Also add the required links (footer already has them; page body should still include CTAs per buildkit):

```html
<div class="btns">
  <a class="btn" href="/check/">Check eligibility</a>
  <a class="btn btn--ghost" href="/free-help/">Free help</a>
</div>
```

Place that `div.btns` after the moved section’s closing `</div></section>`’s inner wrap content (inside the section, after the cost copy).

- [ ] **Step 2: Replace `standards.njk`**

Front matter:

```yaml
---
layout: layouts/base.njk
title: "Our Public Standards | Downwinders Advocates"
description: ""
permalink: /standards/
---
```

Body: paste `<section class="sec sec--deep" id="standards">…</section>` from `index.html` **verbatim** (~lines 448–467), then the same `/check` + `/free-help` button pair.

- [ ] **Step 3: Build and confirm no placeholder blurbs**

```bash
npm run build
rg -ni "content for this page is coming" _site/standards _site/what-it-costs
```

Expected: no matches. Standards page must contain `We will never tell you that you qualify.`

- [ ] **Step 4: Commit**

```bash
/usr/bin/git add src/pages/standards.njk src/pages/what-it-costs.njk
/usr/bin/git commit -F - <<'EOF'
Move standards and costs sections from reference into static pages.

EOF
```

---

### Task 5: Move `/contact` and `/check` from reference

**Files:**
- Modify: `src/pages/contact.njk`
- Modify: `src/pages/check.njk`
- Modify: `src/assets/js/screener.js` (must match reference logic; copy from `index.html` bottom script if drift)
- Read-only: `index.html` `#check` form (~315–403) and `#contact` (~535–588)

**Interfaces:**
- `/check`: screener markup + `<script src="/js/screener.js">` via `extraScripts` or page include
- `/contact`: three fields only (`name`, `phone`, `when`); no Lawmatics wiring; form may no-op / show local message already in reference JS if present — do not add email gate

- [ ] **Step 1: Write `check.njk`**

Front matter — use the reference document title/description from `index.html` `<title>` / meta if present; otherwise structural:

```yaml
---
layout: layouts/base.njk
title: "Eligibility Check | Downwinders Advocates"
description: ""
permalink: /check/
extraScripts: '<script src="/js/screener.js" defer></script>'
---
```

Body: move the screener section from `index.html` starting at `<section class="sec" id="check">` through its closing `</section>` **before** the wind SVG that follows (~315–403). Include the covered-areas notice table and the full form with fieldsets/legends and `aria-live` result region.

Link rewrites inside the moved block:
- Do not point primary CTAs at `#contact` for “start file” if that fragment is absent on this page — leave in-page anchors that exist; externalize only when the target section is not on `/check`.

Ensure `src/assets/js/screener.js` is a straight extraction of the screener function order from the reference (disqualifiers before optimistic branches). Do not reorder.

- [ ] **Step 2: Write `contact.njk`**

```yaml
---
layout: layouts/base.njk
title: "Contact | Downwinders Advocates"
description: ""
permalink: /contact/
---
```

Body: move `#contact` section (~535–588) verbatim. Keep exactly three fields. Change the pending endpoint legal line’s `#who` link to `/` or `/#who` only if that section exists on home after Task 6; otherwise link to `/` without inventing new disclaimer text — prefer keeping the sentence and pointing `who you are dealing with` to `/#who` once home includes the people section.

Add `/check` + `/free-help` button pair if not already present in the moved block.

- [ ] **Step 3: Manual network check for screener**

Run `npm run serve`, open `/check/`, complete the form, confirm DevTools Network shows **no** request on submit.

If `test_screener.js` exists in the workspace or handoff folder, run it and expect EXIT 0 / 0 leaks. If absent, note “screener test file not in repo” in handoff — do not invent a weaker test that rewrites logic.

- [ ] **Step 4: Commit**

```bash
/usr/bin/git add src/pages/check.njk src/pages/contact.njk src/assets/js/screener.js
/usr/bin/git commit -F - <<'EOF'
Move screener and contact pages from the reference build.

EOF
```

---

### Task 6: Condensed home from reference (move only)

**Files:**
- Modify: `src/pages/index.njk`
- Read-only: `index.html`

**Interfaces:**
- Home includes only these moved blocks (spec): hero, free-file offer, families we help, covered-areas table, how-it-works steps, standards summary, people, contact
- Internal `#check` / `#contact` links become `/check/` and `/contact/` where the target is a separate page

- [ ] **Step 1: Assemble `index.njk` from reference slices**

Front matter — move the reference home title/description from `index.html` `<head>` if present:

```yaml
---
layout: layouts/base.njk
title: "RECA Claim Help for Downwinders and Uranium Workers | Downwinders Advocates"
description: "Free eligibility check for the federal Radiation Exposure Compensation Act. Covered counties, qualifying conditions, and the December 31 2027 filing deadline. Independent, not a government agency, not a law firm."
ogTitle: "RECA Claim Help for Downwinders and Uranium Workers"
ogDescription: "Free eligibility check. Covered counties, qualifying conditions, and the December 31 2027 deadline. Independent. Not a government agency. Not a law firm."
permalink: /
---
```

(Those title/description strings must be copied from the reference `index.html` `<title>` / meta tags — if the reference strings differ, use the reference strings exactly.)

Include, in order, **verbatim** HTML from `index.html`:

1. Hero section (`#top`) — rewrite `#check` CTA href to `/check/`; keep `tel:` CTA as in reference
2. Free-file offer section (the `.offer` block)
3. Six kinds of families grid
4. Covered-areas **table only** (the `.notice` + `.scroll` table from the screener section) — do **not** include the screener `<form>` on home
5. How it works four steps section
6. Standards **summary**: move only the standards eyebrow + h2 + lede paragraphs from `#standards` (not the full `<ol class="std">`), then a link using existing footer wording: `<a class="btn" href="/standards/">Our public standards</a>`
7. People section (`#who`) — keep avatar initials placeholders
8. Contact section — same three-field form as `/contact`, or a short CTA pointing to `/contact/` **using sentences already in the reference**; prefer moving a compact “Talk to a person” block only if those exact sentences exist. If duplicating the full contact form would fork copy, move the full `#contact` block once on `/contact` and on home use only existing reference sentences plus `<a href="/contact/">` with link text that already appears in the reference (“Start my family’s file” / “Have someone call me” as they appear). Prefer: include the full contact section on home as in the original single-page reference (copy move), and keep `/contact` as the same moved section (duplicate is OK — it is moved, not rewritten).

Do **not** include FAQ, stories, terminal, or full standards list on home unless they are in the locked list above.

- [ ] **Step 2: Build and visually skim**

```bash
npm run build && npm run serve
```

Open `/`. Confirm no screener form on home, table scrolls inside `.scroll`, people still show initials.

- [ ] **Step 3: Commit**

```bash
/usr/bin/git add src/pages/index.njk
/usr/bin/git commit -F - <<'EOF'
Rebuild home from reference sections without inventing copy.

EOF
```

---

### Task 7: Final verification + handoff flags

**Files:**
- Modify: `docs/superpowers/handoff-2026-09-10.md` (update or append strict-copy restart notes)
- Test: `scripts/verify-build.js`

- [ ] **Step 1: Run full verify**

```bash
npm run build && npm run verify
```

Expected: `PASS verify-build (48 pages + SEO + strict copy + a11y CSS)`

- [ ] **Step 2: Manual checklist (record results in handoff)**

- Spot-check `/covered-areas/not-covered/`, `/covered-areas/arizona-coconino-county/`, `/conditions/leukemia/` — one h1, empty body, no Key Towns prose
- Confirm `_site/robots.txt` allows the four AI bots; `_site/llms.txt` and `_site/sitemap.xml` exist
- Confirm shell metas are empty and listed for Jaxon
- Confirm slug flatten report lists all 12 slash county slugs
- Confirm Lawmatics still unwired
- Confirm photos / Laura surname / fee pending still flagged as launch blockers

- [ ] **Step 3: Commit handoff**

```bash
/usr/bin/git add docs/superpowers/handoff-2026-09-10.md
/usr/bin/git commit -F - <<'EOF'
Document strict-copy restart verification and open flags.

EOF
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|---|---|
| CSV 19+17, flatten + report | Keep existing (Tasks 1–2 verify) |
| CMS templates minimal body | Task 2 |
| 12 static + 36 CMS = 48 | Tasks 1, 7 |
| Content pages moved copy | Tasks 4–6 |
| 7 shells chrome-only | Task 3 |
| robots/llms/sitemap/OG | Existing + Task 1/7 |
| a11y 18px / focus / scroll | Task 1 CSS gates + existing styles |
| No invented copy | Tasks 1–3, 7 greps |
| Screener sends nothing | Task 5 |
| Lawmatics deferred | Task 5/7 |

No TBD placeholders remain in task steps.
