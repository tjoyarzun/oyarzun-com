import Plate from "@/components/thrasher/Plate";
import { Caption, DeptBar, Mast } from "@/components/thrasher/editorial";
import { departments, plates } from "@/lib/copy";
import { fill, lines, rich } from "@/lib/thrasher/fill";

/**
 * 01 · Cover.
 *
 * Every word on this page comes from `departments.cover` in lib/copy.ts and
 * every photograph from `plates` in the same file. Nothing here is written in
 * this component, which is the point: the copy is editable in a browser and
 * the layout is not something you should have to read to change a sentence.
 *
 * The cover plate is screened at the coarsest ruling (5.0px) and is the only
 * one reversed out — light ink on a dark ground — because it is printed at
 * the largest reproduction size in the issue. Screen ruling is keyed to
 * reproduction size throughout, so the dots read at a constant optical weight
 * whether the plate is 1200px wide or 180px.
 */
export default function Cover() {
  const c = departments.cover;
  const p = plates.cover;

  return (
    <section className="dept" id="cover" data-dept={c.name} data-folio={c.folio}>
      <DeptBar folio={c.folio} name={c.name} kicker={fill(c.deptKicker)} />

      <Mast kicker={c.kicker} headline={c.headline} stats={lines(c.stats)}>
        {c.dek.map((para, i) => (
          <p key={i}>{rich(para)}</p>
        ))}
      </Mast>

      <div className="sec" style={{ marginTop: 18 }}>
        <div className="cover" style={{ marginTop: 0 }}>
          <Plate
            full={p.src}
            title={p.title ?? "Cover photograph"}
            detail={p.detail}
            label="Show the cover photograph in colour"
            pitch={5.0}
            gamma={1.02}
            ar={2.35}
            ink="#dcd9d0"
            paper="#141414"
            crop={p.crop}
          />
          <div className="ov">
            <h2>
              {c.coverTitle.map((l, i) => (
                <span key={i}>
                  {i > 0 ? <br /> : null}
                  {l}
                </span>
              ))}
            </h2>
            <p>{rich(c.coverBlurb)}</p>
          </div>
        </div>
        <Caption
          left={
            p.placeholder
              ? "Placeholder cover — swap `plates.cover.src` in lib/copy.ts"
              : "Cover · the ridge above Little Cottonwood"
          }
          right="Screen 5.0px · 45°"
        />
      </div>

      <div className="sec">
        <div className="figstrip">
          {c.figures.map((f) => (
            <div className={f.highlight ? "f hl" : "f"} key={f.label}>
              {/* data-commits lets the live GitHub figure overwrite the
                  build-time one; it is harmless on the others. */}
              <div className="v" data-commits={f.value === "{commits}" ? "" : undefined}>
                {fill(f.value)}
              </div>
              <div className="k">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
