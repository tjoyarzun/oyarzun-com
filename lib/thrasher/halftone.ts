/* ═══════════════════════════════════════════════════════════════════════
   TRUE HALFTONE — dot radius from sampled pixel luminance.

   Not a CSS filter and not an SVG pattern. The source image is drawn to an
   offscreen canvas, read back with getImageData(), and one dot is emitted per
   screen cell with its radius set by the luminance of the pixel underneath
   it. That is what a real halftone screen does.

   CONSTRAINT: getImageData() throws SecurityError on a canvas tainted by a
   cross-origin draw, so every source must be same-origin — a file under
   /public. A remote URL cannot be screened, which is why the blog covers have
   to move into the repo.
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * Resolve the plate's actual ink and paper for the polarity now on screen.
 *
 * `data-ink`/`data-paper` always describe the LIGHT pair and are never
 * mutated. Under Negative we swap them here instead of writing the swapped
 * values back to the dataset — the original design mutated the dataset on
 * every toggle, which meant a repaint that fired twice, or fired once on a
 * plate added later, left that plate in the wrong polarity. Deriving the pair
 * on each draw makes the function idempotent: calling it any number of times
 * in any order gives the same result.
 */
function polarity(cv: HTMLCanvasElement): { ink: string; paper: string } {
  const ink = cv.dataset.ink || "#141414";
  const paper = cv.dataset.paper || "#dcd9d0";
  const negative = document.documentElement.classList.contains("dark");
  return negative ? { ink: paper, paper: ink } : { ink, paper };
}

export function halftone(cv: HTMLCanvasElement): void {
  const src = cv.dataset.src;
  if (!src) return;

  /* Screen ruling. `data-pitch` is the default; a `--plate-pitch` custom
     property overrides it, which is how the cover drops to a finer screen on
     a phone. A fixed 5px ruling on a 350px-wide plate is a 70-dot-wide
     picture — coarse enough that two faces stop being faces. */
  const cssPitch = parseFloat(
    getComputedStyle(cv).getPropertyValue("--plate-pitch"),
  );
  const pitch =
    (Number.isFinite(cssPitch) && cssPitch > 0 ? cssPitch : 0) ||
    parseFloat(cv.dataset.pitch || "") ||
    5;
  const ang = ((parseFloat(cv.dataset.angle || "") || 45) * Math.PI) / 180;
  const gm = parseFloat(cv.dataset.gamma || "") || 1.3;
  const ar = parseFloat(cv.dataset.ar || "") || 1.3;
  const two = cv.dataset.two;
  const twoAng = ((parseFloat(cv.dataset.twoangle || "") || 15) * Math.PI) / 180;
  const { ink, paper } = polarity(cv);
  const [cx, cy, cz] = (cv.dataset.crop || "0.5,0.5,1").split(",").map(Number);

  const img = new Image();
  img.onload = () => {
    const W = Math.round(cv.clientWidth || 600);
    if (!W) return;
    /* Follow the box CSS actually laid out, and fall back to `ar` only if
       there isn't one yet. The inline `aspect-ratio` on the canvas gives it a
       height before the photograph loads, so clientHeight is normally real —
       and reading it is what lets a media query change a plate's proportions.
       Deriving H from data-ar instead made the frame unchangeable from the
       stylesheet, which is how the cover ended up letterboxed to 149px on a
       phone with its caption covering 80% of it. */
    const H = Math.round(cv.clientHeight || W / ar);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const oc = off.getContext("2d");
    if (!oc) return;

    /* The sample window. When the source is WIDER than the target aspect we
       take the full source height and crop horizontally; otherwise the full
       width and crop vertically. Consequence worth knowing before tuning a
       crop by trial and error: in the second case rw === sw, so `cx` has no
       effect at all and only cy/cz move the frame. */
    const sw = img.width * cz;
    const sh = img.height * cz;
    const sAr = sw / sh;
    const tAr = W / H;
    let rw: number, rh: number;
    if (sAr > tAr) {
      rh = sh;
      rw = sh * tAr;
    } else {
      rw = sw;
      rh = sw / tAr;
    }
    const sx = Math.max(0, Math.min(img.width - rw, img.width * cx - rw / 2));
    const sy = Math.max(0, Math.min(img.height - rh, img.height * cy - rh / 2));
    oc.drawImage(img, sx, sy, rw, rh, 0, 0, W, H);

    let d: Uint8ClampedArray;
    try {
      d = oc.getImageData(0, 0, W, H).data;
    } catch {
      /* Tainted canvas — the source was cross-origin. Leave the plate blank
         rather than throwing; a missing screen is a visible bug, a thrown
         exception takes the rest of the boot sequence with it. */
      cv.dataset.error = "tainted";
      return;
    }

    const crush = cv.dataset.crush === "1";
    const lum = (x: number, y: number): number => {
      x = Math.max(0, Math.min(W - 1, x | 0));
      y = Math.max(0, Math.min(H - 1, y | 0));
      const i = (y * W + x) * 4;
      let L = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      /* A real duotone crush: shadows to solid, highlights to paper,
         midtones squeezed out. */
      if (crush) {
        L =
          L < 0.3
            ? L * 0.22
            : L > 0.68
              ? 0.86 + (L - 0.68) * 0.44
              : ((L - 0.3) / 0.38) * 0.66 + 0.1;
      }
      return Math.max(0, Math.min(1, L));
    };

    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, W, H);

    const plate = (
      col: string,
      angle: number,
      dx: number,
      dy: number,
      gamma: number,
      scale: number,
      alpha: number,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = col;
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const diag = Math.ceil(Math.hypot(W, H) / pitch) + 2;
      ctx.beginPath();
      for (let j = -diag; j <= diag; j++) {
        for (let i = -diag; i <= diag; i++) {
          const gx = i * pitch;
          const gy = j * pitch;
          const x = gx * ca - gy * sa + W / 2 + dx;
          const y = gx * sa + gy * ca + H / 2 + dy;
          if (x < -pitch || y < -pitch || x > W + pitch || y > H + pitch)
            continue;
          /* t is INK coverage, so it rises as luminance falls. Note the
             consequence for gamma: raising it always pushes coverage down,
             which lightens a dark-on-light plate but also lightens a
             light-on-dark one. Gamma is not "darkness". */
          const t = Math.pow(Math.max(0, Math.min(1, 1 - lum(x, y))), gamma);
          const r = t * pitch * 0.745 * scale;
          if (r > 0.15) {
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, 6.28318);
          }
        }
      }
      ctx.fill();
      ctx.restore();
    };

    if (two) {
      plate(two, twoAng, -3.2, 2.2, gm * 1.02, 0.92, 0.82);
      plate(ink, ang, 0, 0, gm, 1, 0.9);
    } else {
      plate(ink, ang, 0, 0, gm, 1, 0.93);
    }
    cv.dataset.ready = "1";
  };
  img.src = src;
}

/** Screen (or re-screen) every plate in the document. Idempotent. */
export function paintAllPlates(): void {
  document
    .querySelectorAll<HTMLCanvasElement>("canvas[data-src]")
    .forEach(halftone);
}
