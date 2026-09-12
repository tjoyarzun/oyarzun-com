/**
 * The marks used for outbound links, in one place.
 *
 * These lived inside Colophon.tsx, which was fine while the footer was the
 * only thing that linked out. The profile columns link to the same three
 * places now, and two components drawing their own version of the same mark
 * is how they start to differ.
 *
 * All are 24x24, single-path where possible, and take their colour from
 * `fill: currentColor` in the stylesheet.
 */

export function Github() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.8c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.42-2.33-.26-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.09-2.83-.11-.27-.47-1.34.1-2.8 0 0 .88-.28 2.9 1.08a10 10 0 0 1 5.28 0c2.01-1.36 2.9-1.08 2.9-1.08.57 1.46.21 2.53.1 2.8.68.74 1.09 1.68 1.09 2.83 0 4.04-2.46 4.93-4.8 5.19.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}

export function Linkedin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.5c0-1.3-.03-3-1.85-3-1.85 0-2.13 1.44-2.13 2.9V21h-4V9Z" />
    </svg>
  );
}

/** Letterboxd has no Lucide icon; this is its mark, drawn. */
export function Letterboxd() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {/* The real mark's three dots overlap and are told apart by color.
          In one ink they merge into a blob, so they are spaced instead. */}
      <circle cx="4.6" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="19.4" cy="12" r="3.5" />
    </svg>
  );
}

/** A sheet of paper with a folded corner. Used for the résumé. */
export function Document() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 2.5L17.5 8H14V4.5ZM7.5 12h9v1.6h-9V12Zm0 3.6h9v1.6h-9v-1.6Zm0-7.2h4v1.6h-4V8.4Z" />
    </svg>
  );
}
