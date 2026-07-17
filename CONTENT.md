# Oyarzun.com — Content Update Guide

A quick reference for updating every section of the site. Most updates require editing one file — no code knowledge needed. The GitHub web editor works for everything marked **GitHub web editor**.

---

## Table of Contents

- [Home](#home)
- [Profiles](#profiles)
- [Travels](#travels)
- [Dashboard](#dashboard)
- [Blog](#blog)
- [Now](#now)
- [Footer](#footer)

---

## Home

The home page has six content areas, top to bottom: Hero, Profiles preview, a full-width navigation row, then a final two-column row — "Currently" (Memory of the Day + Currently widget) beside "From the Blog" — of equal width, so the two column headings line up. Profiles preview comes right after the hero so a new visitor meets Tommy and Julia before anything else. There's no separate stats/metrics section on the homepage — the real numbers live on the [Dashboard](#dashboard), which the navigation row links to directly. Some areas are edited via simple JSON files (no code needed), some auto-pull from `lib/data.ts` (edit once, updates in two places), and a couple require editing a component file directly.

---

### 1. Hero section — names, tagline, photo

**File:** `components/home/HeroSection.tsx` — requires a code editor or GitHub web editor

This is the full-screen intro at the top of the page. Find these lines and edit in place:

#### Location badge (above the names)

```tsx
(Sandy, Utah);
```

Change `Sandy, Utah` to whatever city you're in.

#### Names heading

```tsx
Tommy Oyarzun
<br />
<span className="text-white/60">&</span> Julia Velicev
```

Update the names on each line.

#### Site descriptor

```tsx
Our corner of the internet — data & tech work, family
adventures, and whatever we're writing about.
```

One sentence stating what the site actually is, sitting right under the names — this is meant to be the first thing that orients a new visitor regardless of whether they came for the professional side, the family side, or the blog. Keep it to one sentence.

#### Role/company badges (new — auto-generated, no edit here)

The two small pills under the names (e.g. "Manager, Analytics · Domo" and "Data Engineer III · SeekWell") are **not hand-typed** — they're pulled automatically from `lib/data.ts` → `profiles.him.title`/`profiles.him.company` and `profiles.her.title`/`profiles.her.company`. To change what they say, edit those fields under [Profiles](#profiles); the hero updates automatically.

#### Tagline paragraph

```tsx
Skater. Tech and data nerd. Married to a Brazilian engineer who
smokes me on the slopes. We call Sandy, Utah home, when we aren't
dragging our kids on the next trip.
```

Replace with any text. Keep it to 1–2 sentences — it sits below the role badges and above the buttons. Since job titles now live in the badges above, this is the spot for personality, not job descriptions.

#### Buttons

```tsx
<Link href="/profiles" ...>Our Work</Link>
<Link href="/travels" ...>Our World</Link>
<Link href="/blog" ...>Read the Blog</Link>
```

Three buttons, one per pillar of the site (professional, personal, blog) — this is deliberate so a first-time visitor sees all three in the first screen. Change the button label text. Don't change the `href` values or the buttons will break.

#### Hero photo

```tsx
src = "/images/switzerland-dock.jpg";
```

Replace with `/images/your-filename.jpg` (upload the image to `public/images/` first — see [Uploading Photos](#uploading-photos)).

Also update the caption below the photo:

```tsx
<p ...>Switzerland, 2023</p>
```

And the `alt` text on the `<Image>` tag for accessibility.

---

### 2. Profiles preview

**File:** `components/home/ProfilesPreview.tsx` — no edits needed here.

The two condensed cards ("Who We Are") show each person's name, title/company, and a truncated first line of their bio. These read directly from `lib/data.ts` → `profiles.him`/`profiles.her` — the exact same fields documented under [Profiles](#profiles). Edit there once; it updates the hero badges, this preview, and the full `/profiles` page all together.

---

### 3. Navigation row ("Explore")

**File:** `components/home/NavGrid.tsx` — requires a code editor or GitHub web editor

Five clickable cards (`Profiles`, `Travels`, `Dashboard`, `Blog`, `Now`) under an "Explore" heading, sitting on their own row between the profiles preview and the blog — this is the homepage's site-directory row, a quick jump to every section of the site. `Profiles` and `Blog` duplicate the dedicated preview sections elsewhere on the homepage on purpose — those sections are content teasers, this row is pure navigation. `Family Hub` is intentionally **not** in this grid — it's reachable via the "Family Hub" button in the top navigation bar (`components/layout/Navbar.tsx`) instead of being featured on the public homepage. Find the `cards` array:

```ts
const cards: NavCard[] = [
  { label: "Profiles", description: "Career and projects we're proud of", href: "/profiles", ... },
  { label: "Travels", description: "Brazil and Utah and everywhere in between", href: "/travels", ... },
  { label: "Dashboard", description: "Because data...", href: "/dashboard", ... },
  { label: "Blog", description: "Tech, AI, trip stories, and more", href: "/blog", ... },
  { label: "Now", description: "What we're up to right now", href: "/now", ... },
];
```

Edit `label` (the bold card title) and `description` (the small subtitle) for any card. Don't change `href` — that's the link destination.

**Dashboard card's description is live, not the text above.** The `"Because data..."` placeholder in the array is overridden at render time with a real, live GitHub commit count (e.g. "1,203 GitHub commits and counting") — same `/api/github-activity` fetch pattern as the Dashboard page itself, falling back to `dashboardStats.githubCommits` if the live fetch fails. This is a deliberate lightweight signal of real technical activity for visitors coming from the data/tech community, without recreating a whole stats section on the homepage.

---

### 4. From the Blog

**File:** `components/home/BlogTeaser.tsx` — no edits needed here.

The right-hand column of the final homepage row. Blog posts do **not** come from `lib/data.ts` — they're read live from `content/posts/*.mdx` via `getAllPosts()`. Deliberately de-emphasized: shows up to 3 posts as small thumbnail + short-summary rows (not the large featured-post treatment used on the actual `/blog` page), and shrinks gracefully if there are fewer than 3 posts. Add or edit posts in `content/posts/` — see [Blog](#blog) for details.

---

### 5. Currently column — Memory of the Day + Currently widget

The left-hand column of the final homepage row, paired with "From the Blog" so both columns' headings line up. The "Currently" heading itself lives directly in `app/page.tsx` (not in either component below) — this is intentional, so its spacing matches "From the Blog"'s heading exactly.

**Memory of the Day** — **File:** `content/memory.json` — GitHub web editor ✓

```json
{
  "date": "November 14, 2024",
  "caption": "First snow of the season — Big Cottonwood Canyon",
  "imageUrl": "https://picsum.photos/seed/memory142/400/300"
}
```

| Field      | What it does                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `date`     | The label shown below the photo (e.g. "July 4, 2025")                                                 |
| `caption`  | The description shown below the date                                                                  |
| `imageUrl` | Any public image URL. For a real photo, upload it to `public/images/` and use `/images/your-file.jpg` |

**Currently widget** — **File:** `content/now.json` → the `"currently"` block — GitHub web editor ✓

```json
"currently": {
  "reading": "Designing Data-Intensive Applications",
  "watching": "Severance Season 2",
  "building": "Oyarzun.com",
  "listening": "Hozier — Unreal Unearth"
}
```

These are the four one-liners shown below Memory of the Day. Keep each under ~40 characters — they truncate if too long.

---

## Profiles

**File:** `lib/data.ts` — requires a code editor or GitHub web editor ✓

Search for `export const profiles` (around line 123). There are two profile objects: `him` (Tommy) and `her` (Julia).

### GitHub Activity Heatmap

The heatmap on Tommy's profile pulls **real contribution data** from the GitHub API when a token is configured. Without a token it shows a placeholder grid marked "(preview)".

**One-time setup:**

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) → **Generate new token (classic)**
2. Give it a name (e.g. `oyarzun-com`) and select only the `read:user` scope
3. Copy the token
4. **Locally:** paste it into `.env.local` as `GITHUB_TOKEN=ghp_...`
5. **On Vercel:** Settings → Environment Variables → add `GITHUB_TOKEN` with the same value

The heatmap refreshes every 24 hours via Next.js caching — no manual update needed. Julia's side shows the placeholder since she doesn't have a public GitHub profile linked.

### Fields you'll update most often

```ts
{
  name: "Tommy Oyarzun",
  title: "Manager, Analytics",       // job title
  company: "Domo",                    // current employer
  bio: "...",                         // paragraph shown on the profile card
  github: "tjoyarzun",               // GitHub username (no @)
  linkedin: "tom-oyarzun",           // LinkedIn handle (the part after /in/)
  resume: "/documents/tommy_oyarzun_resume_2026.pdf",  // path to PDF in public/documents/
}
```

### Updating the resume PDF

1. Add the new PDF to `public/documents/` (e.g. `tommy_oyarzun_resume_2027.pdf`).
2. In `lib/data.ts`, update the `resume` field to match the new filename.

### Adding or editing a career entry

Find the `career` array inside the profile. Each entry looks like:

```ts
{
  company: "Domo",
  title: "Manager, Analytics",
  years: "2025–Present",
  description: "One or two sentences about impact.",
},
```

Add a new object to the array, or edit an existing one. Order is top-to-bottom on the timeline (most recent first).

### Adding or editing a project

Find the `projects` array inside the profile:

```ts
{
  title: "Project Name",
  description: "What it does in one sentence.",
  tags: ["Python", "dbt", "BigQuery"],
  githubUrl: "https://github.com/tjoyarzun/repo-name",
  liveUrl: "https://yoursite.com",   // optional — remove if no live URL
},
```

### Updating skills (radar chart)

Find the `skills` array. Each entry has a `skill` name and a `value` from 0–100:

```ts
{ skill: "SQL", value: 95 },
```

---

## Travels

**File:** `lib/data.ts` — GitHub web editor ✓

### Adventure Log & Map

Search for `export const adventures`. Adventures can be anywhere in the world — just provide accurate lat/lng coordinates. Each entry is one dot on the map and one row in the log table:

```ts
{
  id: 21,                              // must be unique — increment from the last one
  name: "Bells Canyon Upper Falls",
  location: "Sandy, UT",
  lat: 40.5765,                        // latitude for the map pin
  lng: -111.8010,                      // longitude for the map pin
  date: "2025-08-15",
  type: "hike",                        // "hike" | "ski" | "camp" | "bike" | "sightseeing"
  who: "Family",                       // "Family" | "Just Us" | "Solo"
  nights: 0,                           // 0 = day trip; 1+ = overnight stays
  emoji: "🥾",
  description: "One sentence about the adventure.",
  imageUrl: "https://picsum.photos/seed/bells/400/300",
},
```

To find lat/lng for a location: search the place in Google Maps, right-click the pin, and copy the coordinates.

### Adding a new trip type

If you want to use a type not in the list above (e.g. a new category beyond hike/ski/camp/bike/sightseeing), you must update **three files** or the Vercel build will fail:

1. **`lib/data.ts`** — find `type AdventureType =` near the top and add the new value to the union.
2. **`components/travels/AdventureLog.tsx`** — find `type AdventureType =` and add the same value. Also add it to `TYPE_ICON` (the emoji map) and `TYPE_FILTERS` (the filter chip list).
3. **`components/travels/BucketList.tsx`** — find `type AdventureType =` and add the same value. Also add it to `TYPE_ICON`.

All three files keep their own copy of the type — they must stay in sync.

### Bucket List

Search for `export const bucketList`. Same structure — add items you haven't done yet:

```ts
{
  id: 10,
  name: "The Havasupai Falls",
  state: "AZ",
  description: "One sentence.",
  imageUrl: "https://picsum.photos/seed/havasupai/400/300",
  type: "hike",
},
```

---

## Dashboard

**File:** `lib/data.ts` — GitHub web editor ✓

The dashboard charts pull from several data arrays. Find each by searching the file.

### Ski data (`skiResorts`)

```ts
{ name: "Park City", days: 18, vertical: 52000, runs: 41 },
```

Update `days`, `vertical` (total feet skied), and `runs` at the end of each ski season.

### Adventures by Year (auto-aggregated)

No edits needed — this chart reads directly from the `adventures` array in the Travels section. Every time you add a new adventure entry with a `date`, this chart updates automatically.

### Books read (`books`)

```ts
{
  title: "Designing Data-Intensive Applications",
  author: "Martin Kleppmann",
  progress: 100,    // 0–100. Use < 100 for in-progress books.
  coverColor: "#2a9d8f",
  genre: "Technical",
},
```

### Goals (`goals` + `goalsYear`)

**File:** `lib/data.ts` — search for `export const goalsYear` and `export const goals`

Update `goalsYear` to change the year shown in the card title:

```ts
export const goalsYear = "2026";
```

The goals array looks like this:

```ts
export const goals = [
  { label: "Adventures", current: 0, goal: 20, pct: 0 },
  { label: "Ski Days",   current: 0, goal: 40, pct: 0 },
  { label: "Books Read", current: 7, goal: 20, pct: 35 },
  { label: "Blog Posts", current: 0, goal: 5,  pct: 0 },
];
```

**How each goal's progress is calculated:**

| Goal | How `current` is set | What to edit |
|---|---|---|
| **Adventures** | Auto-counted from the `adventures` array (entries whose `date` starts with the current year) | Only edit `goal` — `current` and `pct` are ignored |
| **Blog Posts** | Auto-counted from the actual MDX files in `content/posts/` (excludes drafts) | Only edit `goal` — `current` and `pct` are ignored |
| **Ski Days** | Manual — update as the season progresses | Edit `current` and recalculate `pct = Math.round(current / goal * 100)` |
| **Books Read** | Manual — update as you finish books | Edit `current` and recalculate `pct = Math.round(current / goal * 100)` |

**At the start of each new year:** update `goalsYear`, reset `current` to `0` and `pct` to `0` for Ski Days and Books Read, and set new `goal` targets for all four.

### Books read per quarter (`booksPerQuarter`)

**File:** `lib/data.ts` — search for `export const booksPerQuarter`

Each entry is one quarter. Add a new row at the end when a new quarter starts:

```ts
export const booksPerQuarter = [
  { quarter: "Q1 24", books: 7 },
  { quarter: "Q2 24", books: 8 },
  // add new quarters here
];
```

The quarter label format is `"Q# YY"` (e.g. `"Q1 25"` for January–March 2025).

### Recent Favorite Movies (`favoriteMovies`)

**File:** `lib/data.ts` — search for `export const favoriteMovies`

Each entry is one movie card on the dashboard. Keep the list to 3–5 movies; remove older entries as you add new ones.

```ts
{
  title: "Anora",
  year: 2024,
  director: "Sean Baker",
  posterColor: "#C8973E",   // hex color for the poster color swatch
  genre: "Drama",
  rating: 5,                // whole number 1–5
  platform: "Theater",      // optional — "Theater", "Netflix", "AppleTV+", "MUBI", etc.
},
```

| Field         | Notes                                                                           |
| ------------- | ------------------------------------------------------------------------------- |
| `title`       | Movie title                                                                     |
| `year`        | Release year                                                                    |
| `director`    | Director's name                                                                 |
| `posterColor` | Hex color for the cover swatch — pick something evocative of the film's palette |
| `genre`       | Short label, e.g. `"Drama"` or `"Sci-Fi / Action"`                              |
| `rating`      | Whole number 1–5                                                                |
| `platform`    | Optional — omit if you don't remember or don't want to show it                  |

---

### KPI Cards

The 4 stat cards pull from `dashboardStats` in `lib/data.ts`:

| Card              | Source                         | How to update                                                      |
|---|---|---|
| GitHub Commits    | Live GitHub API on page load   | Automatic — no edit needed. Fallback value is `githubCommits` in `dashboardStats` |
| Blog Posts        | Auto-counted from `content/posts/*.mdx` | Automatic — just publish or delete MDX files         |
| Books Read        | `booksReadThisYear` in `dashboardStats` | Update manually in `lib/data.ts` as you finish books |
| Countries Visited | `countriesVisited` in `dashboardStats`  | Update manually after each new country               |

---

## Blog

**File:** `content/posts/*.mdx` — GitHub web editor ✓

### Publishing a new post

1. Go to `content/posts/` in your GitHub repo.
2. Click **Add file → Create new file**.
3. Name it `your-post-slug.mdx` (lowercase, hyphens, no spaces).
4. Paste this template at the top, fill in the fields, then write your post below in regular markdown:

```
---
title: "Your Post Title"
author: "him"
date: "2025-07-04"
readTime: 5
tags: ["Data Engineering", "Utah"]
excerpt: "One or two sentences that appear in the blog card preview."
coverImage: "https://picsum.photos/seed/yourpost/800/450"
---

Your post content goes here in regular Markdown.

## Section Heading

Write normally — bold, italic, code blocks, lists all work.
```

| Field        | Notes                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------- |
| `author`     | `"him"`, `"her"`, or `"both"`                                                                 |
| `date`       | `YYYY-MM-DD` format                                                                           |
| `readTime`   | Estimated minutes — count ~200 words/min                                                      |
| `tags`       | Must be in the `["Tag One", "Tag Two"]` format. Tags appear as filter chips on the blog page. |
| `coverImage` | Any public image URL, or `/photos/your-image.jpg` from `public/photos/`                       |

### Adding a real cover image to a post

By default posts use placeholder images. To use a real photo:

1. Drop the image into `public/images/` in the repo (see [Uploading Photos](#uploading-photos)).
2. In the post's `.mdx` file, update the `coverImage` frontmatter field:
   ```
   coverImage: "/images/your-photo.jpg"
   ```
3. In `lib/data.ts`, find the matching entry in `export const blogPosts` (search by slug) and update its `coverImage` field to the same path. Both need to match or the home page preview and the post page will show different images.

### Editing an existing post

Open the `.mdx` file in `content/posts/` and edit directly. Both the frontmatter fields and the body text are editable.

### Removing a post

Delete the `.mdx` file. It disappears from the blog index automatically.

---

## Now

**File:** `content/now.json` — GitHub web editor ✓

This single file drives both the **Currently widget on the home page** and the full **/now page**.

```json
{
  "updatedAt": "July 2025",

  "currently": {
    "reading": "Short one-liner for the home widget",
    "watching": "Short one-liner for the home widget",
    "building": "Short one-liner for the home widget",
    "listening": "Short one-liner for the home widget"
  },

  "building": [
    "Oyarzun.com — this very site",
    "A personal data lakehouse on AWS with dbt + Redshift"
  ],

  "reading": {
    "him": "Designing Data-Intensive Applications by Martin Kleppmann",
    "her": "The Data Warehouse Toolkit by Ralph Kimball"
  },

  "watching": [
    "Severance (Season 2) — This show is everything.",
    "The Bear (Rewatch) — Still stressful."
  ],

  "listening": ["Hozier", "Lord Huron", "Khruangbin"],

  "utahStatus": [
    "Ski season is HERE. Park City opening day was absolutely amazing.",
    "Planning a spring trip to Havasupai Falls in Arizona."
  ],

  "excitedAbout": [
    "dbt 1.9 features dropping this month",
    "Watching the Utah tech scene grow into something special",
    "Our first family ski trip with the kids this February"
  ]
}
```

### Tips

- **`updatedAt`** — update this whenever you edit the file so readers know it's fresh.
- **`currently.*`** — keep these short (under ~40 characters), they show as a single line on the home page.
- **Arrays** (`building`, `watching`, `listening`, `utahStatus`, `excitedAbout`) — add or remove items freely. Each item in the array becomes one bullet on the Now page.
- **`reading`** is structured differently because Tommy and Julia each get their own line. Change `him` and `her` separately.

---

## Footer

**File:** `components/layout/Footer.tsx` — GitHub web editor ✓

The footer has four columns: Brand, Site, Connect, and Family. Each is edited in a different part of the file.

---

### Tagline and description text

Find these two lines near the top of the `Footer` component:

```tsx
Built with ❤️ and data in Utah
```

```tsx
Personal site for Tommy Oyarzun and Julia Velicev. Data, mountains, and family life in the Wasatch.
```

Edit the text between the tags. Keep the tagline short (one line) and the description to 1–2 sentences.

---

### Site column (internal navigation links)

Find the `siteLinks` array at the top of the file:

```ts
const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Profiles", href: "/profiles" },
  { label: "Travels", href: "/travels" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Blog", href: "/blog" },
  { label: "Now", href: "/now" },
  { label: "Family Hub", href: "/family" },
];
```

- **To rename a link:** change the `label` value.
- **To remove a link:** delete the entire `{ label: ..., href: ... }` line.
- **To add a link:** add a new `{ label: "Name", href: "/path" }` entry. Don't change existing `href` values or the links will break.

---

### Connect column (social icons)

Each social link is an `<a>` tag inside the Connect column. Find the block that looks like:

```tsx
<a href="https://github.com/tjoyarzun" ...>
<a href="https://linkedin.com/in/tom-oyarzun" ...>
<a href="https://letterboxd.com/toyarzun" ...>
```

To update a URL, replace the value inside `href="..."`. Keep the rest of the tag (the `target`, `rel`, `aria-label`, and icon) intact.

---

### Family column (external family sites)

Find the "Col 4: Family sites" block. Each external link looks like:

```tsx
<a href="https://tomas.oyarzun.com" ...>
  Tomas Oyarzun
  <ExternalLink ... />
</a>
```

- **To update a URL:** replace the `href` value.
- **To rename the link text:** replace the text between `>` and `<ExternalLink`.
- **To add a family site:** copy one of the `<li>` blocks and paste it below. Update the `href` and link text.
- **To remove a site:** delete the entire `<li>...</li>` block.

---

### Bottom bar

The copyright line and "Made in Utah" badge are at the very bottom of the file:

```tsx
&copy; {new Date().getFullYear()} Oyarzun.com &middot; All rights reserved
```

```tsx
Made in Utah;
```

Edit the text directly. The year updates automatically via `new Date().getFullYear()` — don't touch that part.

---

## Uploading Photos

For any section where you want to use a real photo instead of a placeholder:

1. In GitHub, navigate to `public/images/` in the repo.
2. Click **Add file → Upload files** and drop your image in.
3. Reference it as `/images/your-filename.jpg` in any `imageUrl` or `coverImage` field.

**Tips:**

- Keep images under 1MB for fast load times. JPG is preferred over PNG for photos.
- If your photo is a HEIC (iPhone) or DNG (RAW), convert it to JPG first using the Mac Photos app (File → Export → Export 1 Photo → JPG).
- Name files clearly: `zermatt-ski-2023.jpg` not `IMG_4821.jpg`.
