"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FamilyPost {
  id: number;
  author: string;
  date: string;
  caption: string;
  imageUrl: string;
  reactions: { heart: number; laugh: number; wow: number };
}

interface FamilyFeedProps {
  posts: FamilyPost[];
}

const AVATAR_COLORS: Record<string, string> = {
  Tommy: "bg-[#1C1917]",
  Julia: "bg-[#C8973E]",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface ReactionState {
  heart: number;
  laugh: number;
  wow: number;
  active: Set<"heart" | "laugh" | "wow">;
}

function PostCard({ post }: { post: FamilyPost }) {
  const [reactions, setReactions] = useState<ReactionState>({
    heart: post.reactions.heart,
    laugh: post.reactions.laugh,
    wow: post.reactions.wow,
    active: new Set(),
  });

  const toggle = (type: "heart" | "laugh" | "wow") => {
    setReactions((prev) => {
      const active = new Set(prev.active);
      const delta = active.has(type) ? -1 : 1;
      if (delta > 0) active.add(type);
      else active.delete(type);
      return { ...prev, [type]: prev[type] + delta, active };
    });
  };

  const avatarColor = AVATAR_COLORS[post.author] ?? "bg-[#D4614A]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
      className="bg-white dark:bg-[#1C1A18] rounded-2xl shadow-sm overflow-hidden transition-shadow"
    >
      {/* Post image */}
      <img
        src={post.imageUrl}
        alt={post.caption}
        className="h-48 w-full object-cover"
        loading="lazy"
      />

      {/* Content */}
      <div className="p-4">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`${avatarColor} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
          >
            {getInitials(post.author)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
              {post.author}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {formatDate(post.date)}
            </p>
          </div>
        </div>

        {/* Caption */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {post.caption}
        </p>

        {/* Reactions */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {(
            [
              { type: "heart", emoji: "❤️" },
              { type: "laugh", emoji: "😂" },
              { type: "wow", emoji: "😮" },
            ] as const
          ).map(({ type, emoji }) => (
            <button
              key={type}
              onClick={() => toggle(type)}
              className={`flex items-center gap-1 text-sm rounded-full px-3 py-1 transition-all ${
                reactions.active.has(type)
                  ? "bg-[#C8973E]/10 text-[#C8973E] font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span>{emoji}</span>
              <span>{reactions[type]}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function FamilyFeed({ posts }: FamilyFeedProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Recent Posts
      </h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
