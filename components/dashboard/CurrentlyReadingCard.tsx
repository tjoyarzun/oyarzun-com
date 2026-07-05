"use client";

import { currentlyReading } from "@/lib/data";

export default function CurrentlyReadingCard() {
  return (
    <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm">
      <h2 className="font-display text-xl font-bold text-[#1C1917] dark:text-white mb-6">
        Currently Reading
      </h2>
      <div className="space-y-5">
        {currentlyReading.map((book) => (
          <div key={book.title} className="flex gap-4 items-start">
            <div
              className="w-12 h-16 rounded-md flex-shrink-0 shadow-md"
              style={{ backgroundColor: book.coverColor }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug">
                {book.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {book.author}
              </p>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C8973E] transition-all duration-300"
                  style={{ width: `${book.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {book.progress}% complete
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
