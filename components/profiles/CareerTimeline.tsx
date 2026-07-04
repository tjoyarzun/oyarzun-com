"use client";

import { motion } from "framer-motion";

interface CareerEntry {
  company: string;
  title: string;
  years: string;
  description: string;
}

interface CareerTimelineProps {
  career: CareerEntry[];
}

export default function CareerTimeline({ career }: CareerTimelineProps) {
  return (
    <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-navy dark:text-white mb-6">
        Career
      </h3>
      <div className="relative border-l-2 border-teal/30 pl-6 space-y-8">
        {career.map((entry, i) => (
          <motion.div
            key={`${entry.company}-${entry.years}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
            className="relative"
          >
            {/* Dot on the timeline line */}
            <span className="absolute -left-[1.65rem] top-1.5 w-3 h-3 rounded-full bg-teal border-2 border-white dark:border-[#1C1A18] shadow-sm" />

            {/* Card */}
            <div className="bg-gray-50 dark:bg-[#121110] rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="font-semibold text-navy dark:text-white text-sm">
                    {entry.company}
                  </p>
                  <p className="text-teal-dark dark:text-teal text-xs font-medium mt-0.5">
                    {entry.title}
                  </p>
                </div>
                <span className="text-gray-400 dark:text-gray-500 text-xs font-mono whitespace-nowrap">
                  {entry.years}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {entry.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
