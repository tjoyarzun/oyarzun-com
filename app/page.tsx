import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import MemoryOfDay from "@/components/home/MemoryOfDay";
import NavGrid from "@/components/home/NavGrid";
import CurrentlyWidget from "@/components/home/CurrentlyWidget";
import { getAllPosts } from "@/lib/posts";

const authorLabel: Record<string, string> = {
  him: "Tommy",
  her: "Julia",
  both: "Tommy & Julia",
};

const authorColor: Record<string, string> = {
  him: "bg-navy/10 text-navy dark:bg-navy/30 dark:text-blue-200",
  her: "bg-teal/10 text-teal dark:bg-teal/20 dark:text-teal",
  both: "bg-orange/10 text-orange dark:bg-orange/20 dark:text-orange",
};

export default function HomePage() {
  const featured = getAllPosts().slice(0, 3);

  return (
    <>
      <HeroSection />

      <div className="bg-slate dark:bg-[#121110]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-12">
              <MemoryOfDay />

              <NavGrid />

              {/* Recent blog posts */}
              <section>
                <h2 className="font-display font-bold text-2xl text-navy dark:text-white mb-6">
                  From the Blog
                </h2>
                <div className="space-y-4">
                  {featured.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <article className="bg-white dark:bg-[#1C1A18] rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-200">
                        {/* Cover image */}
                        <div className="sm:w-36 sm:flex-shrink-0 aspect-video sm:aspect-auto overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Text */}
                        <div className="p-5 flex flex-col justify-between gap-2 min-w-0">
                          <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${authorColor[post.author]}`}
                              >
                                {authorLabel[post.author]}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(post.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                              <span className="text-xs text-gray-400">
                                · {post.readTime} min read
                              </span>
                            </div>
                            <h3 className="font-semibold text-navy dark:text-white text-sm leading-snug group-hover:text-teal dark:group-hover:text-teal transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
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
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <CurrentlyWidget />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
