import Plate from "@/components/thrasher/Plate";
import { Caption, DeptBar, Mast } from "@/components/thrasher/editorial";
import { figures } from "@/lib/thrasher/issue";

/**
 * 01 · Cover.
 *
 * The cover plate is the one screened at the coarsest ruling (5.0px) and the
 * only one reversed out — light ink on a dark ground — because it is printed
 * at the largest reproduction size in the issue. Screen ruling is keyed to
 * reproduction size throughout, so the dots read at a constant optical weight
 * whether the plate is 1200px wide or 180px.
 */
export default function Cover() {
  return (
    <section className="dept" id="cover" data-dept="Cover" data-folio="01">
      <DeptBar folio="01" name="Cover" kicker="Issue 04 · September 2026" />

      <Mast
        kicker="Two subjects · one valley · Sandy, Utah"
        headline="Oyarzun"
        stats={
          <>
            Issue 04 · September 2026
            <br />
            4,505 ft above sea level
            <br />
            Nothing here is measuring you
          </>
        }
      >
        <p>
          He runs analytics at Domo. She engineers data at SeekWell. They met at
          Overstock and never left Utah. Everything here was counted by hand.
        </p>
      </Mast>

      <div className="sec" style={{ marginTop: 18 }}>
        <div className="cover" style={{ marginTop: 0 }}>
          <Plate
            full="/images/summit-selfie.jpg"
            title="Top of the ridge, Little Cottonwood"
            detail="Self-timer · 2026"
            label="Show the cover photograph in colour"
            pitch={5.0}
            gamma={1.02}
            ar={2.35}
            ink="#dcd9d0"
            paper="#141414"
            crop="0.44,0.58,0.90"
          />
          <div className="ov">
            <h2>
              Two people,
              <br />
              one valley
            </h2>
            <p>
              Twelve years of analytics and ten of data engineering, at the
              bottom of a wall that goes up eleven thousand feet.
            </p>
          </div>
        </div>
        <Caption
          left="Cover · the ridge above Little Cottonwood"
          right="Screen 5.0px · 45°"
        />
      </div>

      <div className="sec">
        <div className="figstrip">
          <div className="f">
            <div className="v" data-commits>
              {figures.githubCommits.toLocaleString()}
            </div>
            <div className="k">Github commits</div>
          </div>
          <div className="f">
            <div className="v">{figures.nightsAway}</div>
            <div className="k">Nights away, 2026</div>
          </div>
          <div className="f">
            <div className="v">{figures.skiDays}</div>
            <div className="k">Days on snow</div>
          </div>
          {/* FLAG: this tile and the colophon both claim no analytics, which is
              not true while @vercel/analytics is mounted. Decision pending. */}
          <div className="f hl">
            <div className="v">None</div>
            <div className="k">Analytics on this site</div>
          </div>
        </div>
      </div>
    </section>
  );
}
