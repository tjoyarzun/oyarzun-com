# Handoff — oyarzun.com

**As of 11 October 2026.** Where the site stands, what was learned building it,
and what is still open. [CLAUDE.md](CLAUDE.md) holds the working rules;
[CONTENT.md](CONTENT.md) is the guide for editing content without a terminal.
This file is the state.

## State

Live at `www.oyarzun.com`, Vercel, auto-deploys from `main`. Next.js 14 App
Router, TypeScript strict, no CSS framework. Four routes: `/`, `/us`,
`/family`, `/written/[slug]`, plus `/api/github-activity`.

| | |
|---|---|
| Dependencies | 8 runtime, 8 dev. Tailwind was removed; `app/globals.css` carries an explicit written-out reset. |
| Analytics | `@vercel/analytics` — **verify `<Analytics />` is still rendered in `app/layout.tsx`.** It was removed by accident once and the dashboard read zero for weeks before anyone noticed. |
| Posts | 2 published, in `content/posts/`. |
| Guards | `npm run check:figures` asserts every live figure traces to `lib/data.ts` and that stale literals stay deleted. |
| Deploy watcher | `node scripts/await-deploy.mjs --expect "<string>" --path /` |

The open backlog is in Asana, project `1218384029247712`, which is the live
list — this file only summarizes it.

**Next up:** derive the Counted date range (it is the one hand-typed kicker in
`copy.ts`); build the crop-preview tool for picking `cx,cy,cz`; write the third
post.

**Ideas:** drop or wire up the inert trip fields; serve smaller photographs per
breakpoint; seasonal pace for the ski-days gauge; one LinkedIn URL form rather
than two; decide what the family gate is; a post about building this site.

**Ongoing:** log trips, books and films as they happen; refresh the dateline
and the Right-now date when the issue changes; review the analytics once a
month of it exists.

## What was learned

Grouped by the thing that bit, because each of these cost real time.

### Images and canvas

EXIF orientation is a trap. `costa_rica.jpg` carried orientation 3; browsers
obey it, and the halftone engine reads raw pixels, so the plate rendered upside
down while the file previewed correctly everywhere else. Rotation is now baked
into the pixels and the tag stripped. Do the same for any new photograph.

`getImageData()` taints on a cross-origin source and the plate goes blank with
no error. Images must be same-origin.

A single SVG/canvas path of 126,857 arcs silently drops. Two plates vanished as
the window widened — the two with `crush={false}`, which draw the most dots.
Fills are batched at 4,000, drawn opaque into a scratch layer and composited
once, because batching at `alpha < 1` double-composites the overlaps. The
batched output was pixel-diffed against the unbatched: max channel difference
1/255.

### Layout

CSS drives plate height, not JS. The engine used to derive height from
`data-ar` and ignore the stylesheet, which produced 149px of picture under
119px of caption on a phone. It now reads `clientHeight`. Below 860px the
caption moves *under* the plate — the arithmetic does not allow both: type
needs ~45% of the available height and a face needs ~43%.

`repeat(var(--weeks), …)` is invalid CSS. The repeat count is read at parse
time, so the whole declaration is dropped with no warning; the commit grid
auto-sized to 23px columns and pushed the page to 280px wide on a phone. Track
lists that depend on data are set from React. Use `minmax(0, 1fr)`, not a bare
`1fr`, or the min-content floor leaks.

The commit grid was not a calendar for a while — 26 columns filled in reading
order, wrapping every 3.7 weeks. It is now weeks × weekdays with end-padding so
cell 0 is a Sunday.

### Theme

Plates painted one toggle behind. A `useEffect(…, [resolvedTheme])` in a
descendant runs *before* next-themes' own effect writes the class onto
`<html>`, so the plate repainted against the previous theme. Replaced with a
`MutationObserver` on the class attribute.

Type vanished in Negative because grounds came from `var(--ink)` (which
inverts) while the type was a literal `#dcd9d0` (which does not). Then the
first fix still failed contrast one way round, because alpha compositing is not
symmetric across inversion — 55% paper on ink is 4.69:1 and the mirror is
3.68:1. Reversed-out surfaces use the solid `--cap-rev` token.

### Type

Canvas does not apply `text-transform`. The masthead fitter measured the
descender of the `y` in "Oyarzun" and reserved 78px that the uppercase render
never needed. It now measures the string it actually draws. The real bug it was
written for was the ç cedilla in "Andança" cutting through the rule.

`::first-letter` takes exactly one letter and swallows the punctuation in front
of it, so a post opening on a quotation mark gets no drop cap.

React inserts `<!-- -->` between adjacent text nodes, which breaks naive string
matching against the served HTML.

### Deploying

`meta.githubCommitSha` is the only link between a commit and a deployment.
`vercel inspect` writes to **stderr**, and prints an identical alias list for
every deployment — it once green-lit a commit two deploys old. `vercel alias
ls` is authoritative but lags 10+ minutes, so `await-deploy.mjs` treats READY
as the gate and serving-the-string as a 120s best-effort confirmation.
Deployment URLs are SSO-gated; check the apex domain, and `www` is not the
apex.

### The map, most recently

The route plate derives its height from the geographic window. The span is
163° of longitude over 38° of latitude — a 4.3:1 figure — capped at 3.4:1 so it
is not a sliver. A `Math.max(…, 190)` floor then overrode that cap on narrow
screens, so a phone got 350×190: aspect 1.84, a **2.34× vertical stretch**,
which is why Florida looked elongated and Italy was a tall blob. The floor is
gone; both breakpoints now sit at 3.40.

Removing it exposed two latent bugs in the label pass that the padding had been
hiding:

1. The collision walk compared each label only with the *previous* label in a
   y-sorted list. The origin marker was never an obstacle, so "SAN FRANCISCO"
   landed on the Sandy dot. Seeding the walk with the origin only fixed
   `placed[0]`, which is Rome — the origin has to be checked against **every**
   label.
2. Markers and labels were drawn rect-then-text per city, so Las Vegas's square
   painted over San Francisco's name. Split into two passes: all markers, then
   all type.

Both also improved desktop — a pixel diff of the 1440px plate shows the only
change is San Francisco's label dropping ~22px, which cleared Las Vegas's
square off its date line. Box dimensions are unchanged there.

### Method

Everything above was found by rendering at a real viewport and looking, not by
reading. Reading the code produced the wrong root cause at least three times —
the masthead descender, the Tailwind removal, the analytics regression.
Perturb the data, confirm the change propagates, revert.

Two self-inflicted ones worth remembering: `<Analytics />` was removed, and
then the package was removed a commit later on the grounds that nothing
imported it — true only *because* of the first removal. And five debug PNGs
nearly shipped in a release merge; they were caught by reading the diff, and
there is now a `.gitignore` rule.
