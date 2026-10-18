# Handoff — oyarzun.com

The failure modes this build has already hit, and what they cost. Read this at
the start of a session; it is the part that does not decay.

## Orientation

Live at `www.oyarzun.com`, Vercel, auto-deploys from `main`. Next.js 14 App
Router, TypeScript strict, no CSS framework, no component library.

**This file is deliberately not a status report.** A hand-kept summary of
"where we left off" goes stale the next time anyone commits, and a stale one
is worse than none — it reads as current. Four sources are authoritative:

| What | Where |
|---|---|
| What changed and why | `git log` — the commit messages carry the reasoning, not just the what |
| What is still open | Asana project `1218384029247712` |
| How to edit the content | [CONTENT.md](CONTENT.md) |
| How to work in the code | [CLAUDE.md](CLAUDE.md) |

## Standing traps

Live tripwires, as opposed to the history below.

- **`<Analytics />` must stay rendered in `app/layout.tsx`.** It was removed by
  accident once and the Vercel dashboard read zero for weeks before anyone
  noticed. Check it before concluding that traffic is down.
- **Re-point `check:figures` assertions when copy changes; never delete them.**
  A deleted assertion loses its coverage with no signal, which is the same
  class of bug as everything else in this file.
- **A comment asserting why something is safe can itself be the bug.** Two
  fixes here were delayed by confidently-worded comments that were false when
  written or went false later. Verify the claim, not the confidence.

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

The same bug has now surfaced twice, in unrelated parts of the stylesheet,
which makes it this codebase's signature failure: **a ground that inverts with the theme, carrying type
pinned to a literal that does not.** Check both halves whenever either moves.

Type vanished in Negative because grounds came from `var(--ink)` (which
inverts) while the type was a literal `#dcd9d0` (which does not). Then the
first fix still failed contrast one way round, because alpha compositing is not
symmetric across inversion — 55% paper on ink is 4.69:1 and the mirror is
3.68:1. Reversed-out surfaces use the solid `--cap-rev` token.

The cover overlay was the second instance, and the instructive one: its literal
carried a comment explaining that it was correct — "this type sits on a scrim
that is always dark, so it is always light." The premise was false. `.cover` is
`var(--ink)` and inverts, and below 860px the scrim is `display:none` and the
type sits straight on that ground, so Negative gave 1.1:1 on a phone. The scrim
was a ground wearing a literal's clothes; it now reads `--ink95` / `--ink80`
off the existing ramp. **The lightbox is the only fixed-polarity surface left**
— if you find another literal, it is a bug, not an exception.

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

### The route map

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
