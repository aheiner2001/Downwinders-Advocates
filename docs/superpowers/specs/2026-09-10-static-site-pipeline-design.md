# Downwinders Advocates — Static Site Pipeline (Phases 5–8)

**Date:** 2026-09-10 (restart)  
**Status:** Draft for user review  
**Stack:** Eleventy → static `_site/` for GitHub Pages  
**Canonical base:** `https://downwindersadvocates.com`  
**Content policy:** Strict — move reference copy only; invent nothing

## Goal

Local static-site pipeline that:

1. Reads `counties.csv` (19) and `conditions.csv` (17)
2. Emits 36 programmatic pages plus 12 static pages (48 HTML pages total)
3. Ships root `robots.txt`, `llms.txt`, sitemap, global head SEO, and a11y polish from Phases 5–8
4. Obeys buildkit guardrails: no rewritten compliance copy, no invented CMS/shell body copy

## Decisions (locked)

| Topic | Decision |
|---|---|
| SSG | Eleventy (11ty) — keep existing |
| Codebase strategy | Keep CSV loaders, slug flatten, `.eleventy.js`, verify scripts; **replace templates/pages wholesale** |
| Content pages (moved reference copy) | `/`, `/check`, `/standards`, `/what-it-costs`, `/contact` |
| Empty shells (chrome only) | `/is-this-real`, `/siblings`, `/someone-told-me-about-this`, `/documents`, `/free-help`, `/deadline`, `/survivors` |
| Shell SEO titles | Structural only: `{Page name} \| Downwinders Advocates` |
| Shell meta descriptions | Do not invent. Empty or flagged missing for Jaxon |
| CMS visible body | `Name` as sole `<h1>` + empty Body container + links to `/check` and `/free-help` + footer. Do **not** render Meta Description, Key Towns, Coverage Status, or Category as on-page prose |
| CMS head/SEO | SEO Title, Meta Description, canonical, OG/Twitter, FAQ JSON-LD from CSV fields |
| CMS Body field | Bound and empty; never AI-filled |
| Slug `/` characters | Flatten (`arizona/coconino-county` → `arizona-coconino-county`); write `slug-flatten-report.txt` |
| Lawmatics | Deferred; `/contact` three fields only, not live-wired |
| Screener | Client-side only; no network; no per-answer analytics; do not reorder JS branches |

## Page inventory (48)

### Static (12)

| URL | Content |
|---|---|
| `/` | Condensed home by **moving** these reference blocks only (no paraphrase): hero, free-file offer, families we help, covered-areas table, how-it-works steps, standards summary, people, contact |
| `/check/` | Full screener markup + JS from reference |
| `/standards/` | Moved “public standards” section from reference |
| `/what-it-costs/` | Moved cost section from reference |
| `/contact/` | Moved contact / four ways + three-field callback shell (not Lawmatics-wired) |
| `/is-this-real/` | Shell |
| `/siblings/` | Shell |
| `/someone-told-me-about-this/` | Shell |
| `/documents/` | Shell |
| `/free-help/` | Shell |
| `/deadline/` | Shell |
| `/survivors/` | Shell |

**Shell definition:** Shared layout (skip link, nav, footer disclaimer) + structural `<h1>` (page name) + links to `/check` and `/free-help` + unique structural `<title>`. No invented “content coming” blurbs. No body copy until handed over.

### Programmatic (36)

- Covered Areas: `/covered-areas/{slug}/` × 19
- Conditions: `/conditions/{slug}/` × 17

Trailing-slash directories with `index.html` for GitHub Pages.

## Data model (Phase 5)

### Covered Areas (`counties.csv`)

Slug · Name · State · Coverage Status · Key Towns · SEO Title · Meta Description · Body (empty)

### Conditions (`conditions.csv`)

Slug · Name · Category · SEO Title · Meta Description · Body (empty)

### Slug flattening

Any slug containing `/` is rewritten by replacing `/` with `-`. Build writes `slug-flatten-report.txt` listing original → flattened mappings. Nested folder URLs are not used. Flag for Jaxon (SEO plan impact).

## Templates (Phase 6)

### Shared chrome

- Skip-to-content first
- Sticky header/nav
- Footer disclaimer as **one** include/partial (every page)
- Brand tokens and CSS from reference `index.html`
- Visible `:focus-visible` ring; light mode only

### Every CMS page

- `<title>` ← SEO Title
- Meta description ← Meta Description
- Self-referencing canonical (`https://downwindersadvocates.com{path}`)
- Exactly one `<h1>` ← Name
- Empty Body container (rich-text ready, empty now)
- Links to `/check` and `/free-help`
- Footer disclaimer partial
- FAQ JSON-LD in `<head>`, built from collection fields (not duplicated as page prose)

### Implementation approach

Partial templates: move verbatim HTML sections from `index.html` into the five content pages. Do not soft-edit leftover invented strings from the prior pass — replace page/template files wholesale.

## Technical SEO & root files (Phase 7)

### Global head (all pages)

From the reference, excluding per-page title/description: charset, viewport, color-scheme, robots, OG/Twitter structure, geo, favicons, fonts, Organization + WebSite JSON-LD as in reference. Per-page OG/Twitter title, description, and URL remain dynamic.

### Physical root files in `_site/`

- `robots.txt` — allow `*`, GPTBot, ClaudeBot, PerplexityBot, Google-Extended; sitemap URL (copy from handoff; do not “fix”)
- `llms.txt` — copy from handoff as-is
- `sitemap.xml` — all 48 page URLs

### Out of scope

- Live Lawmatics embed / API
- Counsel-reviewed body copy for shells or CMS Body
- Pointing the real domain / production publish (Phase 9)

## Accessibility & polish (Phase 8)

- Body text ≥ 18px; navy (`#08244A`) on light — never gold (`#DEA244`) as body text on white/off-white
- Visible `:focus-visible` ring (no bare `outline: none`)
- Tables / wide content inside `.scroll` overflow containers
- No page horizontal scroll at 375px / 320px
- `prefers-reduced-motion` disables animation
- Screener: `<fieldset>`/`<legend>`, `aria-live` on results, keyboard completable

## Project layout

```
/
├── package.json
├── .eleventy.js                 # keep
├── scripts/load-csv.js          # keep
├── scripts/verify-build.js      # update gates for strict content
├── counties.csv / conditions.csv
├── index.html                   # reference source of truth (copy/CSS/JS)
├── slug-flatten-report.txt      # generated
├── src/
│   ├── _data/                   # keep CSV wiring
│   ├── _includes/               # REPLACE layouts/partials
│   ├── covered-areas/           # REPLACE CMS template
│   ├── conditions/              # REPLACE CMS template
│   ├── pages/                   # REPLACE all 12 static pages
│   └── assets/                  # robots, llms, screener.js
└── _site/                       # build output
```

## Verification

`npm run build` must succeed and produce:

1. Exactly 48 HTML pages under `_site/`
2. `_site/robots.txt`, `_site/llms.txt`, `_site/sitemap.xml`
3. Slug flatten report for every slash-containing original slug
4. Spot-check: one covered county, one condition, one not-covered — empty Body, no meta/key-towns prose
5. Grep gate: no invented shell blurbs (e.g. “content coming”, “copy coming”)
6. CSS checks: 18px body, focus ring, no gold-on-light body text
7. Screener: after any JS change, run workspace `test_screener.js` (or the handoff copy) and expect EXIT 0 with 0 positive-read leaks

## Guardrails

- Do not rewrite compliance language; move it
- Do not invent covered-condition lists into Body fields
- Do not gate the screener or send screener answers anywhere
- Do not add chatbot, exit-intent, countdown, stock doctor imagery, government seals, fake testimonials, or a blog
- Ask before changing copy, URL structure, analytics, eligibility/money/deadline/“free” wording, or going live

## Open follow-ups (not blocking this pipeline)

1. Flattened URLs confirmed with Jaxon for SEO plan impact
2. Shell meta descriptions from Jaxon when available
3. Lawmatics three-field form creation + embed on `/contact`
4. Body copy for seven shells and 36 CMS pages after legal handoff
5. Photos / Laura surname / fee figures remain launch blockers (placeholders only)
