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
import { plates, us as copy } from "@/lib/copy";
import { lines, rich } from "@/lib/thrasher/fill";
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

export default function Us() {
  const { him, her } = profiles;

  return (
    <>
      <RunningHead
        dept="The two of us"
        middle="Two profiles · one overlap · Sandy, Utah"
      />

      <main id="main" className="spread">
        <Mast
          tight={false}
          kicker={copy.kicker}
          headline={copy.headline}
          stats={lines(copy.stats)}
        >
          {copy.dek.map((para, i) => (
            <p key={i}>{rich(para)}</p>
          ))}
        </Mast>

        <div className="sec">
          <div className="pair" id="pair">
            <ProfileColumn
              who="him"
              profile={him}
              portrait={plates.portraitHim}
              years={12}
              place="Sandy, UT · 4,505 ft"
              extraFields={[
                { label: "Commits, 12 mo", value: figures.githubCommits.toLocaleString() },
              ]}
            >
              <h4 className="blk">Commits · 52 weeks</h4>
              <div className="heat" id="heat" data-user={him.github} />
              <Caption
                left="Live from the GitHub GraphQL API · public contributions only"
                right="Vermilion = top decile"
              />
            </ProfileColumn>

            <div className="div" />

            <ProfileColumn
              who="her"
              profile={her}
              portrait={plates.portraitHer}
              years={10}
              place="Draper, UT · hybrid"
              extraFields={[
                { label: "Books, 2026", value: String(figures.booksReadThisYear) },
              ]}
            />

            <div className="overlap" id="overlap">
              <div className="big">
                2014
                <br />
                –2019
              </div>
              <p>{rich(copy.overlapText)}</p>
              <div className="mono" style={{ textAlign: "right" }}>
                {lines(copy.overlapStats)}
              </div>
            </div>
          </div>
        </div>

        {/* The certificate, at reproduction size. It is the one document on
            the site where the colour reveal carries real information — the
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
