# Agent context — oyarzun.com

Personal site for Tommy and Julia Oyarzun. Next.js 14 App Router, TypeScript,
MDX, deployed to Vercel at `www.oyarzun.com`. No CSS framework, no component
library, no state manager.

[CONTENT.md](CONTENT.md) is the human-facing guide — it tells Tommy how to edit
the site from GitHub's web editor without a terminal. **If you change where a
word or a number lives, CONTENT.md is part of the change.** It is not reference
documentation that drifts; it is the only reason the site is editable without
you.

## The one rule that matters

**Every file you can see is a file that runs.** A previous cleanup deleted 39
unreachable components, two dead JSON files and seven dead blocks in
`lib/data.ts` — all of which looked editable and silently were not. Don't
reintroduce that. If something stops being imported, delete it in the same
commit.

## Where things live

| File | Holds |
|---|---|
| `lib/copy.ts` | Every headline, standfirst, caption, label — **the words** |
| `lib/data.ts` | Names, careers, trips, books, skills, awards — **the facts** |
| `content/posts/*.mdx` | Blog posts, frontmatter + Markdown |
| `public/images/` | Photographs |
| `lib/thrasher/` | The rendering engine (below) |
| `components/thrasher/departments/` | One component per section of the page |

The copy/facts split is deliberate: a fact changes when the world changes, a
word changes when Tommy changes his mind. Never hard-code a figure into
`copy.ts` — derive it from `data.ts` through a token, or `check:figures` will
catch it. Roughly 50 small labels live in components rather than `copy.ts`;
CONTENT.md says which.

## The rendering engine (`lib/thrasher/`)

- **`halftone.ts`** — turns a photograph into printed dots. Samples luminance
  with `getImageData()`, so **the source must be same-origin or the canvas
  taints and the plate goes blank**. `gamma` controls ink coverage, so raising
  it *lightens*. Dots are drawn opaque into a reused scratch layer and
  composited once at `alpha`, in batches of 4,000 — batching at `alpha < 1`
  double-composites overlapping dots, and a single path of 126k arcs silently
  drops the plate.
- **`behaviors.ts`** — the generated SVG figures: route map, radar charts,
  sparklines, the masthead fitter.
- Plate crops are `cx,cy,cz`; smaller `cz` is more zoomed in, and the frame's
  aspect versus the source's decides which of `cx`/`cy` is actually live.
- Plates repaint on theme change via a `MutationObserver` on the `<html>` class
  attribute — **not** a `useEffect` on `resolvedTheme`. Child effects run before
  parent effects, so next-themes hasn't written the class yet and the plate
  paints one toggle behind.
- Negative images pair with **dark** mode. Light is the default.

## Theme and color

Grounds come from `var(--ink)` and invert with the theme; type must come from
the `--paper88/70/25/20` ramp or `--cap-rev`, never a literal hex. Alpha
compositing is not symmetric across inversion — 55% paper on ink is 4.69:1,
the mirror is 3.68:1 — so reversed-out surfaces need the solid `--cap-rev`
token, not a transparency that happens to pass in one direction.

## Before you commit

```bash
npx tsc --noEmit
npm run check:figures      # every figure traces to data.ts; stale literals stay gone
npm run build
```

`check:figures` takes an optional URL argv so it can run against production.
When copy changes, **re-point its assertions rather than deleting them** —
a deleted assertion loses coverage with no signal.

Sweep the page at 360 / 390 / 768 / 1440 for overflow before shipping anything
visual. Mobile is where this design breaks: CSS, not JS, drives plate height
(`clientHeight`), and `repeat(var(--x), …)` is invalid CSS — the declaration is
dropped silently and the grid collapses.

## Deploying

```bash
git push origin main
node scripts/await-deploy.mjs --expect "<a string the new page serves>" --path /
```

Vercel's `meta.githubCommitSha` is the only reliable commit↔deployment link.
`vercel inspect` writes to **stderr** and prints an identical alias list for
every deployment — it cannot tell you which one is live. `vercel alias ls` can,
but lags 10+ minutes. React inserts `<!-- -->` between adjacent text nodes, so
`--expect` strings are matched after comments, tags and whitespace are stripped.

## House rules

- American English everywhere, including image descriptions. Don't "correct"
  third-party package names or existing identifiers.
- End commit messages with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- Ski/snowboard are synonymous in the code; only the prose distinguishes them.
- Reproduce visual bugs at a real viewport before theorizing. Perturb the data,
  confirm the change propagates, revert. Reading the code is not evidence.
