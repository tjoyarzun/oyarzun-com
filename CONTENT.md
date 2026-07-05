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

---

## Home

The home page has three dynamic sections.

### Memory of the Day

**File:** `content/memory.json` — GitHub web editor ✓

```json
{
  "date": "November 14, 2024",
  "caption": "First snow of the season — Big Cottonwood Canyon",
  "imageUrl": "https://picsum.photos/seed/memory142/400/300"
}
```

| Field | What it does |
|---|---|
| `date` | The label shown below the photo (e.g. "July 4, 2025") |
| `caption` | The description shown below the date |
| `imageUrl` | Any public image URL. For a real photo, upload it to GitHub under `public/photos/` and use `/photos/your-file.jpg` |

### Currently Widget

**File:** `content/now.json` → the `"currently"` block — GitHub web editor ✓

```json
"currently": {
  "reading": "Designing Data-Intensive Applications",
  "watching": "Severance Season 2",
  "building": "Oyarzun.com",
  "listening": "Hozier — Unreal Unearth"
}
```

These are the four short one-liners shown in the home page sidebar. Keep them brief — they truncate if too long.

### Memory of the Day photo

To use a real photo, drop the image into `public/images/` in the repo and set `imageUrl` to `/images/your-filename.jpg`. See [Uploading Photos](#uploading-photos) for details.

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
export const goalsYear = "2025";
```

Update each goal's `current` and `pct` as you make progress. Change `goal` to reset a target:

```ts
export const goals = [
  { label: "Adventures", current: 0, goal: 20, pct: 0 },  // ← auto-counted, don't edit current/pct
  { label: "Ski Days",   current: 34, goal: 40, pct: 85 },
  { label: "Books Read", current: 24, goal: 30, pct: 80 },
  { label: "Blog Posts", current: 3,  goal: 5,  pct: 60 },
];
```

**Adventures is auto-counted** from your logged adventures for the current year — just update `goal` (the target). The `current` and `pct` fields for Adventures are ignored; they're computed at runtime.

For all other goals: update `current` as you make progress, and set `pct` to `Math.round(current / goal * 100)`.

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

### KPI Cards

The 4 stat cards pull from `dashboardStats` in `lib/data.ts`:

| Card | Field | Notes |
|---|---|---|
| GitHub Commits | `githubCommits` | Static fallback; overridden by live API on page load |
| Blog Posts | auto-counted | Counts entries in `blogPosts` array — no edit needed |
| Books Read | `booksRead2024` | Update manually each year |
| Countries Visited | `countriesVisited` | Update after each new country |

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

| Field | Notes |
|---|---|
| `author` | `"him"`, `"her"`, or `"both"` |
| `date` | `YYYY-MM-DD` format |
| `readTime` | Estimated minutes — count ~200 words/min |
| `tags` | Must be in the `["Tag One", "Tag Two"]` format. Tags appear as filter chips on the blog page. |
| `coverImage` | Any public image URL, or `/photos/your-image.jpg` from `public/photos/` |

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
    "reading":   "Short one-liner for the home widget",
    "watching":  "Short one-liner for the home widget",
    "building":  "Short one-liner for the home widget",
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

## Uploading Photos

For any section where you want to use a real photo instead of a placeholder:

1. In GitHub, navigate to `public/images/` in the repo.
2. Click **Add file → Upload files** and drop your image in.
3. Reference it as `/images/your-filename.jpg` in any `imageUrl` or `coverImage` field.

**Tips:**
- Keep images under 1MB for fast load times. JPG is preferred over PNG for photos.
- If your photo is a HEIC (iPhone) or DNG (RAW), convert it to JPG first using the Mac Photos app (File → Export → Export 1 Photo → JPG).
- Name files clearly: `zermatt-ski-2023.jpg` not `IMG_4821.jpg`.
