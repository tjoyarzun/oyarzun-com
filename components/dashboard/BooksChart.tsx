"use client";

import { BookOpen } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { booksPerQuarter } from "@/lib/data";

export default function BooksChart() {
  return (
    <div className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#C8973E] flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-display text-xl font-bold text-[#1C1917] dark:text-white">
          Books Read Per Quarter
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={booksPerQuarter}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="booksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C8973E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C8973E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />
          <XAxis
            dataKey="quarter"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={30}
            domain={[0, 12]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1C1A18",
              border: "1px solid #C8973E",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            labelStyle={{ color: "#94a3b8", marginBottom: 4 }}
            formatter={(value) => [`${value ?? ""} books`, "Books Read"]}
          />
          <Area
            type="monotone"
            dataKey="books"
            stroke="#C8973E"
            strokeWidth={2}
            fill="url(#booksGradient)"
            dot={{ fill: "#C8973E", r: 4, strokeWidth: 0 }}
            activeDot={{
              r: 6,
              fill: "#C8973E",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
