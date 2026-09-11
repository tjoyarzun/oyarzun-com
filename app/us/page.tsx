import type { Metadata } from "next";
import Link from "next/link";
import Plate from "@/components/thrasher/Plate";
import ProfileColumn from "@/components/thrasher/ProfileColumn";
import {
  Caption,
  Folio,
  Mast,
  RunningHead,
  SectionHead,
} from "@/components/thrasher/editorial";
import { profiles } from "@/lib/data";
import CommitGrid from "@/components/thrasher/CommitGrid";
import { plates, us as copy } from "@/lib/copy";
import { getContributions } from "@/lib/github";
import { fill, lines, rich } from "@/lib/thrasher/fill";
import { figures } from "@/lib/thrasher/issue";

/**
 * /us — the feature, given its own route.
 *
 * It was department 02 of the one scroll and had outgrown it: two full
 * profiles with career, projects, awards, a commit grid and a ten-axis radar
 * each is roughly 4,000px, which is over a third of the scroll spent before
 * the reader reaches anything else. As a route it also gets its own title and
 * share image, and the home page keeps a teaser that links here.
 *
 * `.spread` on the wrapper steps every reading size up one notch — same
 * components as the scroll, more generous setting.
 */
export const metadata: Metadata = {
  title: "The two of us · Oyarzun",
  description:
    "Tommy Oyarzun, Manager of Analytics at Domo, and Julia Velicev, Data Engineer III at SeekWell — twelve years and ten years, five of them in the same building.",
};

export default async function Us() {
  const { him, her } = profiles;
  const gh = await getContributions(him.github ?? "");
  const rt = { commits: gh.ok ? gh.total.toLocaleString() : "—" };

  return (
    <>
      <RunningHead
        dept="The two of us"
        href="/#two"
        middle="Two profiles · one overlap · Sandy, Utah"
      />

      <main id="main" className="spread">
        <Mast
          tight={false}
          kicker={fill(copy.kicker, rt)}
          headline={fill(copy.headline, rt)}
          stats={lines(copy.stats, rt)}
        >
          {copy.dek.map((para, i) => (
            <p key={i}>{rich(para, rt)}</p>
          ))}
        </Mast>

        <div className="sec">
          <div className="pair" id="pair">
            <ProfileColumn
              who="him"
              profile={him}
              portrait={plates.portraitHim}
              extraFields={[
                {
                  label: "Commits, 12 mo",
                  value: gh.ok ? gh.total.toLocaleString() : "—",
                },
              ]}
            >
              <h4 className="blk">Commits · 52 weeks</h4>
              <CommitGrid data={gh} />
            </ProfileColumn>

            <div className="div" />

            <ProfileColumn
              who="her"
              profile={her}
              portrait={plates.portraitHer}
              extraFields={[
                { label: "Books, 2026", value: String(figures.booksReadThisYear) },
              ]}
            />

            <div className="overlap" id="overlap">
              <div className="big">
                {fill("{overlapFrom}")}
                <br />
                –{fill("{overlapTo}")}
              </div>
              <p>{rich(copy.overlapText, rt)}</p>
              <div className="mono" style={{ textAlign: "right" }}>
                {lines(copy.overlapStats, rt)}
              </div>
            </div>
          </div>
        </div>

        {/* The certificate, at reproduction size. It is the one document on
            the site where the color reveal carries real information — the
            IW pink is the whole point of the plate. */}
        {her.recognition ? (
          <div className="sec">
            <SectionHead
              no="·"
              title="The certificate"
              right={
                <>
                  {her.recognition.org} · {her.recognition.year}
                  <br />
                  Verified
                </>
              }
            />
            <div className="rec" id="recognition">
              <div>
                <div className="rt">
                  {her.recognition.org.split(" ")[0]}
                  <br />
                  {her.recognition.org.split(" ").slice(1).join(" ")}{" "}
                  {her.recognition.year}
                </div>
                {her.recognition.tagline ? (
                  <p className="tl">“{her.recognition.tagline}”</p>
                ) : null}
                <div
                  style={{ display: "flex", gap: 9, marginTop: 14, flexWrap: "wrap" }}
                >
                  {her.recognition.videoId ? (
                    <a
                      className="btn alt"
                      href={`https://vimeo.com/${her.recognition.videoId}/${her.recognition.videoHash ?? ""}`}
                    >
                      Watch the film
                    </a>
                  ) : null}
                  {her.recognition.orgUrl ? (
                    <a className="btn gho" href={her.recognition.orgUrl}>
                      influentialwomen.com
                    </a>
                  ) : null}
                </div>
              </div>
              <div>
                <Plate
                  full={her.recognition.certificateUrl}
                  title="Influential Women recognition certificate"
                  detail={`${her.name} · ${her.title}, ${her.company} · ${her.recognition.year}`}
                  label="Show the certificate in color"
                  gamma={0.72}
                  ar={1.09}
                  crush={false}
                  crop="0.5,0.5,1.0"
                />
                <Caption
                  left="The certificate · verified"
                  right="Color reveals the IW pink"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="sec">
          <div className="end">
            <div className="kick">{copy.backLabel}</div>
            <div style={{ display: "flex", gap: 9, marginTop: 13, flexWrap: "wrap" }}>
              <Link className="btn gho" href="/#two">
                The issue
              </Link>
              <Link className="btn gho" href="/#counted">
                Counted
              </Link>
              <Link className="btn gho" href="/#written">
                Written
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Folio n="02" />
    </>
  );
}
