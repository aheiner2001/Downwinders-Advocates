# Spanish Draft Twins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an Español/English header toggle and parallel `/es/...` draft twins for every page (chrome + machine-translated draft copy), on branch `spanish-button`, clearly marked as not counsel-approved.

**Architecture:** Eleventy pages carry `locale` (`en`|`es`) and `alternatePath`. Shared header/footer/head branch on locale. CMS templates paginate twice (EN + ES) using Spanish CSV columns. Static Spanish pages live under `src/pages/es/`. `/es/` pages get a draft banner, `lang=es`, and `noindex`. Sitemap stays English-only.

**Tech Stack:** Eleventy 3, Nunjucks, csv-parse, existing `scripts/verify-build.js` gates, vanilla `screener.js`.

**Spec:** `docs/superpowers/specs/2026-09-10-spanish-draft-twins-design.md`

## Global Constraints

- Machine-translated Spanish is **draft for review only** — never treat as counsel-approved.
- Do **not** invent CMS Body copy; loader keeps `body: ""` for both locales.
- Screener still **sends nothing**; logic unchanged.
- Brand name **Downwinders Advocates** stays untranslated.
- `/es/` draft banner copy (locked): `Borrador de traducción automática para revisión — no es texto aprobado por el abogado. Para ayuda en español, llame al (801) 400-8270.`
- `/es/` pages: `noindex,nofollow`; English sitemap unchanged (no `/es/` URLs).
- Stay on branch `spanish-button`; do not merge to `main` unless asked.
- Preserve English pages except language toggle + hreflang.
- Page count after build: **96** `index.html` files (48 EN + 48 ES).

---

## File structure

| Path | Responsibility |
|---|---|
| `src/_data/locale.js` | Path helpers: `toEs`, `toEn`, `alternatePath`, `isEs` |
| `src/_data/ui.js` | EN/ES chrome strings (nav, footer, CTAs, skip, banner) |
| `src/_includes/layouts/base.njk` | `lang` from locale; include draft banner |
| `src/_includes/partials/head.njk` | robots, og:locale, hreflang |
| `src/_includes/partials/header.njk` | Localized nav + language link |
| `src/_includes/partials/footer.njk` | Localized footer |
| `src/_includes/partials/draft-banner.njk` | ES-only draft banner |
| `src/_includes/styles.css` | Banner + lang-switch styles |
| `counties.csv` / `conditions.csv` | Add `Name ES`, `SEO Title ES`, `Meta Description ES` |
| `src/covered-areas/covered-areas.11ty.js` | Dual-locale CMS areas |
| `src/conditions/conditions.11ty.js` | Dual-locale CMS conditions |
| `src/pages/es/*.njk` | Spanish static twins |
| `src/assets/js/screener.js` | Locale-aware result strings via `data-locale` on `#screener` |
| `scripts/verify-build.js` | 96 pages, ES gates, EN sitemap |

Default front matter for English pages (add where missing):

```yaml
locale: en
```

`alternatePath` may be omitted when it equals the other-locale twin of `permalink` via helpers; prefer setting it explicitly on each page for clarity.

---

### Task 1: Locale helpers + UI strings + failing verify gates

**Files:**
- Create: `src/_data/locale.js`
- Create: `src/_data/ui.js`
- Modify: `scripts/verify-build.js`
- Test: `npm run build && npm run verify`

**Interfaces:**
- Produces: `locale.toEs(path)`, `locale.toEn(path)`, `locale.alternatePath(path)`, `locale.isEsPath(path)` — all take/return strings starting with `/`
- Produces: `ui[locale].skip`, `.check`, `.freeHelp`, `.standards`, `.whatItCosts`, `.who`, `.faq`, `.contact`, `.langSwitchLabel`, `.langSwitchHrefHint`, `.footerTagline`, `.footerLegal`, `.ctaCheck`, `.ctaFreeHelp`, `.draftBanner`

- [ ] **Step 1: Write failing verify expectations for Spanish**

Replace the page-count and append Spanish assertions in `scripts/verify-build.js`:

```js
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
  if (!html.includes("hreflang=\"en\"") || !html.includes("hreflang=\"es\"")) {
    throw new Error(rel + " missing hreflang");
  }
}

assertSpanishDraft("es/index.html");
assertSpanishDraft("es/covered-areas/arizona-coconino-county/index.html");

const sitemap = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
if (sitemap.includes("/es/")) throw new Error("sitemap must not list /es/ while draft");

// keep English shell checks; add Spanish shells
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

console.log("PASS verify-build (96 pages + SEO + strict copy + ES draft + a11y CSS)");
```

Also update the old `pages !== 48` line (remove it — replaced above). Keep all existing English assertions.

- [ ] **Step 2: Run verify to confirm failure**

Run: `npm run build && npm run verify`  
Expected: FAIL — `expected 96 index.html pages, got 48` (or missing `es/...`)

- [ ] **Step 3: Add `src/_data/locale.js`**

```js
function normalizePath(p) {
  if (!p || p === "/") return "/";
  let out = String(p).startsWith("/") ? String(p) : "/" + p;
  if (!out.endsWith("/")) out += "/";
  return out;
}

function isEsPath(p) {
  const n = normalizePath(p);
  return n === "/es/" || n.startsWith("/es/");
}

function toEs(p) {
  const n = normalizePath(p);
  if (isEsPath(n)) return n;
  if (n === "/") return "/es/";
  return "/es" + n;
}

function toEn(p) {
  const n = normalizePath(p);
  if (!isEsPath(n)) return n;
  if (n === "/es/") return "/";
  return n.replace(/^\/es/, "") || "/";
}

function alternatePath(p) {
  return isEsPath(p) ? toEn(p) : toEs(p);
}

module.exports = { normalizePath, isEsPath, toEs, toEn, alternatePath };
```

- [ ] **Step 4: Add `src/_data/ui.js`**

```js
module.exports = {
  en: {
    skip: "Skip to content",
    check: "Check eligibility",
    freeHelp: "Free help",
    standards: "Our standards",
    whatItCosts: "What it costs",
    who: "Who we are",
    faq: "Questions",
    contact: "Contact",
    langSwitchLabel: "Español",
    footerTagline: "You do not have to figure this out alone.",
    footerLegal:
      "Downwinders Advocates is an independent, privately owned company. It is not affiliated with the United States government or the Department of Justice and is not a law firm. We do not provide legal advice. Submitting information does not create an attorney-client relationship and does not guarantee eligibility, approval, or compensation. Eligibility and compensation decisions are made solely by the U.S. Department of Justice. Free assistance with these claims is available from RESEP clinics.",
    footerStandards: "Our public standards",
    footerFreeHelp: "Free help (RESEP)",
    ctaCheck: "Check eligibility",
    ctaFreeHelp: "Free help",
    draftBanner: "",
    brandSubtitle: "RECA Claim Help",
  },
  es: {
    skip: "Saltar al contenido",
    check: "Verificar elegibilidad",
    freeHelp: "Ayuda gratuita",
    standards: "Nuestros estándares",
    whatItCosts: "Cuánto cuesta",
    who: "Quiénes somos",
    faq: "Preguntas",
    contact: "Contacto",
    langSwitchLabel: "English",
    footerTagline: "No tiene que resolver esto solo.",
    footerLegal:
      "Downwinders Advocates es una empresa independiente de propiedad privada. No está afiliada al gobierno de los Estados Unidos ni al Departamento de Justicia y no es un bufete de abogados. No ofrecemos asesoría legal. Enviar información no crea una relación abogado-cliente y no garantiza elegibilidad, aprobación ni compensación. Las decisiones de elegibilidad y compensación las toma únicamente el Departamento de Justicia de EE. UU. Hay asistencia gratuita con estos reclamos en las clínicas RESEP.",
    footerStandards: "Nuestros estándares públicos",
    footerFreeHelp: "Ayuda gratuita (RESEP)",
    ctaCheck: "Verificar elegibilidad",
    ctaFreeHelp: "Ayuda gratuita",
    draftBanner:
      "Borrador de traducción automática para revisión — no es texto aprobado por el abogado. Para ayuda en español, llame al (801) 400-8270.",
    brandSubtitle: "Ayuda con reclamos RECA",
  },
};
```

- [ ] **Step 5: Commit**

```bash
git add src/_data/locale.js src/_data/ui.js scripts/verify-build.js
git commit -m "$(cat <<'EOF'
Add locale/ui data and failing Spanish verify gates.

EOF
)"
```

---

### Task 2: Layout, head, header, footer, banner, CSS

**Files:**
- Modify: `src/_includes/layouts/base.njk`
- Modify: `src/_includes/partials/head.njk`
- Modify: `src/_includes/partials/header.njk`
- Modify: `src/_includes/partials/footer.njk`
- Create: `src/_includes/partials/draft-banner.njk`
- Modify: `src/_includes/styles.css`
- Modify: every English `src/pages/*.njk` front matter to set `locale: en` (and keep permalinks)

**Interfaces:**
- Consumes: `ui`, `locale` from `_data`
- Produces: pages render with `lang` from `locale` (`en` → `en-US`, `es` → `es`); language link uses `locale.alternatePath(page.url)`

- [ ] **Step 1: Update `base.njk`**

```njk
<!DOCTYPE html>
<html lang="{% if locale == 'es' %}es{% else %}en-US{% endif %}">
<head>
{% include "partials/head.njk" %}
</head>
<body>
{% include "partials/header.njk" %}
{% include "partials/draft-banner.njk" %}
<main id="main">
{{ content | safe }}
</main>
{% include "partials/footer.njk" %}
{% if extraScripts %}{{ extraScripts | safe }}{% endif %}
</body>
</html>
```

Default locale when missing: treat as `en` in partials via `locale or 'en'`.

- [ ] **Step 2: Create `draft-banner.njk`**

```njk
{% set L = locale or 'en' %}
{% if L == 'es' %}
<div class="draft-banner" role="status">
  <div class="wrap">{{ ui.es.draftBanner }}</div>
</div>
{% endif %}
```

- [ ] **Step 3: Update `header.njk` to localized chrome + language switch**

```njk
{% set L = locale or 'en' %}
{% set t = ui[L] %}
{% set alt = localeHelpers.alternatePath(page.url) if false else '' %}
```

Eleventy exposes `src/_data/locale.js` as `locale` **conflicting** with page `locale` string. **Rename the data file** to avoid collision:

- Rename `src/_data/locale.js` → `src/_data/paths.js` exporting the same helpers.
- In templates use `paths.toEs`, `paths.toEn`, `paths.alternatePath`.
- Keep page front-matter field named `locale: en|es`.

Update Task 1 commit if already made: rename file and fix imports/docs in this task.

Header body:

```njk
{% set L = locale or 'en' %}
{% set t = ui[L] %}
{% set homeHref = '/es/' if L == 'es' else '/' %}
{% set prefix = '/es' if L == 'es' else '' %}
<a class="skip" href="#main">{{ t.skip }}</a>
<header>
  <div class="bar">
    <a class="brand" href="{{ homeHref }}">
      <!-- existing SVG unchanged -->
      <span>Downwinders Advocates<small>{{ t.brandSubtitle }}</small></span>
    </a>
    <nav>
      <a href="{{ prefix }}/check/">{{ t.check }}</a>
      <a class="nav-secondary" href="{{ prefix }}/free-help/">{{ t.freeHelp }}</a>
      <a class="nav-secondary" href="{{ prefix }}/standards/">{{ t.standards }}</a>
      <a class="nav-secondary" href="{{ prefix }}/what-it-costs/">{{ t.whatItCosts }}</a>
      <a class="nav-secondary" href="{{ homeHref }}#who">{{ t.who }}</a>
      <a class="nav-secondary" href="{{ homeHref }}#faq">{{ t.faq }}</a>
      <a href="{{ prefix }}/contact/">{{ t.contact }}</a>
      <a class="tel" href="tel:{{ site.phoneTel }}">{{ site.phoneDisplay }}</a>
      <a class="lang-switch" href="{{ paths.alternatePath(page.url) }}" hreflang="{% if L == 'es' %}en{% else %}es{% endif %}">{{ t.langSwitchLabel }}</a>
    </nav>
  </div>
</header>
```

Keep the existing shield SVG markup from current `header.njk`.

- [ ] **Step 4: Update `footer.njk` similarly** — use `t.footerTagline`, `t.footerLegal`, prefixed links, `t.check` / `t.footerFreeHelp` / `t.footerStandards`.

- [ ] **Step 5: Update `head.njk`**

- If `locale == 'es'`: `<meta name="robots" content="noindex,nofollow">` else keep existing index,follow meta.
- `og:locale`: `es_US` vs `en_US`; add `og:locale:alternate` for the other.
- After canonical, add:

```njk
{% set enUrl = (paths.toEn(page.url) | absoluteUrl(site.url)) %}
{% set esUrl = (paths.toEs(page.url) | absoluteUrl(site.url)) %}
<link rel="alternate" hreflang="en" href="{{ enUrl }}">
<link rel="alternate" hreflang="es" href="{{ esUrl }}">
<link rel="alternate" hreflang="x-default" href="{{ enUrl }}">
```

- [ ] **Step 6: CSS for banner + lang switch**

Append to `src/_includes/styles.css`:

```css
.draft-banner{background:#3A2A12;color:#F8F5EF;font-size:16px;line-height:1.45;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.12)}
.draft-banner .wrap{max-width:var(--max);margin:0 auto;padding:0 var(--sp3)}
.lang-switch{font-weight:600;color:var(--accent)!important;border:1px solid rgba(222,162,68,.55);padding:6px 10px;border-radius:6px}
@media (max-width:760px){
  nav a.lang-switch{display:inline-flex!important}
}
```

Ensure mobile rule that hides nav links does **not** hide `.lang-switch` (override as above).

- [ ] **Step 7: Add `locale: en` to all English page front matters** under `src/pages/*.njk` (not yet creating `es/`).

- [ ] **Step 8: Build** — English site still works; verify still fails on missing `/es/` (expected until Task 4–6).

- [ ] **Step 9: Commit**

```bash
git add src/_data/paths.js src/_data/ui.js src/_includes scripts/verify-build.js src/pages
git commit -m "$(cat <<'EOF'
Wire locale-aware chrome, draft banner, and hreflang.

EOF
)"
```

If `locale.js` still exists, delete it after renaming to `paths.js`.

---

### Task 3: Spanish CSV columns + dual-locale CMS templates

**Files:**
- Modify: `counties.csv`
- Modify: `conditions.csv`
- Modify: `src/covered-areas/covered-areas.11ty.js`
- Modify: `src/conditions/conditions.11ty.js`
- Modify: `src/_data/counties.js` (FAQ JSON-LD: keep English FAQ on EN pages; for ES pages use Spanish Name/Meta in FAQ text)

**Interfaces:**
- CSV columns exactly: `Name ES`, `SEO Title ES`, `Meta Description ES`
- CMS render uses `locale` from pagination item
- Produces EN + ES HTML under `/covered-areas/` and `/es/covered-areas/` (same for conditions)

- [ ] **Step 1: Extend CSVs**

Add three columns to both CSV headers. Fill every row with Spanish draft translations of Name / SEO Title / Meta Description. Preserve hedging meaning; do not add Body content.

Example county row pattern (apply to **all** rows):

English Name `Utah` → `Name ES` `Utah` (proper noun)  
SEO Title ES: `¿Utah está cubierto por RECA? Todos los condados califican`  
Meta Description ES: Spanish draft of the English meta.

Repeat for every county and condition row. Proper nouns (county names, RECA, DOJ) stay recognizable; translate surrounding prose.

- [ ] **Step 2: Refactor `covered-areas.11ty.js` for dual locale**

```js
exports.data = {
  pagination: {
    data: "countyPages",
    size: 1,
    alias: "pageItem",
  },
  permalink: (data) => data.pageItem.permalink,
  layout: "layouts/base.njk",
  eleventyComputed: {
    locale: (data) => data.pageItem.locale,
    title: (data) => data.pageItem.title,
    description: (data) => data.pageItem.description,
    faqJsonLd: (data) => data.pageItem.faqJsonLd,
  },
};

exports.render = function (data) {
  const item = data.pageItem;
  const L = item.locale;
  const t = data.ui[L];
  const prefix = L === "es" ? "/es" : "";
  return `
<section class="sec">
  <div class="wrap stack">
    <h1>${item.name}</h1>
    <div class="rich-text body-content" data-cms-body">
      ${item.body || ""}
    </div>
    <div class="btns">
      <a class="btn" href="${prefix}/check/">${t.ctaCheck}</a>
      <a class="btn btn--ghost" href="${prefix}/free-help/">${t.ctaFreeHelp}</a>
    </div>
  </div>
</section>
`;
};
```

Fix typo: `data-cms-body"` → `data-cms-body`.

- [ ] **Step 3: Add `src/_data/countyPages.js`**

```js
const counties = require("./counties");

module.exports = counties.flatMap((area) => {
  const en = {
    locale: "en",
    permalink: `/covered-areas/${area.slug}/`,
    name: area.Name,
    title: area["SEO Title"],
    description: area["Meta Description"],
    body: area.body || "",
    faqJsonLd: area.faqJsonLd,
  };
  const es = {
    locale: "es",
    permalink: `/es/covered-areas/${area.slug}/`,
    name: area["Name ES"],
    title: area["SEO Title ES"],
    description: area["Meta Description ES"],
    body: area.body || "",
    faqJsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `¿${area["Name ES"]} está cubierto por RECA?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${area["Coverage Status"]}. ${area["Meta Description ES"]}`,
          },
        },
      ],
    },
  };
  return [en, es];
});
```

Mirror for `conditionPages.js` + update `conditions.11ty.js` the same way (`name` from `Name` / `Name ES`).

- [ ] **Step 4: Point covered-areas pagination at `countyPages`** (as above). Remove old single-locale pagination.

- [ ] **Step 5: Build and spot-check**

Run: `npx eleventy`  
Expected: `_site/es/covered-areas/utah/index.html` exists with Spanish h1/title and draft banner (banner appears once layout Task 2 is done).

- [ ] **Step 6: Commit**

```bash
git add counties.csv conditions.csv src/_data/countyPages.js src/_data/conditionPages.js src/covered-areas src/conditions
git commit -m "$(cat <<'EOF'
Add Spanish CSV fields and dual-locale CMS pages.

EOF
)"
```

---

### Task 4: Spanish static shell pages

**Files:**
- Create: `src/pages/es/documents.njk`
- Create: `src/pages/es/free-help.njk`
- Create: `src/pages/es/deadline.njk`
- Create: `src/pages/es/survivors.njk`
- Create: `src/pages/es/siblings.njk`
- Create: `src/pages/es/is-this-real.njk`
- Create: `src/pages/es/someone-told-me-about-this.njk`

**Interfaces:**
- Each: `locale: es`, `permalink: /es/<slug>/`, empty body like English, CTAs to `/es/check/` and `/es/free-help/`
- Titles: Spanish draft of English shell titles; descriptions may stay `""`

- [ ] **Step 1: Create each shell** using this template (example `documents`):

```njk
---
layout: layouts/base.njk
locale: es
title: "Documentos | Downwinders Advocates"
description: ""
permalink: /es/documents/
---
<section class="sec">
  <div class="wrap stack">
    <h1>Documentos</h1>
    <div class="btns">
      <a class="btn" href="/es/check/">Verificar elegibilidad</a>
      <a class="btn btn--ghost" href="/es/free-help/">Ayuda gratuita</a>
    </div>
  </div>
</section>
```

Title/h1 map:

| Path | h1 ES |
|---|---|
| `/es/free-help/` | Ayuda gratuita |
| `/es/deadline/` | Fecha límite |
| `/es/survivors/` | Sobrevivientes |
| `/es/siblings/` | Hermanos |
| `/es/is-this-real/` | ¿Es esto real? |
| `/es/someone-told-me-about-this/` | Alguien me habló de esto |
| `/es/documents/` | Documentos |

Do **not** invent body copy beyond the h1 + CTAs.

- [ ] **Step 2: Commit**

```bash
git add src/pages/es
git commit -m "$(cat <<'EOF'
Add Spanish empty shell page twins.

EOF
)"
```

---

### Task 5: Spanish content pages (standards, what-it-costs, contact)

**Files:**
- Create: `src/pages/es/standards.njk`
- Create: `src/pages/es/what-it-costs.njk`
- Create: `src/pages/es/contact.njk`

**Interfaces:**
- Full Spanish draft of English prose; internal links use `/es/` prefix; forms keep same field `name`s for `screener.js` / callback JS

- [ ] **Step 1: Create `src/pages/es/standards.njk`**

Copy structure from `src/pages/standards.njk`. Set:

```yaml
locale: es
permalink: /es/standards/
title: "Nuestros estándares públicos | Downwinders Advocates"
```

Machine-translate all visible English strings to Spanish draft. Keep the 11-rule list structure. CTA hrefs → `/es/check/`, `/es/free-help/`.

- [ ] **Step 2: Create `src/pages/es/what-it-costs.njk`**

Same pattern: `permalink: /es/what-it-costs/`, translate all prose, preserve fee-pending hedging; do not invent fee numbers.

- [ ] **Step 3: Create `src/pages/es/contact.njk`**

Same pattern: `permalink: /es/contact/`. Keep `id="cb"`, input `name`s (`name`, `phone`, `when`) unchanged. Translate labels/options/button text. Callback success/error strings live in `screener.js` (Task 7) — add `data-locale="es"` on the form or page root that JS reads.

- [ ] **Step 4: Commit**

```bash
git add src/pages/es/standards.njk src/pages/es/what-it-costs.njk src/pages/es/contact.njk
git commit -m "$(cat <<'EOF'
Add Spanish draft twins for standards, costs, and contact.

EOF
)"
```

---

### Task 6: Spanish home + check pages

**Files:**
- Create: `src/pages/es/index.njk`
- Create: `src/pages/es/check.njk`

**Interfaces:**
- Home: `permalink: /es/`, `locale: es`, all section ids preserved (`#who`, `#faq`, etc.)
- Check: `permalink: /es/check/`, include screener markup with Spanish visible copy; `extraScripts` still loads `/js/screener.js`
- Form `#screener` must include `data-locale="es"`

- [ ] **Step 1: Create Spanish home**

1. Copy `src/pages/index.njk` → `src/pages/es/index.njk`
2. Front matter: `locale: es`, `permalink: /es/`, Spanish `title` / `description` / og fields (draft translations of English)
3. Translate every visible English string to Spanish draft
4. Rewrite internal links: `/check/` → `/es/check/`, `/standards/` → `/es/standards/`, `/` anchors stay `/es/#...`, `/contact/` → `/es/contact/`, `/free-help/` → `/es/free-help/`, `/what-it-costs/` → `/es/what-it-costs/`
5. Keep brand name; keep phone number; existing `lang="es"` callout line may remain or merge with banner (do not remove phone Spanish help)

- [ ] **Step 2: Create Spanish check**

1. Copy `src/pages/check.njk` → `src/pages/es/check.njk`
2. Front matter: `locale: es`, `permalink: /es/check/`
3. Translate legends, labels, table, notices
4. On `<form class="tool" id="screener">` add `data-locale="es"`
5. Radio `value` attributes **unchanged** (logic keys)

- [ ] **Step 3: Commit**

```bash
git add src/pages/es/index.njk src/pages/es/check.njk
git commit -m "$(cat <<'EOF'
Add Spanish draft home and eligibility check pages.

EOF
)"
```

---

### Task 7: Screener + callback JS locale strings

**Files:**
- Modify: `src/assets/js/screener.js`

**Interfaces:**
- Reads `document.getElementById('screener').getAttribute('data-locale')` → `'es'` or default `'en'`
- Same for `#cb` via `data-locale` on that form (set on ES contact page)

- [ ] **Step 1: Wrap message catalogs**

At top of `screener.js`:

```js
function screenerLocale() {
  var el = document.getElementById('screener');
  return (el && el.getAttribute('data-locale') === 'es') ? 'es' : 'en';
}
function cbLocale() {
  var el = document.getElementById('cb');
  return (el && el.getAttribute('data-locale') === 'es') ? 'es' : 'en';
}
```

Duplicate every user-facing result string into `messages.en` / `messages.es` objects (full Spanish drafts of the existing English result HTML). Branch `h`/`b` assignment to use `messages[screenerLocale()]`.

Preserve outcome logic branches exactly; only swap display strings.

For callback form (`#cb`), Spanish drafts of the validation/success HTML when `cbLocale()==='es'`.

- [ ] **Step 2: Add `data-locale="es"`** on `#cb` in `src/pages/es/contact.njk` if not already.

- [ ] **Step 3: Manual check** — open `/es/check/`, submit incomplete form, confirm Spanish blank-state message; complete a path, confirm Spanish result; confirm nothing is sent (still `preventDefault` only).

- [ ] **Step 4: Commit**

```bash
git add src/assets/js/screener.js src/pages/es/contact.njk
git commit -m "$(cat <<'EOF'
Localize screener and callback result strings for Spanish pages.

EOF
)"
```

---

### Task 8: Final verification + handoff note

**Files:**
- Modify: `scripts/verify-build.js` if any assertion gaps remain
- Optionally create: `handoff-spanish-draft.md` (only if useful; keep short)

- [ ] **Step 1: Full verify**

Run: `npm run build && npm run verify`  
Expected: `PASS verify-build (96 pages + SEO + strict copy + ES draft + a11y CSS)`

- [ ] **Step 2: Manual spot checklist**

- `/` shows **Español** → `/es/`
- `/es/` shows draft banner + **English** → `/`
- `/covered-areas/utah/` ↔ `/es/covered-areas/utah/`
- `/es/` HTML has `noindex`; `sitemap.xml` has no `/es/`
- CMS body containers empty on EN and ES
- Mobile: lang switch still visible

- [ ] **Step 3: Commit verify fixes if any**

```bash
git add scripts/verify-build.js
git commit -m "$(cat <<'EOF'
Finish Spanish draft twin verification gates.

EOF
)"
```

- [ ] **Step 4: Stop** — do not merge to `main` or push unless the user asks. Report staging test URLs for local `npm run serve`.

---

## Spec coverage self-review

| Spec requirement | Task |
|---|---|
| Español/English twin URLs | 2, 3, 4, 5, 6 |
| All pages + chrome (A+C) | 2–6 |
| Draft banner locked copy | 2 |
| noindex on `/es/` | 2, 8 |
| Sitemap English-only | 8 (verify) |
| CSV `Name ES` / SEO / Meta | 3 |
| Bodies empty | 3 + verify |
| Screener Spanish + sends nothing | 6, 7 |
| Brand untranslated | 2, global |
| Stay on `spanish-button` | global |

## Placeholder / consistency notes

- Data module renamed **`paths.js`** so it does not clash with page `locale`.
- Page count **96** is the single source of truth in verify.
- CMS CTA strings come from `ui[locale]`, not hardcoded English.
