import { DeptBar, Mast, SectionHead } from "@/components/thrasher/editorial";
import { departments, nowRows } from "@/lib/copy";
import { fill, lines, rich } from "@/lib/thrasher/fill";

/**
 * 05 · Right now.
 *
 * ALL of this department's content lives in `nowRows` in lib/copy.ts — that
 * is the file to edit monthly, and it is editable in GitHub's web editor with
 * no tooling at all. It replaces what used to be content/now.json, which the
 * redesign had orphaned.
 *
 * The figures inside the sentences are {tokens}, filled at build time from
 * the same arrays as every other department, so a row saying how many books
 * are finished cannot drift from the panel above it.
 *
 * The section ids are now-him/now-her, not him/her: the feature teaser
 * further up the same scroll owns those, and duplicate ids make both copies
 * unaddressable.
 */
const IDS = { him: "now-him", her: "now-her", both: "both" } as const;

export default function RightNow() {
  const d = departments.now;
  const groups = ["him", "her", "both"] as const;

  return (
    <section className="dept" id="now" data-dept={d.name} data-folio={d.folio}>
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

      {groups.map((key, i) => {
        const g = nowRows[key];
        return (
          <div className="sec" id={IDS[key]} key={key}>
            <SectionHead
              no={String(i + 1).padStart(2, "0")}
              title={g.title}
              right={g.right}
            />
            <div className="nowlist">
              {g.rows.map((row) => (
                <div className="nr" key={row.label}>
                  <div className="nk">{row.label}</div>
                  <div className="nv">
                    <b>{fill(row.headline)}</b>
                    {rich(row.text)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
