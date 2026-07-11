"use client";

import { dashboardStats } from "@/lib/data";

const stats = [
  {
    label: "Books Read",
    value: dashboardStats.booksReadThisYear.toLocaleString(),
  },
  { label: "Miles Hiked", value: dashboardStats.milesHiked.toLocaleString() },
  { label: "Ski Days", value: dashboardStats.skiDays.toLocaleString() },
  {
    label: "States Visited",
    value: dashboardStats.statesVisited.toLocaleString(),
  },
  {
    label: "GitHub Commits",
    value: dashboardStats.githubCommits.toLocaleString(),
  },
];

export default function StatsTicker() {
  // Repeat twice for seamless infinite scroll
  const items = [...stats, ...stats];

  return (
    <div className="bg-navy text-white py-3 overflow-hidden">
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 28s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="ticker-track">
        {items.map((stat, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="text-teal font-semibold text-sm">
              {stat.label}
            </span>
            <span className="text-white font-bold text-sm mx-1">
              {stat.value}
            </span>
            <span className="text-white/30 mx-6 text-base select-none">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
