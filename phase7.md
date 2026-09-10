Follow buildkit Phase 7 and guidlines.md / guardrails. Do not rewrite compliance copy.

Wire Lawmatics on the existing 3-field callback form only (name, phone, best time) —
on /contact and home if the form is there. Use LAWMATICS-INTEGRATION.md and the
form ID/embed Jaxon provides. Add no extra fields. Do not connect the /check screener
to Lawmatics or any analytics. Style the form to match existing CSS.

Also verify: og-image.jpg is in the build output and OG/Twitter image URLs resolve;
robots.txt, llms.txt, and sitemap.xml still serve at site root after deploy.

Test one real submission and confirm it appears in Lawmatics. Staging only — do not
point the real domain.