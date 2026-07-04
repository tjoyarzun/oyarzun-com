"use client";

import { useMemo } from "react";

interface GitHubHeatmapProps {
  username: string;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKS = 52;
const DAYS_PER_WEEK = 7;

// Seeded PRNG (LCG) — same username → same grid on server and client
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 0x100000000;
  };
}

function strToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function generateMockContributions(username: string): number[] {
  const rng = seededRng(strToSeed(username));
  const data: number[] = [];
  for (let week = 0; week < WEEKS; week++) {
    for (let day = 0; day < DAYS_PER_WEEK; day++) {
      const isWeekend = day === 0 || day === 6;
      const isBurstWeek = week % 8 === 3 || week % 13 === 5;
      const base = isWeekend ? 0.15 : 0.55;
      const burst = isBurstWeek ? 0.3 : 0;
      const rand = rng();
      const prob = base + burst;

      let level = 0;
      if (rand < prob * 0.3) level = 1;
      else if (rand < prob * 0.55) level = 2;
      else if (rand < prob * 0.75) level = 3;
      else if (rand < prob) level = 4;
      data.push(level);
    }
  }
  return data;
}

const cellColors = [
  "bg-gray-100 dark:bg-[#1C1A18]",
  "bg-teal/20",
  "bg-teal/40",
  "bg-teal/70",
  "bg-teal",
];

const levelLabels = ["No contributions", "1-3", "4-6", "7-9", "10+"];

export default function GitHubHeatmap({ username }: GitHubHeatmapProps) {
  const contributions = useMemo(
    () => generateMockContributions(username),
    [username],
  );

  // Build per-week columns: each column is 7 days
  const weeks: number[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    weeks.push(contributions.slice(w * DAYS_PER_WEEK, (w + 1) * DAYS_PER_WEEK));
  }

  // Month label positions — approximate: one label every ~4.33 weeks
  const monthLabels = MONTHS.map((month, i) => ({
    month,
    weekIndex: Math.round((i * WEEKS) / 12),
  }));

  const totalContributions =
    contributions.filter((v) => v > 0).length * 2 + (strToSeed(username) % 50);

  return (
    <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-1">
        <h3 className="font-display text-lg font-semibold text-navy dark:text-white">
          GitHub Activity
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          @{username}
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {totalContributions} contributions in the last year
      </p>

      {/* Scrollable heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-[660px]">
          {/* Month labels */}
          <div className="flex mb-1 pl-0">
            {monthLabels.map(({ month, weekIndex }) => (
              <div
                key={month}
                className="absolute text-[10px] text-gray-400 dark:text-gray-500"
                style={{
                  marginLeft: `${weekIndex * 14}px`,
                  position: "relative",
                  width: 0,
                  overflow: "visible",
                  whiteSpace: "nowrap",
                }}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5 mt-4">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((level, di) => (
                  <div
                    key={di}
                    title={`Level ${level}`}
                    className={`w-2.5 h-2.5 rounded-sm ${cellColors[level]} transition-opacity hover:opacity-80`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 justify-end">
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              Less
            </span>
            {cellColors.map((cls, i) => (
              <div
                key={i}
                title={levelLabels[i]}
                className={`w-2.5 h-2.5 rounded-sm ${cls}`}
              />
            ))}
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              More
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
