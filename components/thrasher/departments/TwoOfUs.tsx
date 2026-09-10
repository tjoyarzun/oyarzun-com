import Link from "next/link";
import Plate from "@/components/thrasher/Plate";
import { Caption, DeptBar, Mast } from "@/components/thrasher/editorial";
import { profiles } from "@/lib/data";
import { axesFor, figures } from "@/lib/thrasher/issue";

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
export default function TwoOfUs() {
  const { him, her } = profiles;
  const strongest = (who: "him" | "her") =>
    axesFor(who).reduce((a, b) => (b.value > a.value ? b : a));

  const people = [
    {
      who: "him" as const,
      profile: him,
      portrait: {
        src: "/images/summit-selfie.jpg",
        crop: "0.24,0.44,0.34",
        gamma: 1.0,
      },
      facts: [
        ["Years in field", "12"],
        ["Commits, 12 mo", figures.githubCommits.toLocaleString()],
        ["Strongest", `${strongest("him").skill} · ${strongest("him").value}`],
      ],
    },
    {
      who: "her" as const,
      profile: her,
      portrait: {
        src: her.recognition?.certificateUrl ?? "/images/Julia_Velicev.png",
        crop: "0.70,0.30,0.44",
        gamma: 1.06,
      },
      facts: [
        ["Years in field", "10"],
        [
          "Recognised",
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
      <DeptBar
        folio="02"
        name="The two of us"
        kicker="The feature · full spread at /us"
      />

      <Mast
        kicker="Twelve years and ten years, five of them in the same building"
        headline="The two of us"
        stats={
          <>
            {him.name} · {him.title}, {him.company}
            <br />
            {her.name} · {her.title}, {her.company}
            <br />
            Both in Sandy, Utah
          </>
        }
      >
        <p>
          Twelve years of analytics and ten of data engineering. Five of those
          years were spent in the same building, on different floors, before
          either of us thought to mention it.
        </p>
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
              2014
              <br />
              –2019
            </div>
            <p>
              <b>Same company, five years, different floors.</b> He was Manager
              of BI Development at Overstock.com while she was growing from BI
              Developer to Manager of Data Engineering there.
            </p>
            <div className="mono" style={{ textAlign: "right" }}>
              Overstock.com
              <br />
              Midvale, Utah
              <br />
              The overlap
            </div>
          </div>
        </div>

        <div className="teaseout">
          <div>
            <div className="kick">The full spread</div>
            <p>
              Both stacks on the same ten axes, careers in full, every project,
              the commit year, and the certificate at reproduction size.
            </p>
          </div>
          <Link className="btn" href="/us">
            Read the feature
          </Link>
        </div>
        <Caption left="Teaser · the department itself is a route" right="/us" />
      </div>
    </section>
  );
}
