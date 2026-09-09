import Plate from "@/components/thrasher/Plate";
import { Caption, DeptBar, Mast, SectionHead } from "@/components/thrasher/editorial";
import { adventures } from "@/lib/data";
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
  const log = [...adventures].sort((a, b) => a.date.localeCompare(b.date));
  const countries = Array.from(
    new Set(adventures.map((a) => a.country ?? "USA")),
  );

  return (
    <section className="dept" id="away" data-dept="Away" data-folio="04">
      <DeptBar
        folio="04"
        name="Away"
        kicker={`${figures.adventuresLogged} adventures · ${figures.nightsAway} nights`}
      />

      <Mast
        kicker={`${figures.adventuresLogged} adventures · ${figures.countriesVisited} countries · ${figures.nightsAway} nights`}
        headline={`${figures.nightsAway} nights`}
        stats={
          <>
            {countries.join(" · ")}
            <br />
            {figures.adventuresLogged} adventures logged
            <br />
            {figures.skiDays} ski days, separately
          </>
        }
      >
        <p>
          Four adventures, two countries, eighteen nights. The countries are
          derived from the array rather than kept by hand, so this page and the
          dashboard cannot disagree.
        </p>
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
          <SectionHead lite no="02" title="The log" right="2026" />
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
        </div>

        <div id="list">
          <SectionHead lite no="03" title="On the list" right="Not yet taken" />
          {/* PLACEHOLDER PLATES — both screens point at stand-in photographs.
              Swap the `full`/`src` paths when the real ones land; the crop
              values will need re-tuning per image and nothing else. */}
          <div className="two" style={{ gap: 16 }}>
            <div>
              <Plate
                full="/images/switzerland-dock.jpg"
                title="Tahiti · French Polynesia"
                detail="On the list · we do love beaches"
                cta="Colour"
                pitch={2.6}
                ar={1.3}
                crop="0.5,0.3,0.5"
              />
              <div className="bcard" style={{ marginTop: 8, paddingTop: 8 }}>
                <div className="bh" style={{ fontSize: 15, margin: 0 }}>
                  Tahiti
                </div>
                <div
                  className="kick"
                  style={{ marginTop: 4, color: "var(--red)" }}
                >
                  French Polynesia · beach
                </div>
              </div>
            </div>
            <div>
              <Plate
                full="/images/summit-selfie.jpg"
                title="The Uintas · Utah"
                detail="On the list"
                cta="Colour"
                pitch={2.6}
                ar={1.3}
                crop="0.68,0.5,0.5"
              />
              <div className="bcard" style={{ marginTop: 8, paddingTop: 8 }}>
                <div className="bh" style={{ fontSize: 15, margin: 0 }}>
                  The Uintas
                </div>
                <div className="kick" style={{ marginTop: 4 }}>
                  Utah · on the list
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
