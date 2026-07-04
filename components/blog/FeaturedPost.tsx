"use client";

import { motion } from "framer-motion";
import { type PostMeta } from "@/lib/posts";

interface FeaturedPostProps {
  post: PostMeta;
}

const authorConfig = {
  him: { label: "By Tommy", bg: "bg-teal", text: "text-white" },
  her: { label: "By Julia", bg: "bg-orange", text: "text-white" },
  both: { label: "By Both", bg: "bg-navy", text: "text-white" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  const author = authorConfig[post.author];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden bg-white dark:bg-[#1C1A18] shadow-md"
    >
      <div className="flex flex-col md:flex-row min-h-80">
        {/* Cover Image — full width on mobile, 60% on md+ */}
        <div className="w-full md:w-[60%] relative overflow-hidden min-h-64 md:min-h-0">
          <img
            src={`https://picsum.photos/seed/${post.slug}/800/450`}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ minHeight: "260px" }}
          />
        </div>

        {/* Content — right side */}
        <div className="w-full md:w-[40%] flex flex-col justify-center p-6 md:p-8 gap-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-teal text-white text-xs rounded-full px-3 py-1 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-gray-900 dark:text-white">
            {post.title}
          </h2>

          {/* Author badge + meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`${author.bg} ${author.text} text-xs font-semibold rounded-full px-3 py-1`}
            >
              {author.label}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.date)} &middot; {post.readTime} min read
            </span>
          </div>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            {post.excerpt}
          </p>

          {/* CTA */}
          <div>
            <a
              href={`/blog/${post.slug}`}
              className="inline-block bg-teal hover:bg-teal/90 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200"
            >
              Read Article →
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
