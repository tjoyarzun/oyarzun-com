"use client";

import { useEffect, useState } from "react";
import { Caption, SectionHead } from "@/components/thrasher/editorial";
import { mountAlbum } from "@/lib/thrasher/behaviours";

/**
 * The gate and the album.
 *
 * ⚠️ THE GATE IS DECORATIVE. It checks nothing — submitting reveals the
 * album, and any visitor who opens devtools or reads the JS bundle can do the
 * same. That is exactly what the pre-redesign FamilyGate did too (its
 * onSubmit called `onLogin?.()` with no comparison), so this is a faithful
 * port of existing behaviour rather than a new hole — but it should not be
 * described to anyone as protecting the album.
 *
 * Real privacy needs the photographs behind a server boundary: a route
 * handler that checks a cookie or a signed URL and only then returns the
 * image bytes. Until then the honest protections are the two that actually
 * work — `noindex, nofollow` on this route, and not publishing the URL.
 *
 * The album is rendered on demand rather than mounted-and-hidden so the
 * twenty screens are not paid for by a visitor who never gets in.
 */
/**
 * Copy arrives already filled, from the server.
 *
 * This is a client component — the gate has state — and fill() cannot be
 * imported here: it reaches lib/posts.ts, which uses `fs`. So app/family
 * resolves the {tokens} and passes the strings down. Doing it the other way
 * round leaked {frames} onto the page verbatim.
 */
export interface FamilyAlbumCopy {
  gateHeadline: string[];
  gateText: string;
  lockedHeadline: string[];
  lockedText: string;
}

export default function FamilyAlbum({ copy }: { copy: FamilyAlbumCopy }) {
  const [open, setOpen] = useState(false);

  /* The album container does not exist until this renders, so the twenty
     plates have to be drawn after the reveal — boot() has long since run and
     found nothing. */
  useEffect(() => {
    if (open) mountAlbum();
  }, [open]);

  return (
    <div className="sec two">
      <div>
        <SectionHead lite no="01" title="The gate" right="FamilyGate" />
        <form
          className="gate"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <div className="gt">
            {copy.gateHeadline.map((l, i) => (
              <span key={i}>
                {i > 0 ? <br /> : null}
                {l}
              </span>
            ))}
          </div>
          <p>{copy.gateText}</p>
          <div className="fld2">
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
            />
            <button className="btn" type="submit" style={{ border: "none" }}>
              Enter
            </button>
          </div>
        </form>
        <Caption
          left={
            open
              ? "Unlocked · this gate is decorative and checks nothing"
              : "Client-side only · not real access control"
          }
        />
      </div>

      <div>
        <SectionHead
          lite
          no="02"
          title="The album"
          right={open ? "20 frames" : "Locked"}
        />
        {open ? (
          <>
            {/* Filled by drawGallery() in lib/thrasher/behaviours.ts, which
                emits twenty plates with deterministic crops. */}
            <div className="gallery" id="gal" />
            <Caption
              left="Click any frame for the actual colour"
              right="Screen 2.2px"
            />
          </>
        ) : (
          <div className="gate" aria-hidden="true">
            <div className="gt" style={{ color: "var(--cap)" }}>
              {copy.lockedHeadline.map((l, i) => (
                <span key={i}>
                  {i > 0 ? <br /> : null}
                  {l}
                </span>
              ))}
            </div>
            <p>{copy.lockedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
