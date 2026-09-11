"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { boot, refit, repaint } from "@/lib/thrasher/behaviours";

/**
 * Runs the issue's client behaviour: the halftone screens, the four drawings,
 * the scroll-spy that drives the running head, the lightbox, and the type
 * fitter that force-justifies each masthead to its measure.
 *
 * This is a single mount point rather than per-component effects on purpose.
 * The behaviours are cross-cutting — the spy reads every department and writes
 * to the nav; the fitter measures every masthead; the lightbox is one overlay
 * shared by every plate — so scattering them across the components they touch
 * would mean each one racing the others' DOM.
 */
export default function Behaviours() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  /* Boot on mount and after every client navigation. Waiting on document.fonts
     matters: the type fitter measures text, and measuring before the display
     face has loaded fits the headline to the fallback's metrics and leaves it
     at the wrong size. */
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) boot();
    };
    if (document.fonts?.ready) void document.fonts.ready.then(run);
    else run();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  /* Negative flips ink and paper, so the screens and the drawings both have to
     be redrawn — a canvas keeps no relationship to the CSS that framed it. */
  useEffect(() => {
    repaint();
  }, [resolvedTheme]);

  /* Several things are functions of the WIDTH rather than merely scaled by
     it — the headline size, the route chart's type and label density, and the
     halftone screen ruling — so they are recomputed when the width changes.
     Debounced, because a desktop resize drag fires continuously and each
     headline fit is 28 layout-forcing iterations.
     
     Width only, and that is the whole point. A phone fires `resize` every
     time its URL bar slides away, which is a HEIGHT change and happens
     constantly while scrolling. Refitting on those meant six binary-searched
     mastheads, a redrawn route chart and five re-screened plates running
     mid-scroll, over and over — measured, and it is what made scrolling on
     mobile feel jumpy. Nothing here depends on viewport height. */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(t);
      t = setTimeout(refit, 160);
    };
    addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      removeEventListener("resize", onResize);
    };
  }, []);

  /* A skipped View Transition rejects its ready/finished promises, and an
     unhandled rejection surfaces as a console error on an otherwise healthy
     page. These only fire for cross-document navigation — a hard load or a
     back/forward — since internal links are client-side routed. */
  useEffect(() => {
    const swallow = (e: Event) => {
      const t = (e as Event & { viewTransition?: Record<string, Promise<unknown>> })
        .viewTransition;
      if (!t) return;
      ["ready", "finished", "updateCallbackDone"].forEach((k) => {
        t[k]?.catch?.(() => {});
      });
    };
    addEventListener("pagereveal", swallow);
    addEventListener("pageswap", swallow);
    return () => {
      removeEventListener("pagereveal", swallow);
      removeEventListener("pageswap", swallow);
    };
  }, []);

  return null;
}
