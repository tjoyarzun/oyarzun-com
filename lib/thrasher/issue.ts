/* ═══════════════════════════════════════════════════════════════════════
   The issue's figures, derived once.

   The masthead copy claims that "where two numbers could disagree, one of
   them is computed from the other so they can't." This module is what makes
   that true: every headline figure in the issue is computed here from the
   arrays in lib/data.ts, and no department hard-codes a number.

   It exists because the alternative had already failed. `goals` in
   lib/data.ts still carries hand-kept values that contradict the arrays
   beside it — Adventures 0 against four logged adventures, Ski Days 0
   against a table totalling 37, Blog Posts 3 against two .mdx files. Those
   are the stale figures this file replaces at the point of use.
   ═══════════════════════════════════════════════════════════════════════ */

import {
  adventures,
  booksReadThisYear,
  goals,
  skiResorts,
  travelStats,
} from "@/lib/data";
import { getAllPosts } from "@/lib/posts";
import { GALLERY_FRAMES } from "@/lib/copy";

/** Days on snow, summed from the resort table rather than kept by hand. */
export const skiDays = skiResorts.reduce((sum, r) => sum + r.days, 0);

/** Published posts. Drafts are excluded — an unpublished post is not written. */
export const postsPublished = getAllPosts().filter((p) => !p.draft).length;

/**
 * The 2026 targets and where we are against them.
 *
 * The TARGET comes from `goals` in lib/data.ts, so raising a goal is an edit
 * to the documented facts file rather than to this one. The label the site
 * prints is set here, because it is display copy — data.ts says "Blog Posts"
 * and the department is called Written.
 *
 * Every `current` is DERIVED. That is the whole point: `goals` in data.ts
 * also carries hand-kept `current` values, and they had already drifted to
 * 0 adventures against four logged and 3 posts against two files.
 */
const target = (label: string, fallback: number): number =>
  goals.find((g) => g.label === label)?.goal ?? fallback;

export const GOALS = [
  { label: "Ski days", current: skiDays, goal: target("Ski Days", 40) },
  { label: "Books", current: booksReadThisYear, goal: target("Books Read", 20) },
  { label: "Written", current: postsPublished, goal: target("Blog Posts", 5) },
  { label: "Adventures", current: adventures.length, goal: target("Adventures", 20) },
] as const;

/** The writing target, used by the copy tokens {postsGoal} and {slotsOpen}. */
export const postsGoal = target("Blog Posts", 5);

export const figures = {
  nightsAway: travelStats.nightsAway,
  countriesVisited: travelStats.countriesVisited,
  adventuresLogged: adventures.length,
  skiDays,
  skiResortCount: skiResorts.length,
  booksReadThisYear,
  postsPublished,
};

export function pct(current: number, goal: number): number {
  return goal ? Math.min(100, (current / goal) * 100) : 0;
}

/** `2026 · 05 · 23` — the issue's dateline form. */
export function dateline(iso: string): string {
  return iso.replaceAll("-", " · ");
}

/** `23 May 2026` */
export function longDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Resolve a plate source that the halftone engine can actually screen.
 *
 * The engine calls getImageData(), which throws SecurityError on a canvas
 * tainted by a cross-origin draw — so a remote URL cannot be screened, full
 * stop. next/image does not help: it would proxy the bytes through
 * /_next/image on our own origin, but the plate is a <canvas> drawing a raw
 * <img>, not a next/image, so the optimiser never enters the picture.
 *
 * Both blog covers in content/posts/*.mdx are currently remote (unsplash and
 * deepdreamgenerator). Until they are downloaded into public/images/ this
 * substitutes a same-origin stand-in and reports that it did, so the gap is
 * visible in the page rather than silently blank.
 */
const PLATE_STANDIN = "/images/switzerland-dock.jpg";

export function plateSource(src: string): {
  src: string;
  placeholder: boolean;
} {
  const remote = /^https?:\/\//.test(src);
  return remote
    ? { src: PLATE_STANDIN, placeholder: true }
    : { src, placeholder: false };
}

/* ═══════════════════════════════════════════════════════════════════════
   The shared skill axes.

   His `skills` array has ten entries, hers nine, and they only partly
   overlap. Plotting each against its own axes would give two radars that
   look comparable and are not — the same shape would mean different things.
   So the axis set is the union, in one fixed order, and a skill someone does
   not list plots as zero on that axis.

   Ordered by combined proficiency, so the axes both of them are strong on
   lead and the polygon reads clockwise from its widest point.
   ═══════════════════════════════════════════════════════════════════════ */

import { profiles } from "@/lib/data";

export interface Axis {
  skill: string;
  value: number;
}

/** Corrects the typo that sits in both arrays in lib/data.ts. */
function label(skill: string): string {
  return skill.replace("Cluade", "Claude");
}

/** Shorter labels, so a ten-axis radar does not collide with itself. */
const SHORTEN: Record<string, string> = {
  "Cloud (Databricks/GCP)": "Cloud",
  "Tableau/Looker": "Tableau",
  "AI (Claude/Gemini)": "AI",
  "Apache Spark": "Spark",
  "Data Modeling": "Modeling",
};

export const SKILL_AXES: string[] = (() => {
  const total = new Map<string, number>();
  [profiles.him, profiles.her].forEach((p) =>
    p.skills.forEach((s) => {
      const k = label(s.skill);
      total.set(k, (total.get(k) ?? 0) + s.value);
    }),
  );
  return Array.from(total.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([k]) => k);
})();

/** One person's values, in the shared axis order. Absent skill = 0. */
export function axesFor(who: "him" | "her"): Axis[] {
  const mine = new Map(
    profiles[who].skills.map((s) => [label(s.skill), s.value]),
  );
  return SKILL_AXES.map((skill) => ({
    skill: SHORTEN[skill] ?? skill,
    value: mine.get(skill) ?? 0,
  }));
}

/* ═══════════════════════════════════════════════════════════════════════
   The rest of the derived figures.

   Everything below was a literal somewhere — in a component, or worse, spelt
   out in words inside a sentence in lib/copy.ts, where nothing would ever
   catch it going stale. "19 years between us" was simply wrong: the two
   profiles say twelve and ten.
   ═══════════════════════════════════════════════════════════════════════ */

/** Posts written but not published. Printed as "N published · M in draft". */
export const draftCount = getAllPosts().filter((p) => p.draft).length;

/** Distinct authors among the published posts. */
export const authorCount = new Set(
  getAllPosts()
    .filter((p) => !p.draft)
    .map((p) => p.author),
).size;

/** Years in the field, each and combined. */
export const yearsHim = profiles.him.yearsExperience;
export const yearsHer = profiles.her.yearsExperience;
export const yearsTotal = yearsHim + yearsHer;

/**
 * Where the two careers overlap, worked out from the two `career` arrays.
 *
 * Was four separate literals — "2014", "–2019", "five years" and "nine
 * years" — spread across two copy blocks, describing data that is sitting
 * right there in lib/data.ts. Change a date on either career entry and the
 * overlap band now follows it.
 *
 * `years` strings are "2014–2019" or "2025–Present"; Present means today.
 */
function span(years: string): [number, number] | null {
  const m = years.match(/(\d{4})\s*[–-]\s*(\d{4}|Present)/i);
  if (!m) return null;
  const to =
    m[2].toLowerCase() === "present" ? new Date().getFullYear() : Number(m[2]);
  return [Number(m[1]), to];
}

export const overlap = (() => {
  for (const a of profiles.him.career) {
    const b = profiles.her.career.find((e) => e.company === a.company);
    if (!b) continue;
    const sa = span(a.years);
    const sb = span(b.years);
    if (!sa || !sb) continue;
    const from = Math.max(sa[0], sb[0]);
    const to = Math.min(sa[1], sb[1]);
    if (to <= from) continue;
    return {
      company: a.company,
      from,
      to,
      /** Years the two were there together. */
      shared: to - from,
      /** Her full tenure, which runs past his. */
      herFrom: sb[0],
      herTo: sb[1],
      herYears: sb[1] - sb[0],
      hisTitle: a.title,
      herTitle: b.title,
    };
  }
  return null;
})();

/** Re-exported so the token table has one import for its figures. */
export { GALLERY_FRAMES };
