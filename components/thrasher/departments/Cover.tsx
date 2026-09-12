import Plate from "@/components/thrasher/Plate";
import { Caption, DeptBar, Mast } from "@/components/thrasher/editorial";
import { departments, plates } from "@/lib/copy";
import { profiles } from "@/lib/data";
import { getContributions } from "@/lib/github";
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
export default async function Cover() {
  const c = departments.cover;
  const p = plates.cover;
  /* One server request, deduped by React across every component that asks
     in this render. The figure is correct in the HTML, so there is nothing
     to patch after hydration. */
  const gh = await getContributions(profiles.him.github ?? "");
  const rt = { commits: gh.ok ? gh.total.toLocaleString() : "—" };

  return (
    <section className="dept" id="cover" data-dept={c.name} data-folio={c.folio}>
      <DeptBar folio={c.folio} name={c.name} kicker={fill(c.deptKicker, rt)} />

      <Mast
        /* The one h1 on the page: this is the issue's masthead. */
        level={1}
        kicker={fill(c.kicker, rt)}
        headline={fill(c.headline, rt)}
        stats={lines(c.stats, rt)}
      >
        {c.dek.map((para, i) => (
          <p key={i}>{rich(para, rt)}</p>
        ))}
      </Mast>

      <div className="sec" style={{ marginTop: 18 }}>
        <div className="cover" style={{ marginTop: 0 }}>
          <Plate
            full={p.src}
            title={p.title ?? "Cover photograph"}
            detail={p.detail}
            label="Show the cover photograph in color"
            pitch={5.0}
            /* Normal polarity, and no crush.
               This plate used to be reversed out — light ink on a dark
               ground — which suited the high-contrast summit photograph that
               stood in here. On a warm indoor portrait of two people it
               renders a photographic negative: dark faces, bright eyes,
               ghoulish. And the duotone crush, which pushes shadows to solid
               and highlights to paper, blew both faces to flat white with
               black blotches where the eyes should be.
               Ordinary ink on paper with a straight tone curve reads as a
               photograph, and the picture's own dark background does the job
               the reversed ground was there for. It also means the plate now
               inverts with Negative like every other one, instead of being
               pinned. */
            gamma={1.0}
            ar={2.35}
            crush={false}
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
          /* The caption describes whatever `plates.cover` currently is. It
             used to name the summit photograph outright, so swapping the
             picture left a caption describing the old one. */
          left={
            p.placeholder
              ? "Placeholder cover — swap `plates.cover.src` in lib/copy.ts"
              : `Cover · ${p.title ?? "photograph"}`
          }
          right="Screen 5.0px · 45°"
        />
      </div>

      <div className="sec">
        <div className="figstrip">
          {c.figures.map((f) => (
            <div className={f.highlight ? "f hl" : "f"} key={f.label}>
              <div className="v">{fill(f.value, rt)}</div>
              <div className="k">{fill(f.label, rt)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
