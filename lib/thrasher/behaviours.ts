/* ═══════════════════════════════════════════════════════════════════════
   Shared behaviour across every route.

   Ported from the design exploration's site.js. Three things changed:

     1. Negative was removed. next-themes owns the theme now; this module only
        repaints the plates and redraws the charts when it changes.
     2. Prefetch-on-intent was removed. next/link already prefetches.
     3. The charts read their colours from the design system's CSS variables
        instead of hard-coded hex, so they invert under Negative too. In the
        static original they did not — the SVGs were drawn once in ink-on-paper
        and stayed that way when the page went negative.
   ═══════════════════════════════════════════════════════════════════════ */

import { halftone, paintAllPlates } from "./halftone";

/** Read the live design-system colours, so every drawing inverts with the page. */
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
    lbi.alt = (el.dataset.t || "Photograph") + " — in colour";
    lbi.classList.remove("in");
    lbm.classList.remove("in");
    lb.hidden = false;
    requestAnimationFrame(() => {
      lb.classList.add("in");
      /* Preload before swapping src, so the reveal is the full-colour image
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

/* ── GitHubHeatmap ─────────────────────────────────────────────────────
   Live from the GitHub GraphQL API via /api/github-activity, which returns
   one level (0-4) per day for the last 52 weeks plus the year total.

   No mock fallback, deliberately. The caption under this grid claims the data
   is live, and a plausible-looking synthetic grid is the one failure mode that
   makes the claim false without looking wrong — the design's static version
   drew a seeded random wall and captioned it "live". If the request fails the
   grid says so instead. */
async function drawHeat(): Promise<void> {
  /* Two consumers, one request: the 52-week grid on /us and the commit
     readout plus sparkline on the home panel. Either can be absent, so the
     guard is on having something to fill and a username to ask about — not on
     the grid specifically, which is what made the panel's sparkline never
     fetch on the one page that shows it. */
  const el = document.getElementById("heat");
  const spark = document.querySelector<HTMLElement>("[data-commit-spark]");
  const host = document.querySelector<HTMLElement>("[data-gh-user]");
  const user = el?.dataset.user || host?.dataset.ghUser;
  if (!user) return;
  if (!el && !spark) return;
  const flag = el ?? spark!;
  if (flag.dataset.loaded) return;
  flag.dataset.loaded = "1";

  try {
    const res = await fetch(
      `/api/github-activity?username=${encodeURIComponent(user)}`,
    );
    if (!res.ok) throw new Error(String(res.status));
    const data: { contributions: number[]; total: number } = await res.json();

    /* The API returns whole weeks ending today; the grid is 26 columns of 7,
       so take the most recent 182 days. */
    if (el) {
      const days = data.contributions.slice(-26 * 7);
      el.innerHTML = days
        .map((lvl) => `<i class="${lvl ? "l" + lvl : ""}"></i>`)
        .join("");
    }

    /* One live figure, written everywhere it is printed, so the cover tile and
       the profile field cannot drift apart or from the grid above them. */
    if (typeof data.total === "number") {
      document
        .querySelectorAll<HTMLElement>("[data-commits]")
        .forEach((n) => (n.textContent = data.total.toLocaleString()));
    }

    /* The panel's commit sparkline comes from this same response rather than a
       second request, so the readout and the line beside it cannot describe
       different windows. Daily levels are summed into 26 fortnightly buckets —
       366 daily points in a 200-unit-wide sparkline is noise, not a series. */
    const spark = document.querySelector<HTMLElement>("[data-commit-spark]");
    if (spark) {
      const raw = data.contributions.slice(-364);
      const B = 26, per = Math.ceil(raw.length / B);
      const buckets = Array.from({ length: B }, (_, i) =>
        raw.slice(i * per, (i + 1) * per).reduce((a, b) => a + b, 0));
      const max = Math.max(...buckets, 1), W = 200, H = 26, bw = W / B;
      spark.innerHTML =
        `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" ` +
        `aria-label="Commit activity over 52 weeks in fortnightly buckets">` +
        buckets.map((v, i) => {
          const h = Math.max(0.8, (v / max) * (H - 2));
          return `<rect x="${(i * bw + bw * 0.16).toFixed(1)}" y="${(H - h - 1).toFixed(1)}" ` +
                 `width="${(bw * 0.68).toFixed(1)}" height="${h.toFixed(1)}" ` +
                 `fill="currentColor" opacity="${v ? 0.85 : 0.18}"/>`;
        }).join("") + `</svg>`;
    }
  } catch {
    flag.dataset.error = "1";
    if (el) {
      el.innerHTML = "";
      const note = el.parentElement?.querySelector(".cap span");
      if (note) note.textContent = "GitHub API unavailable — no fallback drawn";
    }
    if (spark) spark.innerHTML = "";
  }
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
         anchored away from the centre, nudged clear of the vertex. */
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
function drawMap(): void {
  const svg = document.getElementById("chart");
  if (!svg) return;
  /* This one plate is fixed polarity: it is printed as a reversed-out chart
     (light marks on the ink ground) in both themes, so it reads its colours
     from the pair that does not invert. */
  const t = tokens();
  const mark = "#dcd9d0";
  const W = 1360,
    H = 440,
    LON0 = -142,
    LON1 = 32,
    LAT0 = 50,
    LAT1 = 27;
  const X = (l: number) => ((l - LON0) / (LON1 - LON0)) * W;
  const Y = (a: number) => ((LAT0 - a) / (LAT0 - LAT1)) * H;
  const HOME = { lat: 40.57, lng: -111.86 };
  const T = [
    { p: "San Francisco", lat: 37.7846, lng: -122.4006, n: 3, d: "2026·06·15", dx: 12, dy: -8, a: "start" },
    { p: "Las Vegas", lat: 36.1698, lng: -115.1675, n: 3, d: "2026·07·03", dx: 8, dy: 30, a: "start" },
    { p: "Rome", lat: 41.8881, lng: 12.4792, n: 2, d: "2026·05·23", dx: -14, dy: -6, a: "end" },
    { p: "Sicily", lat: 37.9841, lng: 13.6956, n: 10, d: "2026·05·26", dx: -14, dy: 22, a: "end" },
  ];
  let g = "";
  for (let l = LON0; l <= LON1; l += 20) {
    const x = X(l).toFixed(1);
    g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${mark}1f" stroke-width="1"/>`;
    g += `<text x="${x}" y="${H - 8}" text-anchor="middle" font-family="var(--cred)" font-size="10.5" letter-spacing="1" fill="${mark}8c">${Math.abs(l)}°${l < 0 ? "W" : l > 0 ? "E" : ""}</text>`;
  }
  for (let a = LAT0; a >= LAT1; a -= 10) {
    const y = Y(a).toFixed(1);
    g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${mark}1f" stroke-width="1"/>`;
    g += `<text x="9" y="${(+y - 5).toFixed(1)}" font-family="var(--cred)" font-size="10.5" letter-spacing="1" fill="${mark}8c">${a}°N</text>`;
  }
  const hx = X(HOME.lng),
    hy = Y(HOME.lat);
  T.forEach((d) => {
    const dx = X(d.lng),
      dy = Y(d.lat),
      mx = (hx + dx) / 2,
      my = (hy + dy) / 2 - Math.abs(dx - hx) * 0.16;
    g += `<path d="M${hx.toFixed(1)},${hy.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${dx.toFixed(1)},${dy.toFixed(1)}" fill="none" stroke="${t.red}" stroke-width="1.6" stroke-dasharray="7 4"/>`;
  });
  T.forEach((d) => {
    const x = X(d.lng),
      y = Y(d.lat),
      lx = x + d.dx,
      ly = y + d.dy;
    g += `<rect x="${(x - 4).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="8" height="8" fill="${t.red}"/>`;
    g += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${d.a}" font-family="var(--disp)" font-weight="800" font-size="21" fill="${mark}" letter-spacing="-.2">${d.p.toUpperCase()}</text>`;
    g += `<text x="${lx.toFixed(1)}" y="${(ly + 14).toFixed(1)}" text-anchor="${d.a}" font-family="var(--cred)" font-size="11" letter-spacing="1.1" fill="${mark}8c">${d.d} · ${d.n} NIGHTS</text>`;
  });
  g += `<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="7" fill="${mark}"/>`;
  g += `<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="14" fill="none" stroke="${mark}" stroke-width="1.4"/>`;
  g += `<text x="${(hx + 20).toFixed(1)}" y="${(hy - 20).toFixed(1)}" font-family="var(--cred)" font-size="10" letter-spacing="1.4" fill="${mark}">SANDY, UT · 4,505 FT · ORIGIN</text>`;
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
  /* Placeholder sources until the real album lands. Deterministic crops so a
     rebuild does not reshuffle the wall. */
  const src = [
    "/images/switzerland-dock.jpg",
    "/images/summit-selfie.jpg",
    "/images/dimple-dell-3d.jpg",
  ];
  let s = 77;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  let h = "";
  for (let i = 0; i < 20; i++) {
    const f = src[i % 3];
    const x = (0.28 + rnd() * 0.44).toFixed(2);
    const y = (0.26 + rnd() * 0.46).toFixed(2);
    const z = (0.34 + rnd() * 0.34).toFixed(2);
    h +=
      `<button class="plate" type="button" data-full="${f}" data-t="Family album · frame ${String(i + 1).padStart(2, "0")}" ` +
      `data-d="Not indexed" aria-label="Show frame ${i + 1} in colour">` +
      `<canvas data-src="${f}" data-pitch="2.2" data-angle="45" data-gamma="1.02" data-ar="1" ` +
      `data-ink="#141414" data-paper="#dcd9d0" data-crush="1" data-crop="${x},${y},${z}"></canvas></button>`;
  }
  g.innerHTML = h;
}

/* ── boot ─────────────────────────────────────────────────────────────
   Called on mount and after every client navigation. Everything it calls is
   safe to call twice: each init either no-ops when its element is absent or
   guards against double-wiring. */
export function boot(): void {
  void drawHeat();
  drawRadar();
  drawBooks();
  drawMap();
  drawGallery();
  initDepartments();
  initLightbox(); /* after drawGallery, so the 20 new plates get wired */
  fitMast();
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

export { halftone };
