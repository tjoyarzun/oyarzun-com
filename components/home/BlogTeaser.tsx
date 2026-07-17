import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogCard from "@/components/blog/BlogCard";

export default function BlogTeaser() {
  const posts = getAllPosts().filter((p) => !p.draft);
  if (posts.length === 0) return null;

  const [latest, ...rest] = posts;
  const secondary = rest.slice(0, 2);

  return (
    <section>
      <h2 className="font-display font-bold text-2xl text-navy dark:text-white mb-1">
        From the Blog
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Tech, AI, trip stories, and whatever else we&apos;re into.
      </p>

      <div className="space-y-6">
        <FeaturedPost post={latest} />

        {secondary.length > 0 && (
          <div
            className={`grid grid-cols-1 ${
              secondary.length > 1 ? "sm:grid-cols-2" : ""
            } gap-4`}
          >
            {secondary.map((post) => (
              <BlogCard key={post.slug} post={post} />
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
