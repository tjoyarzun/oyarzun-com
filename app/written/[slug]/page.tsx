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
 * Does the post open on an acronym?
 *
 * The standing initial is set with ::first-letter, which takes exactly one
 * letter — so "AI will not eliminate work" renders as a boxed A followed by
 * "I will not eliminate work". Detecting it here and suppressing the initial
 * is the only reliable fix: CSS cannot see the word, and re-writing the post
 * to avoid the case would be the design dictating the prose.
 */
function opensOnAcronym(content: string): boolean {
  const firstWord = content
    .replace(/^\s*(?:import[^\n]*\n|\n)*/, "")
    .trim()
    .split(/\s+/)[0]
    ?.replace(/[^A-Za-z]/g, "");
  return !!firstWord && firstWord.length > 1 && firstWord === firstWord.toUpperCase();
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
                className={
                  opensOnAcronym(post.content) ? "body no-initial" : "body"
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
                <h5>Author</h5>
                <div className="mv">
                  <b>{author.name}</b>
                  {author.title}, {author.company}
                </div>
              </div>
              <div className="mb published">
                <h5>Published</h5>
                <div className="mv">
                  {longDate(post.date)}
                  <br />
                  {post.readTime} minute read
                </div>
              </div>
              <div className="mb tags">
                <h5>Tags</h5>
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
                  <h5>Next</h5>
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
