"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * The nav lists the issue in reading order and marks each item by what it
 * does, not by where it sits.
 *
 *   jump  scrolls you down the one scroll. Highlighted by the scroll-spy in
 *         lib/thrasher/behaviours.ts, which sets aria-current="true".
 *   go    leaves for another route, and carries a chevron.
 *
 * Department 02 is a `go` because the feature outgrew the scroll and lives at
 * /us; the scroll keeps a teaser at #two. Family sits after the hairline rule
 * because it is not a department of the issue at all — it is private.
 *
 * Off the home route the jumps have to carry the path, or they resolve
 * against the current page and go nowhere.
 */
type Item =
  | { kind: "jump"; id: string; label: string }
  | { kind: "go"; href: string; label: string };

const ITEMS: Item[] = [
  { kind: "jump", id: "cover", label: "Cover" },
  { kind: "go", href: "/us", label: "The two of us" },
  { kind: "jump", id: "counted", label: "Counted" },
  { kind: "jump", id: "away", label: "Fernweh" },
  { kind: "jump", id: "written", label: "Written" },
  { kind: "jump", id: "now", label: "Right now" },
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
  /* Negative means "the inverse of how the issue normally prints", and the
     issue prints on paper. So the button is pressed in dark — which is also
     where the photographs are printed as actual negatives. */
  const negative = mounted && resolvedTheme === "dark";

  return (
    <nav className="nav" aria-label="Main">
      <Link className="wm" href="/">
        Oyarzun
      </Link>
      <ul>
        {ITEMS.map((it) =>
          it.kind === "jump" ? (
            <li key={it.id}>
              <a className="jump" href={onHome ? `#${it.id}` : `/#${it.id}`}>
                {it.label}
              </a>
            </li>
          ) : (
            <li key={it.href}>
              <Link
                className="go"
                href={it.href}
                aria-current={pathname === it.href ? "page" : undefined}
              >
                {it.label}
              </Link>
            </li>
          ),
        )}
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
