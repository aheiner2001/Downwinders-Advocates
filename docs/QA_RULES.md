# Website QA rules and maintenance

This repository is an Eleventy/Nunjucks static website. `.github/workflows/pre-push-check.yml` runs after every push and on pull requests: it installs locked npm dependencies, builds the site, runs the existing build and CSV verifiers, runs exact content checks, and runs Chromium UI checks. The `quality` job must be required in the GitHub branch ruleset to prevent merging a failed pull request. GitHub Actions cannot prevent a push to an unprotected branch.

## Authority and scope

1. [Website Specs Checklist](https://docs.google.com/document/d/1ZNxw-8Gsq5OBVu1Xf62HTgjCX-x4nDSimvM_kA98l18/edit) is the latest general site specification.
2. The owner's later approved **Fees** image is the current source for fee copy: 2% new RECA claims, 10% resubmitted claims, $200 non-refundable upfront file review, $400 per claimant processing on completion, and document retrieval billed per document when processed. Its copy also says “we do not collect our fee until your claim has been approved and paid”; this apparently distinguishes the percentage fee from administrative fees, but that interpretation needs explicit approval.
3. The [Downwinders guardrails](https://drive.google.com/file/d/1v5vw2i3tgPqDU8-vNYmXX6qWva7Y_uWn/view) and uploaded original `index.html` supply background where they do not conflict with later direction. The current source files are the executable site.
4. Project correspondence with Andy and others did not establish a final Lawmatics intake/booking workflow. Do not infer one from placeholder embeds.

## Automated coverage

| Rule | Check | Maintenance |
| --- | --- | --- |
| Approved fee copy and disallowed absolute no-upfront claims on English fee surfaces | `tests/content-rules.test.js` | Edit `qa-rules.json` after new written approval; update the site at the same time. |
| Spanish draft fee amounts and noindex/sitemap exclusion | `tests/content-rules.test.js`, existing `scripts/verify-build.js` | Review translated copy with the team before publication. |
| Shared phone, footer, top navigation, homepage sections, trust badge and hero image | Content tests and `tests/e2e/site.spec.js` | Update routes/section IDs in `qa-rules.json` with an approved redesign. |
| Pricing text visible, eligibility preview produces guidance, mobile homepage has no horizontal overflow | Playwright Chromium tests | Review snapshots manually for appearance and semantic correctness. |
| Existing 102-page build, SEO, strict-copy, CSS and CSV checks | `npm run verify`, `npm run test:csv` | Keep existing scripts alongside these tests. |

These checks assert the specific approved statements and presence of structural elements. They do not establish that medical/legal claims are true, that an external form actually delivered a lead, or that a page looks professional. For design, use a reviewed Playwright screenshot baseline (or a visual regression service) after a human approves the reference screenshots; a CSS class or image tag alone does not prove trustworthiness.

## Decisions still needed before stricter gates

- **Fees:** The approved image says the percentage fee is not collected until approval and payment, while it also charges $200 upfront. Confirm the intended distinction and legal wording before testing an interpretation. The current test preserves the approved words and amounts without asserting “no upfront fees.”
- **Intake and Lawmatics:** The newer checklist lists First Name, Last Name, Email, Phone, a subscriber flag, duplicate handling, and appointment booking. Andy's final form/booking endpoints and field mapping are pending. The on-page `/check/` preview currently has three radio question groups and optional notes; its private preview is different from the externally hosted callback form. Once ownership and endpoints are confirmed, add an integration test against a safe test tenant or a mocked contract, then an approved production smoke check.
- **Screener:** Older guardrails describe six questions, while the present preview shows three groups. Confirm the current approved scope before enforcing an exact question count.
- **Footer disclosures:** Older guardrails and the recent checklist differ on legal/RESEP language. Get approved copy before a strict text assertion.
- **Design:** A white first section with a brand image is checked structurally. The darker CTA bands, credibility, typography, and overall professional appearance require approved visual baselines and human review.

## Use

Install Node.js 22 and run `npm ci`, then `npx playwright install --with-deps chromium`, then `npm run test:ci`. To run only the fast checks: `npm run build && npm run verify && npm run test:rules && npm run test:csv`.

When a manager changes a rule, record the decision and source here, edit `qa-rules.json` or the relevant test, update site content, and run `npm run test:ci`. In GitHub **Settings → Rules → Rulesets** (or branch protection), require pull requests and the `quality` status check on the target branch. Protect each active target branch, including `feat/refactor-trust-review` if merges into that branch must be gated. The workflow itself reports failure but cannot enforce branch protection without that repository setting.
