"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Profiles", href: "/profiles" },
  { label: "Travels", href: "/travels" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Blog", href: "/blog" },
  { label: "Now", href: "/now" },
];

function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1C1A18] transition-colors">
        <span className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1C1A18] transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-[#121110]/90 backdrop-blur-md shadow-sm"
            : "bg-white/90 dark:bg-[#121110]/90 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Wordmark */}
            <Link href="/" className="flex-shrink-0">
              <span className="font-display text-xl font-bold text-navy dark:text-white">
                Oyarzun
                <span className="text-teal">.com</span>
              </span>
            </Link>

            {/* Center nav links — desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(link.href)
                      ? "text-teal-dark dark:text-teal font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side — desktop */}
            <div className="hidden md:flex items-center gap-2">
              <DarkModeToggle />
              <Link
                href="/family"
                className="ml-1 px-4 py-1.5 rounded-md text-sm font-medium border-2 border-teal text-teal-dark dark:text-teal hover:bg-teal hover:text-white transition-colors"
              >
                Family Hub
              </Link>
            </div>

            {/* Mobile: dark mode + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              <DarkModeToggle />
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1C1A18] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="md:hidden sticky top-16 z-40 bg-white dark:bg-[#121110] border-b border-gray-100 dark:border-[#1C1A18] shadow-md"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isActive(link.href)
                      ? "text-teal-dark dark:text-teal font-semibold bg-teal/5"
                      : "text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1C1A18] font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/family"
                className="mt-2 px-3 py-2.5 rounded-md text-sm font-medium border-2 border-teal text-teal-dark dark:text-teal text-center hover:bg-teal hover:text-white transition-colors"
              >
                Family Hub
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
