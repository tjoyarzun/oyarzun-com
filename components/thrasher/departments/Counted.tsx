import Sparkline from "@/components/thrasher/Sparkline";
import { Caption, DeptBar, Mast } from "@/components/thrasher/editorial";
import { profiles } from "@/lib/data";
import {
  adventuresThisYear,
  tripMonth,
  booksPerQuarter,
  currentlyReading,
  favoriteMovies,
  skiResorts,
} from "@/lib/data";
import { departments } from "@/lib/copy";
import { bucketLevels, getContributions } from "@/lib/github";
import { fill, lines, rich } from "@/lib/thrasher/fill";
import { GOALS, figures, pct } from "@/lib/thrasher/issue";

/**
 * 03 · Counted — the instrument panel.
 *
 * Read as a panel, not a page of cards: one hairline grid, monospace labels,
 * tabular figures, a sparkline under every readout. Every series is computed
 * here from the arrays in lib/data.ts, so a sparkline cannot disagree with the
 * figure above it.
 *
 * The commit readout and its sparkline come from lib/github.ts, fetched on
 * the server in this component, so they are correct in the HTML rather than
 * patched in after hydration. Every other figure is computed here from
 * lib/data.ts at build time.
 */
export default async function Counted() {
  const gh = await getContributions(profiles.him.github ?? "");
  const rt = { commits: gh.ok ? gh.total.toLocaleString() : "—" };
  /* Nights away by month, so the sparkline is a year and not four bars.
     Scoped to the reporting year: filtering on getUTCMonth() alone put March
     2025 and March 2026 in the same bar, which is a sparkline that silently
     conflates years. Month comes from the date string rather than a Date, so
     no timezone can shift a trip into the neighbouring month. */
  const nightsByMonth = Array.from({ length: 12 }, (_, m) =>
    adventuresThisYear
      .filter((a) => tripMonth(a) === m + 1)
      .reduce((sum, a) => sum + a.nights, 0),
  );
  const books = booksPerQuarter.map((q) => q.books);
  const resorts = [...skiResorts].sort((a, b) => b.days - a.days);
  const busiest = resorts[0];
  const now = new Date();
  const dayOfYear = Math.ceil(
    (now.getTime() - Date.UTC(now.getUTCFullYear(), 0, 1)) / 86400000,
  );
  /* Where a linear pace would have you today — the notch on each goal gauge. */
  const paceMark = (dayOfYear / 365) * 100;
  const d = departments.counted;

  return (
    <section className="dept" id="counted" data-dept={d.name} data-folio={d.folio}>
      <DeptBar folio={d.folio} name={d.name} kicker={fill(d.deptKicker, rt)} />

      <Mast
        kicker={fill(d.kicker, rt)}
        headline={fill(d.headline, rt)}
        stats={lines(d.stats, rt)}
      >
        {d.dek.map((para, i) => (
          <p key={i}>{rich(para, rt)}</p>
        ))}
      </Mast>

      <div className="sec" id="tiles">
        <div className="panel">
          <div className="phead">
            <span>Readouts · year to date</span>
            <span className="pr2">
              Day {dayOfYear} of 365 · {Math.round(paceMark)}% elapsed
            </span>
          </div>

          <div className="prow r4">
            <div className="cell">
              <div className="pl">
                <span>Commits</span>
                <span className="pu">52 wk</span>
              </div>
              <div className="pv">{gh.ok ? gh.total.toLocaleString() : "—"}</div>
              <div className="pn2">
                {gh.ok ? "Live · public only" : (gh.reason ?? "unavailable")}
              </div>
              {/* Same request as the figure above it, so the readout and the
                  line beside it always describe the same window. */}
              <div className="spark">
                {gh.ok ? (
                  <Sparkline
                    bars
                    values={bucketLevels(gh.levels)}
                    label="Commit activity over 52 weeks"
                  />
                ) : null}
              </div>
            </div>

            <div className="cell">
              <div className="pl">
                <span>Nights away</span>
                <span className="pu">2026</span>
              </div>
              <div className="pv">{figures.nightsAway}</div>
              <div className="pn2">
                {figures.adventuresLogged} trips · {figures.countriesVisited}{" "}
                countries
              </div>
              <div className="spark">
                <Sparkline
                  bars
                  values={nightsByMonth}
                  label={`Nights away by month: ${nightsByMonth.join(", ")}`}
                />
              </div>
            </div>

            <div className="cell">
              <div className="pl">
                <span>Days on snow</span>
                <span className="pu">25–26</span>
              </div>
              <div className="pv">{figures.skiDays}</div>
              <div className="pn2">
                {figures.skiResortCount} resorts · {busiest.name} leads
              </div>
              <div className="spark">
                <Sparkline
                  bars
                  values={resorts.map((r) => r.days)}
                  label={`Days by resort: ${resorts.map((r) => `${r.name} ${r.days}`).join(", ")}`}
                />
              </div>
            </div>

            <div className="cell">
              <div className="pl">
                <span>Books</span>
                <span className="pu">2026</span>
              </div>
              <div className="pv">{figures.booksReadThisYear}</div>
              <div className="pn2">Flat until Q2 · then 4 a quarter</div>
              <div className="spark">
                <Sparkline
                  fill
                  values={books}
                  label={`Books per quarter: ${booksPerQuarter.map((q) => `${q.quarter} ${q.books}`).join(", ")}`}
                />
              </div>
            </div>
          </div>

          <div className="prow r2">
            <div className="cell">
              <div className="pl">
                <span>Against the 2026 targets</span>
                <span className="pu">Notch = pace</span>
              </div>
              <div style={{ marginTop: 10 }}>
                {GOALS.map((g) => (
                  <div className="gauge" key={g.label}>
                    <span className="gl">{g.label}</span>
                    <span className="gt">
                      <i
                        className={pct(g.current, g.goal) >= paceMark ? "r" : undefined}
                        style={{ width: `${pct(g.current, g.goal)}%` }}
                      />
                      {/* Where a linear pace would put you today. Ahead of the
                          notch fills vermilion, behind it fills ink — so the
                          colour carries the judgement, not just the length. */}
                      <b style={{ left: `${paceMark}%` }} />
                    </span>
                    <span className="gv">
                      {g.current}/{g.goal}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cell">
              <div className="pl">
                <span>Days on snow by resort</span>
                <span className="pu">{figures.skiDays} total</span>
              </div>
              <div style={{ marginTop: 10 }}>
                {resorts.map((r) => (
                  <div className="gauge" key={r.name}>
                    <span className="gl">{r.name}</span>
                    <span className="gt">
                      <i style={{ width: `${(r.days / busiest.days) * 100}%` }} />
                    </span>
                    <span className="gv">{r.days}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="prow r2">
            <div className="cell">
              <div className="pl">
                <span>Reading now</span>
                <span className="pu">Progress</span>
              </div>
              <div style={{ marginTop: 10 }}>
                {currentlyReading.map((b) => (
                  <div className="gauge" key={b.title}>
                    <span className="gl" title={b.title}>
                      {b.title}
                    </span>
                    <span className="gt">
                      {/* Ink, not vermilion. Vermilion on a gauge means
                          "ahead of pace" on the goals above; reusing it for
                          plain progress would drain that of meaning. */}
                      <i style={{ width: `${b.progress}%` }} />
                    </span>
                    <span className="gv">{b.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cell">
              <div className="pl">
                <span>Watched · favourites</span>
                <span className="pu">Rating</span>
              </div>
              <div style={{ marginTop: 10 }}>
                {favoriteMovies.map((m) => (
                  <div className="gauge" key={m.title}>
                    <span className="gl" title={m.title}>
                      {m.title}
                    </span>
                    <span className="gt">
                      <i style={{ width: `${(m.rating / 5) * 100}%` }} />
                    </span>
                    <span className="gv">
                      {m.rating}/5 · {m.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Caption
          left="Commits live from the GitHub GraphQL API · everything else derived from lib/data.ts on build"
          right={`${GOALS.length} gauges · ${figures.skiResortCount} resorts`}
        />
      </div>
    </section>
  );
}
