"use client";

import { Mountain } from "lucide-react";

type AdventureType = "hike" | "ski" | "camp" | "bike";

interface BucketListItem {
  id: number;
  name: string;
  state: string;
  description: string;
  imageUrl: string;
  type: AdventureType;
}

interface BucketListProps {
  items: BucketListItem[];
}

const TYPE_ICON: Record<AdventureType, string> = {
  hike: "🥾",
  ski: "⛷️",
  camp: "🏕️",
  bike: "🚴",
};

export default function BucketList({ items }: BucketListProps) {
  return (
    <div className="space-y-6">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#D4614A]/10 text-[#D4614A]">
          <Mountain size={20} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-navy dark:text-white">
            The Bucket List
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Adventures we are still chasing
          </p>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-white dark:bg-[#1C1A18] rounded-2xl border border-gray-100 dark:border-[#1C1A18] overflow-hidden shadow-sm
              transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Type badge overlay */}
              <span
                className="absolute top-2 right-2 text-lg"
                title={item.type}
              >
                {TYPE_ICON[item.type]}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                  {item.name}
                </h3>
                <span className="shrink-0 inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-teal/10 text-teal border border-teal/20">
                  {item.state}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>

              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(`${item.name} ${item.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-1 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 border-teal text-teal-dark dark:text-teal text-center hover:bg-teal hover:text-white transition-colors duration-200"
              >
                View on Map
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
