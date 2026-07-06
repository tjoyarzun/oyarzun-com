"use client";

import { Film } from "lucide-react";
import { favoriteMovies } from "@/lib/data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mt-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="text-sm leading-none"
          style={{ color: i < rating ? "#C8973E" : "#d1d5db" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function FavoriteMoviesCard() {
  return (
    <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C8973E]/15 text-[#C8973E]">
          <Film size={16} />
        </div>
        <h2 className="font-display text-xl font-bold text-[#1C1917] dark:text-white">
          Recent Favorites
        </h2>
      </div>
      <div className="space-y-5">
        {favoriteMovies.map((movie) => (
          <div key={movie.title} className="flex gap-4 items-start">
            <div
              className="w-12 h-16 rounded-md flex-shrink-0 shadow-md"
              style={{ backgroundColor: movie.posterColor }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                {movie.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {movie.director} · {movie.year}
              </p>
              {movie.platform && (
                <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#121110] text-gray-500 dark:text-gray-400">
                  {movie.platform}
                </span>
              )}
              <StarRating rating={movie.rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
