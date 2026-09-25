# What I still need

Send this when someone asks what is blocking the Schedule a Call button.

The website notes say that button must open the real booking calendar. It must not send people to another section of the site where they have to click again. That calendar link is not in the notes and not in the website files. It comes from the Lawmatics account.

## Paste Andy's calendar link here

Waiting on Andy. When the link arrives, paste it on the next line and tell the agent to implement it.

```
CALENDAR_URL=
```

The agent will copy that URL into `discoveryBookingUrl` in `src/_data/site.js`. Until the line above has a real link, Schedule a Call goes to the contact form. That one item cannot score 10.

## What to ask Andy for

A public Lawmatics link where a person can book the discovery call directly. The existing Lawmatics snippet on the site is a callback form (name, phone, best time). That form is not the calendar.

## What can be done without the link

Everything else in `website notes.pdf`: header badge, Español placement, homepage wording, core mission moved above the footer, “What to Expect Working With Us,” team placement, and the About page order. The book-a-call section can show only a Schedule a Call prompt, with no extra “call us” prompt beside it, and that button can point at the contact form until the link above is filled in.

## Founders video on the About page

The notes say: “On the about us page - see if we can have the actual video there.” The page already embeds the Instagram reel they sent (`https://www.instagram.com/reel/DdffHupNZsP/`). That embed is Instagram’s player. If Instagram does not load, visitors only see a link that opens Instagram.

Do not download the reel from Instagram. Ask the person who posted it for the video file.

## Paste the video file here

Waiting on the original file. When it arrives, put the mp4 in the project and tell the agent to play it on the About page in place of the Instagram embed.

```
FOUNDERS_VIDEO=
```

## What to ask them for

The original video from the phone or camera, as an mp4, from whoever filmed the founders story. That file is higher quality than a copy saved back out of Instagram. If they no longer have the original, they can download their own reel from the Instagram app and send that file. A link is not enough for a video that plays on the site without Instagram.
