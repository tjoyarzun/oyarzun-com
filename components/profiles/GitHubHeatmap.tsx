"use client";

import { useMemo, useEffect, useState } from "react";

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

// Build month labels from an array of ISO date strings (one per cell).
// Each month label appears at the week column where that month first starts.
function labelsFromDates(
  dates: string[],
): { month: string; weekIndex: number }[] {
  const labels: { month: string; weekIndex: number }[] = [];
  let currentMonth = -1;
  for (let i = 0; i < dates.length; i++) {
    const m = new Date(dates[i] + "T12:00:00").getMonth();
    if (m !== currentMonth) {
      currentMonth = m;
      labels.push({
        month: MONTHS[m],
        weekIndex: Math.floor(i / DAYS_PER_WEEK),
      });
    }
  }
  return labels;
}

// Fallback: derive dates client-side when using mock data
function mockDates(): string[] {
  const today = new Date();
  const result: string[] = [];
  for (let i = WEEKS * DAYS_PER_WEEK - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push(d.toISOString().slice(0, 10));
  }
  return result;
}

const cellColors = [
  "bg-gray-100 dark:bg-[#1C1A18]",
  "bg-teal/20",
  "bg-teal/40",
  "bg-teal/70",
  "bg-teal",
];

const levelLabels = ["No contributions", "1–3", "4–6", "7–9", "10+"];

export default function GitHubHeatmap({ username }: GitHubHeatmapProps) {
  const mock = useMemo(() => generateMockContributions(username), [username]);
  const mockTotal =
    mock.filter((v) => v > 0).length * 2 + (strToSeed(username) % 50);

  const [contributions, setContributions] = useState<number[]>(mock);
  const [dates, setDates] = useState<string[]>(() => mockDates());
  const [total, setTotal] = useState<number>(mockTotal);
  const [isReal, setIsReal] = useState(false);

  useEffect(() => {
    fetch(`/api/github-activity?username=${encodeURIComponent(username)}`, {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.contributions?.length) {
          setContributions(data.contributions);
          setDates(data.dates);
          setTotal(data.total);
          setIsReal(true);
        }
      })
      .catch(() => {});
  }, [username]);

  // Trim/pad to exactly 52 weeks, keeping dates and contributions aligned
  const { cells, cellDates } = useMemo(() => {
    const target = WEEKS * DAYS_PER_WEEK;
    if (contributions.length >= target) {
      return {
        cells: contributions.slice(-target),
        cellDates: dates.slice(-target),
      };
    }
    const pad = target - contributions.length;
    return {
      cells: [...Array(pad).fill(0), ...contributions],
      cellDates: [...Array(pad).fill(""), ...dates],
    };
  }, [contributions, dates]);

  const weeks = useMemo(() => {
    const result: number[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      result.push(cells.slice(w * DAYS_PER_WEEK, (w + 1) * DAYS_PER_WEEK));
    }
    return result;
  }, [cells]);

  const monthLabels = useMemo(() => labelsFromDates(cellDates), [cellDates]);

  return (
    <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-1">
        <h3 className="font-display text-lg font-semibold text-navy dark:text-white">
          GitHub Activity
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          @{username}
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {total} contributions in the last year
        {!isReal && (
          <span className="ml-1 text-gray-300 dark:text-gray-600">
            (preview)
          </span>
        )}
      </p>

      <div className="overflow-x-auto">
        <div className="min-w-[660px]">
          {/* Month labels — relative container, each label absolutely placed */}
          <div className="relative h-4 mb-1">
            {monthLabels.map(({ month, weekIndex }) => (
              <span
                key={`${month}-${weekIndex}`}
                className="absolute text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap"
                style={{ left: `${weekIndex * 12}px` }}
              >
                {month}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5 mt-4">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((level, di) => (
                  <div
                    key={di}
                    title={
                      cellDates[wi * DAYS_PER_WEEK + di] || `Level ${level}`
                    }
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
