"use client";

import { Map } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adventures } from "@/lib/data";

const byYear = adventures.reduce(
  (acc, a) => {
    const year = a.date.slice(0, 4);
    acc[year] = (acc[year] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);

const data = Object.entries(byYear)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([year, count]) => ({ year, adventures: count }));

export default function TravelChart() {
  return (
    <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#D4614A] flex items-center justify-center">
          <Map className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-display text-xl font-bold text-[#1C1917] dark:text-white">
          Adventures by Year
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />
          <XAxis
            dataKey="year"
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
              border: "1px solid #C8973E",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            labelStyle={{ color: "#94a3b8", marginBottom: 4 }}
            formatter={(value) => [`${value ?? ""}`, "Adventures"]}
          />
          <Bar dataKey="adventures" fill="#C8973E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
