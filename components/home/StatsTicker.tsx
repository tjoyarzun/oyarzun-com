"use client";

const stats = [
  { label: "Books Read", value: "24" },
  { label: "Miles Hiked", value: "847" },
  { label: "Ski Days", value: "34" },
  { label: "States Visited", value: "28" },
  { label: "GitHub Commits", value: "1,203" },
];

export default function StatsTicker() {
  // Repeat twice for seamless infinite scroll
  const items = [...stats, ...stats];

  return (
    <div className="bg-navy text-white py-3 overflow-hidden">
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 28s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="ticker-track">
        {items.map((stat, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="text-teal font-semibold text-sm">
              {stat.label}
            </span>
            <span className="text-white font-bold text-sm mx-1">
              {stat.value}
            </span>
            <span className="text-white/30 mx-6 text-base select-none">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
