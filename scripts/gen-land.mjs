/**
 * Generate the route chart's land outlines.
 *
 * The chart is drawn as an equirectangular projection of our own, not by a
 * mapping library, so it needs raw coastline rings in lon/lat that it can run
 * through the same X()/Y() as the trip markers.
 *
 * This runs at authoring time, not build time, and commits its output — so
 * world-atlas and topojson-client stay devDependencies, nothing large reaches
 * the client bundle, and the data is reviewable in a diff.
 *
 *   node scripts/gen-land.mjs
 *
 * Source: world-atlas land-110m (Natural Earth 1:110m), 54KB of TopoJSON.
 * Output: public/land.json — served as a static asset and fetched once by
 *         drawMap(), so none of it reaches the JavaScript bundle. The chart
 *         is department 04, thousands of pixels down the page, so the request
 *         has always resolved by the time anyone scrolls to it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";

const topo = JSON.parse(
  readFileSync("node_modules/world-atlas/land-110m.json", "utf8"),
);
/* topojson-client returns a FeatureCollection here, with a single
   MultiPolygon feature holding every landmass. */
const fc = feature(topo, topo.objects.land);
const land = fc.type === "FeatureCollection" ? fc.features[0] : fc;

/* Rounding to 1 decimal place is about 11km at the equator. The chart is a
   print treatment at a few hundred pixels of latitude — a tenth of a degree
   is well under one pixel, so this costs nothing visible and roughly halves
   the file. */
const DP = 1;
const round = (n) => Math.round(n * 10 ** DP) / 10 ** DP;

/* Shoelace area in square degrees. Not a real area — it does not correct for
   latitude — but it does not need to be: it is only used to decide which
   islands are too small to draw at this scale. */
function areaDeg(ring) {
  let a = 0;
  for (let i = 0, n = ring.length; i < n; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a / 2);
}

/* An equirectangular projection is linear in longitude, so a ring whose
   points straddle ±180 draws a stripe across the entire plate as it wraps.
   Split those rings at the antimeridian rather than let one produce a streak
   through the middle of the map. */
function splitAtAntimeridian(ring) {
  const parts = [];
  let cur = [ring[0]];
  for (let i = 1; i < ring.length; i++) {
    const prev = ring[i - 1];
    const pt = ring[i];
    if (Math.abs(pt[0] - prev[0]) > 180) {
      parts.push(cur);
      cur = [pt];
    } else {
      cur.push(pt);
    }
  }
  parts.push(cur);
  return parts.filter((p) => p.length > 2);
}

/* Drop consecutive duplicates left behind by rounding. */
function dedupe(ring) {
  const out = [];
  for (const p of ring) {
    const last = out[out.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
  }
  return out;
}

/* Douglas-Peucker. Rounding alone left 4,675 points for a chart that is at
   most ~8px per degree of longitude — far more detail than one pixel. A 0.35°
   tolerance is under 3px at the widest the plate ever gets, so the coastline
   is visually identical and the file is a third of the size. */
function simplify(ring, tol) {
  if (ring.length < 4) return ring;
  const sqTol = tol * tol;
  const sqSegDist = ([px, py], [x1, y1], [x2, y2]) => {
    let x = x1, y = y1, dx = x2 - x1, dy = y2 - y1;
    if (dx || dy) {
      const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = x2; y = y2; }
      else if (t > 0) { x += dx * t; y += dy * t; }
    }
    return (px - x) ** 2 + (py - y) ** 2;
  };
  const keep = new Uint8Array(ring.length);
  keep[0] = keep[ring.length - 1] = 1;
  const stack = [[0, ring.length - 1]];
  while (stack.length) {
    const [lo, hi] = stack.pop();
    let maxD = 0, idx = -1;
    for (let i = lo + 1; i < hi; i++) {
      const d = sqSegDist(ring[i], ring[lo], ring[hi]);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > sqTol && idx > 0) {
      keep[idx] = 1;
      stack.push([lo, idx], [idx, hi]);
    }
  }
  return ring.filter((_, i) => keep[i]);
}

const TOL = 0.35; /* degrees */
const MIN_AREA = 1.5; /* square degrees — keeps Iceland, drops the atolls */

const rings = [];
for (const geom of land.geometry.coordinates) {
  /* land-110m is a MultiPolygon: each geom is a polygon, each polygon is
     [outer, ...holes]. Holes are inland seas; at this scale, ignore them. */
  const outer = geom[0];
  if (!outer) continue;
  for (const part of splitAtAntimeridian(outer)) {
    const r = dedupe(
      simplify(part, TOL).map(([x, y]) => [round(x), round(y)]),
    );
    if (r.length > 3 && areaDeg(r) >= MIN_AREA) rings.push(r);
  }
}

rings.sort((a, b) => areaDeg(b) - areaDeg(a));

const points = rings.reduce((n, r) => n + r.length, 0);
const json = JSON.stringify({
  source: "world-atlas land-110m (Natural Earth 1:110m)",
  generatedBy: "scripts/gen-land.mjs",
  detail: `${DP}dp, Douglas-Peucker ${TOL}deg, islands under ${MIN_AREA} sq deg dropped`,
  rings: rings.length,
  points,
  land: rings,
});

writeFileSync("public/land.json", json);
console.log(
  `public/land.json — ${rings.length} rings, ${points} points, ` +
    `${Math.round(Buffer.byteLength(json) / 1024)}KB`,
);
