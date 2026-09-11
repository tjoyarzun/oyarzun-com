import type * as React from "react";
/**
 * A screened photograph.
 *
 * The canvas carries the halftone parameters as data attributes and
 * lib/thrasher/halftone.ts reads them, samples the source image's luminance
 * pixel by pixel, and draws one dot per screen cell with its radius set by
 * what is underneath it. Nothing here is a CSS filter.
 *
 * Why a <canvas> and a plain src rather than next/image: the engine calls
 * getImageData(), which throws SecurityError on a canvas tainted by a
 * cross-origin draw. Every plate source therefore has to be same-origin —
 * i.e. a file under /public — and cannot be a remote URL. That is the
 * constraint driving the "move the covers into /public" migration item.
 *
 * The <button> wrapper is what opens the lightbox. It is a real button, not
 * an anchor with href="#", so keyboard and screen-reader users get the
 * behaviour the visual affords.
 *
 * Under Negative, `ink` and `paper` are swapped and the plate is redrawn by
 * the behaviours module — so pass the light-mode pair and let it invert.
 */
export interface PlateProps {
  /** Full-colour source revealed in the lightbox. Same-origin. */
  full: string;
  /** Lightbox title. */
  title: string;
  /** Lightbox sub-caption — provenance, date. */
  detail?: string;
  /** Screen source. Defaults to `full`. */
  src?: string;
  /** Screen ruling in px. Smaller = finer. Key it to reproduction size. */
  pitch?: number;
  /** Screen angle in degrees. 45 is the black plate. */
  angle?: number;
  /** Tone curve. Higher darkens the mid-tones for a dark-on-light plate. */
  gamma?: number;
  /** Aspect ratio, width / height. */
  ar?: number;
  ink?: string;
  paper?: string;
  /** Duotone crush: shadows to solid, highlights to paper, midtones squeezed. */
  crush?: boolean;
  /** `cx,cy,cz` sample window. NOTE: when the target is wider than the
   *  source, cx has no effect — only cy and cz move the crop. */
  crop?: string;
  /** Label on the hover affordance. */
  cta?: string;
  /** Accessible name for the button. */
  label?: string;
}

export default function Plate({
  full,
  title,
  detail,
  src,
  pitch = 3.0,
  angle = 45,
  gamma = 1.0,
  ar = 1.3,
  ink = "#141414",
  paper = "#dcd9d0",
  crush = true,
  crop = "0.5,0.5,1",
  cta = "Click for colour",
  label,
}: PlateProps) {
  return (
    <button
      className="plate"
      type="button"
      data-full={full}
      data-t={title}
      data-d={detail}
      aria-label={label ?? `Show this photograph in colour: ${title}`}
    >
      <canvas
        /* Reserve the plate's final height before the photograph loads.
           Without this the canvas sits at its intrinsic 300×150 until the
           halftone engine sets width/height, and every plate on the page
           shoves the content below it downwards as it resolves — which
           shifts the text a reader is already looking at, and moves an
           anchor out from under a link that had just scrolled to it. */
        /* `--ar` is the default proportion; `--plate-ar` is the override a
           media query can set (see the cover in globals.css). The engine
           reads the resulting height, so changing it in CSS changes the
           crop, not just the box. */
        style={
          {
            "--ar": String(ar),
            aspectRatio: "var(--plate-ar, var(--ar))",
          } as React.CSSProperties
        }
        data-src={src ?? full}
        data-pitch={pitch}
        data-angle={angle}
        data-gamma={gamma}
        data-ar={ar}
        data-ink={ink}
        data-paper={paper}
        data-crush={crush ? "1" : undefined}
        data-crop={crop}
      />
      <span className="cta">{cta}</span>
    </button>
  );
}
