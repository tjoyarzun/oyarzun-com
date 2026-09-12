import type { Metadata } from "next";
import FamilyAlbum from "@/components/thrasher/FamilyAlbum";
import { Folio, Mast, RunningHead } from "@/components/thrasher/editorial";
import { family as copy } from "@/lib/copy";
import { fill, fillAll, lines, rich } from "@/lib/thrasher/fill";

/**
 * /family — the one page in the issue that has to be a real route.
 *
 * You cannot noindex an anchor. A gated album living at /#family would be
 * crawled, indexed and summarized along with the rest of the scroll, because
 * robots directives are per-URL. That single fact is what settled the
 * one-scroll-versus-routes question: everything browsable is one scroll, and
 * the two things that need their own URL — posts and this — get one.
 */
export const metadata: Metadata = {
  title: "Private · Oyarzun",
  description: "A gated family album. Not indexed.",
  robots: { index: false, follow: false },
  /* Stated rather than inherited, and with an empty image list on purpose.
     Without this the page took the root card — the cover photograph, the home
     page's title, and an og:url of "/", which is not this page. An OG image is
     a copy of the picture handed to anyone who has the link and cached by
     whatever renders the preview, so an unlisted album should not ship one. */
  openGraph: {
    title: "Private · Oyarzun",
    description: "A gated family album. Not indexed.",
    url: "/family",
    images: [],
  },
};

export default function Family() {
  return (
    <>
      <RunningHead dept="Private" middle="Password required · not indexed" />
      <main id="main">
        <Mast
        /* Its own page, so its masthead is that page's h1. */
        level={1}
          tight={false}
          kicker={fill(copy.kicker)}
          headline={fill(copy.headline)}
          stats={lines(copy.stats)}
        >
          {copy.dek.map((para, i) => (
            <p key={i}>{rich(para)}</p>
          ))}
        </Mast>
        {/* Tokens resolved here, on the server, because FamilyAlbum is a
            client component and fill() cannot cross that boundary. */}
        <FamilyAlbum
          copy={{
            gateHeadline: fillAll(copy.gateHeadline),
            gateText: fill(copy.gateText),
            lockedHeadline: fillAll(copy.lockedHeadline),
            lockedText: fill(copy.lockedText),
          }}
        />
      </main>
      <Folio n="07" />
    </>
  );
}
