"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink } from "lucide-react";
import type { Recognition } from "@/lib/data";

/**
 * An external award, shown at the top of a profile column.
 *
 * Certificate-led: it's the only asset carrying her name, photo and title, so
 * it does the most work. The badge shrinks to a mark beside the heading and the
 * video sits at the foot.
 *
 * Colour: this card is the one place the Influential Women magenta appears. It
 * belongs to the awarding body, not to this site, so it stops at the card edge
 * — nothing else on the page picks it up.
 */
export default function RecognitionCard({
  recognition: r,
}: {
  recognition: Recognition;
}) {
  const [playing, setPlaying] = useState(false);

  const hasVideo = Boolean(r.videoId);
  // dnt=1 asks Vimeo not to set tracking cookies. The hash is the unlisted-video
  // key; the share link's HubSpot campaign parameters are deliberately not here.
  const embedSrc = `https://player.vimeo.com/video/${r.videoId}?${new URLSearchParams(
    {
      ...(r.videoHash ? { h: r.videoHash } : {}),
      autoplay: "1",
      title: "0",
      byline: "0",
      portrait: "0",
      dnt: "1",
    },
  ).toString()}`;

  const watchUrl = `https://vimeo.com/${r.videoId}${r.videoHash ? `/${r.videoHash}` : ""}`;

  return (
    <div className="bg-white dark:bg-[#1C1A18] rounded-2xl border border-iw-pink/30 dark:border-iw-pink/25 shadow-sm overflow-hidden">
      {/* Header — badge + awarding body */}
      <div className="bg-iw-pink-tint dark:bg-iw-pink/10 px-6 py-5 flex items-center gap-4">
        <Image
          src={r.badgeUrl}
          alt={`${r.org} verified badge`}
          width={56}
          height={56}
          sizes="56px"
          className="w-14 h-14 shrink-0"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-iw-pink-deep dark:text-iw-pink-light">
            Recognition
          </p>
          <h3 className="font-display text-lg font-bold text-navy dark:text-white leading-tight mt-0.5">
            {r.orgUrl ? (
              <a
                href={r.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {r.org}
              </a>
            ) : (
              r.org
            )}
            {r.year && (
              <span className="text-iw-pink-deep dark:text-iw-pink-light">
                {" "}
                &middot; {r.year}
              </span>
            )}
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-0.5">
            {r.award}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Certificate — the hero asset */}
        <figure>
          <Image
            src={r.certificateUrl}
            alt={r.tagline ? `${r.certificateAlt} ${r.tagline}` : r.certificateAlt}
            width={800}
            height={735}
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 46vw, 92vw"
            className="w-full h-auto rounded-lg border border-gray-100 dark:border-gray-700"
          />
        </figure>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {r.blurb}
        </p>

        {/* Video — the iframe mounts only after a click, so visitors who don't
            watch never touch Vimeo's servers. */}
        {hasVideo && (
          <div>
            {!playing ? (
              <button
                onClick={() => setPlaying(true)}
                className="group w-full aspect-video rounded-lg bg-iw-pink-tint dark:bg-iw-pink/10 border border-iw-pink/30 flex flex-col items-center justify-center gap-3 transition-colors hover:bg-iw-pink/15 dark:hover:bg-iw-pink/20"
                aria-label={`Play the ${r.org} recognition video`}
              >
                <span className="w-14 h-14 rounded-full bg-iw-pink text-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                  <Play size={22} className="ml-0.5 fill-current" />
                </span>
                <span className="text-sm font-semibold text-iw-pink-deep dark:text-iw-pink-light">
                  Watch the recognition video
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Loads from Vimeo when you press play
                </span>
              </button>
            ) : (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={embedSrc}
                  title={`${r.org} recognition video`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-iw-pink-deep dark:text-iw-pink-light hover:underline"
            >
              <ExternalLink size={12} />
              Open on Vimeo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
