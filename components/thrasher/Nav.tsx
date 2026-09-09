"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * The nav distinguishes movement from departure.
 *
 *   .jump  scrolls you down the one scroll. Highlighted by the scroll-spy in
 *          lib/thrasher/behaviours.ts, which sets aria-current="true".
 *   .go    takes you to a different route. Separated by a hairline rule and
 *          marked with a chevron, so the two kinds of link never look alike.
 *
 * Off the home route the jumps have to carry the path, or they resolve
 * against the current page and go nowhere.
 */
const DEPARTMENTS = [
  { id: "cover", label: "Cover" },
  { id: "two", label: "The two of us" },
  { id: "counted", label: "Counted" },
  { id: "away", label: "Away" },
  { id: "now", label: "Right now" },
  { id: "written", label: "Written" },
];

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const { resolvedTheme, setTheme } = useTheme();

  /**
   * next-themes cannot know the theme until it has read localStorage on the
   * client, so rendering aria-pressed from `resolvedTheme` during SSR would
   * emit a value that flips on hydration. Wait for mount before asserting it.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const negative = mounted && resolvedTheme === "dark";

  return (
    <nav className="nav" aria-label="Main">
      <Link className="wm" href="/">
        Oyarzun
      </Link>
      <ul>
        {DEPARTMENTS.map((d) => (
          <li key={d.id}>
            <a className="jump" href={onHome ? `#${d.id}` : `/#${d.id}`}>
              {d.label}
            </a>
          </li>
        ))}
        <li className="split" aria-hidden="true" />
        <li>
          <Link
            className="go"
            href="/family"
            aria-current={pathname === "/family" ? "page" : undefined}
          >
            Family
          </Link>
        </li>
      </ul>
      <button
        className="neg"
        type="button"
        aria-pressed={negative}
        onClick={() => setTheme(negative ? "light" : "dark")}
      >
        Negative
      </button>
    </nav>
  );
}
