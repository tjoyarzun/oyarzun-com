"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  gradient?: string;
  children?: React.ReactNode;
}

export default function PageHero({
  title,
  subtitle,
  gradient = "from-[#1C1917] via-[#1e3a5f] to-[#C8973E]",
  children,
}: PageHeroProps) {
  return (
    <section
      className={`relative w-full h-64 md:h-80 bg-gradient-to-r ${gradient} flex items-center overflow-hidden`}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-3 text-lg text-white/80 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-6">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
