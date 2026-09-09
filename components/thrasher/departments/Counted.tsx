import { Caption, DeptBar, Mast, SectionHead } from "@/components/thrasher/editorial";
import { currentlyReading, favoriteMovies, skiResorts } from "@/lib/data";
import { GOALS, figures, pct } from "@/lib/thrasher/issue";

/**
 * 03 · Counted.
 *
 * Every figure here is derived in lib/thrasher/issue.ts from the arrays in
 * lib/data.ts. The bar widths are computed too — the snow bars against the
 * busiest resort, the goal bars against their target — so a bar cannot
 * disagree with the number printed at the end of it.
 */
export default function Counted() {
  const busiest = Math.max(...skiResorts.map((r) => r.days));

  return (
    <section className="dept" id="counted" data-dept="Counted" data-folio="03">
      <DeptBar folio="03" name="Counted" kicker="1 Jan – 8 Sep 2026" />

      <Mast
        kicker="Every figure counted by hand or derived"
        headline="Counted"
        stats={
          <>
            1 January – 8 September 2026
            <br />
            Four headline tiles
            <br />
            Nothing estimated
          </>
        }
      >
        <p>
          Every figure on this page is either counted by hand or derived from
          the array behind it. Where two numbers could disagree, one of them is
          computed from the other so they can’t.
        </p>
      </Mast>

      <div className="sec" id="tiles">
        <div className="four">
          <div className="stat">
            <div className="v">{figures.postsPublished}</div>
            <div className="k">Posts written</div>
          </div>
          <div className="stat">
            <div className="v" data-commits>
              {figures.githubCommits.toLocaleString()}
            </div>
            <div className="k">Github commits</div>
          </div>
          <div className="stat">
            <div className="v">{figures.booksReadThisYear}</div>
            <div className="k">Books read this year</div>
          </div>
          <div className="stat hl">
            <div className="v">{figures.countriesVisited}</div>
            <div className="k">Countries visited</div>
          </div>
        </div>
        <Caption
          left="Commits live from the GitHub API · countries derived from the adventures array"
          right="StatsGrid"
        />
      </div>

      <div className="sec three">
        <div id="books-sec">
          <SectionHead lite no="01" title="Books" right="By quarter" />
          {/* Drawn by lib/thrasher/behaviours.ts — a line, because it is a
              time series, and dashed while the series is flat at zero. */}
          <div className="chart">
            <svg
              id="books"
              viewBox="0 0 320 168"
              aria-label="Books finished per quarter, Q2 2025 to Q3 2026"
            />
          </div>
          <Caption
            left="Books finished per quarter"
            right={`${figures.booksReadThisYear} this year · flat until Q2`}
          />
        </div>

        <div id="snow">
          <SectionHead lite no="02" title="Snow" right="By resort" />
          <div className="bars">
            {skiResorts.map((r) => (
              <div className="b" key={r.name}>
                <span className="lb">{r.name}</span>
                <span className="tr">
                  <i style={{ width: `${(r.days / busiest) * 100}%` }} />
                </span>
                <span className="vv">{r.days}</span>
              </div>
            ))}
          </div>
          <Caption
            left="Days on snow, 2025–26"
            right={`${figures.skiDays} total · ${figures.skiResortCount} resorts`}
          />
        </div>

        <div id="goals">
          <SectionHead lite no="03" title="Goals" right="2026" />
          <div className="bars">
            {GOALS.map((g) => (
              <div className="b" key={g.label}>
                <span className="lb">{g.label}</span>
                <span className="tr">
                  <i className="r" style={{ width: `${pct(g.current, g.goal)}%` }} />
                </span>
                <span className="vv">
                  {g.current}/{g.goal}
                </span>
              </div>
            ))}
          </div>
          <Caption left="Against the 2026 targets" right="Ski days nearly there" />
        </div>
      </div>

      <div className="sec two" id="media">
        <div>
          <SectionHead lite no="04" title="Reading" right="In progress" />
          {currentlyReading.map((b) => (
            <div className="book" key={b.title}>
              <span className="sp" />
              <div>
                <div className="bt">{b.title}</div>
                <div className="ba">
                  {b.author} · {b.genre}
                </div>
                <div className="bp">
                  <i style={{ width: `${b.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <SectionHead lite no="05" title="Watched" right="Favourites" />
          <dl className="widget">
            {favoriteMovies.map((m) => (
              <div className="wr" key={m.title}>
                <dt>{m.title}</dt>
                <dd>{m.year}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
