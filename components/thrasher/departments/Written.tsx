import Link from "next/link";
import Plate from "@/components/thrasher/Plate";
import {
  Caption,
  DeptBar,
  Mast,
  SectionHead,
} from "@/components/thrasher/editorial";
import { getAllPosts } from "@/lib/posts";
import { departments } from "@/lib/copy";
import { fill, lines, rich } from "@/lib/thrasher/fill";
import { dateline, plateSource, postsGoal } from "@/lib/thrasher/issue";

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
  const remaining = Math.max(0, postsGoal - posts.length);

  const cover = featured ? plateSource(featured.coverImage) : null;
  const d = departments.written;

  return (
    <section className="dept" id="written" data-dept={d.name} data-folio={d.folio}>
      <DeptBar folio={d.folio} name={d.name} kicker={fill(d.deptKicker)} />

      <Mast
        kicker={fill(d.kicker)}
        headline={fill(d.headline)}
        stats={lines(d.stats)}
      >
        {d.dek.map((para, i) => (
          <p key={i}>{rich(para)}</p>
        ))}
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
                crop="0.5,0.4,1.0"
              />
              <Caption
                left={
                  cover.placeholder
                    ? "Stand-in — this post's cover is on another server and cannot be screened"
                    : `Cover · ${featured.title}`
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
          title={d.indexTitle}
          right={
            <>
              {posts.length} of {postsGoal} for 2026
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
                <h3 className="wt">{d.emptyTitle}</h3>
                <p className="wx">
                  {i === 0 ? fill(d.emptyFirstBlurb) : ""}
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
