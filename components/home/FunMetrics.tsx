"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitBranch, FileText, BookOpen, Globe } from "lucide-react";
import {
  dashboardStats,
  travelStats,
  profiles,
  goals,
  adventures,
} from "@/lib/data";
import StatCard from "@/components/shared/StatCard";

const currentYear = new Date().getFullYear().toString();

function goalPct(label: string): number {
  const goal = goals.find((g) => g.label === label);
  if (!goal) return 0;
  return Math.round((goal.current / goal.goal) * 100);
}

export default function FunMetrics({ postCount }: { postCount: number }) {
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

  const adventuresThisYear = adventures.filter((a) =>
    a.date.startsWith(currentYear),
  ).length;

  const stats = [
    {
      title: "GitHub Commits",
      value: githubTotal.toLocaleString(),
      icon: GitBranch,
      description: "live from GitHub",
      accentColor: "#C8973E",
    },
    {
      title: "Blog Posts",
      value: postCount,
      icon: FileText,
      description: `${goalPct("Blog Posts")}% to this year's goal`,
      accentColor: "#D4614A",
    },
    {
      title: "Books Read",
      value: dashboardStats.booksReadThisYear,
      icon: BookOpen,
      description: `${goalPct("Books Read")}% to this year's goal`,
      accentColor: "#C8973E",
    },
    {
      title: "Countries Visited",
      value: travelStats.countriesVisited,
      icon: Globe,
      description: `${adventuresThisYear} new adventures this year`,
      accentColor: "#D4614A",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="font-display font-bold text-2xl text-navy dark:text-white mb-6">
        Fun with Numbers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/dashboard"
          className="inline-block text-sm font-semibold text-teal hover:underline"
        >
          See full dashboard →
        </Link>
      </div>
    </section>
  );
}
