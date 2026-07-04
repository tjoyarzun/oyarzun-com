"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      aria-label={
        mounted
          ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`
          : "Toggle dark mode"
      }
      className={[
        "w-9 h-9 rounded-full flex items-center justify-center",
        "bg-slate-100 dark:bg-slate-800",
        "text-slate-600 dark:text-slate-300",
        "hover:bg-slate-200 dark:hover:bg-slate-700",
        "border border-slate-200 dark:border-slate-700",
        "transition-all duration-200",
        // Fade in after mount to avoid flash
        mounted ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {/* Render placeholder dimensions before mount to prevent layout shift */}
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )
      ) : (
        <span className="w-4 h-4" />
      )}
    </button>
  );
}
