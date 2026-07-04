"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Mountain, Map, List, Compass } from "lucide-react";
import { adventures, bucketListItems, travelStats } from "@/lib/data";
import AdventureLog from "@/components/travels/AdventureLog";
import BucketList from "@/components/travels/BucketList";

const AdventureMap = dynamic(
  () => import("@/components/travels/AdventureMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-gray-100 dark:bg-[#1C1A18] rounded-2xl animate-pulse flex items-center justify-center">
        <span className="text-gray-400 dark:text-gray-600 text-sm font-medium">
          Loading map…
        </span>
      </div>
    ),
  },
);

const stats = [
  {
    icon: "🌍",
    label: "Countries Visited",
    value: travelStats.countriesVisited,
    suffix: "",
  },
  {
    icon: "⛷️",
    label: "Ski Resorts",
    value: travelStats.skiResorts,
    suffix: "",
  },
  {
    icon: "🥾",
    label: "Trips Logged",
    value: travelStats.adventuresLogged,
    suffix: "",
  },
  {
    icon: "📈",
    label: "Highest Summit",
    value: travelStats.highestSummitFt.toLocaleString(),
    suffix: " ft",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#D4614A]/10 text-[#D4614A]">
        {icon}
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold text-navy dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default function TravelsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="min-h-screen"
    >
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden bg-gradient-to-br from-[#D4614A] via-[#c45c3c] to-[#1C1917] py-20 px-4"
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/20 mb-2"
          >
            <Compass size={12} />
            Sandy, Utah → Everywhere
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight"
          >
            Travels
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl sm:text-2xl font-light text-white/80"
          >
            {travelStats.adventuresLogged} trips across{" "}
            {travelStats.countriesVisited} countries and counting
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="max-w-xl mx-auto text-white/60 text-sm leading-relaxed"
          >
            Julia finds the flights, Tommy overpacks and gets us where we need
            to be. Rough direction, good food, a beach when possible.
          </motion.p>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={fadeUp}
        className="bg-white dark:bg-[#1C1A18] border-b border-gray-100 dark:border-[#121110] shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <div className="text-2xl">{stat.icon}</div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-navy dark:text-white">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* The Map */}
        <motion.section variants={fadeUp}>
          <SectionHeading
            icon={<Map size={20} />}
            title="The Map"
            subtitle="Every place we have explored, pinned on one map"
          />
          <AdventureMap adventures={adventures} />
        </motion.section>

        {/* Adventure Log */}
        <motion.section variants={fadeUp}>
          <SectionHeading
            icon={<List size={20} />}
            title="Trip Log"
            subtitle="The full record — sortable and filterable"
          />
          <AdventureLog adventures={adventures} />
        </motion.section>

        {/* Beach aside */}
        <motion.p
          variants={fadeUp}
          className="text-sm text-gray-400 dark:text-gray-500 italic border-l-2 border-gray-200 dark:border-gray-700 pl-4"
        >
          Tommy once gave a work presentation titled &ldquo;How Much Beach Is
          Too Much Beach.&rdquo; The answer, per the Brazilian side of this
          family, is that there is no such thing.
        </motion.p>

        {/* Bucket List */}
        <motion.section variants={fadeUp}>
          <BucketList items={bucketListItems} />
        </motion.section>
      </div>
    </motion.div>
  );
}
