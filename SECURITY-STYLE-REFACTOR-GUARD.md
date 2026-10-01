# Security & Integrity Guard: Style Refactor Test

**Branch:** `style_refactor_test`  
**Base Commit / Branch:** `main`  
**Purpose:** Pure styling and visual refactor test based on `example_site.html` (header blend & shrink, lighter blue header, tilted/angled section dividers, darker midnight footer).

---

## 1. Absolute Non-Negotiable Rules

1. **Zero Text / Copy Changes (100% Preserved):**
   - Under NO circumstances may any text, phrase, title, legal disclaimer, phone number, address, fee structure, FAQ question, or meta tag description be modified or removed.
   - All wording must remain 100% identical to the approved `main` branch state.

2. **Branch Protection & Push Policy:**
   - **`main` Branch is Strictly Protected:** No merges or direct pushes to `main`.
   - **Target Push Branch:** Only the test branch `style_refactor_test` may be pushed to `origin/style_refactor_test` once verification passes.
   - **No Deployment to Production Domain:** No deployment triggers to `downwindersadvocates.com` or live domain DNS without separate written stakeholder instruction.

3. **Styling & Presentation Scope Only:**
   - Changes are strictly limited to CSS (`src/_includes/styles.css`), visual SVG divider decorators, and non-content presentation classes / header scroll state scripting.
   - Form endpoints, Lawmatics callback embeds, analytics, and contact triggers must remain functional without modification.

---

## 2. Automated Verification & Enforcement

Before any commit or push to `style_refactor_test`, the following checks MUST pass cleanly:

1. **Automated Visible Text Integrity Check:**
   - Script: `node scripts/verify-text-integrity.js`
   - Function: Compiles the full site to `_site/`, extracts all visible text across every route, and verifies that the extracted text matches the approved baseline byte-for-byte. Any missing or modified string will fail the test.

2. **Legal & Content Rule Test Suite:**
   - Command: `npm run test:rules`
   - Verifies all DOJ-regulated fee statements, phone links, navigation targets, and required section IDs.

3. **Build & Route Verification:**
   - Command: `npm run verify`
   - Ensures all Eleventy pages compile without broken links, missing assets, or syntax errors.

---

## 3. Audit Log

- **Author / Initiator:** Aaron Heiner / Antigravity
- **Date:** 2026-10-01
- **Status:** Active on branch `style_refactor_test`
