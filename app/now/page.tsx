"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wrench,
  BookOpen,
  Tv,
  Music,
  Mountain,
  Zap,
  ArrowLeft,
} from "lucide-react";
import now from "@/content/now.json";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function SectionIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <span className="inline-flex items-center justify-center rounded-lg bg-teal-500/10 p-2 text-teal-600 dark:text-teal-400 mr-3">
      <Icon size={16} />
    </span>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 space-y-3 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
    >
      <h2 className="font-display font-semibold text-xl text-[#1C1917] dark:text-white flex items-center mb-3">
        <SectionIcon icon={icon} />
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
      <span className="text-[#C8973E] font-bold mt-0.5 shrink-0">→</span>
      <span>{children}</span>
    </div>
  );
}

export default function NowPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#121110]">
      <div className="max-w-2xl mx-auto px-4 py-20">
        {/* Nav breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#C8973E] dark:hover:text-[#C8973E] transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="text-xs tracking-widest text-[#C8973E] uppercase mb-3 font-medium">
            Status Update
          </p>
          <h1 className="font-display text-5xl font-bold text-[#1C1917] dark:text-white leading-tight">
            What We&apos;re Up To
          </h1>
          <p className="text-sm text-gray-400 mt-2">Updated {now.updatedAt}</p>
          <div className="w-16 h-1 bg-[#C8973E] rounded mt-4 mb-6" />
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-[#D4614A]/10 text-[#D4614A] border border-[#D4614A]/20">
              Utah 🏔️
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-[#C8973E]/10 text-[#C8973E] border border-[#C8973E]/20">
              Data 📊
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-[#1C1917]/10 text-[#1C1917] dark:bg-white/10 dark:text-white border border-[#1C1917]/20 dark:border-white/20">
              Family ❤️
            </span>
          </div>
        </motion.div>

        {/* Sections */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          <SectionCard icon={Wrench} title="Currently Building">
            {now.building.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </SectionCard>

          <SectionCard icon={BookOpen} title="Reading">
            <div className="space-y-2">
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="font-semibold text-[#C8973E]">Tommy:</span>{" "}
                {now.reading.him}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="font-semibold text-[#D4614A]">Julia:</span>{" "}
                {now.reading.her}
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Tv} title="Watching">
            {now.watching.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </SectionCard>

          <SectionCard icon={Music} title="Listening To">
            <div className="flex flex-wrap gap-2 pt-1">
              {now.listening.map((artist) => (
                <span
                  key={artist}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-[#121110] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                >
                  {artist}
                </span>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Mountain} title="Utah Status">
            {now.utahStatus.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </SectionCard>

          <SectionCard icon={Zap} title="Excited About">
            {now.excitedAbout.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </SectionCard>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-12"
        >
          <hr className="border-gray-200 dark:border-gray-700 mb-6" />
          <p className="text-sm text-gray-400 italic mb-3">
            This page was inspired by Derek Sivers&apos; Now Page movement.
          </p>
          <Link
            href="/"
            className="text-sm text-[#C8973E] hover:text-[#A87B30] transition-colors font-medium"
          >
            Oyarzun.com
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
