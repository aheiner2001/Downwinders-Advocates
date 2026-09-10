# Spanish draft twins — design

**Date:** 2026-09-10  
**Branch:** `spanish-button`  
**Status:** Draft for Jaxon review — not counsel-approved launch copy  
**Decision:** Option B (full `/es/` twins with machine-translated draft) + scope A+C (all pages + Spanish chrome)

## Goal

Add an **Español** / **English** header control that takes visitors to a parallel Spanish URL for the same page (`/path/` ↔ `/es/path/`), with Spanish nav/footer chrome and draft Spanish content for review. English pages stay the source of truth except for the language link.

## Non-goals

- Google Translate widget or client-only string swapping as the product
- Inventing CMS **Body** copy in English or Spanish (bodies remain empty)
- Merging to `main` / production domain until explicitly requested
- Treating machine translation as counsel-approved legal copy

## Approach

**Parallel `/es/` pages + Spanish CSV columns** (chosen over JS locale swap and Google Translate).

## Routing and language toggle

| English | Spanish twin |
|---|---|
| `/` | `/es/` |
| `/check/` | `/es/check/` |
| `/covered-areas/{slug}/` | `/es/covered-areas/{slug}/` |
| `/conditions/{slug}/` | `/es/conditions/{slug}/` |
| (all other static paths) | `/es` + same path |

- Header control: **Español** on English pages → Spanish twin; **English** on Spanish pages → English twin.
- Twin resolution: strip or add the `/es` path prefix only. Preserve hash fragments (`/#faq` → `/es/#faq`). Query strings are unused today; if present, preserve them the same way.
- Spanish documents: `<html lang="es">`.
- English documents: keep `lang="en-US"`.
- Add `hreflang` alternate links (`en`, `es`, `x-default` → English URL).

## Draft safeguards

- Visible **draft banner** on every `/es/` page only. Locked copy (Spanish):
  > Borrador de traducción automática para revisión — no es texto aprobado por el abogado. Para ayuda en español, llame al (801) 400-8270.
- Brand name **Downwinders Advocates** stays untranslated; tagline/subtitle and nav may be Spanish.
- `/es/` pages use **`noindex, nofollow`** until copy is approved.
- Public **sitemap stays English-only** while draft (do not list `/es/` URLs).
- Do not present Spanish as launch-ready in handoff without that caveat.

## Content and data

### CMS (counties / conditions)

- Extend `counties.csv` and `conditions.csv` with exactly these Spanish columns:
  - `Name ES`
  - `SEO Title ES`
  - `Meta Description ES`
- Same slugs as English; Spanish permalinks under `/es/covered-areas/` and `/es/conditions/`.
- Loader continues to force `body: ""` for both locales.
- Templates select Name / SEO / meta by `locale`.

### Static pages

- Pages with existing English body (home, check, standards, what-it-costs, contact, and any other filled pages): Spanish twins with machine-translated draft copy.
- Empty shells (`documents`, `free-help`, `deadline`, `survivors`, `siblings`, `is-this-real`, `someone-told-me-about-this`, etc.): Spanish chrome + empty body, matching English.

### Chrome (sitewide by locale)

- Skip link, nav labels, footer tagline/legal links/CTAs, CMS page buttons (“Check eligibility” / “Free help”), and related UI strings driven by `locale` (`en` | `es`).
- Footer full legal disclaimer: Spanish draft translation on `/es/` pages; English unchanged on English pages.

### Screener

- `/es/check/` uses Spanish legends, options, notices, and result copy.
- Screener **logic unchanged**; still client-side only; **sends nothing**.

## Implementation shape (Eleventy)

- Introduce `locale` (and optional `alternatePath`) on pages via front matter / computed data.
- Prefer shared includes (header, footer, head, base layout) that branch on `locale` rather than duplicating every partial forever.
- CMS: either dual pagination permalinks from one template family, or thin `es` generators that reuse render helpers — avoid drifting EN/ES markup.
- Static Spanish pages: `src/pages/es/*.njk` (or equivalent) with `permalink: /es/.../` and `locale: es`.
- Path-prefix transform for GitHub Pages must continue to rewrite root-absolute `href`/`src` on `/es/` HTML the same way.

## Verification

- Build succeeds; English URL count unchanged; Spanish twins exist for every in-scope page.
- Toggle links land on the correct twin.
- `/es/` pages show draft banner, `lang=es`, and robots noindex.
- Sitemap has no `/es/` entries while draft.
- Strict gates still pass: empty CMS bodies; screener still sends nothing.
- Spot-check: home, check, one county, one condition, one empty shell.

## Risks

- Machine translation can alter legal meaning — mitigated by banner, noindex, branch isolation, and explicit “draft for review” status.
- Duplicate page maintenance — mitigated by shared layout/partials and locale-driven strings.
- Path prefix on GitHub project Pages — must verify `/es/` links under `ELEVENTY_PATH_PREFIX`.

## Approval record

- User chose full draft twins (B) and scope all pages + chrome (A+C).
- User approved routing/toggle section and content/data/safeguards section (2026-09-10).
