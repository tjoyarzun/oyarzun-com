"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Album {
  name: string;
  count: number;
  coverUrl: string;
  dateRange: string;
}

interface AlbumCardsProps {
  albums: Album[];
}

function AlbumCard({ album }: { album: Album }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.2 }}
      className="relative bg-white dark:bg-[#1C1A18] rounded-2xl overflow-hidden shadow-sm cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover image */}
      <div className="h-40 overflow-hidden">
        <img
          src={album.coverUrl}
          alt={album.name}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
          loading="lazy"
        />
      </div>

      {/* Hover overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center bg-[#1C1917]/50"
      >
        <span className="bg-[#C8973E] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow">
          View Album
        </span>
      </motion.div>

      {/* Info */}
      <div className="p-4">
        <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
          {album.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {album.count} photos
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {album.dateRange}
        </p>
      </div>
    </motion.div>
  );
}

export default function AlbumCards({ albums }: AlbumCardsProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Albums
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {albums.map((album) => (
          <AlbumCard key={album.name} album={album} />
        ))}
      </div>
    </section>
  );
}
