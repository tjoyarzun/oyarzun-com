import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPost } from "@/lib/posts";
import { Folio, RunningHead } from "@/components/thrasher/editorial";
import { profiles } from "@/lib/data";
import { dateline, longDate } from "@/lib/thrasher/issue";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

/**
 * Per-post metadata is one of the two reasons this is a real route and not an
 * anchor on the one scroll: an anchor cannot carry its own title, description
 * or share image.
 */
export function generateMetadata({ params }: Props): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} · Oyarzun`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

/**
 * Should the standing initial be suppressed?
 *
 * It is set with ::first-letter, which takes exactly one letter — so a
 * paragraph opening on an acronym gets split: "AI will not eliminate work"
 * sets as a boxed A followed by "I will not eliminate work". CSS cannot see
 * the word, and re-writing the post to avoid the case would be the design
 * dictating the prose, so it is detected here.
 *
 * Read the FIRST PARAGRAPH, not the first word of the file. The CSS targets
 * `p:first-of-type`, so a post that opens with a heading, a list or a
 * blockquote still gets its initial on the paragraph further down — while
 * the old check looked at the very first token, saw "##" or ">" or "-",
 * found no acronym and let the initial through onto a paragraph that did
 * start with one. The two have to look at the same paragraph.
 */
function opensOnAcronym(content: string): boolean {
  const body = content.replace(/^\s*(?:import[^\n]*\n|\n)*/, "");
  /* The first block that will render as a <p>: not a heading, list, quote,
     fence, table, image or rule. */
  const para = body
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .find((b) => b && !/^(?:#{1,6} |[-*+] |\d+\. |> |```|\||!\[|---|===)/.test(b));
  if (!para) return false;
  const firstWord = para.split(/\s+/)[0]?.replace(/[^A-Za-z]/g, "");
  return (
    !!firstWord && firstWord.length > 1 && firstWord === firstWord.toUpperCase()
  );
}

const BYLINE = {
  him: profiles.him,
  her: profiles.her,
  both: profiles.him,
} as const;

const POSSESSIVE = { him: "His", her: "Her", both: "Their" } as const;
const PRONOUN = { him: "him", her: "her", both: "them" } as const;

export default function WrittenPost({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const author = BYLINE[post.author];
  const posts = getAllPosts().filter((p) => !p.draft);
  const next = posts.find((p) => p.slug !== post.slug);

  return (
    <>
      <RunningHead
        dept="Written"
        href="/#written"
        middle={`${author.name} · ${post.readTime} min read`}
      />

      <main id="main">
        <article className="article">
          <div className="hd">
            <div className="kick">
              Written · {PRONOUN[post.author]} · {dateline(post.date)} ·{" "}
              {post.readTime} min read
            </div>
            <h1>{post.title}</h1>
            <div className="byl">
              <span className="mono">{author.name}</span>
              <span className="mono">
                {author.title}, {author.company}
              </span>
              <span className="mono">{post.tags.join(" · ")}</span>
            </div>
          </div>

          <div className="artgrid">
            <div>
              {/* The design system styles the article body directly — the
                  standing initial, the display-face subheads, the reversed
                  pull-quote — so the MDX is rendered unstyled into `.body`
                  rather than through @tailwindcss/typography's `prose`. Two
                  systems fighting over the same paragraphs is how the old
                  page ended up with a serif stack inside a sans design. */}
              <div
                /* `dropCap: false` in a post's frontmatter forces the
                   initial off; `true` forces it on even where the rule would
                   have suppressed it. Left unset — which is every post so
                   far — the rule above decides. */
                className={
                  (
                    post.dropCap ?? !opensOnAcronym(post.content)
                  )
                    ? "body"
                    : "body no-initial"
                }
                style={{ marginTop: 26 }}
              >
                <MDXRemote
                  source={post.content}
                  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                />
              </div>

              <div className="end">
                <div className="kick">
                  {author.name} · {author.title}, {author.company} ·{" "}
                  {longDate(post.date)}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 9,
                    marginTop: 13,
                    flexWrap: "wrap",
                  }}
                >
                  <Link className="btn gho" href="/#written">
                    Everything written
                  </Link>
                  <Link className="btn gho" href="/#two">
                    {POSSESSIVE[post.author]} profile
                  </Link>
                </div>
              </div>
            </div>

            <aside className="marg">
              {/* The header already carries the author, the date, the read
                  time and the tags. On a phone the rail repeats all four
                  below the article, so those three blocks are hidden there
                  and only "Next" survives — see the 860px block in
                  globals.css. Classed rather than conditionally rendered, so
                  the markup is identical at every width. */}
              <div className="mb author">
                <p className="mbl">Author</p>
                <div className="mv">
                  <b>{author.name}</b>
                  {author.title}, {author.company}
                </div>
              </div>
              <div className="mb published">
                <p className="mbl">Published</p>
                <div className="mv">
                  {longDate(post.date)}
                  <br />
                  {post.readTime} minute read
                </div>
              </div>
              <div className="mb tags">
                <p className="mbl">Tags</p>
                <div className="tl2">
                  {post.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {next ? (
                <div className="mb next">
                  <p className="mbl">Next</p>
                  <div className="mv">
                    <Link
                      href={`/written/${next.slug}`}
                      style={{ textDecoration: "underline" }}
                    >
                      {next.title}
                    </Link>
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </article>
      </main>

      <Folio n="05b" />
    </>
  );
}
