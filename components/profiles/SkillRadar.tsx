"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Skill {
  skill: string;
  value: number;
}

interface SkillRadarProps {
  skills: Skill[];
  color: string;
}

export default function SkillRadar({ skills, color }: SkillRadarProps) {
  return (
    <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-navy dark:text-white mb-4">
        Skills
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart
          data={skills}
          margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
        >
          <PolarGrid
            stroke="#e2e8f0"
            className="dark:[&>line]:stroke-gray-700 dark:[&>circle]:stroke-gray-700"
          />
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fontSize: 11,
              fill: "currentColor",
              className: "text-gray-600 dark:text-gray-300",
            }}
          />
          <Radar
            name="Skill"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              background: "var(--tooltip-bg, #fff)",
              border: `1px solid ${color}`,
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`${value}%`, "Proficiency"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
