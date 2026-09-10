import Link from "next/link";
import Plate from "@/components/thrasher/Plate";
import {
  Caption,
  DeptBar,
  Mast,
  SectionHead,
} from "@/components/thrasher/editorial";
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
  const [featured] = posts;
  const goal = GOALS.find((g) => g.label === "Written");
  const remaining = Math.max(0, (goal?.goal ?? 5) - posts.length);

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
                style={{
                  display: "flex",
                  gap: 9,
                  marginTop: 16,
                  flexWrap: "wrap",
                }}
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
                left={
                  cover.placeholder
                    ? "Stand-in cover — real cover is remote"
                    : "Cover image"
                }
                right="Screen 3.4px"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="sec">
        <SectionHead
          no="·"
          title="Everything written"
          right={
            <>
              {posts.length} of {goal?.goal ?? 5} for 2026
              <br />
              Newest first
            </>
          }
        />

        <div className="windex">
          {posts.map((p, i) => (
            <div className="wrow" key={p.slug}>
              <div className="wn">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <h3 className="wt">
                  <Link href={`/written/${p.slug}`}>{p.title}</Link>
                </h3>
                <p className="wx">{p.excerpt}</p>
              </div>
              <div className="wm2">
                <span className="wa">{AUTHOR[p.author]}</span>
                <span>{dateline(p.date)}</span>
                <span>{p.readTime} min read</span>
                <div className="wtags">
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* One band per unwritten slot, numbered in sequence. Drawing the
              gap is the point — three empty bands say more about the 2026
              goal than a sentence claiming two of five. */}
          {Array.from({ length: remaining }, (_, i) => (
            <div className="wrow empty" key={`slot-${i}`} aria-hidden="true">
              <div className="wn">
                {String(posts.length + i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="wt">Unwritten</h3>
                <p className="wx">
                  {i === 0
                    ? "Next up. The slots are drawn so the gap to the 2026 goal is part of the list rather than a claim above it."
                    : ""}
                </p>
              </div>
              <div className="wm2">
                <span>Slot open</span>
              </div>
            </div>
          ))}
        </div>

        <Caption
          left={`${posts.length} published · ${remaining} slots open against the 2026 goal`}
          right="Newest first · numbered in sequence"
        />
      </div>
    </section>
  );
}
