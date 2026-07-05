"use client";

import { ExternalLink, Globe } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  color: "teal" | "orange";
}

const colorMap = {
  teal: {
    tag: "bg-teal/10 text-teal",
    link: "text-teal hover:text-teal/80",
  },
  orange: {
    tag: "bg-orange/10 text-orange",
    link: "text-orange hover:text-orange/80",
  },
};

export default function ProjectCard({ project, color }: ProjectCardProps) {
  const c = colorMap[color];

  return (
    <div className="bg-white dark:bg-[#1C1A18] p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:scale-[1.02] hover:shadow-md transition-all duration-200">
      <h4 className="font-semibold text-navy dark:text-white text-sm">
        {project.title}
      </h4>
      <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {project.description}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.tag}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="mt-4 flex items-center gap-4">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${c.link}`}
        >
          <ExternalLink size={12} />
          {project.githubUrl.includes("github.com") ? "GitHub" : "View"}
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${c.link}`}
          >
            <Globe size={12} />
            Live Site
          </a>
        )}
      </div>
    </div>
  );
}
