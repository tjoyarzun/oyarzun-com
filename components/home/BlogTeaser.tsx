import Link from "next/link";
import { getAllPosts, type PostMeta } from "@/lib/posts";
import FeaturedPost from "@/components/blog/FeaturedPost";

function BlogThumbRow({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex gap-4 items-start group">
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-sm text-navy dark:text-white leading-snug line-clamp-2 group-hover:text-teal transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
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
        <FeaturedPost post={latest} />

        {rest.length > 0 && (
          <div className="space-y-5">
            {rest.map((post) => (
              <BlogThumbRow key={post.slug} post={post} />
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
