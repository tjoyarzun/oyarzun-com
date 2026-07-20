"use client";

import { useEffect, useState } from "react";
import { dashboardStats, skiResorts, profiles, travelStats } from "@/lib/data";
import StatsGrid from "@/components/dashboard/StatsGrid";
import TravelChart from "@/components/dashboard/TravelChart";
import SkiChart from "@/components/dashboard/SkiChart";
import BooksChart from "@/components/dashboard/BooksChart";
import GoalsChart from "@/components/dashboard/GoalsChart";
import CurrentlyReadingCard from "@/components/dashboard/CurrentlyReadingCard";
import FavoriteMoviesCard from "@/components/dashboard/FavoriteMoviesCard";

export default function DashboardClient({ postCount }: { postCount: number }) {
  const [githubTotal, setGithubTotal] = useState<number>(
    dashboardStats.githubCommits,
  );

  useEffect(() => {
    fetch(
      `/api/github-activity?username=${encodeURIComponent(profiles.him.github ?? "")}`,
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
            Our Numbers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Because... data
          </p>
        </div>

        {/* Stats */}
        <StatsGrid
          stats={{
            ...dashboardStats,
            githubCommits: githubTotal,
            blogPosts: postCount,
            countriesVisited: travelStats.countriesVisited,
          }}
        />

        {/* Travel + Ski charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TravelChart />
          <SkiChart resorts={skiResorts} />
        </div>

        {/* Books + Currently Reading + Movies */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BooksChart />
          <CurrentlyReadingCard />
          <FavoriteMoviesCard />
        </div>

        {/* Goals */}
        <GoalsChart postCount={postCount} />
      </div>
    </main>
  );
}
