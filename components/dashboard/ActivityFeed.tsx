"use client";

import { currentlyReading, recentActivities } from "@/lib/data";

function getActivityIcon(type: string) {
  switch (type) {
    case "hike":
      return "🥾";
    case "run":
      return "🏃";
    default:
      return "🏃";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ActivityFeed() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Currently Reading */}
      <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm">
        <h2 className="font-display text-xl font-bold text-[#1C1917] dark:text-white mb-6">
          Currently Reading
        </h2>
        <div className="space-y-5">
          {currentlyReading.map((book) => (
            <div key={book.title} className="flex gap-4 items-start">
              {/* Book cover */}
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

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm">
        <h2 className="font-display text-xl font-bold text-[#1C1917] dark:text-white mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#121110] hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-150"
            >
              <span className="text-2xl leading-none mt-0.5">
                {getActivityIcon(activity.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                  {activity.name}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{activity.distance} km</span>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span>+{activity.elevation}m</span>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span>{activity.duration}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 pt-0.5">
                {formatDate(activity.date)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
