Build Kit
Brief
Brand
Files
Calls
Guardrails
Phases
QA
Open
0 / 67 checked
Downwinders Advocates · website build

Everything you need, Aaron.
The design is done, the copy is written, and the legal content is verified against government forms. Your job is to build it in Webflow without changing what it says. This page is the map. The detailed files sit alongside it.

9
phases, in order
48
pages, 12 static + 36 CMS
60–80
hours if Webflow is new
7,290
screener cases under test
What this is and why it is fussy
Downwinders Advocates helps families claim federal compensation under RECA, the Radiation Exposure Compensation Act. The United States tested nuclear weapons in Nevada between 1951 and 1962. Fallout drifted over Utah, Nevada, Arizona, New Mexico and Idaho. People who lived there got cancer. Uranium miners got lung disease. Congress set up a fund to pay them.

The people using this site are typically 60 to 85, often sick, often on a phone in bad light, and frequently doing this for a parent who has already died. Many have already been approached by companies running scams on this exact program.

That paragraph explains nearly every decision in the spec. When something looks overly cautious, that is why.

The stakes are not normal for a website build
If this site tells a sick person they might qualify when they do not, we have wasted the time of someone who does not have any, and we have created the exact exposure that got a similar company fined $1 million by the FTC.

You are not responsible for the accuracy of the legal content. You are responsible for not changing it.

The one rule that matters most
Do not guess. Ask. You will hit things the docs do not cover. That is expected. Inventing an answer and building ten hours on top of it is the only real failure mode here.

Ask immediately about: any wording on eligibility, money, deadlines or promises; anything using the words qualify, guarantee, approved, free or government; anything that would make you write new copy instead of moving existing copy; and any Webflow limit that changes the URL structure.

Just decide yourself: class names, navigator organization, which Webflow feature achieves a spec'd result, and your working order inside a phase.

Stuck for more than 30 minutes on the same thing means ask. That is the correct bar, not a low one. Send what you tried and a screenshot.

Brand tokens
Straight out of the reference build. Create these as named Webflow swatches in Phase 1 so a palette change later is one edit instead of two hundred.

ink
#08244A
midnight
#04163A
bg
#F8F5EF
sand
#E7D9C3
rule
#D8CDBA
slate
#4F6D8A
accent
#DEA244
surface
#FFFFFF
Gold is never text on a light background
#DEA244 on #F8F5EF or white fails contrast, and this audience genuinely cannot read it. Gold is for hairlines, icon fills, focus rings, small accents, and text on the dark navy sections only. Body text is ink. Muted text is slate and no lighter.

Poppins 500 / 600 / 700 for headings. Source Sans 3 400 / 600 / 400 italic for body. Both from Google Fonts.

Body text minimum is 18px. Not 16. The audience is older.

Note: this page has a dark mode so it is readable wherever you open it. The site you are building does not, and must not. See guardrail 07.

Your files
Everything lives in ~/Documents/RCC/. The webflow/ folder is yours.

Read in this order
#	File	What it is
1	00-START-HERE.md	Orientation. Same content as this page, in text.
2	02-GUARDRAILS.md	Read before touching anything. What must never change.
3	04-WHAT-THE-CALLS-CHANGED.md	New. What six real customer calls proved, and why three pages were added. Ten minutes, and it changes how you build.
4	01-BUILD-ORDER.md	Your task list in sequence, with checkpoints.
5	WEBFLOW-BUILD-SPEC.md	Technical spec. Page list, collection fields, requirements.
6	LAWMATICS-INTEGRATION.md	How the contact form reaches our CRM. Phase 7.
7	03-QA-CHECKLIST.md	Run before saying anything is done.
Reference, open when you need it
File	What it is
../downwindersadvocates-PRODUCTION.html	The reference build and your source of truth. All design, copy, CSS and JavaScript in one file. Open it in Chrome, then open it in a text editor.
counties.csv	19 rows. Imports into the Covered Areas collection.
conditions.csv	17 rows. Imports into the Conditions collection.
test_screener.js	Automated test for the eligibility screener. Phase 3.
../RECA-AUTHORITATIVE-CONDITIONS.md	Legal source data, verbatim from government forms. Read only. Never edit.
../llms.txt, ../robots.txt	Upload as-is in Phase 7.
Start by using the thing
Before you build anything, open the reference build in Chrome and fill out the screener three or four times with different answers. Try prostate cancer. Try arriving in 1975. Watch what it tells you. You need to understand what it does before you rebuild it.

Added 2026-09-01

What six real customer calls changed
We got transcripts of six recorded intake calls with real families. They contradicted several assumptions this site was built on. Nothing already built is wrong, but three pages were added and a few priorities flipped. Full detail in 04-WHAT-THE-CALLS-CHANGED.md.

The site's job is not what we thought
All six of those families came from someone they personally knew. A cousin, an aunt, a neighbor. Zero came from advertising. In the founder's own words from the calls: "a lot of people, when they see an advertisement, think it sounds just like a scam."

So the real sequence is: someone's neighbor tells them about this, they do not believe it, and they go look it up. The website is what they find. Its whole job is to convince a suspicious person in about ninety seconds that this is a real government program and that we are real people.

That is a trust page, not a sales page. Build it like one.

What every single caller said first
In all six calls, the first real reaction was disbelief.

"I mean, is that all legit? I don't know."
"it does seem too good to be true"
"it just feels almost too good to be true, if I'm being honest"
"what's in it for you?"

Two of them asked outright what the company gets out of this, before anything else. Nobody objected to the price. Not once. Price is not the friction. Believing us is the friction.

Who is actually reading this
We assumed the visitor is the person who was exposed. They are almost never. Five of six were filing on behalf of someone else, and in two cases the person doing all the work receives no money at all. One was handling it for a mother with memory problems, another for a mother with what she called "grief dementia" who cannot manage paperwork. Five of six were women.

Picture an organized woman in her fifties doing a bureaucratic favor for a parent who cannot do it themselves. One described herself as "I'm a buster, so I should have it by the end of the week." She is not afraid of the government. She is afraid this becomes one more thing she is carrying.

The three new pages
Build them as shells in Phase 4 like the others. Copy is coming. But build them knowing what they are, because the intent affects the layout.

01
/is-this-real
Now the most important page on the site. Treat it that way in the nav. It answers the first question every caller asked, with outbound links to justice.gov so people can verify independently, plus a plain answer to "what's in it for you?"

Design note: this page should feel like evidence, not marketing. If you find yourself making it pretty, you are making it worse. Make the outbound government links obvious and easy to click even though sending people away feels wrong. Sending them away to verify is the entire point of the page.

02
/siblings
When both parents are gone the money splits between the children and every child has to be accounted for. This is the single biggest reason deals fall apart. One family walked away entirely over a brother they do not speak to. There is a real answer, and putting it on a page may recover those families.

Design note: people arrive here stressed and possibly embarrassed. Keep it calm and plain. No illustrations of happy families.

03
/someone-told-me-about-this
The literal entry point for how this company grows. Someone was just told about this by a person they trust and is typing it in to check.

Design note: assume the reader is skeptical and already has the basic facts. Links to /is-this-real and to booking a call, not much else.

Priorities that flipped
Photos went from nice-to-have to the top launch blocker
From the calls: "That's why I prefer the Zoom call. Show them a real face, show them that you exist." Showing a face is the mechanism that makes people believe this is not a scam. Circles with initials do the opposite of the page's job.

Still build them as placeholders, we do not have photos yet. But in your handoff note, list this as blocker number one, not a minor item.

The screener is no longer the star
It still gets built exactly as specified and guardrails 3 and 4 still apply in full. But it is not the main call to action anymore. Most visitors were already told they probably qualify by whoever sent them. They do not need screening, they need convincing.

So when you condense the home page in Phase 4, the hierarchy is roughly: what this is in plain words, then proof it is real, then the people with faces, then book a call, then the screener. Not the other way around.

The first call is a video call, on purpose
So the family can see who they are talking to. If you find copy that just says "call," flag it. Do not change it yourself.

What did not change
All eleven guardrails still stand. The screener logic, its tests, and "it sends nothing" are unchanged. The condition and county data is unchanged. Accessibility is unchanged. Light mode only, still. You still do not write copy.

Guardrails
Eleven things that cause real problems if changed. Full reasoning in 02-GUARDRAILS.md. If a reason does not make sense, ask rather than working around it.

01
Do not rewrite copy. Move it.
Every word was written deliberately and much of it is doing legal work. Sentences that sound oddly hedged are hedged on purpose. Copy and paste, never retype, so typos cannot enter reviewed copy. Flag mistakes, do not silently fix them.

02
The footer disclaimer goes on every page
All 45, including every CMS-generated page. Build it as one Webflow symbol. Paste it 45 times and one copy eventually drifts, and that is the one that gets screenshotted.

03
The screener sends nothing. Ever.
Entirely client-side. No submission, no per-answer analytics, no email gate, no lead capture. Three reasons: people answer honestly about a dying parent only if nothing is collected; AI and search cannot cite content behind a form; and we do not want a database of medical answers. Do not connect it to Lawmatics.

04
Do not reorder the screener logic
Disqualifiers run before optimistic branches. In testing, having the "we will look up your county" branch run first returned a positive result to someone with prostate cancer, which does not qualify. Run test_screener.js after any change.

05
Never gold text on a light background
Fails WCAG AA and this audience cannot read it. Gold is hairlines, icons, focus rings, and text on dark navy only.

06
Accessibility is not the last 5%
18px minimum, AA contrast, visible focus on everything, full keyboard path through the screener, fieldset and legend on every radio group, aria-live on the result, skip link, 44px tap targets, reduced motion honored. If time is short, cut an animation, never an accessibility item.

07
Light mode only
No dark mode, no prefers-color-scheme blocks. This was tried and deliberately removed. Older readers do better on light, and dark made it read like a tech product rather than a trustworthy local service.

08
Do not add any of these
No chatbot, exit popup, countdown timer, "X people viewing," stock photos of doctors or handshakes, government seals, eagles, flags, official-looking letterhead, testimonials, blog, or newsletter modal. Looking official is itself an FTC problem because it implies government affiliation.

09
Do not invent CMS body copy
The 36 CMS pages have titles and meta descriptions. The Body field is intentionally empty. Those pages explain which cancers and counties qualify. Bind the field, leave it empty. Do not generate it with AI and do not copy it off another RECA site, most of which are wrong. That copy is being written separately. Same for the seven empty static pages.

10
Three placeholders must not go live
Initials instead of real photos, now the number one launch blocker, "Laura" with no surname or bar number, and "fee figures pending counsel review." Build them as they are and flag them. Do not quietly invent a fee number or a last name.

11
Staging only until told otherwise
Do not point the real domain. Going live starts legal and marketing clocks that are not your call.

The nine phases
Do them in order. Each ends with a checkpoint where you send Jaxon a short update before moving on. The checkpoints are the point: they exist so a misunderstanding costs you four hours instead of forty.

0
Setup and orientation
2 to 3 h
Read this page, then 02-GUARDRAILS.md in full.
Open the reference build in Chrome. Click everything. Fill out the screener three or four times with different answers.
Open the same file in a text editor. Skim the CSS at the top and the JavaScript at the bottom.
Get Webflow access from Jaxon. Confirm you can create pages and edit CMS collections.
Open both CSVs in a spreadsheet so you know what is coming.
Checkpoint 0
Confirm you have access and have read the guardrails. List anything in the guardrails you did not understand. That list is genuinely useful. Do not skip it to look competent.
1
Style system
4 to 6 h
Do not build any page yet. Build the system the pages will use.

Add both Google Fonts in Site Settings.
Create named color swatches for all eight tokens, named exactly as above.
Set base typography: body 18px Source Sans 3, headings Poppins. Take the type scale from the reference, do not eyeball it.
Build reusable classes: section wrapper, content max width (about 65 characters for running text), card, muted paragraph, eyebrow label, primary button, legal fine print.
Set the global focus state now, gold and clearly visible, so you never ship outline:none.
Checkpoint 1
Build a throwaway page showing every swatch, every heading level, body text, a button in all states, and a card. Send the staging link. This is the cheapest possible place to catch a wrong color or font.
2
The home page
12 to 18 h
Rebuild from the reference, top to bottom, desktop first. Sections in order:

Header and nav
Hero, "Let's get the uncomfortable part out of the way"
The free file offer
Six kinds of families we help
The covered areas table
Four steps, how it works
If time is short, the terminal illness section
What it costs
Our public standards, the 11 numbered rules
Families of the West, story cards
FAQ, native accordion or <details> in an embed
Who you are dealing with, the three people
Contact, the four ways
Footer with the disclaimer as a symbol
The wind-line dividers and the shield logo are inline SVG. Use embed blocks, do not screenshot them. The alternating light and sand bands are a big part of how the page reads.

Checkpoint 2
Staging link with desktop home complete. Do not do mobile yet. Jaxon compares side by side with the reference.
3
The screener
3 to 4 h
Rebuild the six-question form natively or place the whole thing as a custom code embed. The embed is faster and less error prone, and it does not submit anywhere so you lose nothing.
Copy the screener JavaScript from the bottom of the reference exactly.
Make sure <fieldset>, <legend> and the aria-live result region survive. If Webflow strips them, use an embed.
Confirm it sends nothing. Open the network tab, submit, verify zero requests.
Then run the test:

cd ~/Documents/RCC/webflow
node test_screener.js

# or point it at your own export:
node test_screener.js path/to/your-export.html
You want:

PASS | no positive read leaks a bad illness or bad dates (0 leaks)
EXIT: 0
Any FAIL is a stop-work item
A failure means someone could be told they qualify when they do not. Do not proceed and do not try to fix the test. Send the output to Jaxon.

Checkpoint 3
Staging link plus a screenshot of the test output passing.
4
Static pages
8 to 10 h
Split the single-page reference into 12 URLs. Three are new, added after listening to six real intake calls. Read the Calls section above before building them.

URL	Source
/	Home, condensed. Hero, offer, families, areas table, steps, standards summary, people, contact.
/check	The screener, full page
/standards	The 11 rules, full page
/what-it-costs	The cost section, expanded
/contact	The four ways plus the callback form
/is-this-real	NEW, and now the most important page on the site. Shell only.
/siblings	NEW. The biggest deal killer. Shell only.
/someone-told-me-about-this	NEW. The real entry point. Shell only.
/documents	No copy yet. Shell only.
/free-help	No copy yet. RESEP clinic directory. Shell only.
/deadline	No copy yet. Shell only.
/survivors	No copy yet. Shell only.
Seven have no copy. That is expected and not on you. Build the page, nav entry, SEO fields and footer, leave the body empty.

Every page needs a unique title, unique meta description, self-referencing canonical, the footer symbol, and links to /check and /free-help.

Checkpoint 4
Staging link, all 12 URLs reachable from the nav.
5
CMS collections
3 to 4 h
Create two collections and import the CSVs. Do not build templates yet.

Covered Areas, from counties.csv, 19 rows. Fields: Slug, Name, State, Coverage Status (option), Key Towns, SEO Title, Meta Description, Body (rich text, empty).

Conditions, from conditions.csv, 17 rows. Fields: Slug, Name, Category (option), SEO Title, Meta Description, Body (rich text, empty).

Watch for this one
Some county slugs contain a slash, like arizona/coconino-county. If Webflow rejects nested slugs, flatten to arizona-coconino-county and tell Jaxon, because it changes the URL structure and therefore the SEO plan. Do not silently pick one.

Checkpoint 5
Both collections imported, 19 and 17 items, no malformed rows. Screenshot the collection list.
6
CMS templates
6 to 10 h
Two templates driving 36 generated pages. Each needs:

<title> bound to SEO Title
Meta description bound to Meta Description
Exactly one <h1>, bound to Name
Self-referencing canonical
Body bound to Body, rendering empty for now, which is correct
The footer disclaimer symbol
Links to /check and /free-help
FAQ structured data built from the collection fields
URLs: /covered-areas/{slug} and /conditions/{slug}.

Checkpoint 6
Three live example URLs: one county, one condition, and one of the not covered rows, so the negative cases get checked too.
7
Technical SEO and Lawmatics
5 to 7 h
Head code. Paste the reference <head> into Site Settings, Custom Code, excluding title and meta description which Webflow manages per page. Include the JSON-LD block.
robots.txt. Paste it in. It deliberately allows GPTBot, ClaudeBot, PerplexityBot and Google-Extended. That is intentional, do not "fix" it.
llms.txt at the site root. Webflow may not serve arbitrary root files. If it will not, stop and tell Jaxon rather than burning hours. The fallback is a Cloudflare Worker and that is a separate decision.
Sitemap. Enable auto-generation, verify all 48 pages.
Open Graph and Twitter tags per page, with an image.
Lawmatics. Follow LAWMATICS-INTEGRATION.md. The callback form is three fields: name, phone, best time. Style to match. Add no other fields. Test a real submission and confirm it lands.
Checkpoint 7
Which of the six are done, and specifically whether llms.txt resolves at root.
8
Accessibility and responsive
6 to 10 h
Do not compress this phase.

Every breakpoint: 1440, 1024, 768, 375. Test 320 too, plenty of older phones are that narrow.
Run Lighthouse and axe DevTools on home, /check, and a CMS page. Fix everything in the accessibility category.
Tab the entire site with the keyboard only. Complete the whole screener without a mouse.
Check contrast on every text and background pair. Gold on light is the one that will catch you.
Test on a real phone, ideally an older one. Webflow preview is not a substitute.
Tables and wide content scroll inside their own container. The page body never scrolls sideways.
Verify prefers-reduced-motion disables animation.
Checkpoint 8
Lighthouse scores for three pages, and confirmation of the keyboard-only screener run.
9
Pre-publish
3 to 4 h
Work through every item in the QA checklist below. All of it.
Write a handoff note: what is done, what is still placeholder, anything you changed from the spec and why, anything you are unsure about, and anything that seems wrong in the source material.
Do not point the real domain.
That last point in the note matters. You will have looked at this more closely than anyone. If something seems off, say so.

Checkpoint 9
QA checklist fully ticked, plus your handoff note.
Pre-publish QA
Run all of it. Nothing is done until every box passes or has a written reason next to it. Your ticks save in this browser, so you can work through it over several days.

0 / 67 (0%)
Clear all ticks
Content accuracy

No page says anyone "qualifies," only "may qualify"

Compensation reads "up to $100,000," never a flat figure

Manhattan Project waste correctly shown as $50,000 or $25,000

Covered areas correct: statewide UT, NM, ID; six AZ counties; six NV entries

Montana, Colorado and Guam shown as not covered

Clark County described as partially covered, not covered and not excluded

Melanoma stated as not qualifying

Filing deadline reads December 31, 2027 everywhere

No copy was rewritten from the reference build

No CMS Body field filled with invented content
Legal and compliance

Footer disclaimer on all 48 pages including every CMS page

It is a single Webflow symbol, not pasted copies

Disclaimer states: independent, not affiliated with the government or DOJ, not a law firm, no legal advice, no attorney-client relationship, DOJ decides eligibility, RESEP is free

No government seals, eagles, flags or official-looking formatting

The free RESEP option is on the home page and linked from every CMS page

No countdown timers, urgency banners or scarcity language

No testimonials present, since no real ones exist yet
The screener

Six questions in order: place, years, uranium, illness, who is filing, prior claim

Submitting sends zero network requests, verified in the network tab

No analytics fires on individual answers

No email gate and no lead capture

node test_screener.js exits 0 with 0 leaks

Prostate cancer returns a negative read

Melanoma returns a negative read

Arriving after November 1962 returns a negative read

A uranium worker who arrived after 1962 still returns a positive read

The result announces to a screen reader via aria-live

The whole form is completable with the keyboard alone
Accessibility

Body text 18px or larger everywhere

All text passes WCAG 2.2 AA contrast

No gold text on any light background

Every interactive element has a visible focus state

Skip-to-content link is the first focusable element

Every radio group has fieldset and legend

Meaningful alt text on images, decorative ones aria-hidden

Tap targets at least 44px

prefers-reduced-motion honored

Lighthouse accessibility 95+ on home, /check and a CMS page

axe DevTools reports zero critical or serious issues
Technical SEO

Unique title on every page, under about 60 characters

Unique meta description on every page, under about 155 characters

Self-referencing canonical on every page

Exactly one h1 per page

JSON-LD validates in Google's Rich Results Test

robots.txt live and allowing GPTBot, ClaudeBot, PerplexityBot, Google-Extended

llms.txt resolves at root, or is documented as blocked with the reason

Sitemap generates and lists all 48 pages

Open Graph and Twitter tags present with an image

No page accidentally set to noindex

No broken internal links and no file:// links
Responsive and functional

Correct at 1440, 1024, 768, 375 and 320 pixels

The page body never scrolls horizontally at any width

Tables and wide content scroll inside their own container

Tested on a real phone, not only Webflow preview

Nav works on mobile and the phone number stays reachable

Every tel: link dials (801) 400-8270 and the sms: link opens a message

Lawmatics form submits and the test entry appears in Lawmatics

The callback form has exactly three fields

Validation messages are clear and announced to screen readers

404 page exists and links back to home and the phone number
Placeholders, confirm flagged not filled

Photos still placeholder initials, and flagged as the number one launch blocker

Laura's surname and bar number still absent

Fee section still reads as pending

The seven empty static pages are shells

All 36 CMS Body fields empty

Published to staging only, real domain not pointed

Handoff note written
What you are waiting on, and from whom
None of these block you from starting. All of them block launch.

Item	Owner	Blocks
Webflow account access	Jaxon	Phase 0. Ask on day one.
Lawmatics form embed code or form ID	Jaxon	Phase 7 only.
Body copy for 36 CMS pages	Not you	Nothing. Build templates with the field bound and empty.
Copy for the seven empty static pages	Not you	Nothing. Build the shells.
Photos of Jaxon, Jonny and Laura	Jaxon	Launch, and this is now the top blocker. Use placeholder initials for now.
Laura's surname and bar number	Jaxon	Launch. Leave as is.
The published fee number	Jaxon	Launch. Leave the pending line.
DBA registration	Jaxon	Launch, not the build.
Domain and DNS	Jaxon	Launch only. Staging until told.
Progress updates
Three lines at each checkpoint is plenty:

Phase 2 done. Home desktop matches the reference except the
testimonial cards, which are placeholders since there is no
content yet. Blocked on nothing. Starting Phase 3 tomorrow.
If you are blocked, say so the same day. If you break something, say that too. Nobody minds a thing breaking during a build. People mind hearing about it in week three.

Downwinders Advocates website build kit. Source files in ~/Documents/RCC/webflow/. This page mirrors those files, and they are the version of record if the two ever disagree.