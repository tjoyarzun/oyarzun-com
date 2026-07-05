"use client";

import { useState, useMemo } from "react";

type AdventureType = "hike" | "ski" | "camp" | "bike" | "sightseeing" | "beach";

interface Adventure {
  id: number;
  name: string;
  location: string;
  date: string;
  type: AdventureType;
  who: "Family" | "Just Us" | "Solo";
  nights: number;
  emoji: string;
  description: string;
  imageUrl: string;
}

interface AdventureLogProps {
  adventures: Adventure[];
}

type FilterType = "all" | AdventureType;
type SortKey = "date" | "location" | "type" | "who" | "nights";
type SortDir = "asc" | "desc";

const TYPE_FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "🥾 Hike", value: "hike" },
  { label: "⛷️ Ski", value: "ski" },
  { label: "🏕️ Camp", value: "camp" },
  { label: "🚴 Bike", value: "bike" },
  { label: "🗺️ Sightseeing", value: "sightseeing" },
  { label: "🏖️ Beach", value: "beach" },
];

const TYPE_ICON: Record<AdventureType, string> = {
  hike: "🥾",
  ski: "⛷️",
  camp: "🏕️",
  bike: "🚴",
  sightseeing: "🗺️",
  beach: "🏖️",
};

function formatNights(n: number): string {
  if (n === 0) return "Day Trip";
  return n === 1 ? "1 night" : `${n} nights`;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return <span className="text-gray-300 dark:text-gray-600 ml-1">↕</span>;
  return <span className="text-teal ml-1">{dir === "asc" ? "↑" : "↓"}</span>;
}

export default function AdventureLog({ adventures }: AdventureLogProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    const base =
      filter === "all"
        ? adventures
        : adventures.filter((a) => a.type === filter);
    return [...base].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "date":
          cmp = a.date.localeCompare(b.date);
          break;
        case "location":
          cmp = a.location.localeCompare(b.location);
          break;
        case "type":
          cmp = a.type.localeCompare(b.type);
          break;
        case "who":
          cmp = a.who.localeCompare(b.who);
          break;
        case "nights":
          cmp = a.nights - b.nights;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [adventures, filter, sortKey, sortDir]);

  const thClass =
    "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-navy dark:hover:text-white whitespace-nowrap transition-colors";

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              filter === f.value
                ? "bg-[#D4614A] border-[#D4614A] text-white"
                : "border-gray-200 dark:border-[#1C1A18] text-gray-600 dark:text-gray-300 hover:border-[#D4614A] hover:text-[#D4614A] dark:hover:text-[#D4614A]"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-gray-400 dark:text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {adventures.length}
          </span>{" "}
          trips
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-gray-100 dark:border-[#1C1A18] overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-[#1C1A18]">
            <tr>
              <th className={thClass} onClick={() => handleSort("date")}>
                Date <SortIcon active={sortKey === "date"} dir={sortDir} />
              </th>
              <th className={thClass} onClick={() => handleSort("location")}>
                Location{" "}
                <SortIcon active={sortKey === "location"} dir={sortDir} />
              </th>
              <th className={thClass} onClick={() => handleSort("type")}>
                Type <SortIcon active={sortKey === "type"} dir={sortDir} />
              </th>
              <th className={thClass} onClick={() => handleSort("who")}>
                Who <SortIcon active={sortKey === "who"} dir={sortDir} />
              </th>
              <th className={thClass} onClick={() => handleSort("nights")}>
                Nights <SortIcon active={sortKey === "nights"} dir={sortDir} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-[#1C1A18]">
            {filtered.map((adventure, i) => (
              <tr
                key={adventure.id}
                className={`transition-colors hover:bg-gray-50 dark:hover:bg-[#1C1A18]/60 ${
                  i % 2 === 0
                    ? "bg-white dark:bg-[#121110]"
                    : "bg-gray-50/40 dark:bg-[#1C1A18]/20"
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {new Date(adventure.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {adventure.location}
                  </span>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 max-w-xs">
                    {adventure.description}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1.5">
                    <span>
                      {TYPE_ICON[adventure.type as AdventureType] ?? "📍"}
                    </span>
                    <span className="capitalize">{adventure.type}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {adventure.who}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {formatNights(adventure.nights)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {filtered.map((adventure) => (
          <div
            key={adventure.id}
            className="bg-white dark:bg-[#1C1A18] rounded-2xl border border-gray-100 dark:border-[#1C1A18] p-4 shadow-sm space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                  {adventure.location}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {new Date(adventure.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#121110] px-2 py-0.5 rounded-full">
                {adventure.who}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {TYPE_ICON[adventure.type as AdventureType] ?? "📍"}{" "}
                <span className="capitalize">{adventure.type}</span>
              </span>
              <span>{formatNights(adventure.nights)}</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-2">
              {adventure.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
