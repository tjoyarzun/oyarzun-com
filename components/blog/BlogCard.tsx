"use client";

import { motion } from "framer-motion";
import { type PostMeta } from "@/lib/posts";

interface BlogCardProps {
  post: PostMeta;
}

const authorConfig = {
  him: { label: "Tommy", bg: "bg-teal", text: "text-white" },
  her: { label: "Julia", bg: "bg-orange", text: "text-white" },
  both: { label: "Both of Us", bg: "bg-navy", text: "text-white" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogCard({ post }: BlogCardProps) {
  const author = authorConfig[post.author];

  return (
    <motion.a
      href={`/blog/${post.slug}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="block bg-white dark:bg-[#1C1A18] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      {/* Cover image */}
      <div className="overflow-hidden h-48">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        {/* Author badge */}
        <div>
          <span
            className={`${author.bg} ${author.text} text-xs font-semibold rounded-full px-3 py-1`}
          >
            {author.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg leading-snug text-gray-900 dark:text-white">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Bottom row: date · read time · tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(post.date)}
          </span>
          <span className="text-xs text-gray-300 dark:text-gray-600">
            &middot;
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {post.readTime} min read
          </span>

          {/* Draft chip */}
          {post.draft && (
            <span className="text-xs font-medium rounded-full px-2.5 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500">
              draft
            </span>
          )}

          {/* First 2 tags */}
          <div className="flex gap-1.5 ml-auto">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-teal/10 text-teal-dark dark:text-teal text-xs font-medium rounded-full px-2.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
}
