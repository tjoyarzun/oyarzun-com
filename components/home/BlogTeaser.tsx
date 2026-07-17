import Link from "next/link";
import { getAllPosts, type PostMeta } from "@/lib/posts";
import BlogCard from "@/components/blog/BlogCard";

function CompactBlogCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block bg-white dark:bg-[#1C1A18] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 group"
    >
      <div className="overflow-hidden h-28">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="font-semibold text-sm text-navy dark:text-white leading-snug line-clamp-2 group-hover:text-teal transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}

export default function BlogTeaser() {
  const posts = getAllPosts()
    .filter((p) => !p.draft)
    .slice(0, 3);
  if (posts.length === 0) return null;

  const [latest, ...rest] = posts;

  return (
    <section>
      <h2 className="font-display font-bold text-2xl text-navy dark:text-white mb-6">
        From the Blog
      </h2>

      <div className="space-y-6">
        <BlogCard post={latest} />

        {rest.length > 0 && (
          <div className="space-y-4">
            {rest.map((post) => (
              <CompactBlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="inline-block text-sm font-semibold text-teal hover:underline"
        >
          View all posts →
        </Link>
      </div>
    </section>
  );
}
