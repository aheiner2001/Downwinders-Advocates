# Site media

## Published (goes live with the build)

`src/assets/img/` is copied to `/img/` on the site.

| File | Purpose |
| --- | --- |
| `src/assets/img/og-image.jpg` | Share preview (1200×630). Also published at `/og-image.jpg` for meta tags. |
| `src/assets/img/people/jaxon.jpg` | Home page — Jaxon |
| `src/assets/img/people/jonny.jpg` | Home page — Jonny |
| `src/assets/img/people/laura.jpg` | Home page — Laura |

Home templates already use `/img/people/….jpg`. OG URL is set in `src/_data/site.js`.

## Source originals (not published)

This folder (`assets/source/`) is for maintainers only. Eleventy does not copy it.

| File | Notes |
| --- | --- |
| `source/og/og-image-chatgpt-original.png` | ChatGPT export before resize |
| `source/people/jaxon-original.png` | Full Jaxon headshot |
| `source/people/laura-original.jpg` | Full Laura portrait |
| `source/people/jonny-family-square.jpg` | Cropped family photo used for Jonny |
| `source/people/jonny-family-full.jpg` | Full family photo |
