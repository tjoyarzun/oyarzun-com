"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { profiles, type Profile } from "@/lib/data";

const colorMap = {
  teal: {
    gradient: "from-teal to-teal/60",
    text: "text-teal-dark dark:text-teal",
  },
  orange: {
    gradient: "from-orange to-orange/60",
    text: "text-orange",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function PreviewCard({
  profile,
  color,
}: {
  profile: Profile;
  color: "teal" | "orange";
}) {
  const c = colorMap[color];
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div variants={cardVariants}>
      <Link href="/profiles" className="block h-full group">
        <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-md`}
          >
            <span className="font-display text-lg font-bold text-white tracking-tight">
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-navy dark:text-white group-hover:underline">
              {profile.name}
            </h3>
            <p className={`text-sm font-semibold mt-0.5 ${c.text}`}>
              {profile.title} · {profile.company}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
              {profile.bio}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProfilesPreview() {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-16">
      <h2 className="font-display font-bold text-2xl text-navy dark:text-white mb-6">
        Who We Are
      </h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <PreviewCard profile={profiles.him} color="teal" />
        <PreviewCard profile={profiles.her} color="orange" />
      </motion.div>
      <div className="mt-6 text-center">
        <Link
          href="/profiles"
          className="inline-block text-sm font-semibold text-teal hover:underline"
        >
          Meet us both →
        </Link>
      </div>
    </section>
  );
}
