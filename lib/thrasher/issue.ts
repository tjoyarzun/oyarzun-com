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
  dashboardStats,
  skiResorts,
  travelStats,
} from "@/lib/data";
import { getAllPosts } from "@/lib/posts";

/** Days on snow, summed from the resort table rather than kept by hand. */
export const skiDays = skiResorts.reduce((sum, r) => sum + r.days, 0);

/** Published posts. Drafts are excluded — an unpublished post is not written. */
export const postsPublished = getAllPosts().filter((p) => !p.draft).length;

/**
 * The 2026 targets. Only the goal is a constant; every `current` is derived,
 * so a bar can never disagree with the department it sits next to.
 */
export const GOALS = [
  { label: "Ski days", current: skiDays, goal: 40 },
  { label: "Books", current: booksReadThisYear, goal: 20 },
  { label: "Written", current: postsPublished, goal: 5 },
  { label: "Adventures", current: adventures.length, goal: 20 },
] as const;

export const figures = {
  /** Seed value; the live figure comes from the GitHub API client-side. */
  githubCommits: dashboardStats.githubCommits,
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
