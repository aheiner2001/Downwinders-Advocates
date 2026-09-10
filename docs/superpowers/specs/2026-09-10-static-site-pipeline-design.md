# Downwinders Advocates — Static Site Pipeline (Phases 5–8)

**Date:** 2026-09-10  
**Status:** Approved in conversation; awaiting final review of this written spec  
**Stack:** Eleventy → static `_site/` for GitHub Pages  
**Canonical base:** `https://downwindersadvocates.com`

## Goal

Replace Webflow CMS generation with a local static-site pipeline that:

1. Reads `counties.csv` (19) and `conditions.csv` (17)
2. Emits 36 programmatic pages plus 12 static shells (48 HTML pages total)
3. Ships root `robots.txt`, `llms.txt`, sitemap, global head SEO, and a11y polish from Phases 5–8

## Decisions (locked)

| Topic | Decision |
|---|---|
| SSG | Eleventy (11ty) |
| Static pages | Minimal shells for all 12 URLs (not full Phase 4 content split) |
| CMS pages | Full templates for Covered Areas + Conditions |
| Lawmatics | Deferred; `/contact` gets a three-field shell only |
| Slug `/` characters | Flatten (`arizona/coconino-county` → `arizona-coconino-county`) and flag in a build report |
| CMS Body | Empty rich-text container; do not invent condition/county body copy |
| Screener | Client-side only; no network; no per-answer analytics |

## Page inventory (48)

### Static (12)

`/` · `/check/` · `/is-this-real/` · `/siblings/` · `/someone-told-me-about-this/` · `/documents/` · `/standards/` · `/free-help/` · `/deadline/` · `/what-it-costs/` · `/survivors/` · `/contact/`

**Content policy:** Shared layout + unique title/meta/canonical + nav + footer disclaimer + links to `/check` and `/free-help`. Placeholder body except:

- Home: lightly condensed sections lifted from the reference HTML (no new compliance copy)
- `/check`: full screener markup + JS ported from the reference
- `/contact`: three-field callback shell (Name, Phone, Best time) — not wired to Lawmatics

### Programmatic (36)

- Covered Areas: `/covered-areas/{slug}/` × 19
- Conditions: `/conditions/{slug}/` × 17

Trailing-slash directories with `index.html` for clean GitHub Pages URLs.

## Data model (Phase 5)

### Covered Areas (`counties.csv`)

Slug · Name · State · Coverage Status · Key Towns · SEO Title · Meta Description · Body (empty)

Coverage Status values in use: Statewide / Covered / Certain counties only / Six counties only / NOT COVERED

### Conditions (`conditions.csv`)

Slug · Name · Category · SEO Title · Meta Description · Body (empty)

Category values: Downwinder / Uranium worker / Both / Neither

### Slug flattening

Any slug containing `/` is rewritten by replacing `/` with `-`. Build writes `slug-flatten-report.txt` listing original → flattened mappings. Nested folder URLs are intentionally not used so the SEO plan stays flat and consistent.

## Templates (Phase 6)

Every CMS page includes:

- `<title>` ← SEO Title
- Meta description ← Meta Description
- Self-referencing canonical (`https://downwindersadvocates.com{path}`)
- Exactly one `<h1>` ← Name
- Empty Body container (ready for future rich text)
- Links to `/check` and `/free-help`
- Site-wide footer compliance disclaimer from the reference
- FAQ JSON-LD in `<head>`, built from collection fields (Name, Coverage Status/Category, Key Towns where relevant, Meta Description)

Shared chrome: skip-to-content, sticky header/nav, brand tokens and CSS from `index.html`.

## Technical SEO & root files (Phase 7)

### Global head (all pages)

From the reference, excluding per-page title/description: charset, viewport, color-scheme, robots, OG site defaults structure, Twitter card type, geo, favicons, fonts, Organization + WebSite JSON-LD graph pieces as appropriate. Per-page OG/Twitter title, description, and URL remain dynamic.

### Physical root files in `_site/`

- `robots.txt` — allow `*`, GPTBot, ClaudeBot, PerplexityBot, Google-Extended; sitemap URL
- `llms.txt` — copy from handoff reference (content must not be invented)
- `sitemap.xml` — all 48 page URLs

### Explicitly out of scope for this build

- Live Lawmatics embed / API
- Counsel-reviewed new body copy for placeholder pages
- Pointing the real domain / production publish (Phase 9)

## Accessibility & polish (Phase 8)

Keep / enforce from the reference CSS:

- Body text ≥ 18px; navy (`#08244A`) on light backgrounds — never gold (`#DEA244`) as body text on white/off-white
- Visible `:focus-visible` ring (no bare `outline: none` without a replacement ring)
- Tables / wide content inside `.scroll` overflow containers
- No page horizontal scroll at 375px / 320px
- `prefers-reduced-motion` disables animation
- Screener: `<fieldset>`/`<legend>`, `aria-live` on results, keyboard completable

## Project layout (planned)

```
/
├── package.json
├── .eleventy.js
├── src/
│   ├── _data/          # site config, CSV-derived collections
│   ├── _includes/      # base layout, head, header, footer, styles
│   ├── covered-areas/  # CMS template
│   ├── conditions/     # CMS template
│   ├── pages/          # 12 static shells
│   └── assets/         # css if extracted, robots/llms passthrough
├── data/               # counties.csv, conditions.csv (or src/_data)
├── index.html          # retained as visual/copy reference
└── _site/              # build output (gitignored or published)
```

## Verification

`npm run build` must succeed and produce:

1. Exactly 48 HTML pages under `_site/` (12 static + 19 covered-areas + 17 conditions)
2. `_site/robots.txt`, `_site/llms.txt`, `_site/sitemap.xml`
3. Slug flatten report listing every slash-containing original slug
4. Spot-check: one covered county, one condition, and the `not-covered` row render correctly
5. Manual CSS check: 18px body, focus ring, no gold-on-light body text, table scroll wrappers

## Guardrails (from webflow-specs / handoff)

- Do not rewrite compliance language
- Do not invent covered-condition lists into page Body fields
- Do not gate the screener or send screener answers anywhere
- Do not add chatbot, exit-intent, countdown, stock doctor imagery, government seals, fake testimonials, or a blog

## Open follow-ups (not blocking this pipeline)

1. Flattened URLs must be confirmed with Jaxon for SEO plan impact
2. Lawmatics three-field form creation + embed swap on `/contact`
3. Full Phase 4 copy for shell pages
4. Body copy from `RECA-AUTHORITATIVE-CONDITIONS.md` after legal sign-off
