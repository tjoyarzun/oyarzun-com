import Plate from "@/components/thrasher/Plate";
import ProfileLinks from "@/components/thrasher/ProfileLinks";
import { Caption } from "@/components/thrasher/editorial";
import type { Profile } from "@/lib/data";
import { axesFor } from "@/lib/thrasher/issue";

/**
 * One person, in full.
 *
 * Everything here comes from `profiles` in lib/data.ts — bio, career,
 * projects, skills, recognition. The only per-person values passed in are the
 * ones the data does not carry: the portrait plate and its crop, the years
 * count, and the place.
 *
 * Used by /us. The home page shows a teaser instead, not this.
 */

const OVERLAP_COMPANY = "Overstock.com";

export interface ProfileColumnProps {
  who: "him" | "her";
  /** Everything printed here comes off this object — including the years in
   *  the field and the place, which used to be passed in as literals. */
  profile: Profile;
  /** Portrait plate. Same-origin, or the halftone engine cannot screen it. */
  portrait: { src: string; crop: string; gamma?: number };
  /** Extra field rows for whatever the data does not model. */
  extraFields?: { label: string; value: string; wide?: boolean }[];
  /** Rendered under the career block — his commit grid. */
  children?: React.ReactNode;
}

export default function ProfileColumn({
  who,
  profile,
  portrait,
  extraFields = [],
  children,
}: ProfileColumnProps) {
  const axes = axesFor(who);
  const place = profile.place;
  const [first, ...rest] = profile.name.split(" ");
  const rec = profile.recognition;
  const top = axes.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <div className="who" id={who}>
      <Plate
        full={portrait.src}
        title={`${profile.name} · ${profile.title}, ${profile.company}`}
        detail={place}
        ar={1.28}
        gamma={portrait.gamma ?? 1.0}
        crop={portrait.crop}
      />
      {/* The person's name is the heading for their column.
          
          It was a plain div, so /us went from its h1 straight to a flat run of
          "Stack · self-assessed", "Career", "Projects" — twice, once per
          person, with nothing to say whose was whose. Navigating that column
          by heading told you nothing at all. */}
      <h2 className="pn">
        {first}
        <br />
        {rest.join(" ")}
      </h2>
      <div className="pr">
        {profile.title} · {profile.company}
      </div>
      <p className="pb">{profile.bio}</p>

      <dl className="fld">
        <div className="fr2">
          <dt>Years in field</dt>
          <dd>{profile.yearsExperience}</dd>
        </div>
        <div className="fr2">
          <dt>Based</dt>
          <dd className="w">{place}</dd>
        </div>
        {extraFields.map((f) => (
          <div className="fr2" key={f.label}>
            <dt>{f.label}</dt>
            <dd className={f.wide ? "w" : undefined}>{f.value}</dd>
          </div>
        ))}
        <div className="fr2">
          <dt>Strongest</dt>
          <dd className="w">
            {top.skill} · {top.value}
          </dd>
        </div>
      </dl>

      {/* The handles used to sit in the table above as two unclickable rows.
          A handle is a fact about a person; it is not a way to reach them. */}
      <ProfileLinks profile={profile} />

      <h3 className="blk">Stack · self-assessed</h3>
      {/* Drawn by drawRadar() in lib/thrasher/behaviors.ts. The axes are the
          union of both people's `skills` arrays, so the two radars on this
          page are directly comparable — see SKILL_AXES in lib/thrasher/issue. */}
      <div className="radar">
        <div className="radarkey">
          <span>{profile.name.split(" ")[0]}</span>
          <span>0–100 · {axes.length} shared axes</span>
        </div>
        <svg
          data-radar
          data-who={who}
          data-axes={JSON.stringify(axes)}
          viewBox="0 0 340 260"
          aria-label={`Skill radar for ${profile.name}: ${axes
            .map((a) => `${a.skill} ${a.value}`)
            .join(", ")}`}
        />
      </div>
      <Caption
        left="Self-assessed, 0–100 · same axes for both"
        right="Vermilion = 90+"
      />

      <h3 className="blk">Career</h3>
      {profile.career.map((j) => (
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

      {children}

      <h3 className="blk">Projects · {profile.projects.length}</h3>
      {profile.projects.map((p) => (
        <div className="pj" key={p.title}>
          <div className="pt">{p.title}</div>
          <p>{p.description}</p>
          <div className="tl2" style={{ marginTop: 8 }}>
            {p.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          {/* The poster has been in the data since the embed was written and
              was never drawn — a project you can walk through in 3D was
              represented by a line of text and a button. Screened like every
              other photograph so it belongs to the page rather than sitting
              on it as a web screenshot. */}
          {p.embed?.poster ? (
            <div style={{ marginTop: 11 }}>
              <Plate
                full={p.embed.poster}
                title={p.title}
                detail={p.embed.posterAlt ?? p.title}
                label={`Show the render for ${p.title} in color`}
                pitch={2.4}
                ar={1.72}
                crush={false}
                cta="Color"
              />
            </div>
          ) : null}
          {p.embed || p.liveUrl || p.githubUrl ? (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 11,
                flexWrap: "wrap",
              }}
            >
              {p.embed ? (
                /* Still a link out rather than an inline iframe: a WebGL
                   walkthrough embedded in a profile column would download a
                   scene nobody asked for. The poster above is the preview. */
                <a className="btn alt" href={p.embed.url}>
                  {p.embed.cta}
                </a>
              ) : p.liveUrl ? (
                <a className="btn gho" href={p.liveUrl}>
                  Open
                </a>
              ) : null}
              {p.githubUrl ? (
                <a className="btn gho" href={p.githubUrl}>
                  Source
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}

      {/* The awards block renders only for whoever has one. An empty
          "Recognition — none" heading would be worse than no heading:
          it prints an absence as if it were a fact about the person. */}
      {rec ? (
        <>
          <h3 className="blk">Recognition</h3>
          <div className="pj">
            <div className="pt">
              {rec.org} {rec.year}
              {rec.award ? ` · ${rec.award}` : ""}
            </div>
            {rec.tagline ? <p>“{rec.tagline}”</p> : null}
            <p>{rec.blurb}</p>
            {/* The certificate itself, which used to be a full-width section
                of its own below both columns — so the recognition was
                described in one place and shown in another, a screen apart.
                It reproduces at almost exactly the width it did there (627px
                in this column against ~640 in the old band), so the screen
                ruling and the crop carry over untouched.

                gamma 0.72 rather than 1: this is a near-white document, and
                a straight tone curve laid down so little ink that the plate
                read as blank paper. */}
            {rec.certificateUrl ? (
              <div style={{ marginTop: 12 }}>
                <Plate
                  full={rec.certificateUrl}
                  title={`${rec.org} recognition certificate`}
                  detail={`${profile.name} · ${profile.title}, ${profile.company} · ${rec.year}`}
                  label="Show the certificate in color"
                  gamma={0.72}
                  ar={1.09}
                  crush={false}
                  crop="0.5,0.5,1.0"
                  cta="Color"
                />
                <Caption
                  left="The certificate · verified"
                  right="Color reveals the IW pink"
                />
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 11,
                flexWrap: "wrap",
              }}
            >
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
        </>
      ) : null}
    </div>
  );
}
