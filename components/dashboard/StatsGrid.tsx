"use client";

import { GitBranch, FileText, BookOpen, Globe } from "lucide-react";
import { dashboardStats } from "@/lib/data";

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

interface StatsGridProps {
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      icon: <GitBranch className="w-5 h-5 text-white" />,
      iconBg: "bg-[#C8973E]",
      value: stats.githubCommits.toLocaleString(),
      label: "GitHub Commits",
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
      label: "Books Read",
    },
    {
      icon: <Globe className="w-5 h-5 text-white" />,
      iconBg: "bg-[#D4614A]",
      value: stats.countriesVisited.toLocaleString(),
      label: "Countries Visited",
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
