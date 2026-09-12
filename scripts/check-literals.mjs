/**
 * Catch hard-coded figures in the copy, at authoring time.
 *
 * scripts/check-figures.mjs compares the rendered page against the sources.
 * That catches DRIFT — a figure that has gone stale — but it provably cannot
 * catch a literal that currently happens to equal the derived value. I proved
 * that on myself: I replaced "{adventures} adventures, {countries} countries,
 * {nights} nights" with the literal "4 adventures, 2 countries, 18 nights",
 * rebuilt, and the figures check reported "All figures trace to their source",
 * because at that moment they did. It would only have failed later, after a
 * fifth trip was logged — which is exactly the silent rot both scripts exist
 * to prevent.
 *
 * So this one works statically and structurally instead: any number in a
 * user-facing string that EQUALS a figure the site derives is a literal
 * waiting to go stale, whether or not it is currently correct.
 *
 *   node scripts/check-literals.mjs
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { globSync } from "node:fs";

const derived = JSON.parse(
  execFileSync(
    "npx",
    [
      "tsx",
      "-e",
      `import { figures, draftCount, yearsHim, yearsHer, yearsTotal, overlap, GALLERY_FRAMES, postsGoal, SKILL_AXES, skiDays } from "./lib/thrasher/issue";
       import { skiResorts } from "./lib/data";
       const top = [...skiResorts].sort((a,b)=>b.days-a.days)[0];
       process.stdout.write(JSON.stringify({
         nights: figures.nightsAway, countries: figures.countriesVisited,
         adventures: figures.adventuresLogged, skiDays, resorts: figures.skiResortCount,
         books: figures.booksReadThisYear, posts: figures.postsPublished,
         drafts: draftCount, postsGoal, yearsHim, yearsHer, yearsTotal,
         axes: SKILL_AXES.length, frames: GALLERY_FRAMES,
         topResortDays: top.days, overlapYears: overlap?.shared,
         herTenureYears: overlap?.herYears,
       }));`,
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  ),
);

/* The token that should have been used, per value. Several figures share a
   value — nights is 18 and so is Snowbird's day count — so a hit lists every
   candidate rather than guessing. */
const byValue = new Map();
for (const [k, v] of Object.entries(derived)) {
  if (typeof v !== "number") continue;
  /* 0 and 1 appear in every style object, every array index and half the
     prose on the site. A figure that currently happens to be 0 or 1 cannot
     be distinguished from those, so it is out of scope here — the runtime
     check in check-figures.mjs still covers it. */
  if (v < 2) continue;
  if (!byValue.has(v)) byValue.set(v, []);
  byValue.get(v).push(k);
}

const WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
};

/* Numbers that legitimately appear as prose and are not site figures. Each
   needs a reason, so the list cannot quietly become a dumping ground. */
const ALLOW = [
  { re: /forty-five degrees/, why: "the halftone screen angle, describing the engine" },
  { re: /one ink/, why: "how the issue is printed, not a count" },
  { re: /eleven thousand feet/, why: "the height of the Little Cottonwood wall" },
  { re: /4,505/, why: "elevation, and it lives in issue.elevation" },
  { re: /\b(19|20)\d\d\b/, why: "a calendar year" },
  { re: /two numbers could disagree/, why: "prose about the method" },
  { re: /Two subjects/, why: "the strapline — two people, a fact of the site" },
  { re: /two of us|two shapes|two people|The two of us/i, why: "there are two of them" },
  { re: /one file|one valley|one issue|one scroll/, why: "prose" },
];

/* Only lib/copy.ts.
   Every user-facing sentence on the site now lives there, and it is plain
   strings, which is what makes a scan like this reliable. Scanning the .tsx
   files as well produced fifty hits, all of them digits inside style objects
   and JSX expressions — a quoted-string regex cannot tell prose from code in
   a component, so it reported nothing useful. If prose ever moves back into
   a component this check goes blind to it, which is one more reason for it
   to stay in the copy file. */
const FILES = ["lib/copy.ts"];

/**
 * Pull the double-quoted string literals out of a source file.
 *
 * Not a regex. `/"([^"\\]{6,})"/g` looks like it works and does not: with the
 * global flag it happily pairs the CLOSING quote of one string with the
 * OPENING quote of the next, so it reports the code between two strings as
 * copy — and, worse, having consumed that span it never offers the real
 * string that followed. Filtering the junk candidates out does not give the
 * swallowed ones back.
 *
 * That is not hypothetical either: it is why the first version of this check
 * reported "No hard-coded figures" against a file where I had just replaced
 * "{adventures} adventures, {countries} countries, {nights} nights" with the
 * literal digits. A scanner that tracks whether it is inside a string cannot
 * make that mistake.
 */
function stringLiterals(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '"') {
      let j = i + 1;
      let val = "";
      while (j < src.length && src[j] !== '"') {
        if (src[j] === "\\") {
          val += src[j + 1] ?? "";
          j += 2;
          continue;
        }
        if (src[j] === "\n") break; /* unterminated — bail rather than guess */
        val += src[j];
        j++;
      }
      if (src[j] === '"') {
        out.push({ value: val, index: i + 1 });
        i = j + 1;
        continue;
      }
    }
    i++;
  }
  return out;
}

let hits = 0;
for (const file of FILES) {
  let src = readFileSync(file, "utf8");
  /* Comments first, or the documentation about the figures trips every rule
     in the file. Replaced with equal-length blanks so reported line numbers
     still match the real file. */
  src = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  src = src.replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));

  for (const { value: text, index } of stringLiterals(src)) {
    if (text.length < 6) continue;
    if (/^[\w./@<>-]+$/.test(text)) continue; /* a path, a class, a slug */
    if (ALLOW.some((a) => a.re.test(text))) continue;

    const found = [];
    const seen = new Set();
    for (const nm of text.matchAll(/\b(\d{1,4})\b/g)) {
      /* Skip a digit that is part of a decimal — the halftone crop values
         are strings like "0.68,0.5,0.5", and the 5 in 0.5 is not a figure. */
      const before = text[nm.index - 1];
      const after = text[nm.index + nm[1].length];
      if (before === "." || after === "." || before === "," && after === ",") continue;
      const v = Number(nm[1]);
      if (byValue.has(v) && !seen.has(nm[1])) {
        seen.add(nm[1]);
        found.push([nm[1], byValue.get(v)]);
      }
    }
    for (const wm of text.matchAll(/\b([a-z]+)\b/gi)) {
      const w = wm[1].toLowerCase();
      const v = WORDS[w];
      if (v !== undefined && byValue.has(v) && !seen.has(w)) {
        seen.add(w);
        found.push([wm[1], byValue.get(v)]);
      }
    }
    if (!found.length) continue;

    const line = src.slice(0, index).split("\n").length;
    hits++;
    console.log(`  FAIL ${file}:${line}`);
    console.log(`       ${text.slice(0, 96)}`);
    for (const [lit, tokens] of found) {
      console.log(
        `       "${lit}" equals ${tokens.map((t) => `{${t}}`).join(" or ")} — use the token`,
      );
    }
  }
}

console.log(
  hits
    ? `\n${hits} hard-coded figure(s). Replace with a {token} from lib/thrasher/fill.tsx.`
    : "\nNo hard-coded figures in user-facing copy.",
);
process.exit(hits ? 1 : 0);
