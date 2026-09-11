import Link from "next/link";
import Plate from "@/components/thrasher/Plate";
import { Caption, DeptBar, Mast } from "@/components/thrasher/editorial";
import { profiles } from "@/lib/data";
import { departments, plates } from "@/lib/copy";
import { fill, lines, rich } from "@/lib/thrasher/fill";
import { getContributions } from "@/lib/github";
import { axesFor } from "@/lib/thrasher/issue";

/**
 * 02 · The two of us — the teaser.
 *
 * The full spread lives at /us. This is the department's presence in the
 * scroll: both portraits, the two headline facts about each, the overlap
 * band, and a way through. It is deliberately short — the full version is
 * ~4,000px and reading a third of the scroll before reaching Counted was the
 * problem that moved it.
 *
 * Everything here is derived, including the two "strongest" figures, so the
 * teaser cannot contradict the spread it links to.
 */
export default async function TwoOfUs() {
  const { him, her } = profiles;
  const gh = await getContributions(him.github ?? "");
  const rt = { commits: gh.ok ? gh.total.toLocaleString() : "—" };
  const d = departments.two;
  const strongest = (who: "him" | "her") =>
    axesFor(who).reduce((a, b) => (b.value > a.value ? b : a));

  const people = [
    {
      who: "him" as const,
      profile: him,
      portrait: plates.portraitHim,
      facts: [
        ["Years in field", String(him.yearsExperience)],
        ["Commits, 12 mo", gh.ok ? gh.total.toLocaleString() : "—"],
        ["Strongest", `${strongest("him").skill} · ${strongest("him").value}`],
      ],
    },
    {
      who: "her" as const,
      profile: her,
      portrait: plates.portraitHer,
      facts: [
        ["Years in field", String(her.yearsExperience)],
        [
          "Recognized",
          `${her.recognition?.org ?? "—"}, ${her.recognition?.year ?? ""}`,
        ],
        ["Strongest", `${strongest("her").skill} · ${strongest("her").value}`],
      ],
    },
  ];

  return (
    <section
      className="dept"
      id="two"
      data-dept="The two of us"
      data-folio="02"
    >
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

      <div className="sec">
        <div className="pair">
          {/* The hairline divider is the grid's middle column, so it is a
              sibling of the two columns rather than something the map emits —
              a keyed fragment per person just to carry it reads worse and
              React would want the key on the fragment, not its children. */}
          {people.map((p, i) => (
            <div
              className="who"
              key={p.who}
              style={i === 1 ? { gridColumn: 3 } : undefined}
            >
              <Plate
                full={p.portrait.src}
                title={`${p.profile.name} · ${p.profile.title}, ${p.profile.company}`}
                detail={
                  i === 0
                    ? "Self-timer · 2026"
                    : "Influential Women certificate · 2026"
                }
                ar={1.28}
                gamma={p.portrait.gamma}
                crop={p.portrait.crop}
              />
              <div className="pn">
                {p.profile.name.split(" ")[0]}
                <br />
                {p.profile.name.split(" ").slice(1).join(" ")}
              </div>
              <div className="pr">
                {p.profile.title} · {p.profile.company}
              </div>
              <dl className="fld">
                {p.facts.map(([k, v]) => (
                  <div className="fr2" key={k}>
                    <dt>{k}</dt>
                    <dd className="w">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          <div className="div" style={{ gridColumn: 2, gridRow: 1 }} />

          <div className="overlap" id="overlap">
            <div className="big">
              {d.overlapYears.map((y, i) => (
                <span key={i}>
                  {i > 0 ? <br /> : null}
                  {fill(y, rt)}
                </span>
              ))}
            </div>
            <p>{rich(d.overlapText, rt)}</p>
            <div className="mono" style={{ textAlign: "right" }}>
              {lines(d.overlapStats, rt)}
            </div>
          </div>
        </div>

        <div className="teaseout">
          <div>
            <div className="kick">{d.teaseLabel}</div>
            <p>{rich(d.teaseBlurb, rt)}</p>
          </div>
          <Link className="btn" href="/us">
            {d.teaseCta}
          </Link>
        </div>
        <Caption left="Teaser · the department itself is a route" right="/us" />
      </div>
    </section>
  );
}
