"use client";

import { useEffect, useState } from "react";
import { GitBranch, FileText, BookOpen, Camera } from "lucide-react";
import { dashboardStats, profiles } from "@/lib/data";

type DashboardStats = typeof dashboardStats;

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
}

function StatCard({ icon, iconBg, value, label }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 flex flex-col gap-4">
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <p className="font-display text-3xl font-bold text-[#1C1917] dark:text-white">
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

function computeStreak(contributions: number[], dates: string[]): number {
  const today = new Date().toISOString().slice(0, 10);
  let i = dates.length - 1;
  // Skip today if no contributions yet — day might not be over
  if (dates[i] === today && contributions[i] === 0) i--;
  let streak = 0;
  while (i >= 0 && contributions[i] > 0) {
    streak++;
    i--;
  }
  return streak;
}

interface StatsGridProps {
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const [streak, setStreak] = useState<number>(stats.githubStreak);

  useEffect(() => {
    fetch(
      `/api/github-activity?username=${encodeURIComponent(profiles.him.github)}`,
      { cache: "no-store" },
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.contributions?.length && data?.dates?.length) {
          setStreak(computeStreak(data.contributions, data.dates));
        }
      })
      .catch(() => {});
  }, []);

  const cards = [
    {
      icon: <GitBranch className="w-5 h-5 text-white" />,
      iconBg: "bg-[#C8973E]",
      value: `${streak}`,
      label: "GitHub Streak (days)",
    },
    {
      icon: <FileText className="w-5 h-5 text-white" />,
      iconBg: "bg-[#D4614A]",
      value: `${stats.blogPosts}`,
      label: "Blog Posts",
    },
    {
      icon: <BookOpen className="w-5 h-5 text-white" />,
      iconBg: "bg-[#C8973E]",
      value: `${stats.booksRead2024}`,
      label: "Books Read 2024",
    },
    {
      icon: <Camera className="w-5 h-5 text-white" />,
      iconBg: "bg-[#D4614A]",
      value: stats.photosInLibrary.toLocaleString(),
      label: "Photos",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
