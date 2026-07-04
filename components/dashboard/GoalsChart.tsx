"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";

const goals = [
  { label: "Hike Miles", current: 847, goal: 1000, pct: 84.7 },
  { label: "Ski Days", current: 34, goal: 40, pct: 85 },
  { label: "Books Read", current: 24, goal: 30, pct: 80 },
  { label: "Blog Posts", current: 23, goal: 25, pct: 92 },
];

interface GoalBarProps {
  label: string;
  current: number;
  goal: number;
  pct: number;
  index: number;
}

function GoalBar({ label, current, goal, pct, index }: GoalBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {current.toLocaleString()} / {goal.toLocaleString()}
          <span className="ml-2 font-semibold text-[#C8973E]">{pct}%</span>
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-[#C8973E]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function GoalsChart() {
  return (
    <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#1C1917] flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-display text-xl font-bold text-[#1C1917] dark:text-white">
          2024 Annual Goals Progress
        </h2>
      </div>

      <div className="space-y-6">
        {goals.map((goal, i) => (
          <GoalBar key={goal.label} {...goal} index={i} />
        ))}
      </div>
    </div>
  );
}
