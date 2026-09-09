import Link from "next/link";
import Plate from "@/components/thrasher/Plate";
import { Caption, DeptBar, Mast, SectionHead } from "@/components/thrasher/editorial";
import { getAllPosts } from "@/lib/posts";
import { GOALS, dateline, plateSource } from "@/lib/thrasher/issue";

/**
 * 06 · Written.
 *
 * There is no separate /blog. This department IS the index, and each post is
 * a real route at /written/<slug> — because a post you cannot link to is not
 * published, and an anchor cannot carry its own OG image or be noindexed.
 *
 * The empty slot is drawn deliberately. Two of five against the 2026 goal,
 * and the gap is printed rather than hidden.
 */
const AUTHOR = { him: "Him", her: "Her", both: "Both" } as const;

export default function Written() {
  const posts = getAllPosts().filter((p) => !p.draft);
  const [featured, ...rest] = posts;
  const goal = GOALS.find((g) => g.label === "Written");
  const remaining = Math.max(0, (goal?.goal ?? 5) - posts.length);

  /* Tag counts, ordered by frequency then alphabetically, so the filter row
     is stable across rebuilds. */
  const counts = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  const tags = Array.from(counts.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  const cover = featured ? plateSource(featured.coverImage) : null;

  return (
    <section className="dept" id="written" data-dept="Written" data-folio="06">
      <DeptBar
        folio="06"
        name="Written"
        kicker={`${posts.length} posts · ${new Set(posts.map((p) => p.author)).size} authors`}
      />

      <Mast
        kicker="Two posts · two authors · each with its own address"
        headline="Written"
        stats={
          <>
            {posts.length} published · 0 drafts
            <br />
            next-mdx-remote
            <br />
            /written/&lt;slug&gt;
          </>
        }
      >
        <p>
          Two posts so far against a target of five. Each one is its own page
          with its own address, because a post you cannot link to is not
          published.
        </p>
      </Mast>

      {featured && cover ? (
        <div className="sec">
          <div className="feat">
            <div>
              <div className="kick">
                Featured · {AUTHOR[featured.author].toLowerCase()} ·{" "}
                {dateline(featured.date)} · {featured.readTime} min
              </div>
              <h3 className="ft">
                <Link href={`/written/${featured.slug}`}>{featured.title}</Link>
              </h3>
              <p>{featured.excerpt}</p>
              <div
                style={{ display: "flex", gap: 9, marginTop: 16, flexWrap: "wrap" }}
              >
                <Link className="btn" href={`/written/${featured.slug}`}>
                  Read the post
                </Link>
              </div>
            </div>
            <div>
              <Plate
                full={cover.src}
                title={`Cover · ${featured.title}`}
                detail="Cover image · 2026"
                label="Show the cover in colour"
                pitch={3.4}
                gamma={1.06}
                ar={1.5}
                crop="0.5,0.36,0.7"
              />
              <Caption
                left={cover.placeholder ? "Stand-in cover — real cover is remote" : "Cover image"}
                right="Screen 3.4px"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="sec">
        <SectionHead lite no="·" title="Everything written" right="Filter by tag" />
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}
        >
          {/* Phase 1 renders the filter row without behaviour: the counts are
              real, the buttons are inert. Wiring it needs client state and
              belongs with the rest of the interactive work. */}
          <button className="tag" type="button" aria-pressed="true">
            All · {posts.length}
          </button>
          {tags.map(([t, n]) => (
            <button className="tag" type="button" key={t}>
              {t} · {n}
            </button>
          ))}
        </div>

        <div className="three">
          {posts.map((p) => (
            <div className="bcard" key={p.slug}>
              <div className="kick">
                {dateline(p.date)} · {p.readTime} min · {AUTHOR[p.author]}
              </div>
              <div className="bh">
                <Link href={`/written/${p.slug}`}>{p.title}</Link>
              </div>
              <p>{p.excerpt}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 11 }}>
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {remaining > 0 ? (
            <div className="bcard" style={{ borderTopStyle: "dashed" }}>
              <div className="kick" style={{ color: "var(--red)" }}>
                Empty slot
              </div>
              <div className="bh" style={{ color: "var(--ink45)" }}>
                {remaining} more to write
              </div>
              <p>
                {posts.length} of {goal?.goal ?? 5} against the 2026 goal. Drawn
                so the gap is visible rather than hidden.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
