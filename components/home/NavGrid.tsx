"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mountain, BarChart2, Newspaper, Clock } from "lucide-react";
import { dashboardStats, profiles } from "@/lib/data";

interface NavCard {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
  color: "teal" | "orange";
}

const cards: NavCard[] = [
  {
    icon: User,
    label: "Profiles",
    description: "Career and projects we're proud of",
    href: "/profiles",
    color: "teal",
  },
  {
    icon: Mountain,
    label: "Travels",
    description: "Brazil and Utah and everywhere in between",
    href: "/travels",
    color: "orange",
  },
  {
    icon: BarChart2,
    label: "Dashboard",
    description: "Because data...", // overridden with a live GitHub commit count below
    href: "/dashboard",
    color: "teal",
  },
  {
    icon: Newspaper,
    label: "Blog",
    description: "Tech, AI, trip stories, and more",
    href: "/blog",
    color: "orange",
  },
  {
    icon: Clock,
    label: "Now",
    description: "What we're up to right now",
    href: "/now",
    color: "teal",
  },
];

const iconBg: Record<NavCard["color"], string> = {
  teal: "bg-teal/10 text-teal dark:bg-teal/20",
  orange: "bg-orange/10 text-orange dark:bg-orange/20",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function NavGrid() {
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

  const liveCards = cards.map((card) =>
    card.label === "Dashboard"
      ? {
          ...card,
          description: `${githubTotal.toLocaleString()} GitHub commits and counting`,
        }
      : card,
  );

  return (
    <section>
      <h2 className="font-display font-bold text-2xl text-navy dark:text-white mb-1">
        Explore
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Jump straight to any corner of the site.
      </p>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {liveCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.href} variants={cardVariants}>
              <Link href={card.href} className="block h-full">
                <motion.div
                  className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm cursor-pointer h-full flex flex-col gap-3"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 30px -8px rgba(0,0,0,0.15)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[card.color]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy dark:text-white text-sm leading-snug">
                      {card.label}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
