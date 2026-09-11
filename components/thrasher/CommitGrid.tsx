import { Caption } from "@/components/thrasher/editorial";
import Sparkline from "@/components/thrasher/Sparkline";
import { bucketLevels, type Contributions } from "@/lib/github";

/**
 * Commit activity, rendered on the server.
 *
 * Was drawn client-side by drawHeat() in lib/thrasher/behaviours.ts, which
 * fetched /api/github-activity after hydration and wrote into the DOM. That
 * meant the grid was absent in the HTML, absent with JavaScript off, absent
 * in a share preview, and — worse — the figure beside it was a stale literal
 * until the patch landed.
 *
 * Now the page awaits lib/github.ts and passes the result here, so the
 * figure, the 52-week grid and the sparkline all come from one request and
 * cannot disagree.
 *
 * No fallback. If the request failed, the caption says so instead of drawing
 * a plausible-looking wall of fake activity — the previous version drew a
 * seeded random grid and captioned it "live".
 */
export default function CommitGrid({
  data,
  weeks = 26,
  spark = false,
}: {
  data: Contributions;
  /** Columns of seven. 26 is half a year and fits a profile column. */
  weeks?: number;
  spark?: boolean;
}) {
  if (!data.ok) {
    return (
      <Caption
        left={`GitHub activity unavailable — ${data.reason ?? "no data"}`}
        right="No fallback drawn"
      />
    );
  }

  /* A GitHub calendar is columns of weeks, not rows of days.
     
     This grid used to be 26 columns filled in reading order — left to right,
     wrapping at the end of each row — so a row was 26 consecutive days and
     the wrap landed 26 days later, which is 3.7 weeks. Nothing lined up
     vertically, no column meant anything, and it looked nothing like the
     calendar it was imitating. It was a timeline that wrapped like text.
     
     Now each column is one week, oldest on the left, and each row is a
     weekday — the top row is every Sunday of the last six months. That only
     holds if the first cell really is a Sunday, which is what the padding
     below is for: GitHub's last week is partial (it ends today), so the end
     is filled out to a whole week before slicing back from it. */
  const weekday = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay();
  const last = data.dates[data.dates.length - 1];
  const tail = last ? 6 - weekday(last) : 0;
  const cells: (number | null)[] = [
    ...data.levels,
    ...(Array(tail).fill(null) as null[]),
  ];
  const days = cells.slice(-weeks * 7);

  return (
    <>
      <div
        className="heat"
        /* Set here rather than from a custom property, because
           `repeat(var(--weeks), …)` is invalid: repeat()'s count is read when
           the stylesheet is parsed, before custom properties are substituted,
           so the whole declaration is thrown away silently. The columns then
           fall back to auto-sizing, each cell takes its width from
           aspect-ratio:1 against the row height, and 26 of them demand 670px
           inside a 350px column. minmax(0,1fr) rather than 1fr for the
           related reason: a bare 1fr will not shrink below min-content. */
        style={{
          gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
        }}
      >
        {days.map((lvl, i) =>
          lvl === null ? (
            /* Days after today. Drawn as a hole, not as a zero-contribution
               day — "nothing yet" and "nothing" are different claims. */
            <i key={i} className="pad" aria-hidden="true" />
          ) : (
            <i key={i} className={lvl ? `l${lvl}` : undefined} />
          ),
        )}
      </div>
      {spark ? (
        <div className="spark" style={{ marginTop: 10 }}>
          <Sparkline
            bars
            values={bucketLevels(data.levels)}
            label="Commit activity over 52 weeks"
          />
        </div>
      ) : null}
      <Caption
        left={`Live from the GitHub GraphQL API · ${data.total.toLocaleString()} contributions in 52 weeks`}
        right="Public contributions only"
      />
    </>
  );
}
