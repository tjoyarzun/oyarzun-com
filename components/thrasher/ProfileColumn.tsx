import Plate from "@/components/thrasher/Plate";
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
      <div className="pn">
        {first}
        <br />
        {rest.join(" ")}
      </div>
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
        {profile.github ? (
          <div className="fr2">
            <dt>Github</dt>
            <dd className="w">{profile.github}</dd>
          </div>
        ) : null}
        <div className="fr2">
          <dt>Linkedin</dt>
          <dd className="w">{profile.linkedin}</dd>
        </div>
      </dl>

      <h4 className="blk">Stack · self-assessed</h4>
      {/* Drawn by drawRadar() in lib/thrasher/behaviours.ts. The axes are the
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

      <h4 className="blk">Career</h4>
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

      <h4 className="blk">Projects · {profile.projects.length}</h4>
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
                /* TODO: ProjectEmbed's click-to-load iframe has no screened
                   treatment yet, so this is a link out for now. */
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
          <h4 className="blk">Recognition</h4>
          <div className="pj">
            <div className="pt">
              {rec.org} {rec.year}
              {rec.award ? ` · ${rec.award}` : ""}
            </div>
            {rec.tagline ? <p>“{rec.tagline}”</p> : null}
            <p>{rec.blurb}</p>
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
