import type { Metadata } from "next";
import FamilyAlbum from "@/components/thrasher/FamilyAlbum";
import { Folio, Mast, RunningHead } from "@/components/thrasher/editorial";

/**
 * /family — the one page in the issue that has to be a real route.
 *
 * You cannot noindex an anchor. A gated album living at /#family would be
 * crawled, indexed and summarised along with the rest of the scroll, because
 * robots directives are per-URL. That single fact is what settled the
 * one-scroll-versus-routes question: everything browsable is one scroll, and
 * the two things that need their own URL — posts and this — get one.
 */
export const metadata: Metadata = {
  title: "Private · Oyarzun",
  description: "A gated family album. Not indexed.",
  robots: { index: false, follow: false },
};

export default function Family() {
  return (
    <>
      <RunningHead dept="Private" middle="Password required · not indexed" />
      <main id="main">
        <Mast
          tight={false}
          kicker="For family · not indexed, not shared"
          headline="Private"
          stats={
            <>
              Password required
              <br />
              Twenty photographs
              <br />
              noindex, nofollow
            </>
          }
        >
          <p>
            This section is for family. Nothing behind it is indexed, nothing is
            shared, and nothing on this site is measuring you.
          </p>
        </Mast>
        <FamilyAlbum />
      </main>
      <Folio n="07" />
    </>
  );
}
