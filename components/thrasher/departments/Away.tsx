import Plate from "@/components/thrasher/Plate";
import { Caption, DeptBar, Mast, SectionHead } from "@/components/thrasher/editorial";
import {
  adventuresOtherYears,
  adventuresThisYear,
  adventuresUndated,
  adventuresUpcoming,
  bucketListItems,
  countriesIn,
} from "@/lib/data";
import { departments, plates } from "@/lib/copy";
import { fill, lines, rich } from "@/lib/thrasher/fill";
import { dateline, figures } from "@/lib/thrasher/issue";

/**
 * 04 · Away.
 *
 * The route chart is drawn in lib/thrasher/behaviours.ts from the real lat/lng
 * on each adventure, projected equirectangularly onto a labelled graticule —
 * a print treatment of what react-leaflet renders interactively today. The
 * arcs are quadratic béziers whose control point rises with the span, so a
 * transatlantic leg reads as longer than a domestic one.
 */
export default function Away() {
  /* The log lists the reporting year, because its heading says the year and
     its total row prints the year's figure. Listing all time under that
     heading put a 2025 row in a table headed 2026, with a total that did not
     include it. Trips outside the year are counted in the caption instead,
     so one is visibly excluded rather than quietly missing. */
  const log = adventuresThisYear;
  const earlier = adventuresOtherYears.length;
  /* countriesIn(), not a second hand-rolled Set — see lib/data.ts. */
  const countries = countriesIn(adventuresThisYear);
  const upcoming = adventuresUpcoming.length;
  const undated = adventuresUndated.length;
  const d = departments.away;

  return (
    <section className="dept" id="away" data-dept={d.name} data-folio={d.folio}>
      <DeptBar folio={d.folio} name={d.name} kicker={fill(d.deptKicker)} />

      <Mast
        kicker={fill(d.kicker)}
        headline={fill(d.headline)}
        stats={lines(d.stats)}
      >
        {d.dek.map((para, i) => (
          <p key={i}>{rich(para)}</p>
        ))}
      </Mast>

      <div className="sec" id="routes">
        <SectionHead
          no="01"
          title="The routes"
          right={
            <>
              Plotted from real lat/lng
              <br />
              Origin: Sandy, UT
            </>
          }
        />
        <div className="map">
          <svg
            id="chart"
            viewBox="0 0 1360 440"
            aria-label="Route chart from Sandy, Utah to four 2026 destinations"
          />
        </div>
        <Caption
          left="Print treatment of the react-leaflet map · arcs from the adventures array"
          right={`${figures.nightsAway} nights · ${figures.countriesVisited} countries`}
        />
      </div>

      <div className="sec two">
        <div id="log">
          <SectionHead lite no="02" title="The log" right={fill("{year}")} />
          <div className="alog">
            {log.map((a) => (
              <div className="ar" key={a.id}>
                <span className="ad">{dateline(a.date)}</span>
                <span>
                  <span className="an">{a.name}</span>
                  <br />
                  <span className="al">{a.location}</span>
                </span>
                <span className="aw">{a.who}</span>
                <span className="ann">{a.nights}</span>
              </div>
            ))}
            <div className="ar tot">
              <span className="ad">Total</span>
              <span className="al">
                {countries.join(" + ")} · derived from the array
              </span>
              <span />
              <span className="ann">{figures.nightsAway}</span>
            </div>
          </div>
          {/* Trips outside the reporting year are excluded from this table and
              from every figure beside it. Saying so is the difference between
              a scoped figure and a missing row. */}
          {/* Everything excluded is named. A trip can fall out of these
              figures three ways — another year, a date still in the future,
              or a date that does not parse — and all three are silent
              unless the caption says so. */}
          <Caption
            left={[
              `${log.length} taken in ${fill("{year}")}`,
              earlier ? `${earlier} in other years` : null,
              upcoming ? `${upcoming} booked, not yet taken` : null,
              undated ? `${undated} with an unreadable date` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
            right={`${figures.nightsAway} nights counted`}
          />
        </div>

        <div id="list">
          <SectionHead lite no="03" title="On the list" right="Not yet taken" />
          {/* PLACEHOLDER PLATES — both screens point at stand-in photographs.
              Swap the `full`/`src` paths when the real ones land; the crop
              values will need re-tuning per image and nothing else. */}
          {/* Rendered from `bucketListItems` in lib/data.ts — add an entry
              there and a card appears. The plate falls back to a stand-in
              from `plates` in lib/copy.ts, because a photograph on someone
              else's server cannot be screened: the halftone engine reads
              pixels off a canvas, and the browser refuses that for an image
              fetched cross-origin. */}
          <div className="two" style={{ gap: 16 }}>
            {bucketListItems.map((b, i) => {
              const stand = i % 2 === 0 ? plates.bucketTahiti : plates.bucketUintas;
              const remote = /^https?:\/\//.test(b.imageUrl ?? "");
              return (
                <div key={b.id}>
                  <Plate
                    full={remote || !b.imageUrl ? stand.src : b.imageUrl}
                    title={`${b.name} · ${b.state}`}
                    detail={b.description}
                    cta="Colour"
                    pitch={2.6}
                    ar={1.3}
                    crop={stand.crop}
                  />
                  <div className="bcard" style={{ marginTop: 8, paddingTop: 8 }}>
                    <div className="bh" style={{ fontSize: 15, margin: 0 }}>
                      {b.name}
                    </div>
                    <div
                      className="kick"
                      style={{ marginTop: 4, color: "var(--red-tx)" }}
                    >
                      {b.state}
                      {b.type ? ` · ${b.type}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
