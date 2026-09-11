/* ═══════════════════════════════════════════════════════════════════════
   Shared behavior across every route.

   Ported from the design exploration's site.js. Three things changed:

     1. Negative was removed. next-themes owns the theme now; this module only
        repaints the plates and redraws the charts when it changes.
     2. Prefetch-on-intent was removed. next/link already prefetches.
     3. The charts read their colors from the design system's CSS variables
        instead of hard-coded hex, so they invert under Negative too. In the
        static original they did not — the SVGs were drawn once in ink-on-paper
        and stayed that way when the page went negative.
   ═══════════════════════════════════════════════════════════════════════ */

import { halftone, paintAllPlates } from "./halftone";
import { GALLERY_FRAMES, gallery } from "@/lib/copy";
import { adventuresThisYear } from "@/lib/data";

/** Read the live design-system colors, so every drawing inverts with the page. */
function tokens() {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, fallback: string) =>
    s.getPropertyValue(n).trim() || fallback;
  return {
    ink: v("--ink", "#141414"),
    paper: v("--paper", "#dcd9d0"),
    red: v("--red", "#dd2f1c"),
    ink70: v("--ink70", "#141414b3"),
    ink45: v("--ink45", "#14141473"),
    /* Caption ink and caption red — the AA-passing pair. SVG <text> is text
       and needs them for the same reason the CSS labels do; ink45 measured
       2.80:1 and every axis label in every drawing was using it. */
    cap: v("--cap", "#545350"),
    redTx: v("--red-tx", "#a62315"),
    ink22: v("--ink22", "#14141438"),
    ink12: v("--ink12", "#1414141f"),
  };
}

/* ── LIGHTBOX ──────────────────────────────────────────────────────────
   The site is printed in one ink. The photographs are not. */
let lbWired = false;

function initLightbox(): void {
  const lb = document.getElementById("lb");
  if (!lb) return;

  const lbi = lb.querySelector("img") as HTMLImageElement | null;
  const lbm = lb.querySelector(".meta");
  const lbt = lb.querySelector(".t");
  const lbd = lb.querySelector(".d");
  const lbx = lb.querySelector("button");
  if (!lbi || !lbm || !lbt || !lbd || !lbx) return;

  let last: HTMLElement | null = null;

  const open = (el: HTMLElement) => {
    last = el;
    lbt.textContent = el.dataset.t || "";
    lbd.textContent = el.dataset.d || "";
    lbi.alt = (el.dataset.t || "Photograph") + " — in color";
    lbi.classList.remove("in");
    lbm.classList.remove("in");
    lb.hidden = false;
    requestAnimationFrame(() => {
      lb.classList.add("in");
      /* Preload before swapping src, so the reveal is the full-color image
         arriving rather than a blank frame that fills in. */
      const pre = new Image();
      pre.onload = () => {
        lbi.src = pre.src;
        requestAnimationFrame(() => {
          lbi.classList.add("in");
          lbm.classList.add("in");
        });
      };
      pre.src = el.dataset.full || "";
    });
    (lbx as HTMLElement).focus();
  };

  const close = () => {
    lb.classList.remove("in");
    lbi.classList.remove("in");
    lbm.classList.remove("in");
    setTimeout(() => {
      lb.hidden = true;
      last?.focus();
    }, 300);
  };

  /* Plates are re-wired on every boot because a client navigation replaces
     them; the `data-w` flag keeps a plate from collecting two listeners. */
  document.querySelectorAll<HTMLElement>(".plate[data-full]").forEach((el) => {
    if (el.dataset.w) return;
    el.dataset.w = "1";
    el.addEventListener("click", () => open(el));
  });

  /* The overlay itself lives in the root layout and is never replaced, so its
     own listeners must be attached exactly once. */
  if (lbWired) return;
  lbWired = true;
  lbx.addEventListener("click", close);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lb.hidden) close();
  });
}

/* ── the masthead is force-justified to the measure ──────────────────── */
export function fitMast(): void {
  document.querySelectorAll<HTMLElement>("[data-fitbox]").forEach((box) => {
    const el = box.querySelector<HTMLElement>("[data-fit]");
    if (!el) return;
    const target = box.clientWidth;
    if (!target) return;
    /* scrollWidth, not getBoundingClientRect: gBCR returns the *clamped* box
       width, so any max-width on the span makes the comparison unfalsifiable
       and the search runs away to its ceiling. scrollWidth reports the real
       content width either way. This was the heading-resize bug. */
    let lo = 22;
    let hi = Math.max(64, target * 1.6);
    for (let k = 0; k < 28; k++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + "px";
      if (el.scrollWidth > target) hi = mid;
      else lo = mid;
    }
    el.style.fontSize = Math.max(22, lo).toFixed(2) + "px";
  });
}

/* ── SkillRadar ────────────────────────────────────────────────────────
   Both stacks, from lib/data.ts, on one shared axis set.

   The design hard-coded six invented axes (BigQuery .9, GCP .88, Databricks
   .75 …) that appear nowhere in the data. The real `skills` arrays carry ten
   entries for him and nine for her, on partly different axes — so plotting
   each against its own axes would produce two charts that cannot be compared,
   which defeats the point of putting them side by side.

   The axis set is therefore the UNION of both arrays, ordered by combined
   proficiency so the strong axes lead. A skill one of them does not list
   reads as zero on that axis, which is information rather than a gap.

   Reads the radar's own `data-who` to know whose polygon to fill. */
function drawRadar(): void {
  const svgs = document.querySelectorAll<SVGElement>("svg[data-radar]");
  if (!svgs.length) return;
  const t = tokens();

  svgs.forEach((svg) => {
    let axes: { skill: string; value: number }[];
    try {
      axes = JSON.parse(svg.dataset.axes || "[]");
    } catch {
      return;
    }
    if (axes.length < 3) return;

    const W = 340, H = 260, cx = W / 2, cy = 118, R = 84;
    const pt = (i: number, r: number) => {
      const a = -Math.PI / 2 + (i / axes.length) * Math.PI * 2;
      return [cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r];
    };
    const poly = (r: number) =>
      axes.map((_, i) => pt(i, r).map((n) => n.toFixed(1)).join(",")).join(" ");

    let g = "";
    /* Rings at 25/50/75/100, the outermost solid so the scale has an edge. */
    [0.25, 0.5, 0.75, 1].forEach((r) => {
      g += `<polygon points="${poly(r)}" fill="none" stroke="${r === 1 ? t.ink45 : t.ink22}" stroke-width="1"/>`;
    });
    axes.forEach((_, i) => {
      const [x, y] = pt(i, 1);
      g += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${t.ink22}" stroke-width="1"/>`;
    });
    /* No ring label. The first axis sits at -90° — straight up — which is
       exactly where a "100" marker on the outer ring wants to go, and the two
       collided: SQL rendered as "SOL" with the 1 across its Q. The scale is
       stated in the key above the plate instead. */

    g +=
      `<polygon points="${axes.map((d, i) => pt(i, d.value / 100).map((n) => n.toFixed(1)).join(",")).join(" ")}" ` +
      `fill="${t.red}" fill-opacity=".18" stroke="${t.red}" stroke-width="2"/>`;

    axes.forEach((d, i) => {
      const [px, py] = pt(i, d.value / 100);
      if (d.value > 0)
        g += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.6" fill="${t.red}"/>`;
      /* Labels are placed by quadrant so they never overrun the drawing:
         anchored away from the center, nudged clear of the vertex. */
      const [lx, ly] = pt(i, 1.13);
      const dx = lx - cx;
      const anchor = Math.abs(dx) < 6 ? "middle" : dx > 0 ? "start" : "end";
      const dy = ly < cy ? -1 : 9;
      g += `<text x="${lx.toFixed(1)}" y="${(ly + dy).toFixed(1)}" text-anchor="${anchor}" font-family="var(--cred)" font-size="10" letter-spacing=".7" fill="${t.cap}">${d.skill.toUpperCase()}</text>`;
      g += `<text x="${lx.toFixed(1)}" y="${(ly + dy + 11).toFixed(1)}" text-anchor="${anchor}" font-family="var(--disp)" font-weight="800" font-size="13" fill="${d.value >= 90 ? t.redTx : t.ink70}">${d.value}</text>`;
    });
    svg.innerHTML = g;
  });
}

/* ── BooksChart — a line, because it is a time series ────────────────── */
function drawBooks(): void {
  const svg = document.getElementById("books");
  if (!svg) return;
  const t = tokens();
  const D: [string, number][] = [
    ["Q2 25", 0],
    ["Q3 25", 0],
    ["Q4 25", 0],
    ["Q1 26", 0],
    ["Q2 26", 4],
    ["Q3 26", 4],
  ];
  const W = 320,
    H = 168,
    L = 26,
    R = 26,
    T = 18,
    B = 32,
    max = 5;
  const X = (i: number) => L + (i / (D.length - 1)) * (W - L - R);
  const Y = (v: number) => T + (1 - v / max) * (H - T - B);
  let g = "";
  for (let v = 0; v <= max; v++) {
    const y = Y(v).toFixed(1);
    g += `<line x1="${L}" y1="${y}" x2="${W - R}" y2="${y}" stroke="${v === 0 ? t.ink : t.ink12}" stroke-width="1"/>`;
    g += `<text x="${L - 6}" y="${(+y + 3).toFixed(1)}" text-anchor="end" font-family="var(--cred)" font-size="10" fill="${t.cap}">${v}</text>`;
  }
  D.forEach((d, i) => {
    g += `<text x="${X(i).toFixed(1)}" y="${H - B + 15}" text-anchor="middle" font-family="var(--cred)" font-size="10" letter-spacing=".6" fill="${t.cap}">${d[0].toUpperCase()}</text>`;
  });
  const pts = D.map((d, i) => [X(i), Y(d[1])]);
  const fz = D.findIndex((d) => d[1] > 0);
  const seg = (a: number, b: number) =>
    pts.slice(a, b + 1).map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  /* Dashed while the series is flat at zero, solid once it moves: the gap is
     real data, not missing data, and the two are drawn differently. */
  g += `<polyline points="${seg(0, fz - 1)}" fill="none" stroke="${t.ink45}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
  g += `<polyline points="${seg(fz - 1, D.length - 1)}" fill="none" stroke="${t.red}" stroke-width="2.4"/>`;
  pts.forEach((p, i) => {
    const v = D[i][1];
    g +=
      v > 0
        ? `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="${t.red}"/>`
        : `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.6" fill="${t.paper}" stroke="${t.ink45}" stroke-width="1.2"/>`;
    if (v > 0)
      g += `<text x="${p[0].toFixed(1)}" y="${(p[1] - 10).toFixed(1)}" text-anchor="middle" font-family="var(--disp)" font-weight="800" font-size="16" fill="${t.ink}">${v}</text>`;
  });
  svg.innerHTML = g;
}

/* ── AdventureMap — a route chart on a real graticule ────────────────── */
/* ── the coastline ───────────────────────────────────────────────────────
   The route chart used to be a graticule with arcs on it and nothing else,
   which is a coordinate grid rather than a map: there was no way to tell that
   Rome is in Italy or San Francisco on a coast.

   The outlines come from public/land.json — 73 rings, 1,934 points, 8KB
   gzipped — generated from Natural Earth 1:110m by scripts/gen-land.mjs.
   Fetched rather than bundled, because it is a decorative base layer for one
   department thousands of pixels down the page, and the alternative was 24KB
   in the first-load JS of every route including the posts, which have no map.

   Cached at module scope, so a client navigation back to the home page
   redraws from memory rather than asking again. */
type Ring = [number, number][];
let LAND: Ring[] | null = null;
let landPending = false;

function loadLand(): void {
  if (LAND || landPending) return;
  landPending = true;
  fetch("/land.json")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((d: { land: Ring[] }) => {
      LAND = d.land;
      /* Redraw now that there is something to draw. The chart renders
         perfectly well without land, so nothing was blocked on this. */
      drawMap();
    })
    .catch(() => {
      /* No land, no fuss — the graticule and the arcs still carry the plate. */
      LAND = [];
    })
    .finally(() => {
      landPending = false;
    });
}

function drawMap(): void {
  const svg = document.getElementById("chart");
  const wrap = svg?.closest(".map") as HTMLElement | null;
  if (!svg || !wrap) return;

  /* ── Drawn at the container's real pixel size, not into a fixed viewBox.
     The old version used viewBox="0 0 1360 440" and let the browser scale it
     to fit, which meant everything inside scaled too: at a 420px viewport the
     plate was 380x123 and its city labels rendered at 5.9px with the dates at
     3.1px. It was drawing correctly and reading as a dark smudge.

     Same principle as the halftone's screen ruling — the marks are keyed to
     the size the thing is actually reproduced at, so type stays type. ── */
  const W = Math.max(280, Math.round(wrap.clientWidth));

  /* ── Destinations come from `adventures`, not a hand-written list.
     They used to be four hard-coded entries, so logging a trip updated every
     figure on the site and left the map showing the old four. The window is
     derived from the data too, so a destination outside the previous bounds
     appears on the plate instead of off the edge of it. ── */
  const HOME = { lat: 40.57, lng: -111.86 };
  /* The reporting year's trips, matching every figure printed beside the
     chart. Drawing all time here would have put a 2025 arc on a plate whose
     caption counts only 2026. */
  const pts = adventuresThisYear
    .filter((a) => typeof a.lat === "number" && typeof a.lng === "number")
    .map((a) => ({
      name: a.name,
      /* The trip name is the headline; the place is what belongs on a map. */
      place: (a.location || a.name).split(",")[0].trim(),
      lat: a.lat,
      lng: a.lng,
      n: a.nights,
      d: a.date.replace(/-/g, "·"),
    }));
  if (!pts.length) {
    svg.innerHTML = "";
    return;
  }

  const lons = [HOME.lng, ...pts.map((d) => d.lng)];
  const lats = [HOME.lat, ...pts.map((d) => d.lat)];
  const padLon = Math.max(12, (Math.max(...lons) - Math.min(...lons)) * 0.1);
  const padLat = Math.max(5, (Math.max(...lats) - Math.min(...lats)) * 0.22);

  /* ── Minimum spans, so the coastline is recognizable geography rather than
     a vertical sliver.

     Framed to the markers alone this window was 35-45°N — five degrees of
     padding around four destinations that all sit near the 40th parallel.
     Correct framing, useless map: North America and Europe both cropped to
     ambiguous strips with no coastline anyone could name. A route chart is
     read by recognizing where the arcs land, so the window has to be wide
     enough to show that, even when the trips themselves are clustered. ── */
  const MIN_LAT_SPAN = 38;
  const MIN_LON_SPAN = 80;
  const widen = (lo: number, hi: number, min: number): [number, number] => {
    const span = hi - lo;
    if (span >= min) return [lo, hi];
    const grow = (min - span) / 2;
    return [lo - grow, hi + grow];
  };
  const [LON0, LON1] = widen(
    Math.min(...lons) - padLon,
    Math.max(...lons) + padLon,
    MIN_LON_SPAN,
  );
  const [LAT1, LAT0] = widen(
    Math.min(...lats) - padLat,
    Math.max(...lats) + padLat,
    MIN_LAT_SPAN,
  );

  /* Height from the geographic window, but never a sliver. A 174-degree
     longitude span over 23 of latitude wants a 5.5:1 plate, which at phone
     width is 70px tall — so the aspect is clamped and a floor applied. The
     result is vertically stretched relative to the geography, which is why
     the caption calls this a print treatment rather than a map. */
  const geoAspect = (LON1 - LON0) / Math.max(1, LAT0 - LAT1);
  const H = Math.round(
    Math.max(W / Math.min(3.4, Math.max(1.6, geoAspect)), 190),
  );

  const X = (l: number) => ((l - LON0) / (LON1 - LON0)) * W;
  const Y = (a: number) => ((LAT0 - a) / (LAT0 - LAT1)) * H;

  /* Fixed polarity: a reversed-out plate in both themes, so its marks come
     from the pair that does not invert. */
  const t = tokens();
  const mark = "#dcd9d0";

  /* Type and density step with the reproduction size. Below 560px the date
     line is dropped entirely rather than set at an unreadable size — fewer
     things, still legible, beats everything present and none of it readable. */
  /* Labels are knocked out of whatever they cross. The arcs and the
     graticule both run through the label positions — Rome's dateline had a
     dashed vermilion arc straight through it — and paint-order lets one
     <text> paint a ground-colored stroke first and the glyph on top, which
     is a halo without a second element or a filter. */
  const knock = `stroke="#141414" stroke-width="3.5" stroke-linejoin="round" paint-order="stroke"`;
  const tight = W < 560;
  const fCity = tight ? 13 : 21;
  const fMeta = tight ? 9 : 11;
  const fGrat = tight ? 9 : 10.5;
  const showDates = !tight;
  const lineH = fCity * 0.82;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  let g = "";

  /* ── Land first, so every line and label sits on top of it.
     Rings whose bounding box misses the window are culled rather than left
     to the SVG clip: at a 174-degree window most of the world is off-plate,
     and a path string carrying it is bytes and parse time for nothing.

     A ring is drawn as one path with a fill and its own hairline coast. The
     fill is deliberately quiet — this is the ground the chart is printed on,
     not the subject of it. ── */
  if (LAND && LAND.length) {
    const paths: string[] = [];
    for (const ring of LAND) {
      let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
      for (const [lo, la] of ring) {
        if (lo < minLon) minLon = lo;
        if (lo > maxLon) maxLon = lo;
        if (la < minLat) minLat = la;
        if (la > maxLat) maxLat = la;
      }
      if (maxLon < LON0 || minLon > LON1 || maxLat < LAT1 || minLat > LAT0) continue;
      let d = "";
      for (let i = 0; i < ring.length; i++) {
        const x = X(ring[i][0]);
        const y = Y(ring[i][1]);
        d += `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      }
      paths.push(d + "Z");
    }
    if (paths.length) {
      const d = paths.join("");
      /* Quiet, but readable. At 7% fill and a 30% coast the continents were
         present and unidentifiable — the plate looked black, which is what
         was reported. The coastline carries the shape and the fill just
         separates land from sea. */
      g += `<path d="${d}" fill="${mark}1f" stroke="none"/>`;
      g += `<path d="${d}" fill="none" stroke="${mark}8c" stroke-width="1" stroke-linejoin="round"/>`;
    }
  } else {
    loadLand();
  }

  /* Graticule, at whatever interval gives roughly six lines for this window. */
  const step = (span: number) =>
    [1, 2, 5, 10, 20, 30, 45, 60].find((v) => span / v <= 6) ?? 60;
  const lonStep = step(LON1 - LON0);
  const latStep = step(LAT0 - LAT1);
  for (let l = Math.ceil(LON0 / lonStep) * lonStep; l <= LON1; l += lonStep) {
    const x = X(l).toFixed(1);
    g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${mark}1f" stroke-width="1"/>`;
    g += `<text x="${x}" y="${H - 7}" text-anchor="middle" font-family="var(--cred)" font-size="${fGrat}" letter-spacing="1" fill="${mark}8c" ${knock}>${Math.abs(Math.round(l))}°${l < 0 ? "W" : l > 0 ? "E" : ""}</text>`;
  }
  for (let a = Math.floor(LAT0 / latStep) * latStep; a >= LAT1; a -= latStep) {
    const y = Y(a);
    if (y < 12 || y > H - 12) continue;
    g += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="${mark}1f" stroke-width="1"/>`;
    /* Hemisphere from the sign, not assumed. It was hard-coded "°N", so a
       trip south of the equator would have labelled the plate "-20°N". */
    const lat = Math.round(a);
    const hemi = lat < 0 ? "S" : lat > 0 ? "N" : "";
    g += `<text x="8" y="${(y - 5).toFixed(1)}" font-family="var(--cred)" font-size="${fGrat}" letter-spacing="1" fill="${mark}8c" ${knock}>${Math.abs(lat)}°${hemi}</text>`;
  }

  const hx = X(HOME.lng);
  const hy = Y(HOME.lat);

  /* Arcs first, so every label sits on top of every line. */
  pts.forEach((d) => {
    const dx = X(d.lng);
    const dy = Y(d.lat);
    const mx = (hx + dx) / 2;
    const my = (hy + dy) / 2 - Math.abs(dx - hx) * 0.16;
    g += `<path d="M${hx.toFixed(1)},${hy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${dx.toFixed(1)},${dy.toFixed(1)}" fill="none" stroke="${t.red}" stroke-width="1.6" stroke-dasharray="7 4"/>`;
  });

  /* ── Label placement, since the destinations are no longer hand-tuned.
     Anchor away from whichever edge the point is near, then walk down the
     list pushing any label that would collide with the previous one. Two
     trips to the same city — Rome and Sicily are 4 degrees apart — would
     otherwise print on top of each other. ── */
  const placed = pts
    .map((d) => ({ ...d, x: X(d.lng), y: Y(d.lat) }))
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .map((d) => {
      const anchor = d.x > W * 0.7 ? "end" : d.x < W * 0.3 ? "start" : "middle";
      const off = anchor === "end" ? -10 : anchor === "start" ? 10 : 0;
      return { ...d, anchor, lx: d.x + off, ly: d.y };
    });
  const block = lineH + (showDates ? fMeta + 4 : 0) + 6;
  /* Keep the whole label — headline plus its meta line — inside the plate. */
  const floorY = H - (showDates ? fMeta + 8 : 6);
  for (let i = 1; i < placed.length; i++) {
    const prev = placed[i - 1];
    const cur = placed[i];
    /* only a real overlap counts — labels far apart horizontally are fine */
    if (Math.abs(cur.x - prev.x) < W * 0.24 && cur.ly - prev.ly < block) {
      cur.ly = prev.ly + block;
    }
    /* The walk pushed each colliding label down by a fixed block with no
       clamp, so a cluster of destinations marched its labels off the bottom
       of the viewBox. Clamped here, and anything that hits the floor is
       nudged UP instead so it stays legible rather than stacking. */
    if (cur.ly > floorY) {
      cur.ly = floorY;
      if (Math.abs(cur.x - prev.x) < W * 0.24 && Math.abs(cur.ly - prev.ly) < block) {
        prev.ly = Math.max(lineH, cur.ly - block);
      }
    }
    cur.ly = Math.max(lineH, cur.ly);
  }

  placed.forEach((d) => {
    g += `<rect x="${(d.x - 4).toFixed(1)}" y="${(d.y - 4).toFixed(1)}" width="8" height="8" fill="${t.red}"/>`;
    /* a leader line when the label has been pushed clear of its marker */
    if (Math.abs(d.ly - d.y) > 2) {
      g += `<line x1="${d.x.toFixed(1)}" y1="${d.y.toFixed(1)}" x2="${d.lx.toFixed(1)}" y2="${(d.ly - lineH * 0.3).toFixed(1)}" stroke="${mark}59" stroke-width="1"/>`;
    }
    g += `<text x="${d.lx.toFixed(1)}" y="${d.ly.toFixed(1)}" text-anchor="${d.anchor}" font-family="var(--disp)" font-weight="800" font-size="${fCity}" fill="${mark}" letter-spacing="-.2" ${knock}>${d.place.toUpperCase()}</text>`;
    if (showDates) {
      g += `<text x="${d.lx.toFixed(1)}" y="${(d.ly + fMeta + 3).toFixed(1)}" text-anchor="${d.anchor}" font-family="var(--cred)" font-size="${fMeta}" letter-spacing="1.1" fill="${mark}8c" ${knock}>${d.d} · ${d.n} NIGHTS</text>`;
    }
  });

  /* Origin, drawn last so nothing crosses it. */
  const rHome = tight ? 5 : 7;
  g += `<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="${rHome}" fill="${mark}"/>`;
  g += `<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="${rHome * 2}" fill="none" stroke="${mark}" stroke-width="1.4"/>`;
  if (!tight) {
    g += `<text x="${(hx + 20).toFixed(1)}" y="${(hy - 20).toFixed(1)}" font-family="var(--cred)" font-size="10" letter-spacing="1.4" fill="${mark}" ${knock}>SANDY, UT · 4,505 FT · ORIGIN</text>`;
  }

  svg.setAttribute(
    "aria-label",
    `Route chart from Sandy, Utah to ${pts.length} destinations: ${pts
      .map((d) => `${d.place}, ${d.n} nights`)
      .join("; ")}`,
  );
  svg.innerHTML = g;
}

/* ── the scroll IS the issue ──────────────────────────────────────────
   A magazine changes its running head per department. So does this. */
function initDepartments(): void {
  const depts = Array.from(
    document.querySelectorAll<HTMLElement>(".dept[data-dept]"),
  );
  if (!depts.length) return;
  const deptEl = document.getElementById("dept");
  const folioEl = document.getElementById("folio");
  const jumps = Array.from(document.querySelectorAll<HTMLElement>(".nav a.jump"));
  let lastId: string | null = null;

  const spy = () => {
    /* Pick the TOPMOST department above the fold line. An IntersectionObserver
       here means last-callback-wins, which reported whichever section the
       browser happened to notify about last — at scroll-top that was the
       bottom of the page. */
    const line = 90;
    let best = depts[0];
    let bestTop = -Infinity;
    depts.forEach((d) => {
      const top = d.getBoundingClientRect().top - line;
      if (top <= 0 && top > bestTop) {
        bestTop = top;
        best = d;
      }
    });
    if (!best || best.id === lastId) return;
    lastId = best.id;
    if (deptEl) deptEl.textContent = best.dataset.dept || "";
    if (folioEl) folioEl.textContent = best.dataset.folio || "";
    jumps.forEach((a) => {
      const h = a.getAttribute("href") || "";
      a.setAttribute("aria-current", String(h.endsWith("#" + best.id)));
    });
  };

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      spy();
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("hashchange", () => setTimeout(spy, 80));
  spy();
}

/* ── PhotoGallery — the family album's twenty frames ─────────────────── */
function drawGallery(): void {
  const g = document.getElementById("gal");
  if (!g) return;
  /* Sources come from `gallery` in lib/copy.ts, so adding a photograph to
     the album is an edit to that file rather than to this one. Crops are
     chosen from a fixed seed, so a rebuild never reshuffles the wall. */
  const src = gallery;
  if (!src.length) return;
  let s = 77;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  let h = "";
  for (let i = 0; i < GALLERY_FRAMES; i++) {
    const f = src[i % src.length];
    const x = (0.28 + rnd() * 0.44).toFixed(2);
    const y = (0.26 + rnd() * 0.46).toFixed(2);
    const z = (0.34 + rnd() * 0.34).toFixed(2);
    h +=
      `<button class="plate" type="button" data-full="${f}" data-t="Family album · frame ${String(i + 1).padStart(2, "0")}" ` +
      `data-d="Not indexed" aria-label="Show frame ${i + 1} in color">` +
      `<canvas data-src="${f}" data-pitch="2.2" data-angle="45" data-gamma="1.02" data-ar="1" ` +
      `data-ink="#141414" data-paper="#dcd9d0" data-crush="1" data-crop="${x},${y},${z}"></canvas></button>`;
  }
  g.innerHTML = h;
}

/* ── landing on an anchor ────────────────────────────────────────────────
   The masthead type is fitted to the measure at runtime, which means every
   department gets TALLER after the fonts resolve — and the browser has
   already scrolled to the anchor by then, using the pre-fit layout.

   The error compounds down the page, because each masthead above the target
   contributes its own growth: arriving at /#cover landed 38px short and
   looked fine, /#counted was 516px short, /#written 1,216px short — far
   enough into the previous department that the link read as broken.

   So the hash is honored a second time, once the layout is final.

   Two things this must not do. It must not fight a reader who started
   scrolling before the fonts arrived, so any real scroll input cancels it.
   And it must not animate: the browser has already jumped once, and a smooth
   crawl on top of that reads as the page lurching twice. scrollIntoView is
   used rather than a computed offset so the scroll-margin-top that clears
   the sticky nav is applied for free. */
let userHasScrolled = false;
if (typeof window !== "undefined") {
  const mark = () => {
    userHasScrolled = true;
  };
  ["wheel", "touchmove", "keydown", "pointerdown"].forEach((ev) =>
    addEventListener(ev, mark, { passive: true, once: true }),
  );
}

function honorHash(): void {
  if (userHasScrolled) return;
  const hash = location.hash;
  if (hash.length < 2) return;
  let el: Element | null = null;
  try {
    el = document.querySelector(hash);
  } catch {
    return; /* a hash that is not a valid selector */
  }
  if (!el) return;
  el.scrollIntoView({ behavior: "instant", block: "start" });
}

/* ── boot ─────────────────────────────────────────────────────────────
   Called on mount and after every client navigation. Everything it calls is
   safe to call twice: each init either no-ops when its element is absent or
   guards against double-wiring. */
export function boot(): void {
  drawRadar();
  drawBooks();
  drawMap();
  drawGallery();
  initDepartments();
  initLightbox(); /* after drawGallery, so the 20 new plates get wired */
  fitMast();
  /* after the fit, not before: the fit is what moves the target. */
  honorHash();
  paintAllPlates();
}

/**
 * Draw the family album and wire its plates.
 *
 * Separate from boot() because the album is revealed by the gate, which
 * happens long after boot() has run — the gallery container does not exist at
 * mount, so drawGallery() inside boot() found nothing and the wall stayed
 * empty. Called by FamilyAlbum on unlock.
 */
export function mountAlbum(): void {
  drawGallery();
  initLightbox();
  paintAllPlates();
}

/** Re-screen the plates and redraw the charts for the polarity now on screen. */
export function repaint(): void {
  drawRadar();
  drawBooks();
  drawMap();
  paintAllPlates();
}

/**
 * Redraw everything whose CONTENT depends on its width.
 *
 * The route chart now picks its own type sizes, label density and height from
 * the pixel width it is being drawn at, so a resize is not a rescale — it has
 * to be drawn again or a window dragged from desktop to phone width keeps
 * desktop type in a phone-sized plate. Same for the plates, whose screen
 * ruling is keyed to reproduction size.
 */
export function refit(): void {
  fitMast();
  drawMap();
  paintAllPlates();
}

export { halftone };
