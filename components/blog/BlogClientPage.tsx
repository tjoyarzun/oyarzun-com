"use client";

import { useState, useMemo } from "react";
import { type PostMeta } from "@/lib/posts";
import FeaturedPost from "./FeaturedPost";
import TagFilter from "./TagFilter";
import BlogCard from "./BlogCard";

interface BlogClientPageProps {
  posts: PostMeta[];
}

type AuthorFilter = "All" | "him" | "her" | "both";

const AUTHOR_OPTIONS: { value: AuthorFilter; label: string }[] = [
  { value: "All", label: "Everyone" },
  { value: "him", label: "Tommy" },
  { value: "her", label: "Julia" },
  { value: "both", label: "Both" },
];

export default function BlogClientPage({ posts }: BlogClientPageProps) {
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorFilter>("All");

  // Derive tags dynamically so new posts automatically appear as filter chips
  const allTags = useMemo(() => {
    const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
    return ["All", ...tags];
  }, [posts]);

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          (selectedTag === "All" || p.tags.includes(selectedTag)) &&
          (selectedAuthor === "All" || p.author === selectedAuthor),
      ),
    [posts, selectedTag, selectedAuthor],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-slate dark:bg-[#121110]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-widest text-teal-dark dark:text-teal uppercase font-medium mb-3">
            The Blog
          </p>
          <h1 className="font-display text-5xl font-bold text-navy dark:text-white">
            From the Blog
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
            Data, mountains, and everything in between.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 space-y-3">
          <TagFilter
            tags={allTags}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
              Author
            </span>
            {AUTHOR_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedAuthor(value)}
                className={
                  selectedAuthor === value
                    ? "bg-navy dark:bg-white/20 text-white text-sm font-medium rounded-full px-4 py-1.5 transition-colors duration-200 shrink-0"
                    : "bg-gray-100 dark:bg-[#1C1A18] text-gray-600 dark:text-gray-300 hover:bg-navy/10 dark:hover:bg-white/10 text-sm font-medium rounded-full px-4 py-1.5 transition-colors duration-200 shrink-0"
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured post */}
        {featured && (
          <div className="mb-12">
            <FeaturedPost post={featured} />
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <>
            <div className="border-t border-gray-200 dark:border-gray-700 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No posts match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
