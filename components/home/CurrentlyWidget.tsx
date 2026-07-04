"use client";

import { BookOpen, Film, Wrench, Music } from "lucide-react";
import now from "@/content/now.json";

const items = [
  { icon: BookOpen, label: "Reading", value: now.currently.reading },
  { icon: Film, label: "Watching", value: now.currently.watching },
  { icon: Wrench, label: "Building", value: now.currently.building },
  { icon: Music, label: "Listening", value: now.currently.listening },
];

export default function CurrentlyWidget() {
  return (
    <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 border-l-4 border-teal shadow-sm">
      <h2 className="font-display font-semibold text-xl text-navy dark:text-white mb-5">
        Currently
      </h2>
      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <Icon className="w-4 h-4 text-teal" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug truncate">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
