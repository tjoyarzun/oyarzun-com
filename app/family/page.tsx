"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FamilyGate from "@/components/family/FamilyGate";
import FamilyFeed from "@/components/family/FamilyFeed";
import PhotoGallery from "@/components/family/PhotoGallery";
import AlbumCards from "@/components/family/AlbumCards";
import { familyPhotos, familyFeedPosts, upcomingEvents } from "@/lib/data";

const albums = [
  {
    name: "Summer 2024",
    count: 142,
    coverUrl: "https://picsum.photos/seed/album1/400/250",
    dateRange: "Jun–Aug 2024",
  },
  {
    name: "Ski Season 23-24",
    count: 89,
    coverUrl: "https://picsum.photos/seed/album2/400/250",
    dateRange: "Nov 2023–Apr 2024",
  },
  {
    name: "Anniversary Trip",
    count: 67,
    coverUrl: "https://picsum.photos/seed/album3/400/250",
    dateRange: "Sep 2023",
  },
  {
    name: "Holidays 2023",
    count: 203,
    coverUrl: "https://picsum.photos/seed/album4/400/250",
    dateRange: "Nov–Dec 2023",
  },
];

const today = new Date();
const christmas = new Date(today.getFullYear(), 11, 25);
const daysUntilChristmas = Math.ceil(
  (christmas.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
);

const stats = [
  { label: "Members", value: "4", emoji: "👨‍👩‍👧‍👦" },
  { label: "Photos", value: "3,847", emoji: "📸" },
  { label: "Recipes", value: "112", emoji: "🍳" },
  {
    label: "Days til Christmas",
    value: String(daysUntilChristmas),
    emoji: "🎄",
  },
];

const quickActions = [
  { icon: "📅", label: "Calendar" },
  { icon: "🍳", label: "Recipes" },
  { icon: "📝", label: "Lists" },
  { icon: "📖", label: "Journal" },
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  ski: "bg-[#1C1917] text-white",
  family: "bg-[#C8973E] text-white",
  celebration: "bg-[#D4614A] text-white",
};

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function FamilyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#121110]">
      {/* Demo banner */}
      <div className="bg-[#1C1917] text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 bg-[#C8973E] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Demo Mode
            </span>
            <span className="text-gray-300">
              This is a design preview — the login form is not wired up yet. No
              data is sent anywhere.
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-white/10 rounded-full p-1">
            <button
              onClick={() => setIsLoggedIn(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !isLoggedIn
                  ? "bg-white text-[#1C1917]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Login Screen
            </button>
            <button
              onClick={() => setIsLoggedIn(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isLoggedIn
                  ? "bg-white text-[#1C1917]"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Hub Screen
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FamilyGate onLogin={() => setIsLoggedIn(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto px-4 pb-16 pt-4 space-y-10"
          >
            {/* Welcome banner */}
            <div className="bg-[#C8973E] text-white rounded-xl px-6 py-4 flex items-center gap-3 shadow">
              <span className="text-2xl">👋</span>
              <div>
                <p className="font-semibold text-lg leading-tight">
                  Welcome back!
                </p>
                <p className="text-white/80 text-sm">
                  Here is what is happening with the Oyarzun family.
                </p>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-[#1C1A18] rounded-2xl p-5 shadow-sm text-center"
                >
                  <div className="text-3xl mb-1">{stat.emoji}</div>
                  <div className="text-2xl font-bold text-[#1C1917] dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Family feed */}
            <FamilyFeed posts={familyFeedPosts} />

            {/* Photo gallery */}
            <PhotoGallery photos={familyPhotos} />

            {/* Album cards */}
            <AlbumCards albums={albums} />

            {/* Quick actions */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.label}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white dark:bg-[#1C1A18] rounded-2xl p-5 shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-shadow"
                  >
                    <span className="text-3xl">{action.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Upcoming events */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Events
              </h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white dark:bg-[#1C1A18] rounded-2xl p-5 shadow-sm flex items-start gap-4"
                  >
                    <div
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex-shrink-0 ${
                        EVENT_TYPE_COLORS[event.type] ??
                        "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {formatEventDate(event.date)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
