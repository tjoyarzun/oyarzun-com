import type { ReactNode } from "react";
import Link from "next/link";
import { issue } from "@/lib/copy";

/* ═══════════════════════════════════════════════════════════════════════
   The editorial furniture of the issue.

   These are grouped in one file rather than split one-per-file on purpose:
   each is a handful of lines of markup over a class already defined in the
   design system, and they are only ever read together. Anything with real
   behavior or its own state lives in its own file.
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * The department bar — folio number, department name, and the dateline or
 * standfirst that belongs to that department.
 */
export function DeptBar({
  folio,
  name,
  kicker,
}: {
  folio: string;
  name: string;
  kicker: string;
}) {
  return (
    /* aria-hidden, and not a heading.
       
       This is a running head: it repeats the masthead directly below it, and
       it did so as an <h2> sitting ABOVE that <h1>, so every department
       announced itself twice and in the wrong order. Sighted readers need it
       because it is sticky and tells you where you are once the masthead has
       scrolled away; a screen reader gets the masthead itself. */
    <div className="deptbar" aria-hidden="true">
      <span className="dn">{folio}</span>
      <span className="dnm">{name}</span>
      <span className="dk">{kicker}</span>
    </div>
  );
}

/**
 * The masthead. `data-fitbox`/`data-fit` are the hooks for the type fitter in
 * lib/thrasher/behaviors.ts, which binary-searches a font size so the
 * headline force-justifies to the exact measure.
 *
 * The span must NOT be given a max-width. The fitter measures scrollWidth,
 * and a clamp makes the comparison unfalsifiable — that was the heading-resize
 * bug. `white-space: nowrap` in the sheet is what actually holds the line.
 */
export function Mast({
  kicker,
  headline,
  children,
  stats,
  tight = true,
  level = 2,
}: {
  kicker: string;
  headline: string;
  /** The dek — one or two sentences of standfirst. */
  children: ReactNode;
  /** The right-hand credit block. One item per line. */
  stats: ReactNode;
  tight?: boolean;
  /**
   * Heading level. One per page is an <h1>; the rest are <h2>.
   *
   * Every masthead used to be an <h1>, which gave the home page six of them —
   * six things announcing themselves as the title of the page. The departments
   * are sections of one issue, so the cover's masthead is the h1 and they are
   * its h2s. Nothing visual depends on this: the styles key off `.mast`.
   */
  level?: 1 | 2;
}) {
  const H = level === 1 ? "h1" : "h2";
  return (
    <header className={tight ? "mast tight" : "mast"}>
      <div className="kick">{kicker}</div>
      <H data-fitbox>
        <span data-fit>{headline}</span>
      </H>
      <div className="dek">
        <div>{children}</div>
        <div className="mono">{stats}</div>
      </div>
    </header>
  );
}

/** A section head inside a department. `lite` is the smaller variant. */
export function SectionHead({
  no,
  title,
  right,
  lite = false,
}: {
  no: string;
  title: string;
  right?: ReactNode;
  lite?: boolean;
}) {
  return (
    <div className={lite ? "sh lite" : "sh"}>
      <span className="no">{no}</span>
      <h2>{title}</h2>
      {right ? <div className="r mono">{right}</div> : null}
    </div>
  );
}

/**
 * A figure caption. Two slots: what it is on the left, how it was made on
 * the right. The right slot is where the issue admits its own construction.
 */
export function Caption({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="cap">
      <span>{left}</span>
      {right ? <span>{right}</span> : null}
    </div>
  );
}

/**
 * The running head. On the one scroll this is driven live by the scroll-spy,
 * which needs `id="dept"` to write into; on a real route it is static.
 *
 * `href` makes the department name a link back to its section, which is the
 * magazine convention and one of two ways off a post — the other being the
 * sticky nav, which stays pinned at the top of the window at any scroll
 * depth. The name is not a link on the home page, where it is the live
 * scroll-spy readout rather than a destination.
 */
export function RunningHead({
  dept,
  middle,
  live = false,
  href,
}: {
  dept: string;
  middle: string;
  live?: boolean;
  href?: string;
}) {
  return (
    <div className="run">
      {href ? (
        <Link className="dept back" href={href}>
          {dept}
        </Link>
      ) : (
        <span className="dept" id={live ? "dept" : undefined}>
          {dept}
        </span>
      )}
      <span className="mid">{middle}</span>
      <span className="iss">
        Issue {issue.number} · {issue.dateline}
      </span>
    </div>
  );
}

/** The page folio, bottom right. Driven live on the one scroll. */
export function Folio({ n, live = false }: { n: string; live?: boolean }) {
  return (
    <div className="folio">
      <span id={live ? "folio" : undefined}>{n}</span>
    </div>
  );
}
