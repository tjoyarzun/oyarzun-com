"use client";

import { useState } from "react";
import { type PostMeta } from "@/lib/posts";
import FeaturedPost from "./FeaturedPost";
import TagFilter from "./TagFilter";
import BlogCard from "./BlogCard";

interface BlogClientPageProps {
  posts: PostMeta[];
}

const ALL_TAGS = [
  "All",
  "Data Engineering",
  "Analytics",
  "Utah",
  "Career",
  "Tools & Stack",
  "Family",
];

export default function BlogClientPage({ posts }: BlogClientPageProps) {
  const [selectedTag, setSelectedTag] = useState("All");

  const filtered =
    selectedTag === "All"
      ? posts
      : posts.filter((p) => p.tags.includes(selectedTag));

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

        {/* Tag Filter */}
        <div className="mb-10">
          <TagFilter
            tags={ALL_TAGS}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
          />
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
            No posts tagged &quot;{selectedTag}&quot; yet.
          </div>
        )}
      </div>
    </div>
  );
}
