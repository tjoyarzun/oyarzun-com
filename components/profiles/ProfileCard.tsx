"use client";

import { ExternalLink, Github, Download } from "lucide-react";
import type { Profile } from "@/lib/data";

interface ProfileCardProps {
  profile: Profile;
  color: "teal" | "orange";
}

const colorMap = {
  teal: {
    gradient: "from-teal to-teal/60",
    border: "border-teal",
    text: "text-teal-dark dark:text-teal",
    hover: "hover:bg-teal hover:text-white",
    badge: "bg-teal/10 text-teal-dark dark:text-teal",
  },
  orange: {
    gradient: "from-orange to-orange/60",
    border: "border-orange",
    text: "text-orange",
    hover: "hover:bg-orange hover:text-white",
    badge: "bg-orange/10 text-orange",
  },
};

export default function ProfileCard({ profile, color }: ProfileCardProps) {
  const c = colorMap[color];
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Avatar + Name */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Circular gradient avatar */}
        <div
          className={`flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-md`}
        >
          <span className="font-display text-3xl font-bold text-white tracking-tight">
            {initials}
          </span>
        </div>

        {/* Name / title / company */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display text-2xl font-bold text-navy dark:text-white">
            {profile.name}
          </h2>
          <p className={`text-sm font-semibold mt-0.5 ${c.text}`}>
            {profile.title}
          </p>
          <span
            className={`inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${c.badge}`}
          >
            {profile.company}
          </span>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-5 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {profile.bio}
      </p>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={`https://www.linkedin.com/in/${profile.linkedin}/`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${c.border} ${c.text} ${c.hover} text-sm font-medium transition-colors`}
        >
          <ExternalLink size={14} />
          LinkedIn
        </a>
        {profile.github && (
          <a
            href={`https://github.com/${profile.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${c.border} ${c.text} ${c.hover} text-sm font-medium transition-colors`}
          >
            <Github size={14} />
            GitHub
          </a>
        )}
        {profile.resume ? (
          <a
            href={profile.resume}
            download
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${c.border} ${c.text} ${c.hover} text-sm font-medium transition-colors`}
          >
            <Download size={14} />
            Resume
          </a>
        ) : (
          <button
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${c.border} ${c.text} ${c.hover} text-sm font-medium transition-colors opacity-50 cursor-not-allowed`}
            disabled
          >
            <Download size={14} />
            Resume
          </button>
        )}
      </div>
    </div>
  );
}
