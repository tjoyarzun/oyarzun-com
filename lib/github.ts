import { cache } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   The one place that talks to GitHub.

   Everything that prints a commit figure or draws commit activity reads from
   here, and it is fetched on the SERVER. That matters: the figure used to be
   a literal in lib/data.ts (`githubCommits: 1203`) rendered into the HTML and
   then overwritten client-side once the real number arrived. So the page
   shipped 1,203 in three places when the true figure was around 150 — wrong
   in the HTML, wrong in a share preview, wrong with JavaScript off, and
   briefly wrong on every load before the patch landed.

   `cache()` dedupes within a single render pass, so three components asking
   for the figure make one call. `next.revalidate` caches across requests, so
   the GitHub API sees one request a day rather than one per visitor.

   No fallback figure. If the request fails, `ok` is false and every consumer
   says so — a plausible-looking wrong number is worse than an honest gap,
   which is the whole reason this file exists.
   ═══════════════════════════════════════════════════════════════════════ */

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

/** One day. The contribution calendar changes at most daily in practice. */
const REVALIDATE_SECONDS = 86400;

const CONTRIBUTION_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { contributionCount date } }
        }
      }
    }
  }
`;

export interface Contributions {
  ok: boolean;
  /** Total contributions in the last 52 weeks. */
  total: number;
  /** One level per day, 0–4, oldest first. */
  levels: number[];
  /** ISO dates parallel to `levels`. */
  dates: string[];
  /** Why it failed, for the caption to print rather than hide. */
  reason?: string;
}

const EMPTY: Contributions = { ok: false, total: 0, levels: [], dates: [] };

/** 0–4, the same buckets GitHub's own calendar uses. */
function countToLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

export const getContributions = cache(
  async (username: string): Promise<Contributions> => {
    const token = process.env.GITHUB_TOKEN;
    if (!username) return { ...EMPTY, reason: "no username" };
    if (!token) return { ...EMPTY, reason: "GITHUB_TOKEN not configured" };

    const to = new Date();
    const from = new Date(to);
    from.setFullYear(from.getFullYear() - 1);

    try {
      const res = await fetch(GITHUB_GRAPHQL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: CONTRIBUTION_QUERY,
          variables: {
            username,
            from: from.toISOString(),
            to: to.toISOString(),
          },
        }),
        next: { revalidate: REVALIDATE_SECONDS },
      });
      if (!res.ok) return { ...EMPTY, reason: `GitHub API ${res.status}` };

      const json = await res.json();
      const cal =
        json?.data?.user?.contributionsCollection?.contributionCalendar;
      if (!cal) return { ...EMPTY, reason: "no calendar in response" };

      type Day = { contributionCount: number; date: string };
      type Week = { contributionDays: Day[] };
      const days: Day[] = cal.weeks.flatMap((w: Week) => w.contributionDays);

      return {
        ok: true,
        total: cal.totalContributions,
        levels: days.map((d) => countToLevel(d.contributionCount)),
        dates: days.map((d) => d.date),
      };
    } catch (e) {
      return { ...EMPTY, reason: e instanceof Error ? e.message : "fetch failed" };
    }
  },
);

/**
 * Sum daily levels into `buckets` equal groups, for a sparkline.
 *
 * Levels rather than raw counts because that is what the calendar exposes;
 * the shape is what the sparkline is for, not the absolute height.
 */
export function bucketLevels(levels: number[], buckets = 26): number[] {
  if (!levels.length) return [];
  const recent = levels.slice(-364);
  const per = Math.ceil(recent.length / buckets);
  return Array.from({ length: buckets }, (_, i) =>
    recent.slice(i * per, (i + 1) * per).reduce((a, b) => a + b, 0),
  );
}
