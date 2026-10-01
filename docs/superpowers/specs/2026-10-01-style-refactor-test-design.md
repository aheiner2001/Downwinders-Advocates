# Design Specification: Style Refactor Test

- **Date:** 2026-10-01
- **Branch:** `style_refactor_test`
- **Reference Site:** `example_site.html` (https://www.downwindersprogram.com/)
- **Scope:** Visual styling enhancement; 100% preservation of all approved text copy and legal terms.

---

## 1. Goal & Requirements

The goal is to test an enhanced modern visual presentation for Downwinders Advocates inspired by the reference site:
1. **Dynamic Header:**
   - On the homepage at the top (`scrollY < 50px`), the header is transparent/blended with the hero section.
   - On scroll (`scrollY >= 50px`) on the homepage, and always on inner pages, the header transitions into a solid sticky header.
   - Header sticky background uses a lighter, richer blue (`#1A447E` / `#163A6B`) instead of the baseline `#08244A`.
   - Header padding shrinks smoothly on scroll from `16px` to `10px` ("shrinking header" effect) with an elevation drop shadow.
2. **Angled / Tilted Section Dividers:**
   - Clean SVG tilt shape dividers at alternating section boundaries (e.g. below Hero, Consultation to Programs, Process to Pricing).
   - Angle is ~2.5° slant, with `preserveAspectRatio="none"` and zero horizontal overflow.
   - All inner text, cards, buttons, and columns remain level and undistorted.
3. **Footer Grounding:**
   - Footer uses a deeper Midnight color (`#04163A`) to provide high visual contrast against the lighter blue header.
   - Footer bottom edge remains completely flat.
4. **Security & Copy Preservation:**
   - Zero copy, phone, legal disclaimer, or metadata changes.
   - Automated text integrity verification (`scripts/verify-text-integrity.js`).
   - Push only to the `style_refactor_test` branch once verified.

---

## 2. Technical Architecture & Component Changes

### 2.1 CSS Updates (`src/_includes/styles.css`)
- **Color Tokens:**
  - Introduce `--header-scrolled-bg: #1A447E;` (lighter blue).
  - Update `--footer-bg: #04163A;` (midnight navy).
- **Header Styles:**
  - Add `.site-header.is-transparent` for homepage top state (transparent background, zero border/shadow).
  - Add `.site-header.is-scrolled` for sticky state (lighter blue background, `padding: 10px var(--sp3)`, `box-shadow: 0 4px 20px rgba(0,0,0,0.16)`).
  - Smooth transitions (`transition: background 0.25s ease, padding 0.25s ease, box-shadow 0.25s ease;`).
- **Tilt Dividers:**
  - CSS classes `.tilt-divider`, `.tilt-divider--bottom`, `.tilt-divider--top` with `width: 100%; height: 48px; line-height: 0; display: block; overflow: hidden; pointer-events: none;`.
  - SVG polygons matching the adjacent background colors (`#FFFFFF`, `#F8F5EF`, etc.).
- **Footer Styles:**
  - Update `.site-footer` background to `--footer-bg`.
  - Ensure footer remains flat at base.

### 2.2 Template & Partial Updates
- **`src/_includes/partials/header.njk`:**
  - Add scroll event listener / intersection logic to toggle `.is-scrolled` (and `.is-transparent` when on home page).
  - Fallback: Works cleanly with `<noscript>` if JavaScript is disabled.
- **Section Layouts (`src/pages/index.njk`):**
  - Add tilt divider markup between alternating sections (below Hero, between `#consultation` and `#programs`, etc.).

### 2.3 Verification & Safety Automation
- **`scripts/verify-text-integrity.js`:**
  - Builds the site or checks `_site/`.
  - Compares the visible text content of every route against baseline text snapshots.
  - Exits with status `0` if all routes match 100%, and status `1` if any text has changed.
- **`SECURITY-STYLE-REFACTOR-GUARD.md`:**
  - Contains branch policies and audit records.

---

## 3. Testing & Verification Plan

1. **Automated Suite:**
   - `npm run build`
   - `npm run verify`
   - `npm run test:rules`
   - `node scripts/verify-text-integrity.js`
2. **Visual Checks:**
   - Verify header transparency at top of homepage and solid lighter blue sticky state on scroll down.
   - Verify inner pages have solid lighter blue header.
   - Verify mobile hamburger menu still works correctly in both top and scrolled states.
   - Verify tilt dividers scale smoothly without horizontal scrollbar on mobile, tablet, and desktop.
   - Verify footer has flat bottom and midnight navy background.
3. **Git Branch & Push:**
   - Commit changes to `style_refactor_test`.
   - Push to `origin style_refactor_test`.
