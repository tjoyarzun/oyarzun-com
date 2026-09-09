import Link from "next/link";
import { DeptBar, Mast, SectionHead } from "@/components/thrasher/editorial";
import { profiles } from "@/lib/data";
import { figures } from "@/lib/thrasher/issue";

/**
 * 05 · Right now.
 *
 * Deliberately prose rather than data. A /now page earns its keep by being
 * short enough to stay true, so this is hand-written and dated, and the
 * figures inside it are interpolated from the same derived set as every other
 * department so they cannot go stale independently.
 *
 * The section ids are now-him/now-her, not him/her: the feature department
 * further up the same scroll already owns those, and duplicate ids make both
 * copies unaddressable.
 */
function NowRow({ k, headline, children }: { k: string; headline: string; children?: React.ReactNode }) {
  return (
    <div className="nr">
      <div className="nk">{k}</div>
      <div className="nv">
        <b>{headline}</b>
        {children}
      </div>
    </div>
  );
}

export default function RightNow() {
  const { her } = profiles;

  return (
    <section className="dept" id="now" data-dept="Right now" data-folio="05">
      <DeptBar folio="05" name="Right now" kicker="Updated 8 September 2026" />

      <Mast
        kicker="What we are actually doing this month"
        headline="Right now"
        stats={
          <>
            Updated monthly
            <br />
            Sandy, Utah
            <br />
            Not a changelog
          </>
        }
      >
        <p>
          What we are actually doing this month, kept short enough that it stays
          true. Last edited the 8th of September, 2026.
        </p>
      </Mast>

      <div className="sec" id="now-him">
        <SectionHead no="01" title="Him" right="Tommy · Manager, Analytics" />
        <div className="nowlist">
          <NowRow k="Working on" headline="Marketing analytics at Domo">
            Building the team out and running experiments against the Gated Free
            Trial funnel.
          </NowRow>
          <NowRow k="Building" headline="Dimple Dell in WebGL">
            A walkable model of the house, generated from the architect’s CAD
            rather than modelled by hand.
          </NowRow>
          <NowRow k="Reading" headline="Do Androids Dream of Electric Sheep?">
            {figures.booksReadThisYear} books finished this year against a
            target of twenty.
          </NowRow>
          <NowRow k="Skiing" headline="Snowbird, mostly">
            Eighteen days there last season out of {figures.skiDays} total.
          </NowRow>
        </div>
      </div>

      <div className="sec" id="now-her">
        <SectionHead no="02" title="Her" right="Julia · Data Engineer III" />
        <div className="nowlist">
          <NowRow k="Working on" headline="Pipelines at SeekWell">
            Hybrid out of Draper. Warehouse modelling and high-volume SQL.
          </NowRow>
          <NowRow k="Speaking" headline="Tech Moms">
            On navigating data engineering without a CS degree or a Silicon
            Valley on-ramp.
          </NowRow>
          <NowRow
            k="Recognised"
            headline={`${her.recognition?.org ?? "Influential Women"}, ${her.recognition?.year ?? "2026"}`}
          >
            Verified. The certificate is on{" "}
            <Link href="/#recognition" style={{ textDecoration: "underline" }}>
              her profile
            </Link>
            .
          </NowRow>
          <NowRow k="Volunteering" headline="Wasatch Community Gardens">
            Which is the same job as mentoring, with dirt.
          </NowRow>
        </div>
      </div>

      <div className="sec" id="both">
        <SectionHead no="03" title="Both" right="Next up" />
        <div className="nowlist">
          <NowRow k="Travelling" headline="Nothing booked">
            {figures.nightsAway} nights away already this year — Rome, Sicily,
            San Francisco, Las Vegas.{" "}
            <Link href="/#away" style={{ textDecoration: "underline" }}>
              The log
            </Link>
            .
          </NowRow>
          <NowRow k="Writing" headline={`${figures.postsPublished} of five`}>
            {figures.postsPublished} posts published against the 2026 goal.{" "}
            {5 - figures.postsPublished} slots open.
          </NowRow>
          {/* FLAG: same analytics claim as the cover tile and the colophon. */}
          <NowRow k="Not doing" headline="Measuring you">
            No analytics, no newsletter, no cookie banner, because there is
            nothing to consent to.
          </NowRow>
        </div>
      </div>
    </section>
  );
}
