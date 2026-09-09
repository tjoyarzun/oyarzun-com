import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   The editorial furniture of the issue.

   These are grouped in one file rather than split one-per-file on purpose:
   each is a handful of lines of markup over a class already defined in the
   design system, and they are only ever read together. Anything with real
   behaviour or its own state lives in its own file.
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
    <div className="deptbar">
      <span className="dn">{folio}</span>
      <h2>{name}</h2>
      <span className="dk">{kicker}</span>
    </div>
  );
}

/**
 * The masthead. `data-fitbox`/`data-fit` are the hooks for the type fitter in
 * lib/thrasher/behaviours.ts, which binary-searches a font size so the
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
}: {
  kicker: string;
  headline: string;
  /** The dek — one or two sentences of standfirst. */
  children: ReactNode;
  /** The right-hand credit block. One item per line. */
  stats: ReactNode;
  tight?: boolean;
}) {
  return (
    <header className={tight ? "mast tight" : "mast"}>
      <div className="kick">{kicker}</div>
      <h1 data-fitbox>
        <span data-fit>{headline}</span>
      </h1>
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
 */
export function RunningHead({
  dept,
  middle,
  live = false,
}: {
  dept: string;
  middle: string;
  live?: boolean;
}) {
  return (
    <div className="run">
      <span className="dept" id={live ? "dept" : undefined}>
        {dept}
      </span>
      <span className="mid">{middle}</span>
      <span className="iss">Issue 04 · Sep 2026</span>
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
