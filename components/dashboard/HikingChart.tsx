"use client";

import { Mountain } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
interface MonthlyHiking {
  month: string;
  hikes: number;
}

interface HikingChartProps {
  data: MonthlyHiking[];
}

export default function HikingChart({ data }: HikingChartProps) {
  return (
    <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#C8973E] flex items-center justify-center">
          <Mountain className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-display text-xl font-bold text-[#1C1917] dark:text-white">
          Hikes per Month
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1C1A18",
              border: "1px solid #C8973E",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            labelStyle={{ color: "#94a3b8", marginBottom: 4 }}
            formatter={(value: number) => [`${value}`, "Hikes"]}
          />
          <Line
            type="monotone"
            dataKey="hikes"
            stroke="#C8973E"
            strokeWidth={2}
            dot={{ fill: "#C8973E", r: 4, strokeWidth: 0 }}
            activeDot={{
              r: 6,
              fill: "#C8973E",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
