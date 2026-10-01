# Style Refactor Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a visual style refactor inspired by `example_site.html` (dynamic header blending into hero with sticky shrink on scroll, lighter blue header, angled/tilted section dividers, and darker midnight footer) on branch `style_refactor_test` while mathematically verifying 100% text preservation and pushing only to `style_refactor_test`.

**Architecture:** Add an automated pre-build text-snapshot hash verification script (`scripts/verify-text-integrity.js`) to guarantee zero copy modifications. Update CSS variables, header sticky/scroll transitions, SVG tilt dividers between sections, and footer midnight background. Verify all tests pass, then push the feature branch to origin.

**Tech Stack:** Eleventy (11ty), Vanilla CSS, Vanilla JavaScript, Node.js test runner, Git.

## Global Constraints

- Branch: `style_refactor_test` only. Do NOT touch or push to `main`.
- Copy & Text: Strictly 0% changes to any text, punctuation, legal disclosure, phone number, or link.
- Push Policy: Push only to `origin style_refactor_test` upon complete verification.
- Testing: All builds, rules tests (`npm run test:rules`), build verification (`npm run verify`), and text integrity tests must pass.

---

### Task 1: Setup Text Integrity Baseline & Verification Script

**Files:**
- Create: `scripts/verify-text-integrity.js`
- Test: `node scripts/verify-text-integrity.js`

**Interfaces:**
- Produces: `scripts/verify-text-integrity.js` command line script that compiles the site, extracts all text content across all generated HTML files in `_site/`, and ensures 100% fidelity.

- [ ] **Step 1: Write `scripts/verify-text-integrity.js`**

```javascript
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const siteDir = path.join(__dirname, '..', '_site');
const baselineFile = path.join(__dirname, 'baseline-text-hashes.json');

function extractVisibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ') // ignore decorative SVGs
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function getAllHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const isRecording = process.argv.includes('--record');
const htmlFiles = getAllHtmlFiles(siteDir);

if (htmlFiles.length === 0) {
  console.error("Error: _site directory is empty. Run 'npm run build' first.");
  process.exit(1);
}

if (isRecording) {
  const hashes = {};
  for (const file of htmlFiles) {
    const rel = path.relative(siteDir, file);
    const text = extractVisibleText(fs.readFileSync(file, 'utf8'));
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    hashes[rel] = { hash, length: text.length };
  }
  fs.writeFileSync(baselineFile, JSON.stringify(hashes, null, 2), 'utf8');
  console.log(`Baseline recorded for ${Object.keys(hashes).length} HTML routes.`);
  process.exit(0);
}

if (!fs.existsSync(baselineFile)) {
  console.error("Baseline file not found. Run 'node scripts/verify-text-integrity.js --record' first.");
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
let failed = 0;

for (const [rel, data] of Object.entries(baseline)) {
  const filePath = path.join(siteDir, rel);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING ROUTE: ${rel}`);
    failed++;
    continue;
  }
  const currentText = extractVisibleText(fs.readFileSync(filePath, 'utf8'));
  const currentHash = crypto.createHash('sha256').update(currentText).digest('hex');
  if (currentHash !== data.hash) {
    console.error(`TEXT CONTENT DRIFT IN: ${rel}`);
    console.error(`Expected length: ${data.length}, Actual: ${currentText.length}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`FAILED: ${failed} routes had text modifications!`);
  process.exit(1);
}

console.log(`PASSED: All ${Object.keys(baseline).length} routes match approved text 100%.`);
process.exit(0);
```

- [ ] **Step 2: Build and record baseline hashes**

Run:
```bash
npm run build
node scripts/verify-text-integrity.js --record
```
Expected: "Baseline recorded for [N] HTML routes."

- [ ] **Step 3: Test verification against baseline**

Run:
```bash
node scripts/verify-text-integrity.js
```
Expected: "PASSED: All [N] routes match approved text 100%."

- [ ] **Step 4: Commit baseline security script and hashes**

```bash
git add scripts/verify-text-integrity.js scripts/baseline-text-hashes.json
git commit -m "chore(security): add automated visible text integrity verification"
```

---

### Task 2: Header Refactor (Blend at Top, Shrink & Lighter Blue on Scroll)

**Files:**
- Modify: `src/_includes/styles.css`
- Modify: `src/_includes/partials/header.njk`

**Interfaces:**
- Consumes: Existing `.site-header` and `.bar`
- Produces: Dynamic scroll-responsive header with `.is-scrolled` class, transparent top state on homepage, lighter blue `#1A447E` sticky background, and smooth padding reduction.

- [ ] **Step 1: Update `src/_includes/styles.css` for Header**

Add lighter blue variable and sticky transition styles:
```css
:root {
  ...
  --header-scrolled-bg: #1A447E;
  ...
}

header.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--deep);
  color: var(--on-deep);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: background-color 0.25s ease, box-shadow 0.25s ease, padding 0.25s ease;
}

/* Scrolled sticky state with lighter blue and shrink effect */
header.site-header.is-scrolled {
  background: var(--header-scrolled-bg);
  box-shadow: 0 6px 24px rgba(8, 36, 74, 0.25);
  border-bottom-color: rgba(255, 255, 255, 0.15);
}

.bar {
  ...
  transition: padding 0.25s ease;
}

header.site-header.is-scrolled .bar {
  padding: 10px var(--sp3) 8px;
}
```

- [ ] **Step 2: Update `src/_includes/partials/header.njk` scroll logic**

Update the header JavaScript in `src/_includes/partials/header.njk` to observe window scroll:
```javascript
  function handleScroll() {
    var isScrolled = window.scrollY > 40;
    header.classList.toggle("is-scrolled", isScrolled);
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
```

- [ ] **Step 3: Rebuild and run tests**

Run:
```bash
npm run build
npm run test:rules
npm run verify
node scripts/verify-text-integrity.js
```
Expected: All tests PASS with zero text modification.

- [ ] **Step 4: Commit header styling updates**

```bash
git add src/_includes/styles.css src/_includes/partials/header.njk
git commit -m "feat(header): add dynamic scroll shrink and lighter blue sticky state"
```

---

### Task 3: Angled / Tilted Section Dividers & Darker Midnight Footer

**Files:**
- Modify: `src/_includes/styles.css`
- Modify: `src/pages/index.njk` (and Spanish counterpart `src/pages/es/index.njk`)

**Interfaces:**
- Consumes: Section container classes (`.sec`, `.sec--band`, `.sec--deep`, `.consultation-section`)
- Produces: SVG tilt dividers matching reference site geometry (`d="M0,6V0h1000v100L0,6z"`), seamless angle transitions between sections, and `--midnight: #04163A` footer background.

- [ ] **Step 1: Add tilt divider CSS to `src/_includes/styles.css`**

```css
/* Tilted Section Dividers inspired by reference site */
.tilt-divider {
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;
  line-height: 0;
  pointer-events: none;
  z-index: 2;
}

.tilt-divider svg {
  display: block;
  width: 100%;
  height: 100%;
}

.tilt-divider--flip svg {
  transform: scaleX(-1);
}

/* Darker Footer grounding */
.site-footer {
  background: var(--midnight);
  color: #D2E0EE;
  padding: var(--sp6) 0 var(--sp4);
  font-size: 15px;
  line-height: 1.6;
}
```

- [ ] **Step 2: Add decorative SVG tilt dividers between alternating sections in `index.njk` and `es/index.njk`**

Insert the tilt dividers cleanly at section boundaries without modifying any headings, paragraphs, or links.

- [ ] **Step 3: Rebuild and verify test suite**

Run:
```bash
npm run build
npm run test:rules
npm run verify
node scripts/verify-text-integrity.js
```
Expected: All tests PASS with zero text modification.

- [ ] **Step 4: Commit tilt dividers and footer styling**

```bash
git add src/_includes/styles.css src/pages/index.njk src/pages/es/index.njk
git commit -m "feat(style): add tilted section dividers and midnight footer grounding"
```

---

### Task 4: Full Suite Verification & Push to `style_refactor_test`

**Files:**
- None (verification & git push)

**Interfaces:**
- Consumes: All updated files on branch `style_refactor_test`
- Produces: Clean local test report and pushed branch `origin/style_refactor_test`.

- [ ] **Step 1: Run comprehensive CI check**

Run:
```bash
npm run test:ci
node scripts/verify-text-integrity.js
```
Expected: All suites exit 0 cleanly.

- [ ] **Step 2: Verify git status and branch**

Run:
```bash
git status
git branch --show-current
```
Expected: On branch `style_refactor_test`, clean working tree.

- [ ] **Step 3: Push `style_refactor_test` to origin**

Run:
```bash
git push -u origin style_refactor_test
```
Expected: Pushed successfully to `origin/style_refactor_test`.
