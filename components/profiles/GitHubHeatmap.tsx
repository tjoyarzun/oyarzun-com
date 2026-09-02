"use client";

import { useEffect, useMemo, useState } from "react";

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

const DAYS_PER_WEEK = 7;
/** Columns drawn before any data arrives, so the card doesn't jump on load. */
const PLACEHOLDER_WEEKS = 53;
/**
 * Horizontal distance between week columns, in px: cell width + gap.
 * Single source of truth — this was hardcoded as 12 in both the container's
 * minWidth and the month labels' `left`, so any change to the cell size would
 * have silently drifted the labels out of alignment with the columns.
 *
 * 10px keeps a full 53-week year inside the ~552px column without scrolling;
 * at the previous 12px it overflowed once the grid stopped being trimmed.
 */
const CELL_PITCH = 10;

const cellColors = [
  "bg-gray-100 dark:bg-[#1C1A18]",
  "bg-teal/20",
  "bg-teal/40",
  "bg-teal/70",
  "bg-teal",
];

const levelLabels = ["No contributions", "1–3", "4–6", "7–9", "10+"];

type Status = "loading" | "ready" | "error";

interface Activity {
  contributions: number[];
  dates: string[];
  total: number;
}

/**
 * Month labels, placed at the week column where each month first appears.
 */
function labelsFromDates(
  dates: string[],
): { month: string; weekIndex: number }[] {
  const labels: { month: string; weekIndex: number }[] = [];
  let current = -1;
  for (let i = 0; i < dates.length; i++) {
    if (!dates[i]) continue;
    const m = new Date(dates[i] + "T12:00:00").getMonth();
    if (m !== current) {
      current = m;
      labels.push({ month: MONTHS[m], weekIndex: Math.floor(i / DAYS_PER_WEEK) });
    }
  }
  return labels;
}

/** "Sep 2025 – Sep 2026", derived from the data rather than hard-coded. */
function rangeLabel(dates: string[]): string {
  const real = dates.filter(Boolean);
  if (real.length === 0) return "";
  const fmt = (iso: string) => {
    const d = new Date(iso + "T12:00:00");
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };
  const from = fmt(real[0]);
  const to = fmt(real[real.length - 1]);
  return from === to ? from : `${from} – ${to}`;
}

/**
 * GitHub contribution calendar for one account.
 *
 * This component used to seed its state with `generateMockContributions()` — a
 * seeded RNG that produced a dense, plausible-looking graph. For this account
 * that mock claimed 366 contributions across 171 active days, against a real
 * 37 across 10. Because the seed came from the username it was stable, so it
 * looked like settled truth rather than a placeholder, and the only disclosure
 * was a small "(preview)" note.
 *
 * That data was also in the server-rendered HTML, so anyone with JS disabled,
 * a slow connection, or a crawler read invented statistics as real. The mock is
 * gone: the grid is empty until real data arrives, and a failure says so.
 *
 * The old code also swallowed every failure (`r.ok ? r.json() : null` plus an
 * empty `.catch`), which meant an expired token would leave fabricated numbers
 * on the page indefinitely with no signal.
 */
export default function GitHubHeatmap({ username }: { username: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (!username) {
      setStatus("error");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    fetch(`/api/github-activity?username=${encodeURIComponent(username)}`, {
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`activity request failed: ${r.status}`);
        const data = await r.json();
        if (!Array.isArray(data?.contributions) || !data.contributions.length) {
          throw new Error("activity response had no contributions");
        }
        return data as Activity;
      })
      .then((data) => {
        setActivity(data);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Surfaced in the UI as well — logged so a broken token is diagnosable.
        console.error("[GitHubHeatmap]", err);
        setStatus("error");
      });

    return () => controller.abort();
  }, [username]);

  /**
   * The grid draws every day the API returned, padded at the front to a whole
   * number of weeks. It used to be pinned at 43 weeks while the API returned
   * 366 days, so ~9 weeks were silently dropped — yet the heading printed
   * GitHub's 12-month total, meaning the stated number covered a wider window
   * than the squares beneath it.
   */
  const { weeks, cellDates, monthLabels } = useMemo(() => {
    const source = activity?.contributions ?? [];
    const srcDates = activity?.dates ?? [];

    const weekCount = source.length
      ? Math.ceil(source.length / DAYS_PER_WEEK)
      : PLACEHOLDER_WEEKS;
    const target = weekCount * DAYS_PER_WEEK;
    const pad = Math.max(0, target - source.length);

    const cells = [...Array(pad).fill(0), ...source];
    const dates = [...Array(pad).fill(""), ...srcDates];

    const grid: number[][] = [];
    for (let w = 0; w < weekCount; w++) {
      grid.push(cells.slice(w * DAYS_PER_WEEK, (w + 1) * DAYS_PER_WEEK));
    }
    return { weeks: grid, cellDates: dates, monthLabels: labelsFromDates(dates) };
  }, [activity]);

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

      <p className="text-xs mb-3" aria-live="polite">
        {status === "ready" && activity ? (
          <span className="text-gray-500 dark:text-gray-400">
            {activity.total.toLocaleString()} contribution
            {activity.total === 1 ? "" : "s"} &middot;{" "}
            {rangeLabel(cellDates)}
          </span>
        ) : status === "error" ? (
          <span className="text-orange">
            Couldn&apos;t load GitHub activity right now.
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">
            Loading activity&hellip;
          </span>
        )}
      </p>

      <div className="overflow-x-auto">
        <div style={{ minWidth: `${weeks.length * CELL_PITCH}px` }}>
          <div className="relative h-4 mb-1">
            {monthLabels.map(({ month, weekIndex }) => (
              <span
                key={`${month}-${weekIndex}`}
                className="absolute text-[10px] text-gray-400 whitespace-nowrap"
                style={{ left: `${weekIndex * CELL_PITCH}px` }}
              >
                {month}
              </span>
            ))}
          </div>

          <div
            className={`flex gap-0.5 mt-4 transition-opacity duration-300 ${
              status === "ready" ? "opacity-100" : "opacity-60"
            }`}
          >
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((level, di) => (
                  <div
                    key={di}
                    title={cellDates[wi * DAYS_PER_WEEK + di] || undefined}
                    className={`h-2 w-2 rounded-sm ${cellColors[level]}`}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-3 justify-end">
            <span className="text-[10px] text-gray-400">Less</span>
            {cellColors.map((cls, i) => (
              <div
                key={i}
                title={levelLabels[i]}
                className={`h-2 w-2 rounded-sm ${cls}`}
              />
            ))}
            <span className="text-[10px] text-gray-400">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
