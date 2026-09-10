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

  const days = data.levels.slice(-weeks * 7);

  return (
    <>
      <div className="heat">
        {days.map((lvl, i) => (
          <i key={i} className={lvl ? `l${lvl}` : undefined} />
        ))}
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
