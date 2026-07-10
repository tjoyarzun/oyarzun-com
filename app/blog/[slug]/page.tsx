import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPost } from "@/lib/posts";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

const authorConfig = {
  him: { label: "By Tommy", bg: "bg-teal", text: "text-white" },
  her: { label: "By Julia", bg: "bg-orange", text: "text-white" },
  both: { label: "By Both", bg: "bg-navy", text: "text-white" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const author = authorConfig[post.author];

  return (
    <div className="min-h-screen bg-slate dark:bg-[#121110]">
      {/* Hero */}
      <div className="w-full h-72 md:h-96 relative overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-teal text-white text-xs font-medium rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3 border-b border-gray-200 dark:border-gray-700">
        <span
          className={`${author.bg} ${author.text} text-xs font-semibold rounded-full px-3 py-1`}
        >
          {author.label}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(post.date)}
        </span>
        <span className="text-gray-300 dark:text-gray-600">&middot;</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {post.readTime} min read
        </span>
        <Link
          href="/blog"
          className="ml-auto text-sm text-teal-dark dark:text-teal hover:underline"
        >
          ← All posts
        </Link>
      </div>

      {/* Body */}
      <article className="max-w-4xl mx-auto px-4 py-12 prose prose-lg dark:prose-invert prose-headings:font-display prose-a:text-teal-dark dark:prose-a:text-teal prose-code:text-teal-dark dark:prose-code:text-teal prose-code:bg-gray-100 dark:prose-code:bg-[#1C1A18] prose-pre:bg-[#1C1A18] dark:prose-pre:bg-[#121110] prose-table:w-full prose-th:text-left prose-th:font-semibold prose-td:align-top">
        <MDXRemote
          source={post.content}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>

      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-teal-dark dark:text-teal font-medium hover:underline"
        >
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}
