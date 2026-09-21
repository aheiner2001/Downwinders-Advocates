# Ready to go live

**Do not start this until Jaxon/Jonny explicitly say to point the real domain.**

Staging stays on GitHub Pages under the repo URL until then. Going live starts legal and marketing clocks that are not the builder’s call.

When they say go, tell Cursor/Aaron: **“Update GitHub Actions for the real domain”** — that workflow change can be done in chat. Then finish the DNS steps below (or hand the DNS table to whoever owns the registrar).

---

## Before go-live (confirm these are done)

- [ ] Laura’s surname + bar number added (or they accept leaving the pending line)
- [ ] Published fee number approved (or keep “pending counsel review”)
- [ ] DBA registration confirmed by business (not a site task)
- [ ] Lawmatics embed styling looks good on home + `/contact`
- [ ] Real submission still lands in Lawmatics
- [ ] Explicit OK to point `downwindersadvocates.com`

Empty page / CMS body copy can still come later; do not invent it.

---

## Part A — Site / GitHub (Aaron or Cursor)

Tell the agent: **“We’re going live — update GitHub Actions for the custom domain.”**

That change should:

1. Stop building with `ELEVENTY_PATH_PREFIX: /RepoName` (that’s only for `*.github.io/RepoName/`).
2. Build at site root `/` so links and images work on `downwindersadvocates.com`.
3. Push/merge to `main` so Pages redeploys.

Then in GitHub:

1. Open the repo → **Settings → Pages**.
2. Under **Custom domain**, enter: `downwindersadvocates.com`
3. Save.
4. After DNS verifies, turn on **Enforce HTTPS**.
5. Confirm the latest Actions run for **Deploy GitHub Pages** succeeded.

Smoke-check after DNS propagates:

- [ ] `https://downwindersadvocates.com` loads
- [ ] CSS / photos / OG image load (no broken `/Downwinders-Advocates/` paths)
- [ ] `/contact` Lawmatics form works
- [ ] Screener on `/check` still works and sends nothing

---

## Part B — Domain / DNS (ask them, or do it if they give access)

### Ask them for

1. **Go-live approval** in writing (“point the real domain”).
2. **Where the domain is registered** (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.).
3. Either:
   - **Registrar login / access** so you can edit DNS, **or**
   - Confirmation they will paste the records below themselves.
4. The GitHub Pages hostname to use in the www CNAME, usually:
   - `USERNAME.github.io` or `ORGNAME.github.io`  
   (not `…github.io/Downwinders-Advocates`)

### DNS records to add

At the registrar’s DNS panel for `downwindersadvocates.com`:

**Apex (root domain)** — four **A** records, host `@` (or blank / root):

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

**www** — one **CNAME**:

| Type | Host | Value |
| --- | --- | --- |
| CNAME | `www` | `REPLACE-WITH.github.io` |

Replace `REPLACE-WITH.github.io` with the actual user or org Pages host from GitHub Settings → Pages.

### After DNS is saved

- [ ] Wait (minutes to a few hours; sometimes longer)
- [ ] In GitHub Pages, domain shows as verified / DNS check OK
- [ ] Enable **Enforce HTTPS** if not already on
- [ ] Test `https://downwindersadvocates.com` and `https://www.downwindersadvocates.com`

Official reference: [Managing a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

---

## Part C — Still their side (not blocking the DNS click, but blocking a clean public launch)

| Item | Owner | Notes |
| --- | --- | --- |
| Laura surname + bar number | Jaxon | Don’t invent |
| Fee number | Jaxon / counsel | Don’t invent |
| DBA registration | Jaxon | Business/legal |
| Empty page + CMS body copy | Not the builder | Shells stay empty until they write it |
| Bigger Lawmatics intakes | Their CRM | Not on the public site |
| “Families of the West” section | Content | Hidden until stories exist; turn on with `showStories: true` in `src/_data/site.js` |

---

## One-line trigger for Cursor

> We’re approved to go live on downwindersadvocates.com. Update GitHub Actions for the custom domain (remove path prefix), then walk me through GitHub custom domain + DNS with host `YOURUSER.github.io`.

Until that message, leave the workflow alone and keep staging only.
