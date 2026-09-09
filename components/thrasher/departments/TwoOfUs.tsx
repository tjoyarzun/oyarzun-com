import Plate from "@/components/thrasher/Plate";
import { Caption, DeptBar, Mast } from "@/components/thrasher/editorial";
import { profiles } from "@/lib/data";
import { figures } from "@/lib/thrasher/issue";
import type { Profile } from "@/lib/data";

/**
 * 02 · The two of us — the feature.
 *
 * Two columns, one hairline rule, and the overlap printed across both. Every
 * figure and every career row comes from `profiles` in lib/data.ts; nothing
 * about either person is written twice.
 *
 * Note on anchors: the design gave the two columns id="him"/id="her", and the
 * Right-now department reused the same two ids further down the same scroll.
 * Duplicate ids are invalid and make both anchors unaddressable, so Right now
 * uses now-him/now-her and these keep the short names. Neither is a nav
 * target — the columns sit side by side and share a y, so they cannot be
 * scroll-spied apart, which is why the nav stops at the department.
 */

/** The Overstock rows are the overlap, and are marked so the eye finds them. */
const OVERLAP_COMPANY = "Overstock.com";

function Career({ career }: { career: Profile["career"] }) {
  return (
    <>
      {career.map((j) => (
        <div
          className={j.company === OVERLAP_COMPANY ? "job ov" : "job"}
          key={`${j.company}-${j.years}`}
        >
          <span className="yr">{j.years.replace("–Present", " —")}</span>
          <div>
            <div className="co">{j.company}</div>
            <div className="ti">{j.title}</div>
            {j.description ? <div className="de">{j.description}</div> : null}
          </div>
        </div>
      ))}
    </>
  );
}

export default function TwoOfUs() {
  const { him, her } = profiles;
  const rec = her.recognition;

  return (
    <section className="dept" id="two" data-dept="The two of us" data-folio="02">
      <DeptBar folio="02" name="The two of us" kicker="The feature" />

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
        <div className="pair" id="pair">
          {/* ── him ───────────────────────────────────────────────────── */}
          <div className="who" id="him">
            {/* PLACEHOLDER PLATE — this is the summit photograph standing in
                for a portrait. Swap when the real one lands. */}
            <Plate
              full="/images/summit-selfie.jpg"
              title={`${him.name} · Sandy, Utah`}
              detail="Self-timer · 2026"
              ar={1.28}
              crop="0.24,0.44,0.34"
            />
            <div className="pn">
              {him.name.split(" ")[0]}
              <br />
              {him.name.split(" ").slice(1).join(" ")}
            </div>
            <div className="pr">
              {him.title} · {him.company}
            </div>
            <p className="pb">{him.bio}</p>
            <dl className="fld">
              <div className="fr2">
                <dt>Years in field</dt>
                <dd>12</dd>
              </div>
              <div className="fr2">
                <dt>Based</dt>
                <dd className="w">Sandy, UT · 4,505 ft</dd>
              </div>
              <div className="fr2">
                <dt>Commits, 12 mo</dt>
                <dd data-commits>{figures.githubCommits.toLocaleString()}</dd>
              </div>
              <div className="fr2">
                <dt>Github</dt>
                <dd className="w">{him.github}</dd>
              </div>
              <div className="fr2">
                <dt>Linkedin</dt>
                <dd className="w">{him.linkedin}</dd>
              </div>
            </dl>

            <h4 className="blk">Career</h4>
            <Career career={him.career} />

            <h4 className="blk">Projects</h4>
            {him.projects.map((p) => (
              <div className="pj" key={p.title}>
                <div className="pt">{p.title}</div>
                <p>{p.description}</p>
                {p.embed ? (
                  <div style={{ marginTop: 11 }}>
                    {/* TODO Phase 2: this is where ProjectEmbed's click-to-load
                        iframe goes. It has no screened treatment yet — flagged
                        as one of the two undesigned interactive pieces. */}
                    <a className="btn alt" href={p.embed.url}>
                      {p.embed.cta}
                    </a>
                  </div>
                ) : null}
              </div>
            ))}

            <h4 className="blk">Commits · 52 weeks</h4>
            {/* drawHeat() in lib/thrasher/behaviours.ts reads data-user and
                fills this from /api/github-activity. */}
            <div className="heat" id="heat" data-user={him.github} />
            <Caption
              left="Live from the GitHub GraphQL API · no mock fallback"
              right="Vermilion = top decile"
            />
          </div>

          <div className="div" />

          {/* ── her ───────────────────────────────────────────────────── */}
          <div className="who" id="her">
            <Plate
              full={rec?.certificateUrl ?? "/images/Julia_Velicev.png"}
              title={`${her.name} · ${her.title}, ${her.company}`}
              detail="Influential Women certificate · 2026"
              ar={1.28}
              gamma={1.06}
              crop="0.70,0.30,0.44"
            />
            <div className="pn">
              {her.name.split(" ")[0]}
              <br />
              {her.name.split(" ").slice(1).join(" ")}
            </div>
            <div className="pr">
              {her.title} · {her.company}
            </div>
            <p className="pb">{her.bio}</p>
            <dl className="fld">
              <div className="fr2">
                <dt>Years in field</dt>
                <dd>10</dd>
              </div>
              <div className="fr2">
                <dt>Based</dt>
                <dd className="w">Draper, UT · hybrid</dd>
              </div>
              <div className="fr2">
                <dt>Books, 2026</dt>
                <dd>{figures.booksReadThisYear}</dd>
              </div>
              {rec ? (
                <div className="fr2">
                  <dt>Recognised</dt>
                  <dd className="w">
                    {rec.org}, {rec.year}
                  </dd>
                </div>
              ) : null}
              <div className="fr2">
                <dt>Linkedin</dt>
                <dd className="w">{her.linkedin}</dd>
              </div>
            </dl>

            <h4 className="blk">Career</h4>
            <Career career={her.career} />

            <h4 className="blk">Projects</h4>
            {her.projects.map((p) => (
              <div className="pj" key={p.title}>
                <div className="pt">{p.title}</div>
                <p>{p.description}</p>
              </div>
            ))}

            <h4 className="blk">Stack</h4>
            {/* Drawn by lib/thrasher/behaviours.ts. */}
            <div className="radar">
              <svg
                id="radar"
                viewBox="0 0 320 200"
                aria-label="Skill radar: SQL, BigQuery, Python, GCP, Databricks, Tableau"
              />
            </div>
          </div>

          {/* ── the overlap, printed across both columns ─────────────── */}
          <div className="overlap" id="overlap">
            <div className="big">
              2014
              <br />
              –2019
            </div>
            <p>
              <b>Same company, five years, different floors.</b> He was Manager
              of BI Development at Overstock.com while she was growing from BI
              Developer to Manager of Data Engineering there. Her tenure ran to
              2023 — nine years in all.
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

        {/* ── recognition ─────────────────────────────────────────────── */}
        {rec ? (
          <div className="rec" id="recognition">
            <div>
              <div className="kick">Recognition · hers</div>
              <div className="rt">
                {rec.org.split(" ")[0]}
                <br />
                {rec.org.split(" ").slice(1).join(" ")} {rec.year}
              </div>
              {rec.tagline ? <p className="tl">“{rec.tagline}”</p> : null}
              <div
                style={{
                  display: "flex",
                  gap: 9,
                  marginTop: 14,
                  flexWrap: "wrap",
                }}
              >
                {/* TODO Phase 2: click-to-load Vimeo player. Undesigned in the
                    Thrasher direction — currently a link out. */}
                {rec.videoId ? (
                  <a
                    className="btn alt"
                    href={`https://vimeo.com/${rec.videoId}/${rec.videoHash ?? ""}`}
                  >
                    Watch the film
                  </a>
                ) : null}
                {rec.orgUrl ? (
                  <a className="btn gho" href={rec.orgUrl}>
                    {rec.orgUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                ) : null}
              </div>
            </div>
            <div>
              <Plate
                full={rec.certificateUrl}
                title="Influential Women recognition certificate"
                detail={`${her.name} · ${her.title}, ${her.company} · ${rec.year}`}
                label="Show the certificate in colour"
                gamma={0.72}
                ar={1.09}
                crush={false}
                crop="0.5,0.5,1.0"
              />
              <Caption
                left="The certificate · verified"
                right="Colour reveals the IW pink"
              />
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.48,
                  color: "var(--ink70)",
                  margin: "12px 0 0",
                }}
              >
                {rec.blurb}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
