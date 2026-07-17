"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mountain, BarChart2 } from "lucide-react";

interface NavCard {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
  color: "teal" | "orange";
}

const cards: NavCard[] = [
  {
    icon: Mountain,
    label: "Travels",
    description: "Brazil and Utah and everywhere in between",
    href: "/travels",
    color: "orange",
  },
  {
    icon: BarChart2,
    label: "Data Dashboard",
    description: "Because data...",
    href: "/dashboard",
    color: "teal",
  },
];

const iconBg: Record<NavCard["color"], string> = {
  teal: "bg-teal/10 text-teal dark:bg-teal/20",
  orange: "bg-orange/10 text-orange dark:bg-orange/20",
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

export default function NavGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div key={card.href} variants={cardVariants}>
            <Link href={card.href} className="block h-full">
              <motion.div
                className="bg-white dark:bg-[#1C1A18] p-6 rounded-2xl shadow-sm cursor-pointer h-full flex flex-col gap-3"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px -8px rgba(0,0,0,0.15)",
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[card.color]}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-navy dark:text-white text-sm leading-snug">
                    {card.label}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
