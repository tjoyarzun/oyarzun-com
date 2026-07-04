"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FamilyGateProps {
  onLogin?: () => void;
}

export default function FamilyGate({ onLogin }: FamilyGateProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.();
  };

  const bgImages = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    seed: 200 + i,
  }));

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-8rem)] flex items-center justify-center">
      {/* Blurred photo grid background */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {bgImages.map(({ id, seed }) => (
          <div key={id} className="overflow-hidden">
            <img
              src={`https://picsum.photos/seed/${seed}/400/400`}
              alt=""
              className="w-full h-full object-cover filter blur-sm opacity-40"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#1C1917]/30 dark:bg-[#121110]/50" />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="bg-white/95 dark:bg-[#1C1A18]/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          {/* Monogram */}
          <div className="flex justify-center mb-4">
            <span className="font-serif text-7xl font-bold text-[#1C1917] dark:text-white leading-none select-none">
              O
            </span>
          </div>

          <h1 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-1">
            Family &amp; Friends Only
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            This space is private — just for us.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-[#121110] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8973E] transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-[#121110] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8973E] transition"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#C8973E] hover:bg-[#238a7d] text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Enter the Hub
            </motion.button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-400">
              Request Access — coming soon
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
