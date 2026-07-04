"use client";

import { CloudSnow } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
interface SkiResort {
  name: string;
  days: number;
  vertical: number;
  runs: number;
}

interface SkiChartProps {
  resorts: SkiResort[];
}

export default function SkiChart({ resorts }: SkiChartProps) {
  return (
    <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#D4614A] flex items-center justify-center">
          <CloudSnow className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-display text-xl font-bold text-[#1C1917] dark:text-white">
          Ski Days by Resort
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={resorts}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1C1A18",
              border: "1px solid #D4614A",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            labelStyle={{ color: "#94a3b8", marginBottom: 4 }}
            formatter={(value) => [`${value ?? ""} days`, "Ski Days"]}
          />
          <Bar dataKey="days" fill="#D4614A" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
