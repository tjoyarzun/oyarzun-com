"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Maximize2, X, ExternalLink } from "lucide-react";
import type { ProjectEmbed as Embed } from "@/lib/data";

/**
 * Poster + launch button for an interactive app embedded from another origin.
 *
 * The iframe is only mounted once the button is pressed. Before that, nothing
 * is requested from the embedded origin — no scripts, no WebGL context, no
 * cookies — so the profiles page costs the same for everyone who doesn't open
 * it. Same pattern as the click-to-load Vimeo player on Julia's card.
 *
 * It opens in a full-screen overlay rather than inline: the profile columns are
 * roughly 550px wide, which is not enough room to orbit a building or read a
 * first-person view.
 *
 * The overlay is portalled to <body> rather than rendered in place. ProjectCard
 * applies `hover:scale-[1.02]`, and a CSS transform makes an element the
 * containing block for any `position: fixed` descendant — so in place, the
 * overlay resolved against the card instead of the viewport. Worse, because the
 * overlay was a DOM child of the card, hovering the overlay also hovered the
 * card: transform applied, overlay collapsed to card size, pointer fell
 * outside it, card unhovered, overlay expanded again — a loop that flipped
 * between the frame and the page several times a second. The portal removes
 * both the containing block and the hover propagation.
 *
 * REMOVAL: this file, the `embed` field on the project in lib/data.ts, the
 * two-line conditional in ProjectCard, and public/images/dimple-dell-3d.jpg.
 * Nothing else references it.
 */
export default function ProjectEmbed({ embed }: { embed: Embed }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Esc closes the overlay. The embedded app also uses Esc to leave its own
  // pointer-lock walk mode; because that key is handled inside the iframe's
  // document, it never reaches this listener, so the two don't collide.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    // Hold the page still behind the overlay.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    // Captured now, not read in the cleanup: by the time cleanup runs the ref
    // may point at a different node (or null), and focus would land nowhere.
    const opener = openerRef.current;

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus();
    };
  }, [open, close]);

  return (
    <>
      <div className="mt-4">
        <button
          ref={openerRef}
          onClick={() => setOpen(true)}
          className="group block w-full overflow-hidden rounded-xl border border-gray-100 text-left transition-shadow hover:shadow-md dark:border-gray-700"
          aria-haspopup="dialog"
        >
          <span className="relative block aspect-[16/9] bg-gray-100 dark:bg-[#121110]">
            <Image
              src={embed.poster}
              alt={embed.posterAlt}
              fill
              sizes="(min-width: 1280px) 520px, (min-width: 768px) 46vw, 92vw"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#1C1917] shadow-sm">
                <Maximize2 size={15} />
                {embed.cta}
              </span>
            </span>
          </span>
        </button>

        {embed.note && (
          <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {embed.note}
          </p>
        )}
      </div>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={embed.cta}
            className="fixed inset-0 z-[100] flex flex-col bg-[#1C1917]"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-2.5">
              <a
                href={embed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 transition-colors hover:text-white"
              >
                <ExternalLink size={12} />
                Open in a new tab
              </a>
              <button
                ref={closeRef}
                onClick={close}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
                Close
              </button>
            </div>

            <iframe
              src={embed.url}
              title={embed.posterAlt}
              className="w-full flex-1 border-0 bg-[#1C1917]"
              /* Only what the walkthrough needs. No top-level navigation, no
                 popups, no downloads, no form submission. */
              sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-fullscreen"
              allow="fullscreen; xr-spatial-tracking"
              loading="eager"
            />
          </div>,
          document.body,
        )}
    </>
  );
}
