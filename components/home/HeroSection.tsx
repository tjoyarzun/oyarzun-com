"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { profiles } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-navy via-[#1a2a1a] to-[#1C1917]">
      {/* Subtle warm glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-teal/5 rounded-full blur-3xl" />
      </div>

      {/* Main content: text left, photo right */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-12 pb-24 pt-12 flex flex-col md:flex-row items-center gap-12 md:gap-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left: text */}
        <div className="flex-1 flex flex-col items-start text-left">
          <motion.p
            variants={childVariants}
            className="text-teal/80 text-sm font-medium tracking-widest uppercase mb-4"
          >
            Sandy, Utah
          </motion.p>

          <motion.h1
            variants={childVariants}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Tommy Oyarzun
            <br />
            <span className="text-white/60">&</span> Julia Velicev
          </motion.h1>

          <motion.div
            variants={childVariants}
            className="flex flex-wrap gap-3 mb-6"
          >
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal/15 text-teal">
              {profiles.him.title} · {profiles.him.company}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange/20 text-orange">
              {profiles.her.title} · {profiles.her.company}
            </span>
          </motion.div>

          <motion.p
            variants={childVariants}
            className="text-white/70 text-base md:text-lg max-w-md mb-10 leading-relaxed"
          >
            We build data platforms by day and write about all of it here —
            code, mountains, and everything in between. Married, based in Sandy,
            Utah, when we aren't dragging our kids on the next trip.
          </motion.p>

          <motion.div
            variants={childVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/profiles"
              className="px-7 py-3 rounded-full bg-teal text-white font-semibold text-sm hover:bg-teal/80 transition-colors duration-200"
            >
              Our Work
            </Link>
            <Link
              href="/travels"
              className="px-7 py-3 rounded-full border border-white/30 text-white/80 font-semibold text-sm hover:border-white hover:text-white transition-colors duration-200"
            >
              Our World
            </Link>
          </motion.div>
        </div>

        {/* Right: photo */}
        <motion.div
          variants={childVariants}
          className="flex-shrink-0 hidden md:block"
          style={{ rotate: "-2deg" }}
        >
          <div
            className="bg-white p-2 pb-8 shadow-2xl shadow-black/40"
            style={{ rotate: "2deg" }}
          >
            <div className="relative w-[260px] h-[340px] overflow-hidden">
              <Image
                src="/images/switzerland-dock.jpg"
                alt="Julia, her kids, and her mom on a dock in Switzerland at sunset"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-3 font-sans tracking-wide">
              Switzerland, 2023
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Mountain silhouette */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 180"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-32 md:h-44"
        >
          <path
            d="M0 180 L0 140 L60 100 L110 125 L160 70 L220 105 L280 55 L340 90 L390 40 L440 75 L510 20 L570 60 L620 35 L680 80 L730 50 L780 90 L840 30 L900 65 L960 45 L1020 85 L1080 55 L1130 95 L1190 60 L1250 100 L1310 70 L1380 110 L1440 80 L1440 180 Z"
            fill="#121110"
            fillOpacity="0.22"
          />
          <path
            d="M0 180 L0 155 L80 130 L150 148 L220 115 L300 138 L370 108 L440 130 L520 100 L590 125 L660 110 L740 135 L820 105 L900 130 L970 118 L1050 138 L1130 120 L1200 142 L1280 125 L1360 148 L1440 130 L1440 180 Z"
            fill="#121110"
            fillOpacity="0.35"
          />
        </svg>
      </div>
    </section>
  );
}
