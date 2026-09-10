import type { ReactNode } from "react";
import {
  CURRENT_YEAR,
  adventuresThisYear,
  goals,
  profiles,
  skiResorts,
} from "@/lib/data";
import {
  GALLERY_FRAMES,
  SKILL_AXES,
  authorCount,
  draftCount,
  figures,
  overlap,
  postsGoal,
  yearsHer,
  yearsHim,
  yearsTotal,
} from "@/lib/thrasher/issue";
import { issue, departments } from "@/lib/copy";

/* ═══════════════════════════════════════════════════════════════════════
   Filling the copy in lib/copy.ts.

   The problem this solves: a sentence like "18 nights so far this year" has
   to be BOTH hand-editable and live. Put the literal in the copy file and it
   goes stale the next time a trip is logged; put a template function there
   and the file stops being something you can edit in a browser.

   So the copy carries {tokens} and this fills them. You can rewrite the
   sentence around a token, move it, drop it, or use it twice, and the figure
   stays correct — because it is still coming from the array.

   The token table below is the contract. It is duplicated as prose in the
   header of lib/copy.ts, which is the file a human actually reads; if you
   add a token, add it there too.
   ═══════════════════════════════════════════════════════════════════════ */

const goalOf = (label: string, fallback: number) =>
  goals.find((g) => g.label === label)?.goal ?? fallback;

function tokens(): Record<string, string> {
  const { him, her } = profiles;
  /* The reporting year's countries, in the order first visited, printed as
     the credit line under the Fernweh masthead. */
  const countries = Array.from(
    new Set(adventuresThisYear.map((a) => (a.country ?? "USA").trim())),
  );
  const topResort = [...skiResorts].sort((a, b) => b.days - a.days)[0];
  return {
    /* Placeholder only. Every page that prints {commits} passes the real
       figure through fill()'s second argument, fetched on the server by
       lib/github.ts. An em dash rather than a number, so a page that forgets
       to pass it shows an obvious gap instead of a plausible lie. */
    commits: "—",
    nights: String(figures.nightsAway),
    countries: String(figures.countriesVisited),
    adventures: String(figures.adventuresLogged),
    skiDays: String(figures.skiDays),
    resorts: String(figures.skiResortCount),
    books: String(figures.booksReadThisYear),
    posts: String(figures.postsPublished),
    postsGoal: String(postsGoal),
    slotsOpen: String(Math.max(0, postsGoal - figures.postsPublished)),
    drafts: String(draftCount),
    authors: String(authorCount),

    /* the two of us */
    yearsHim: String(yearsHim),
    yearsHer: String(yearsHer),
    yearsTotal: String(yearsTotal),
    axes: String(SKILL_AXES.length),
    placeHim: him.place,
    placeHer: her.place,

    /* the overlap, worked out from the two career arrays */
    overlapCompany: overlap?.company ?? "—",
    overlapFrom: overlap ? String(overlap.from) : "—",
    overlapTo: overlap ? String(overlap.to) : "—",
    overlapYears: overlap ? String(overlap.shared) : "—",
    herTenureTo: overlap ? String(overlap.herTo) : "—",
    herTenureYears: overlap ? String(overlap.herYears) : "—",

    /* targets, so a sentence quoting one cannot drift from its gauge */
    booksGoal: String(goalOf("Books Read", 20)),
    skiGoal: String(goalOf("Ski Days", 40)),
    adventuresGoal: String(goalOf("Adventures", 20)),

    /* odds and ends that were literals in prose */
    frames: String(GALLERY_FRAMES),
    topResort: topResort?.name ?? "—",
    topResortDays: topResort ? String(topResort.days) : "—",

    /* composed from lib/data.ts, so a job change is one edit there */
    himLine: `${him.name} · ${him.title}, ${him.company}`,
    herLine: `${her.name} · ${her.title}, ${her.company}`,
    countryList: countries.join(" · "),
    year: String(CURRENT_YEAR),
    earlier: String(figures.adventuresEarlier),

    /* the issue's own furniture */
    issueNumber: issue.number,
    dateline: issue.dateline,
    elevation: issue.elevation,
    updated: departments.now.updated,
  };
}

/**
 * Replace every {token} in a string.
 *
 * An unknown token is left exactly as written rather than blanked. That is
 * deliberate: `{Nights}` printing literally on the page is a mistake you see
 * immediately in the preview, whereas silently dropping it would leave a
 * sentence that reads fine and says the wrong thing.
 */
/* ── spelled-out numbers ─────────────────────────────────────────────────
   A masthead kicker reads better as "Twelve years and ten years" than as
   "12 years and 10 years", and the design uses words throughout the deks.
   That was the excuse for leaving those figures hard-coded — and it made
   "Twelve years of analytics" a sentence that would quietly be wrong the
   year Tommy's experience ticks over.

   So any token name ending in `Word` spells out the numeric token of the
   same base name: {yearsHim} gives "12", {yearsHimWord} gives "twelve".
   Generic on purpose, so a new figure needs no new token to be writable in
   words. Capitalised if it starts the sentence, which the caller signals by
   writing the token capitalised: {YearsHimWord}. */
const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty",
  "ninety",
];

export function spellOut(n: number): string {
  if (!Number.isFinite(n) || n < 0 || n % 1 !== 0) return String(n);
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = TENS[Math.floor(n / 10)];
    const o = n % 10;
    return o ? `${t}-${ONES[o]}` : t;
  }
  /* Above ninety-nine, digits read better than words anyway. */
  return n.toLocaleString();
}

export type Runtime = Record<string, string | number>;

export function fill(text: string, runtime?: Runtime): string {
  const t = tokens();
  const lookup = (key: string): string | undefined => {
    /* Runtime values win: they are the ones fetched per request — the commit
       figure from lib/github.ts — and the static table only carries a
       placeholder for them. */
    if (runtime && key in runtime) return String(runtime[key]);
    return key in t ? t[key] : undefined;
  };

  return text.replace(/\{(\w+)\}/g, (whole, key: string) => {
    const direct = lookup(key);
    if (direct !== undefined) return direct;

    /* {somethingWord} — spell out {something}. Handles a capitalised token
       for sentence-initial use. */
    const m = key.match(/^([A-Za-z]\w*?)Word$/);
    if (m) {
      const base = m[1];
      const raw =
        lookup(base) ?? lookup(base.charAt(0).toLowerCase() + base.slice(1));
      if (raw !== undefined) {
        const word = spellOut(Number(raw.replace(/,/g, "")));
        return /^[A-Z]/.test(key) ? word.charAt(0).toUpperCase() + word.slice(1) : word;
      }
    }
    return whole;
  });
}

export function fillAll(lines: readonly string[], runtime?: Runtime): string[] {
  return lines.map((l) => fill(l, runtime));
}

/**
 * Fill a string and render **double asterisks** as bold.
 *
 * Deliberately not a markdown parser and deliberately not
 * dangerouslySetInnerHTML — the copy file is meant to be safely editable by
 * hand, and the smallest thing that supports the one bit of emphasis the
 * design actually uses is a split on the delimiter. Everything else in the
 * text stays text, so a stray `<` or `&` in a sentence can never become
 * markup.
 */
export function rich(text: string, runtime?: Runtime): ReactNode {
  return fill(text, runtime)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <b key={i}>{part.slice(2, -2)}</b>
      ) : (
        part
      ),
    );
}

/** The right-hand credit column: one string per line, tokens filled. */
export function lines(src: readonly string[], runtime?: Runtime): ReactNode {
  return fillAll(src, runtime).map((l, i) => (
    <span key={i}>
      {i > 0 ? <br /> : null}
      {l}
    </span>
  ));
}
