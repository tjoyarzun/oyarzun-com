import Cover from "@/components/thrasher/departments/Cover";
import TwoOfUs from "@/components/thrasher/departments/TwoOfUs";
import Counted from "@/components/thrasher/departments/Counted";
import Away from "@/components/thrasher/departments/Away";
import RightNow from "@/components/thrasher/departments/RightNow";
import Written from "@/components/thrasher/departments/Written";
import { Folio, RunningHead } from "@/components/thrasher/editorial";

/**
 * The one scroll.
 *
 * Six departments in a fixed order, and the order is the argument: the reader
 * meets the two of us before the figures, because the figures only mean
 * something once you know whose they are. Cover, then the feature, then what
 * was counted, then where we went, then what we wrote — and Right now last,
 * because it is the only department that goes stale on purpose. Everything
 * above it is a record; that one is a snapshot with a date on it, and it
 * belongs at the end where a colophon would sit.
 *
 * The running head and the folio advance as you scroll — the scroll-spy in
 * lib/thrasher/behaviours.ts picks the topmost department above the fold line
 * and writes into `#dept` and `#folio`, which is why both are marked `live`.
 *
 * What is NOT here, on purpose: /written/<slug> and /family. Both need to be
 * real routes — a post needs its own address and its own OG image, and you
 * cannot noindex an anchor, so a gated album cannot live on a public scroll.
 */
export default function Home() {
  return (
    <>
      <RunningHead
        live
        dept="Cover"
        middle="Two subjects · six departments · one issue"
      />
      <main id="main">
        <Cover />
        <TwoOfUs />
        <Counted />
        <Away />
        <Written />
        <RightNow />
      </main>
      <Folio live n="01" />
    </>
  );
}
