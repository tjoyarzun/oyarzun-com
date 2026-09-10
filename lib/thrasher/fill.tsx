import type { ReactNode } from "react";
import { profiles, adventures } from "@/lib/data";
import { figures, postsGoal } from "@/lib/thrasher/issue";
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

function tokens(): Record<string, string> {
  const { him, her } = profiles;
  const countries = Array.from(
    new Set(adventures.map((a) => a.country ?? "USA")),
  );
  return {
    /* live / derived figures */
    commits: figures.githubCommits.toLocaleString(),
    nights: String(figures.nightsAway),
    countries: String(figures.countriesVisited),
    adventures: String(figures.adventuresLogged),
    skiDays: String(figures.skiDays),
    resorts: String(figures.skiResortCount),
    books: String(figures.booksReadThisYear),
    posts: String(figures.postsPublished),
    postsGoal: String(postsGoal),
    slotsOpen: String(Math.max(0, postsGoal - figures.postsPublished)),

    /* composed from lib/data.ts, so a job change is one edit there */
    himLine: `${him.name} · ${him.title}, ${him.company}`,
    herLine: `${her.name} · ${her.title}, ${her.company}`,
    countryList: countries.join(" · "),

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
export function fill(text: string): string {
  const t = tokens();
  return text.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in t ? t[key] : whole,
  );
}

export function fillAll(lines: readonly string[]): string[] {
  return lines.map(fill);
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
export function rich(text: string): ReactNode {
  return fill(text)
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
export function lines(src: readonly string[]): ReactNode {
  return fillAll(src).map((l, i) => (
    <span key={i}>
      {i > 0 ? <br /> : null}
      {l}
    </span>
  ));
}
