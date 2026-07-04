import type { ElementType } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  description?: string;
  accentColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  accentColor = "#C8973E", // teal default
}: StatCardProps) {
  return (
    <div
      className={[
        "relative bg-white dark:bg-[#1C1A18]",
        "rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50",
        "p-6",
        "hover:scale-[1.02] hover:shadow-md",
        "transition-all duration-200 ease-out",
        "cursor-default",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>
          <p className="mt-1 text-3xl font-bold font-display text-slate-900 dark:text-white leading-tight">
            {value}
          </p>
          {description && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-snug">
              {description}
            </p>
          )}
        </div>

        {/* Icon circle */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}1a` }} // 10% opacity background
        >
          <Icon
            className="w-5 h-5"
            style={{ color: accentColor }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Subtle left accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}
