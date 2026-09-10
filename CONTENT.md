# Oyarzun.com — Content Update Guide

Everything on this site can be changed by editing text in a file. No build
tools, no terminal, no AI. GitHub's web editor is enough: open the file, click
the pencil, edit, commit. Vercel builds a preview automatically and you check
it before it goes live.

**Almost everything lives in two files.**

| File | Holds | What it is |
|---|---|---|
| [`lib/copy.ts`](lib/copy.ts) | Every headline, standfirst, caption and label | The **words** |
| [`lib/data.ts`](lib/data.ts) | Names, jobs, careers, trips, books, skills, awards | The **facts** |

They are separate because a fact changes when the world changes, and a word
changes when you change your mind about how to say it. You can rewrite all of
`copy.ts` without any risk of breaking a number, and edit `data.ts` without
touching a sentence.

Two more places, for two specific things:

| File | Holds |
|---|---|
| [`content/posts/`](content/posts) | Blog posts, one Markdown file each |
| [`public/images/`](public/images) | Photographs |

---

## ⚠️ Read this before you edit anything

**There are 39 files in `components/` that look editable and are not.**

The site was redesigned. The old components were left on disk on purpose —
they are useful reference until the redesign reaches production — but **nothing
imports them.** If you edit one, the site does not change, no error appears,
and there is no way to tell from the file itself.

The dead ones are every file under:

- `components/blog/`
- `components/dashboard/`
- `components/family/`
- `components/home/`
- `components/layout/`
- `components/profiles/`
- `components/shared/`
- `components/travels/`

**Everything live is under `components/thrasher/`** — plus one file,
`components/providers.tsx`, which is wiring for the Negative button and holds
no content. If a path in an older note or an older version of this guide
points anywhere else under `components/`, it is out of date.

The count is exact as of this writing: **39 dead, 16 live.**

Two data files are dead the same way:

- `content/now.json` — the "Right now" content moved to `nowRows` in
  `lib/copy.ts`
- `content/memory.json` — the Memory-of-the-Day feature no longer exists

---

## Table of contents

- [How live figures work](#how-live-figures-work) — the `{curly braces}`
- [Changing a headline or a paragraph](#changing-a-headline-or-a-paragraph)
- [Right now — the monthly edit](#right-now--the-monthly-edit)
- [Names, jobs and bios](#names-jobs-and-bios)
- [Careers](#careers)
- [Projects](#projects)
- [Awards](#awards)
- [Skills and the spider charts](#skills-and-the-spider-charts)
- [Trips](#trips)
- [The bucket list](#the-bucket-list)
- [Ski days, books, films, reading](#ski-days-books-films-reading)
- [Goals](#goals)
- [Photographs](#photographs)
- [The family album](#the-family-album)
- [Publishing a blog post](#publishing-a-blog-post)
- [The colophon at the foot](#the-colophon-at-the-foot)
- [What updates itself](#what-updates-itself)
- [What still needs a developer](#what-still-needs-a-developer)
- [Checking your work](#checking-your-work)

---

## How live figures work

**File:** [`lib/copy.ts`](lib/copy.ts) — GitHub web editor ✓

Some sentences contain a number that has to stay correct. Those are written as
a **token** in curly braces, and the real figure is filled in when the site
builds.

```ts
"{adventures} adventures, {countries} countries, {nights} nights so " +
  "far this year. Every figure derived from the log below, so adding a " +
  "trip updates all of them.",
```

On the page that reads *"4 adventures, 2 countries, 18 nights so far this
year…"* — and if you log a fifth trip in `lib/data.ts`, all three numbers
change on their own.

**You can rewrite the sentence around a token freely.** Move it, drop it, use
it twice. The only thing you must not do is rename it — `{nights}` works,
`{Nights}` prints on the page exactly as written, which is a mistake you will
see immediately in the preview.

The tokens available:

| Token | Means | Comes from |
|---|---|---|
| `{commits}` | GitHub contributions, last 52 weeks | live, from the GitHub API |
| `{nights}` | nights away this year | sum of `adventures` |
| `{countries}` | countries visited | distinct countries in `adventures` |
| `{adventures}` | trips logged | number of `adventures` |
| `{skiDays}` | days on snow | sum of `skiResorts` |
| `{resorts}` | resorts skied | number of `skiResorts` |
| `{books}` | books finished this year | sum of `booksPerQuarter` |
| `{posts}` | posts published | files in `content/posts/` |
| `{postsGoal}` | the writing target | `goals` in `lib/data.ts` |
| `{slotsOpen}` | target minus published | both of the above |
| `{himLine}` | "Tommy Oyarzun · Manager, Analytics, Domo" | `profiles.him` |
| `{herLine}` | "Julia Velicev · Data Engineer III, SeekWell" | `profiles.her` |
| `{countryList}` | "USA · Italy" | `adventures` |
| `{issueNumber}` `{dateline}` `{elevation}` `{updated}` | the issue's own details | `issue` in `lib/copy.ts` |

**Bold:** put `**two asterisks**` around a phrase. That is the only formatting
the text understands — no HTML, no links.

---

## Changing a headline or a paragraph

**File:** [`lib/copy.ts`](lib/copy.ts) → the `departments` block — GitHub web editor ✓

The home page is one long scroll of six **departments**. Each has its own
block in `departments`, and every visible word in it is a field you can edit:

```ts
counted: {
  folio: "03",                    // the number in the department bar
  name: "Counted",                // the department's name
  deptKicker: "1 Jan – 10 Sep 2026",   // small line, right of the bar
  kicker: "Every figure derived from the array behind it",  // above the headline
  headline: "Counted",            // THE BIG WORD
  dek: [
    "Every figure on this panel is computed from…",   // each string = one paragraph
  ],
  stats: [
    "Panel updated on build",     // the small right-hand column,
    "Commits live from the API",  // one string per line
    "Nothing estimated",
  ],
},
```

### Two things to know about `headline`

**It sizes itself.** The headline is stretched to the exact width of the page,
so a longer word sets smaller and a shorter word sets bigger. You never set a
size. One or two words is the house style; four is the practical limit.

**Do not put a `{token}` in it.** A headline that changes value re-sizes the
type and re-flows the whole department every time the number moves. That is
why department 04 is headlined **Fernweh** rather than "18 nights" — the count
sits in `deptKicker`, where it can grow without moving anything.

### Adding a paragraph

`dek` is a list. Add a string, get a paragraph:

```ts
dek: [
  "The first paragraph.",
  "A second one, which did not exist before.",
],
```

---

## Right now — the monthly edit

**File:** [`lib/copy.ts`](lib/copy.ts) → the `nowRows` block — GitHub web editor ✓

This is the one you will edit most. Three groups — him, her, both — and each
row is a label, a bold headline, and a sentence.

```ts
{
  label: "Reading",
  headline: "Do Androids Dream of Electric Sheep?",
  text: "{books} books finished this year against a target of twenty.",
},
```

To add a row, copy an existing one and change the three lines. To remove one,
delete from the `{` to the `},` inclusive. Four rows per group reads well;
past six it starts to feel like a changelog rather than a snapshot.

**When you change a row, change the date too.** It is in the same file:

```ts
now: {
  updated: "10 September 2026",
```

That one field feeds both the department bar and the last sentence of the
standfirst, so you only type it once. The whole value of a "now" page is that
the date is honest.

---

## Names, jobs and bios

**File:** [`lib/data.ts`](lib/data.ts) → `profiles` — GitHub web editor ✓

```ts
her: {
  name: "Julia Velicev",
  title: "Data Engineer III",
  company: "SeekWell",
  bio: "Staff Data Engineer with 10+ years of experience…",
  linkedin: "julia-velicev",        // just the handle, not the full URL
  github: "tjoyarzun",              // optional; omit and no GitHub row appears
```

Changing `title` or `company` updates it **everywhere at once** — the profile
column, the teaser on the home page, the credit block under two different
headlines, and the byline on any post that person wrote. That is what
`{himLine}` and `{herLine}` are for.

---

## Careers

**File:** [`lib/data.ts`](lib/data.ts) → `profiles.him.career` / `profiles.her.career` — GitHub web editor ✓

Newest first. `description` is optional — leave it out and the row is just the
company and the job title.

```ts
{
  company: "Domo",
  title: "Manager, Analytics",
  years: "2025–Present",     // "–Present" is printed as " —"
  description: "Built the marketing analytics team from scratch…",
},
```

**One special case:** any row where `company` is exactly `Overstock.com` is
printed reversed out in vermilion, because that is where you two overlapped.
Change the company name and the highlight follows it.

---

## Projects

**File:** [`lib/data.ts`](lib/data.ts) → `profiles.*.projects` — GitHub web editor ✓

```ts
{
  title: "Dimple Dell Residence — interactive 3D",
  description: "A walkable 3D model of the house we're building in Sandy…",
  tags: ["React Three Fiber", "three.js", "TypeScript"],
  liveUrl: "https://dimple-dell-3d.vercel.app",   // optional → "Open" button
  githubUrl: "https://github.com/…",              // optional → "Source" button
},
```

The project count in the heading (`Projects · 2`) counts the list, so it can
never be wrong.

---

## Awards

**File:** [`lib/data.ts`](lib/data.ts) → `profiles.*.recognition` — GitHub web editor ✓

The awards block appears **only for a person who has one.** There is no empty
"Recognition — none" heading, because printing an absence reads as a fact
about the person.

Julia has one. **Tommy has none** — add a `recognition` block to
`profiles.him` in the same shape and the section appears on his side:

```ts
recognition: {
  org: "Influential Women",
  orgUrl: "https://influentialwomen.com/",
  award: "Verified",
  tagline: "Amplifying the achievements and influence of women who…",
  year: "2026",
  badgeUrl: "/images/badge.png",
  certificateUrl: "/images/Julia_Velicev.png",
  certificateAlt: "Influential Women recognition certificate for…",
  blurb: "She advanced from Analyst to Data Engineer III through…",
  videoId: "1221262818",      // optional Vimeo id → "Watch the film" button
  videoHash: "e2e2ed707e",    // the unlisted-video hash
},
```

---

## Skills and the spider charts

**File:** [`lib/data.ts`](lib/data.ts) → `profiles.*.skills` — GitHub web editor ✓

```ts
skills: [
  { skill: "SQL", value: 95 },      // value is 0–100, self-assessed
  { skill: "Python", value: 90 },
],
```

**The two charts share one set of axes**, built automatically from both lists
combined. That is on purpose: if each chart used only its own skills, the two
shapes would look comparable and would not be.

Consequences worth knowing:

- **Add a skill to one person and it appears on both charts** — as a real
  value for them, and as zero for the other. A zero is information, not a gap:
  Julia's `Domo` axis collapses to the centre because she does not list it.
- The axes are ordered by the two values added together, so the strongest
  shared skills come first.
- Ten axes is about the limit before the labels crowd. There are ten now.

A value of 90 or more is printed in vermilion.

---

## Trips

**File:** [`lib/data.ts`](lib/data.ts) → `adventures` — GitHub web editor ✓

```ts
{
  id: 5,                       // any number not already used
  name: "Roman Holiday",
  location: "Rome, Italy",
  country: "Italy",            // used to count countries — spell it consistently
  lat: 41.8881,                // decimal degrees; negative lng = west
  lng: 12.4792,
  date: "2026-05-23",          // YYYY-MM-DD
  type: "sightseeing",
  who: "Just Us",
  nights: 2,
  emoji: "🏛️",
  description: "…",
  imageUrl: "https://picsum.photos/seed/rome/400/250",
},
```

### Trips count for the year they happened

**`date` decides which year a trip counts for.** Every figure the site prints
about trips — nights, countries, trips logged, the Adventures gauge, the log
table, the route chart, the monthly sparkline — counts **the current year
only**, because every label beside them says so.

This was wrong until it was checked. Books already filtered by year; trips did
not, while the cover said "Nights away, **2026**". A trip dated 2025 with nine
nights pushed that figure from 18 to 27, moved the Adventures gauge to 5/20
under a heading reading "AGAINST THE 2026 TARGETS", and put a 2025 row in a
log headed 2026.

So a trip outside the current year is **excluded from the figures and named in
the caption** — "4 in 2026 · 1 logged in other years, not counted here" —
rather than either inflating a year total or vanishing. Keep old trips in the
array; they simply stop counting when the year turns.

Two things follow:

- **On 1 January every trip figure resets to zero.** That is the intent, and it
  matches how the books and goals figures already behaved.
- **A trip you book in advance and date next year does not count yet.** Give it
  a real date and it starts counting on its own.

**Adding one trip changes eight things on the site,** all on their own:

1. the nights figure on the cover
2. the nights readout in the Counted panel, and its by-month sparkline
3. the trips-and-countries line under it
4. the Fernweh department bar
5. both paragraphs of the Fernweh standfirst
6. the country list in its credit column
7. the log table and its total
8. the Adventures goal gauge

The route chart is drawn from `lat` and `lng`, so a new destination appears on
the map with its own arc from Sandy. Get the coordinates from Google Maps —
right-click a spot and the first pair of numbers is `lat, lng`.

The map's window is worked out from the trips themselves, so a destination
further afield than anything already on it widens the whole chart rather than
falling off the edge — add Tokyo and the plate re-spans to 120°W–120°E, with
the degree markings re-spaced to match. The label on the plate is the **first
part of `location`**, not `name`: "Rome", not "Roman Holiday". A trip with no
`lat`/`lng` is simply left off the chart; it still counts everywhere else.

The window also has a minimum size — 38° of latitude and 80° of longitude —
so the coastline stays recognisable even when every trip is clustered. Framed
tightly to four destinations that all sit near the 40th parallel, the chart
showed North America and Europe as unidentifiable vertical strips.

### The coastline

**Files:** [`public/land.json`](public/land.json) and [`scripts/gen-land.mjs`](scripts/gen-land.mjs) — not a content edit

You will not need to touch this, but it is worth knowing it exists. The
continents are 73 coastline outlines in `public/land.json`, generated from
Natural Earth's 1:110m land data. It is committed rather than fetched from a
package at build time, so the file is reviewable in a diff and nothing large
lands in the JavaScript bundle — 24KB, 8KB over the wire, and only requested
by the pages that draw a map.

If it ever needs regenerating — a finer coastline, smaller islands kept:

```
node scripts/gen-land.mjs
```

The two knobs are at the top of that script: `TOL` (how much detail to keep,
in degrees) and `MIN_AREA` (the smallest island to bother drawing).

---

## The bucket list

**File:** [`lib/data.ts`](lib/data.ts) → `bucketListItems` — GitHub web editor ✓

```ts
{
  id: 1,
  name: "Tahiti",
  state: "French Polynesia",
  description: "We do love beaches.",
  imageUrl: "…",
  type: "beach",
},
```

Add an entry and a card appears under "On the list". There is one entry today,
so there is one card.

**About `imageUrl`:** if it points at another website, the card falls back to a
stand-in photograph. See [Photographs](#photographs) for why.

---

## Ski days, books, films, reading

**File:** [`lib/data.ts`](lib/data.ts) — GitHub web editor ✓

```ts
export const skiResorts = [
  { name: "Snowbird", days: 18, vertical: 3100, runs: 330 },
];
```

Days on snow, the resort count, the bars, the sparkline and the Ski goal gauge
all come from this one list. The bars are drawn relative to the busiest
resort, so they cannot disagree with the numbers beside them.

```ts
export const booksPerQuarter = [
  { quarter: "Q2 26", books: 4 },   // the last two digits pick out this year
];

export const currentlyReading = [
  { title: "…", author: "…", progress: 25, genre: "Sci-Fi", coverColor: "#1C1917" },
];

export const favoriteMovies = [
  { title: "Backrooms", year: 2026, director: "…", genre: "Horror",
    rating: 5, platform: "Theater", posterColor: "#C8973E" },
];
```

`coverColor` and `posterColor` are left over from the old design and are not
used any more. Harmless; leave them.

---

## Goals

**File:** [`lib/data.ts`](lib/data.ts) → `goals` — GitHub web editor ✓

**Edit only the `goal` number.**

```ts
export const goals = [
  { label: "Adventures", current: 0, goal: 20, pct: 0 },
  { label: "Ski Days",   current: 0, goal: 40, pct: 0 },
  { label: "Books Read", current: 8, goal: 20, pct: 40 },
  { label: "Blog Posts", current: 3, goal: 5,  pct: 60 },
];
```

`current` and `pct` are **ignored**, and they are deliberately left wrong so
nobody trusts them. Where you actually are is counted from the lists above —
which is the point, because this array used to claim 0 adventures against four
logged and 3 posts against two files, and the site printed both.

Each gauge in the Counted panel also carries a **notch** showing where a
steady pace would have you today. Ahead of the notch fills vermilion, behind
it fills ink.

---

## Photographs

**Files:** [`public/images/`](public/images) and [`lib/copy.ts`](lib/copy.ts) → `plates` — GitHub web editor ✓

Every photograph on this site is **screened** — printed as halftone dots, the
way a magazine prints a photograph, with the dot size worked out from the
brightness of the picture underneath. Clicking one shows the real colour.

### Swapping a picture

1. Upload the file to `public/images/` (in GitHub: **Add file → Upload files**).
2. In `lib/copy.ts`, find the entry in `plates` and change `src`:

```ts
portraitHim: {
  src: "/images/summit-selfie.jpg",   // ← change this
  detail: "Self-timer · 2026",        // the caption in the colour view
  crop: "0.24,0.44,0.34",
  placeholder: true,                  // set to false once it is the real one
},
```

### The picture must live in this repo

A photograph on someone else's server **cannot be screened at all.** The
halftone works by reading the individual pixels of the picture, and browsers
refuse to let a page read pixels from an image it fetched off another domain.
There is no way around it — the file has to be in `public/images/`.

Two blog covers are remote today and fall back to a stand-in plate. Download
them into `public/images/` and set `coverImage` in the post to that path, and
they will screen properly.

### `crop` is not a one-line edit

`crop` is `across,down,zoom` as fractions. `0.5,0.5,1` is centred and
full-frame. `0.24,0.44,0.34` is 24% across, 44% down, at a 34% zoom.

**You cannot get this right by reading it.** Change it, let Vercel build the
preview, look, nudge, repeat. Two quirks that will otherwise waste your time:

- When the frame is **wider** than the photograph, the *across* value does
  nothing at all. Only *down* and *zoom* move the picture.
- `gamma` is the tone curve and it works backwards from what you would guess:
  **raising it makes a dark-on-light picture lighter,** because the number
  controls how much ink is laid down rather than how dark the result is. Leave
  it at 1 unless a plate looks muddy.

### Negative

The button in the top bar runs the whole site as a photocopier would, and it
remembers your choice. Every photograph is re-screened inverted. You do not
have to do anything for a new picture to work in it.

---

## The family album

**File:** [`lib/copy.ts`](lib/copy.ts) → `gallery` — GitHub web editor ✓

```ts
export const gallery = [
  "/images/switzerland-dock.jpg",
  "/images/summit-selfie.jpg",
  "/images/dimple-dell-3d.jpg",
];
```

Twenty frames are drawn, cycling through this list, each with its own crop.
Add paths and the wall gets more variety. The crops come from a fixed seed, so
a rebuild never reshuffles it.

### ⚠️ The password box checks nothing

Anyone who presses Enter gets in. This has always been true — the old gate did
the same. The album is kept private by two things that **do** work:

1. the page tells search engines not to index it (`noindex, nofollow`)
2. the address is not linked from anywhere public

**Do not describe this gate to anyone as protecting the photographs.** Real
privacy needs the images served from behind a password check on the server,
which is a developer task.

---

## Publishing a blog post

**Folder:** [`content/posts/`](content/posts) — GitHub web editor ✓

This is unchanged from before. One Markdown file per post; the filename is the
web address.

1. **Add file → Create new file** in `content/posts/`
2. Name it `my-new-post.mdx` — lowercase, hyphens, no spaces. It becomes
   `oyarzun.com/written/my-new-post`.
3. Paste this at the top, between the two `---` lines, and edit it:

```mdx
---
title: "The title, as it should appear"
author: "him"
date: "2026-09-14"
readTime: 6
tags: ["Analytics", "Data"]
excerpt: "One or two sentences. Shown in the index and used as the description when the post is shared."
coverImage: "/images/my-cover.jpg"
draft: false
---

Your first paragraph. This one gets the big initial letter.

## A subheading

More text. **Bold** and *italic* work, and so do lists:

- one
- two

> A quotation, which is set large and reversed out between two rules.
```

**The fields:**

| Field | Notes |
|---|---|
| `author` | `"him"`, `"her"` or `"both"` — sets the byline and the profile link |
| `date` | `YYYY-MM-DD`. The index is newest first. |
| `readTime` | minutes, your estimate |
| `tags` | shown on the index row and in the margin of the post |
| `excerpt` | keep it to two sentences; it is also the share description |
| `coverImage` | put the file in `public/images/` and use `/images/name.jpg` |
| `draft` | `true` hides it from the site completely |

**Two things happen on their own when you publish:**

- The post appears in the numbered index, and one "Unwritten" slot disappears.
- Every `{posts}` and `{slotsOpen}` figure across the site updates — the
  Counted panel, the Written goal gauge, the standfirst, the Right-now row.

**The first letter of your first paragraph** is set as a large initial in a
vermilion box. If your post opens on an acronym — "AI will not…" — the site
notices and skips the initial, because it would otherwise print a boxed **A**
followed by "I will not…".

To **edit** a post, edit the file. To **remove** one, either delete the file
or set `draft: true`, which keeps the text for later.

---

## The colophon at the foot

**File:** [`lib/copy.ts`](lib/copy.ts) → `colophon` — GitHub web editor ✓

The long paragraph at the bottom of every page, describing how the site is
made.

**⚠️ It ends with "No analytics, no newsletter, nothing here is measuring
you."** That sentence is only true while the analytics package stays out of
`app/layout.tsx`. If analytics is ever added back, this sentence has to change
in the same commit — and so do two readouts, the "None / Analytics on this
site" tile on the cover and the "Not doing / Measuring you" row in Right now.

---

## Every figure and where it comes from

**No number is written twice anywhere on this site.** Each one has exactly one
source, and everything that prints it reads from there — including the numbers
spelled out inside sentences, which is where they used to hide.

### Counted from something (you never touch these)

| Figure | Counted from |
|---|---|
| Commits, and the activity grid and sparkline | the GitHub API, **on the server** |
| Nights away | sum of `nights` across this year's `adventures` |
| Countries | distinct `country` in this year's `adventures`, ignoring case and spacing |
| Trips logged | this year's `adventures` |
| Trips excluded | `adventures` dated outside this year, named in the log caption |
| Days on snow | sum of `days` across `skiResorts` |
| Resorts, and which one leads | `skiResorts` |
| Books this year | `booksPerQuarter`, rows ending in the current year |
| Posts published, drafts, authors | files in `content/posts/` and their `draft` flag |
| Slots open | writing target minus posts published |
| Years in the field, each and combined | `yearsExperience` on each profile |
| The Overstock overlap — years, span, company | both `career` arrays, intersected |
| Shared spider-chart axes | both `skills` arrays, combined |
| Album frames | `GALLERY_FRAMES` in `lib/copy.ts` |
| Every goal gauge, and its pace notch | the arrays above, and today's date |

### Kept by hand, in one place each

| Figure | The one place |
|---|---|
| Days at each resort | `skiResorts` in `lib/data.ts` |
| Books per quarter | `booksPerQuarter` in `lib/data.ts` |
| What you're reading, and how far in | `currentlyReading` in `lib/data.ts` |
| Films and their ratings | `favoriteMovies` in `lib/data.ts` |
| The 2026 targets | the `goal` field in `goals` in `lib/data.ts` |
| Trips | `adventures` in `lib/data.ts` |

Change one of those and every place that mentions it follows. Adding a single
trip moves **eight** figures; a day at a new resort can change which resort the
Right-now section names.

### Spelled-out numbers still derive

"Twelve years and ten years, five of them in the same building" is not typed
out. It reads `{YearsHimWord} years and {yearsHerWord} years,
{overlapYearsWord} of them…` — any token ending in `Word` prints its figure as
a word, capitalised if you capitalise the token. So the prose keeps its words
and the number still comes from the data.

### If GitHub is unreachable

The figure prints as an em dash and the caption says why. There is deliberately
no fallback number: the previous version shipped **1,203** in three places
against a real figure of about 150, because a seed value sat in the data file
and was only corrected after the page had already loaded.

## Checking the figures

Two commands. They catch different things, and the difference matters.

```bash
npm run build && npx next start -p 3100 &

npm run check:figures     # every figure on the page matches its source
node scripts/check-literals.mjs   # no figure is hard-coded in the copy
```

`check:figures` catches **drift** — a number that has gone stale. It cannot
catch a number that has just been typed in and happens to be right today. I
proved that on myself: I replaced `{adventures} adventures, {countries}
countries, {nights} nights` with the literal `4 adventures, 2 countries, 18
nights`, and it reported all clear, because at that moment it was.

`check-literals` catches that one. It reads the copy file and flags any number
— digits or words — that equals a figure the site derives, whether or not it
is currently correct. That is the check that would have caught the literal.

Run both before merging a change to `lib/data.ts` or `lib/copy.ts`.

---

## What still needs a developer

Honest list. These are not edits you can make in the web editor:

| Change | Why |
|---|---|
| Adding or removing a department | It is a section of a page, not a content field |
| Renaming a nav item | `components/thrasher/Nav.tsx` |
| A link inside a paragraph | The copy file is plain text on purpose, so a stray `<` can never break the page |
| The tag filter under "Everything written" | The tags show, but filtering is not built |
| A screened treatment for the Vimeo player and the 3D walkthrough | Both are plain links today |
| Real privacy on the family album | Needs a server-side check |
| Colours, type sizes, spacing | `app/globals.css` |
| Halftone `crop` and `gamma` by feel | Editable, but needs the preview to judge — see [Photographs](#photographs) |

---

## Checking your work

**You cannot break the live site by editing these files.** Two safety nets:

1. **A typo stops the build.** Delete a quote or a comma and Vercel fails the
   build with an error naming the file and the line. The old version keeps
   serving.
2. **Every commit gets a preview.** Vercel comments a preview link on the
   commit. Look at it before merging.

A quick checklist after an edit:

- [ ] Does the preview build succeed?
- [ ] Any `{tokens}` printed literally on the page? That is a misspelt token.
- [ ] If you changed the Right-now rows, did you change `updated` as well?
- [ ] If you swapped a photograph, does the crop still frame it? Check on a
      phone as well — the plates are cropped to the same fractions at every
      size but the frame shape changes.
- [ ] If you edited something and nothing changed, check you were not in one
      of the [39 dead files](#-read-this-before-you-edit-anything).

### If a build fails

The error names the file and the line. It is almost always one of three
things: a missing `"` , a missing `,` at the end of a line, or a `{` without
its matching `}`. Compare the block you edited against the one above it — they
have the same shape.
