/* ═══════════════════════════════════════════════════════════════════════
   THE WORDS.

   lib/data.ts holds the FACTS — names, jobs, trips, books, skills.
   This file holds the WORDS — every headline, standfirst and caption that
   is written rather than counted.

   Why they are separate: a fact changes when the world changes, and a word
   changes when you change your mind about how to say it. Keeping the two
   apart means you can rewrite this whole file without any risk of breaking
   a figure, and edit lib/data.ts without touching a sentence.

   ── HOW TO EDIT THIS FILE ────────────────────────────────────────────────

   It is TypeScript, but you only ever change the text between the quotes.
   You can do it in GitHub's web editor — click the pencil, edit, commit.
   Vercel builds the preview automatically.

   Two rules and nothing else:

     1. Keep the quotes and the commas. If you delete a quote the build
        fails with a clear error naming this file and the line — nothing
        reaches the live site broken.
     2. Anything in {curly braces} is a live figure, filled in at build
        time from lib/data.ts. Move it, delete it, or use it twice — but do
        not rename it. `{nights}` works; `{Nights}` prints literally.

   Available figures, and where they come from:

     {commits}    GitHub contributions, last 52 weeks (live, from the API)
     {nights}     nights away this year        — sum of `adventures`
     {countries}  countries visited            — distinct in `adventures`
     {adventures} trips logged                 — length of `adventures`
     {skiDays}    days on snow                 — sum of `skiResorts`
     {resorts}    resorts skied                — length of `skiResorts`
     {books}      books finished this year     — sum of `booksPerQuarter`
     {posts}      posts published              — files in content/posts/
     {postsGoal}  the 2026 writing target
     {slotsOpen}  postsGoal minus posts

   Write **two asterisks** around a phrase to set it bold. Nothing else in
   the text is interpreted — no HTML, no links. If you need a link, that is
   a code change; ask for one.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── The shapes ─────────────────────────────────────────────────────────
   Declared so the editor autocompletes the field names and the build tells
   you if you misspell one, rather than silently rendering nothing. You do
   not need to read this section to edit the copy below. */

/** A figure tile: `value` may be a {token} or plain words. */
interface FigureTile {
  value: string;
  label: string;
  /** Reversed out in vermilion. At most one per strip. */
  highlight?: boolean;
}

/** What every department has. */
interface DeptBase {
  folio: string;
  name: string;
  deptKicker: string;
  kicker: string;
  headline: string;
  dek: string[];
  stats: string[];
}

/* Each department then declares only its own extra fields, so the build
   catches a field put in the wrong block instead of rendering nothing. */
interface CoverDept extends DeptBase {
  coverTitle: string[];
  coverBlurb: string;
  figures: FigureTile[];
}
interface TwoDept extends DeptBase {
  teaseLabel: string;
  teaseBlurb: string;
  teaseCta: string;
  overlapYears: string[];
  overlapText: string;
  overlapStats: string[];
}
interface NowDept extends DeptBase {
  /** The date the rows in `nowRows` were last true. Change both together. */
  updated: string;
}
interface WrittenDept extends DeptBase {
  indexTitle: string;
  emptyTitle: string;
  emptyFirstBlurb: string;
}

interface NowRow {
  label: string;
  headline: string;
  text: string;
}

interface NowGroup {
  title: string;
  right: string;
  rows: NowRow[];
}

/** A screened photograph. See the notes above `plates` before touching crop. */
interface PlateCopy {
  src: string;
  title?: string;
  detail?: string;
  crop: string;
  gamma?: number;
  /** true = a stand-in, and the caption says so on the page. */
  placeholder?: boolean;
}

/* ── The issue itself ───────────────────────────────────────────────────
   Shown in the running head at the top of every page and in the bar at
   the foot of it. Bump `number` when the design changes enough to be a new
   issue; bump `dateline` whenever you like. */
export const issue = {
  number: "04",
  dateline: "Sep 2026",
  /* The line in the middle of the running head on the home page. */
  strapline: "Two subjects · six departments · one issue",
  /* Written once. `place` is composed from it — they were two literals
     carrying the same number. */
  elevation: "4,505 ft",
  domain: "oyarzun.com",
  /** The copyright year. Computed, so the footer never needs editing. */
  year: new Date().getFullYear(),
};

/* ── The departments ────────────────────────────────────────────────────
   One entry per section of the one scroll, in reading order.

     name        the department's name — appears in the bar, the running
                 head as you scroll, and the nav
     deptKicker  the small line on the right of the department bar
     kicker      the small line above the big headline
     headline    THE BIG WORD. It is force-justified to the full width of
                 the page, so length changes its size, not the layout.
                 One or two words works best; four is the practical limit.
     dek         the standfirst under the headline. One or two short
                 paragraphs — each string is its own paragraph.
     stats       the small right-hand column beside the dek. One string
                 per line. Three lines is the house style.

   A note on `headline`: keep a live {figure} OUT of it. A headline that
   changes value re-fits the type and re-flows the whole department every
   time the number moves — which is why 04 is "Fernweh" and not "18
   nights". Put the count in `deptKicker` instead, where it can grow
   without moving anything. */
export const departments: {
  cover: CoverDept;
  two: TwoDept;
  counted: DeptBase;
  away: DeptBase;
  now: NowDept;
  written: WrittenDept;
} = {
  cover: {
    folio: "01",
    name: "Cover",
    deptKicker: "Issue {issueNumber} · {dateline}",
    kicker: "Tommy and Julia · Sandy, Utah",
    headline: "Oyarzun",
    dek: [
      "Tommy runs analytics at Domo. Julia engineers data at SeekWell. We met " +
        "at Overstock and never left Utah. Everything on this page was " +
        "counted, not guessed at.",
    ],
    stats: [
      "Issue {issueNumber} · {dateline}",
      "{elevation} above sea level",
      "Printed in one ink",
    ],
    /* The type reversed out over the cover photograph. Two lines. */
    coverTitle: ["Two of us,", "mostly outside"],
    coverBlurb:
      "We both work with data and live at the bottom of the Wasatch. The rest " +
      "of the time we are somewhere else, and we write down where.",
    /* The four figures under the cover. `value` may be a {figure} or plain
       text — "None" below is deliberately a word, not a number. */
    figures: [
      { value: "{commits}", label: "Github commits" },
      { value: "{nights}", label: "Nights away, 2026" },
      { value: "{skiDays}", label: "Days on snow" },
      /* The highlighted tile. Was "None / Analytics on this site"; now a
         fourth real figure, derived like the other three. */
      { value: "{books}", label: "Books read, {year}", highlight: true },
    ],
  },

  two: {
    folio: "02",
    name: "The two of us",
    deptKicker: "The feature · full spread at /us",
    kicker:
      "{YearsHimWord} years and {yearsHerWord} years, {overlapYearsWord} of " +
      "them in the same building",
    headline: "The two of us",
    dek: [
      "{YearsHimWord} years of analytics and {yearsHerWord} of data " +
        "engineering. {OverlapYearsWord} of those years were spent in the same " +
        "building, on different floors, before either of us thought to " +
        "mention it.",
    ],
    stats: ["{himLine}", "{herLine}", "Both in Sandy, Utah"],
    /* The band at the foot of the teaser that sends you to /us. */
    teaseLabel: "The full spread",
    teaseBlurb:
      "Both stacks on the same {axes} axes, careers in full, every project, the " +
      "commit year, and the certificate at reproduction size.",
    teaseCta: "Read the feature",
    /* The vermilion band across both columns.
       Derived: the years, the span and the company all come out of the two
       `career` arrays in lib/data.ts, so correcting a date on either job
       moves this band with it. They were four separate literals before. */
    overlapYears: ["{overlapFrom}", "–{overlapTo}"],
    overlapText:
      "**Same company, {overlapYears} years, different floors.** He was " +
      "Manager of BI Development at {overlapCompany} while she was growing " +
      "from BI Developer to Manager of Data Engineering there.",
    overlapStats: ["{overlapCompany}", "Midvale, Utah", "The overlap"],
  },

  counted: {
    folio: "03",
    name: "Counted",
    deptKicker: "1 Jan – 10 Sep 2026",
    kicker: "Every figure derived from the array behind it",
    headline: "Counted",
    dek: [
      "Every figure on this panel is computed from the array behind it, and " +
        "every sparkline from the same array as the figure above it. Where " +
        "two numbers could disagree, one is derived from the other so they " +
        "can’t.",
    ],
    stats: [
      "Panel updated on build",
      "Commits live from the API",
      "Nothing estimated",
    ],
  },

  away: {
    folio: "04",
    name: "Fernweh",
    deptKicker: "{adventures} adventures · {countries} countries · {nights} nights",
    kicker: "Fernweh · the ache to be somewhere far off",
    headline: "Fernweh",
    dek: [
      "German. The ache to be somewhere far off — the opposite of " +
        "homesickness, and the more honest word for what a route chart is for.",
      "{adventures} adventures, {countries} countries, {nights} nights so " +
        "far this year. Every figure derived from the log below, so adding a " +
        "trip updates all of them.",
    ],
    stats: [
      "{countryList}",
      "{adventures} adventures logged",
      "{skiDays} ski days, separately",
    ],
  },

  now: {
    /* Last in the issue. It closes the scroll because it is the only
       department that is deliberately short-lived — everything above it is a
       record, and this is a snapshot with a date on it. */
    folio: "06",
    name: "Right now",
    /* Change this date whenever you change the rows in `nowRows` below. It
       is the whole point of a /now page that the date is honest. */
    updated: "10 September 2026",
    deptKicker: "Updated {updated}",
    kicker: "What we are actually doing this month",
    headline: "Right now",
    dek: [
      "What we are actually doing this month, kept short enough that it " +
        "stays true. Last edited {updated}.",
    ],
    stats: ["Updated monthly", "Sandy, Utah", "Not a changelog"],
  },

  written: {
    folio: "05",
    name: "Written",
    deptKicker: "{posts} posts · {postsGoal} for 2026",
    kicker:
      "{PostsWord} posts · {authorsWord} authors · each with its own address",
    headline: "Written",
    dek: [
      "{posts} posts so far against a target of {postsGoal}. Each one is its " +
        "own page with its own address, because a post you cannot link to is " +
        "not published.",
    ],
    stats: [
      "{posts} published · {drafts} in draft",
      "next-mdx-remote",
      "/written/<slug>",
    ],
    /* The index at the foot of the department. */
    indexTitle: "Everything written",
    emptyTitle: "Unwritten",
    emptyFirstBlurb:
      "Next up. The slots are drawn so the gap to the 2026 goal is part of " +
      "the list rather than a claim above it.",
  },
};

/* ── The issue's running order ──────────────────────────────────────────
   ONE list, read by the nav at the top and the sitemap in the footer. They
   were separate arrays, which is how a nav and a footer quietly stop
   agreeing about what the site contains.

   `jump` scrolls down the one scroll; `go` leaves for a real route. Folio
   numbers come from `departments` above rather than being repeated here. */
export interface SiteMapEntry {
  key: keyof typeof departments;
  kind: "jump" | "go";
  /** "#counted" for a jump, "/us" for a route. */
  href: string;
}

export const runningOrder: SiteMapEntry[] = [
  { key: "cover", kind: "jump", href: "#cover" },
  { key: "two", kind: "go", href: "/us" },
  { key: "counted", kind: "jump", href: "#counted" },
  { key: "away", kind: "jump", href: "#away" },
  { key: "written", kind: "jump", href: "#written" },
  { key: "now", kind: "jump", href: "#now" },
];

/* ── The footer ─────────────────────────────────────────────────────────
   Links out, and the two family sites. Edit these freely; the sitemap
   column builds itself from `runningOrder` above. */
export const footer = {
  blurb:
    "Personal site for Tommy Oyarzun and Julia Velicev. Data, mountains and " +
    "family life in the Wasatch.",
  place: "Sandy, Utah",
  /** External family sites. Add an entry and a row appears. */
  family: [
    { label: "Tomas Oyarzun", href: "https://tomas.oyarzun.com" },
    { label: "The Housekeeper", href: "https://www.thehousekeeper.biz" },
  ],
  rights: "All rights reserved",
};

/* ── Right now: the rows ────────────────────────────────────────────────
   THIS IS THE FILE TO EDIT MONTHLY. It replaces what used to be
   content/now.json.

   Three groups — him, her, both. Each row is a label, a bold headline, and
   a sentence. Add, remove or reorder rows freely; four per group reads
   well, and more than six starts to feel like a changelog rather than a
   snapshot.

   When you change anything here, change `departments.now.updated` too. */
export const nowRows: Record<"him" | "her" | "both", NowGroup> = {
  him: {
    title: "Him",
    right: "Tommy · Manager, Analytics",
    rows: [
      {
        label: "Working on",
        headline: "Marketing analytics at Domo",
        text:
          "Building the team out and running experiments against the Gated " +
          "Free Trial funnel.",
      },
      {
        label: "Building",
        headline: "Dimple Dell in WebGL",
        text:
          "A walkable model of the house, generated from the architect’s CAD " +
          "rather than modeled by hand.",
      },
      {
        label: "Reading",
        headline: "Do Androids Dream of Electric Sheep?",
        text: "{books} books finished this year against a target of {booksGoal}.",
      },
      {
        label: "Skiing",
        headline: "{topResort}, mostly",
        text: "{topResortDays} days there last season out of {skiDays} total.",
      },
    ],
  },
  her: {
    title: "Her",
    right: "Julia · Data Engineer III",
    rows: [
      {
        label: "Working on",
        headline: "Pipelines at SeekWell",
        text: "Hybrid out of Draper. Warehouse modeling and high-volume SQL.",
      },
      {
        label: "Speaking",
        headline: "Tech Moms",
        text:
          "On navigating data engineering without a CS degree or a Silicon " +
          "Valley on-ramp.",
      },
      {
        label: "Recognized",
        headline: "Influential Women, 2026",
        text: "Verified. The certificate is on her profile at /us.",
      },
      {
        label: "Volunteering",
        headline: "Wasatch Community Gardens",
        text: "Which is the same job as mentoring, with dirt.",
      },
    ],
  },
  both: {
    title: "Both",
    right: "Next up",
    rows: [
      {
        label: "Travelling",
        headline: "Nothing booked",
        /* The places are derived too. Naming them by hand meant a fifth
           trip made the sentence wrong beside a correct {nights}, and no
           check could see it — city names are not numbers. */
        text: "{nights} nights away already this year — {tripCities}.",
      },
      {
        label: "Writing",
        headline: "{posts} of {postsGoal}",
        text: "{posts} posts published against the 2026 goal. {slotsOpen} slots open.",
      },
    ],
  },
};

/* ── The photographs ────────────────────────────────────────────────────
   Every screened photograph on the site, in one place.

   To swap a picture: put the file in public/images/ and change `src`.
   That part is a genuine one-line edit.

   `crop` is NOT a one-line edit. It is "across,down,zoom" as fractions —
   0.5,0.5,1 means centered and full-frame; 0.24,0.44,0.34 means 24% across,
   44% down, at a 34% zoom. You cannot get it right by reading it; open the
   Vercel preview and nudge. One quirk worth knowing: when the frame is
   WIDER than the photograph, the across value does nothing at all — only
   down and zoom move the picture.

   `gamma` is the tone curve, and it is counter-intuitive: RAISING it makes
   a dark-on-light plate LIGHTER, because the number controls ink coverage
   rather than darkness. Leave it at 1 unless a plate looks muddy.

   The images must live in public/images/ — a photograph on someone else's
   server cannot be screened at all, because the browser will not let the
   halftone engine read pixels it fetched from another domain. */
export const plates: Record<string, PlateCopy> = {
  cover: {
    src: "/images/costa_rica.jpg",
    title: "Tommy and Julia, Costa Rica",
    detail: "Rio Celeste, Costa Rica · 2026",
    /* Both faces sit in the upper-left of this frame, which is where they
       have to be: the type block reverses out over the lower-left third.
       cy 0.72 lifts them clear of it. The source is 4:3 and the plate is
       2.35:1, so the crop is vertical only — cx does nothing here. */
    crop: "0.5,0.72,1.0",
    placeholder: false,
  },
  portraitHim: {
    src: "/images/tommy_amsterdam.jpg",
    detail: "Amsterdam · 2026",
    /* Matched to hers by eye, not by arithmetic: the two photographs are
       different shapes, so the same numbers give different results. What is
       matched is the share of the frame each head takes up. The frame is
       1.28:1 and the source is 3:4, so the crop is vertical — the middle
       number aims it and the first one does nothing at this zoom. */
    crop: "0.5,0.20,0.72",
    placeholder: false,
  },
  portraitHer: {
    src: "/images/julia_smile.jpg",
    detail: "Julia Velicev · 2026",
    crop: "0.5,0.5,1.0",
    placeholder: false,
  },
  bucketTahiti: {
    src: "/images/tahiti.jpg",
    title: "Tahiti · French Polynesia",
    detail: "On the list · we do love beaches",
    crop: "0.5,0.5,1.0",
    placeholder: false,
  },
  bucketUintas: {
    src: "/images/summit-selfie.jpg",
    title: "The Uintas · Utah",
    detail: "On the list",
    crop: "0.68,0.5,0.5",
    placeholder: true,
  },
};

/* ── The family album ───────────────────────────────────────────────────
   Twenty frames behind the gate on /family. Add paths here and the wall
   grows; the crops are chosen automatically and stay the same between
   builds, so a rebuild never reshuffles the wall.

   These are placeholders — three files repeated. */
/**
 * How many frames the album draws. One constant, three consumers — the
 * gallery itself, the "N photographs" credit line, and the locked headline.
 *
 * Declared here rather than in lib/thrasher/issue.ts because the gallery is
 * drawn client-side and that module reaches lib/posts.ts, which uses `fs`.
 * This file imports nothing, which is what makes it safe on both sides.
 */
export const GALLERY_FRAMES = 20;

export const gallery: string[] = [
  "/images/switzerland-dock.jpg",
  "/images/summit-selfie.jpg",
  "/images/dimple-dell-3d.jpg",
];

/* ── The gate ───────────────────────────────────────────────────────────
   ⚠️ The password box checks NOTHING. Anyone who presses Enter gets in.
   The album is kept private by two things that do work: the page tells
   search engines not to index it, and the address is not published. Do not
   describe this gate to anyone as protecting the photographs. */
export const family = {
  kicker: "For family · not indexed, not shared",
  headline: "Private",
  dek: [
    "This section is for family. Nothing behind it is indexed and nothing " +
      "is shared.",
  ],
  stats: ["Password required", "{frames} photographs", "noindex, nofollow"],
  gateHeadline: ["Password", "required"],
  gateText:
    "Ask either of us. There is no reset link and no account to make, " +
    "because there is no account.",
  lockedHeadline: ["{frames}", "frames"],
  lockedText:
    "Behind the gate. Nothing here is indexed and nothing is shared.",
};

/* ── /us, the full spread ───────────────────────────────────────────────
   The dedicated feature page. `stats` follows the same three-line house
   style as a department. */
export const us = {
  kicker:
    "{YearsHimWord} years and {yearsHerWord} years, {overlapYearsWord} of " +
    "them in the same building",
  headline: "The two of us",
  dek: [
    "{YearsHimWord} years of analytics and {yearsHerWord} of data " +
      "engineering. {OverlapYearsWord} of those years were spent in the same " +
      "building, on different floors, before either of us thought to " +
      "mention it.",
    "Both stacks below are plotted on the same {axes} axes, so the two shapes " +
      "mean the same thing. Everything on this page comes out of one file.",
  ],
  stats: [
    "{himLine}",
    "{herLine}",
    "{commits} commits · {yearsTotal} years between us",
  ],
  overlapText:
    "**Same company, {overlapYears} years, different floors.** He was " +
    "Manager of BI Development at {overlapCompany} while she was growing " +
    "from BI Developer to Manager of Data Engineering there. Her tenure ran " +
    "to {herTenureTo} — {herTenureYears} years in all.",
  overlapStats: ["{overlapCompany}", "Midvale, Utah", "The overlap"],
  backLabel: "Back to the issue",
};
