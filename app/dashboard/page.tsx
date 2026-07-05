"use client";

import { useEffect, useState } from "react";
import { dashboardStats, hikingData, skiResorts, profiles } from "@/lib/data";
import StatsGrid from "@/components/dashboard/StatsGrid";
import HikingChart from "@/components/dashboard/HikingChart";
import SkiChart from "@/components/dashboard/SkiChart";
import BooksChart from "@/components/dashboard/BooksChart";
import GoalsChart from "@/components/dashboard/GoalsChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
  const [githubTotal, setGithubTotal] = useState<number>(
    dashboardStats.githubCommits,
  );

  useEffect(() => {
    fetch(
      `/api/github-activity?username=${encodeURIComponent(profiles.him.github)}`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.total) setGithubTotal(data.total);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="bg-[#f8fafc] dark:bg-[#121110] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold text-[#1C1917] dark:text-white">
            The Oyarzun Numbers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Because we track everything
          </p>
        </div>

        {/* Stats */}
        <StatsGrid stats={{ ...dashboardStats, githubCommits: githubTotal }} />

        {/* Hiking + Ski charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HikingChart data={hikingData} />
          <SkiChart resorts={skiResorts} />
        </div>

        {/* Books + Goals charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BooksChart />
          <GoalsChart />
        </div>

        {/* Activity feed */}
        <ActivityFeed />
      </div>
    </main>
  );
}
