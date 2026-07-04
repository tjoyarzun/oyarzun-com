"use client";

import { Heart } from "lucide-react";
import memory from "@/content/memory.json";

const IMAGE_URL = memory.imageUrl;
const MOCK_DATE = memory.date;
const MOCK_CAPTION = memory.caption;

export default function MemoryOfDay() {
  return (
    <div className="bg-white dark:bg-[#1C1A18] rounded-2xl overflow-hidden shadow-lg">
      {/* Card header */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <Heart className="w-5 h-5 text-orange fill-orange" />
        <h2 className="font-display font-semibold text-lg text-navy dark:text-white">
          Memory of the Day
        </h2>
      </div>

      {/* Photo */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={IMAGE_URL}
          alt={MOCK_CAPTION}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Caption */}
      <div className="px-5 py-4">
        <p className="text-teal-dark dark:text-teal text-xs font-semibold uppercase tracking-wider mb-1">
          {MOCK_DATE}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {MOCK_CAPTION}
        </p>
      </div>
    </div>
  );
}
