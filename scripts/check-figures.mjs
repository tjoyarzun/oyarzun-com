/**
 * Assert that every figure printed on the site comes from its single source.
 *
 * Run against a built server:
 *
 *   npm run build && npx next start -p 3100 &
 *   node scripts/check-figures.mjs               # or pass a base URL
 *
 * Why this exists. The site prints about twenty figures, several of them
 * spelled out inside sentences, and the failure mode is silent: a number goes
 * stale and the page still reads perfectly. That is not hypothetical — the
 * commit count shipped as 1,203 against a real 151, `goals` claimed 0
 * adventures against four logged, and "19 years between us" was wrong against
 * two profiles saying twelve and ten. None of it broke a build or a test.
 *
 * So this computes each figure from its source and then asserts the rendered
 * HTML contains it. It also asserts the specific stale strings that were
 * there before are gone, so a regression to any of them fails loudly.
 */
import { execFileSync } from "node:child_process";

const BASE = process.argv[2] ?? "http://localhost:3100";

/* The figures, computed by the app's own modules — not restated here, which
   would just move the duplication into the test. */
const truth = JSON.parse(
  execFileSync(
    "npx",
    [
      "tsx",
      "-e",
      `import { figures, GOALS, draftCount, yearsTotal, overlap, GALLERY_FRAMES, postsGoal, SKILL_AXES, skiDays } from "./lib/thrasher/issue";
       import { skiResorts } from "./lib/data";
       const top = [...skiResorts].sort((a,b)=>b.days-a.days)[0];
       process.stdout.write(JSON.stringify({
         nights: figures.nightsAway, countries: figures.countriesVisited,
         adventures: figures.adventuresLogged, skiDays, resorts: figures.skiResortCount,
         books: figures.booksReadThisYear, posts: figures.postsPublished,
         drafts: draftCount, postsGoal, yearsTotal, axes: SKILL_AXES.length,
         frames: GALLERY_FRAMES, topResort: top.name, topResortDays: top.days,
         overlapFrom: overlap?.from, overlapTo: overlap?.to,
         overlapYears: overlap?.shared, herTenureTo: overlap?.herTo,
         herTenureYears: overlap?.herYears,
         goals: GOALS.map(g => [g.label, g.current, g.goal]),
       }));`,
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  ),
);

/** The live commit total, from the one place that talks to GitHub. */
let commits = null;
try {
  const r = await fetch(`${BASE}/api/github-activity?username=tjoyarzun`);
  if (r.ok) commits = (await r.json()).total;
} catch {
  /* leave null — reported below rather than failing the run */
}

async function page(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  let h = await res.text();
  h = h.replace(/<script[\s\S]*?<\/script>/g, " ");
  h = h.replace(/<style[\s\S]*?<\/style>/g, " ");
  /* React separates adjacent text nodes with an empty HTML comment, so
     {current}/{goal} arrives as `37<!-- -->/<!-- -->40`. Drop the comments
     BEFORE the tags, or the number comes out as "37 / 40" and every gauge
     check fails against a page that is perfectly correct. */
  h = h.replace(/<!--[\s\S]*?-->/g, "");
  h = h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  /* And tidy the spacing a slash picks up from a <br> or a tag boundary. */
  return h.replace(/\s*\/\s*/g, "/");
}

const home = await page("/");
const us = await page("/us");
const family = await page("/family");

let failures = 0;
const check = (label, haystack, needle) => {
  const ok = haystack.includes(needle);
  if (!ok) failures++;
  console.log(`${ok ? "  ok  " : "  FAIL"} ${label}: ${JSON.stringify(needle)}`);
};

/* ── Derivation unit checks ─────────────────────────────────────────────
   Run the trip derivations against synthetic entries, so the rules hold for
   data that does not exist yet. The page checks below can only see today's
   array; these see the behavior.

   The year rule is here because it was broken and shipped: trips were counted
   all-time while the labels said 2026, so a 2025 trip with nine nights showed
   "Nights away, 2026 — 27". ── */
console.log("derivation rules:");
const unit = JSON.parse(
  execFileSync(
    "npx",
    [
      "tsx",
      "-e",
      `import { tripStats, tripYear, tripMonth, parseTripDate, countriesIn, CURRENT_YEAR } from "./lib/data";
       const mk = (o) => ({ id: 1, name: "x", location: "A, B", lat: 0, lng: 0,
         type: "sightseeing", who: "Just Us", nights: 1, emoji: "x",
         description: "", imageUrl: "", ...o });
       const y = CURRENT_YEAR;
       process.stdout.write(JSON.stringify({
         year: y,
         /* The count and the printed list must come from one helper. They
            did not: the count uppercased before de-duping and both list
            sites only trimmed, so one entry written "usa" produced
            "2 countries" beside a three-name list. Asserting the count
            alone is exactly what missed it, so this asserts BOTH. */
         casingCount: tripStats([
           mk({ date: y + "-01-02", country: "Italy" }),
           mk({ date: y + "-01-03", country: " usa " }),
           mk({ date: y + "-01-04", country: "USA" }),
         ]).countriesVisited,
         casingList: countriesIn([
           mk({ date: y + "-01-02", country: "Italy" }),
           mk({ date: y + "-01-03", country: " usa " }),
           mk({ date: y + "-01-04", country: "USA" }),
         ]),
         /* An empty country slips past the nullish fallback: ?? only
            catches null and undefined, never "" — so a blank became its own
            country. NOTE: no backticks in here, the whole block is a JS
            template literal and one would end it early. */
         blankCountry: countriesIn([
           mk({ date: y + "-01-02", country: "" }),
           mk({ date: y + "-01-03", country: "   " }),
           mk({ date: y + "-01-04" }),
         ]),
         /* A malformed date is surfaced, not half-counted: it used to pass
            the year filter by slicing and then match no month bucket. */
         /* Reported as a string: JSON.stringify turns NaN into null, so
            asserting Number.isNaN on the far side always fails. */
         unpaddedMonth: String(tripMonth(mk({ date: y + "-3-14" }))),
         paddedMonth: tripMonth(mk({ date: y + "-03-14" })),
         badDate: parseTripDate(y + "-13-01"),
         /* the year a trip belongs to comes from the string, not a Date, so a
            1 January trip cannot slide into the previous year west of UTC */
         jan1: tripYear(mk({ date: y + "-01-01" })),
         dec31: tripYear(mk({ date: y + "-12-31" })),
         /* countries normalize: three spellings of one country count once */
         countryCasing: tripStats([
           mk({ date: y + "-01-02", country: "Italy" }),
           mk({ date: y + "-01-03", country: " italy " }),
           mk({ date: y + "-01-04", country: "ITALY" }),
         ]).countriesVisited,
         /* a missing country falls back to one value, not to undefined */
         countryMissing: tripStats([
           mk({ date: y + "-01-02" }),
           mk({ date: y + "-01-03" }),
         ]).countriesVisited,
         /* nights sum, and a zero-night trip still counts as a trip */
         zeroNights: tripStats([mk({ date: y + "-01-02", nights: 0 })]),
         /* empty list does not throw and reports zeroes */
         empty: tripStats([]),
       }));`,
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  ),
);
const unitCheck = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(
    `${ok ? "  ok  " : "  FAIL"} ${label}: ${JSON.stringify(actual)}` +
      (ok ? "" : ` expected ${JSON.stringify(expected)}`),
  );
};
unitCheck("1 Jan belongs to its own year", unit.jan1, unit.year);
unitCheck("31 Dec belongs to its own year", unit.dec31, unit.year);
unitCheck("two spellings of one country count once", unit.casingCount, 2);
unitCheck("and the printed LIST agrees with that count", unit.casingList.length, unit.casingCount);
unitCheck("the list displays the first spelling seen", unit.casingList, ["Italy", "usa"]);
unitCheck("blank and missing countries collapse to one", unit.blankCountry, ["USA"]);
unitCheck("an unpadded month is rejected, not mis-bucketed", unit.unpaddedMonth, "NaN");
unitCheck("a padded month parses", unit.paddedMonth, 3);
unitCheck("month 13 is rejected", unit.badDate, null);
unitCheck("three spellings of one country count once", unit.countryCasing, 1);
unitCheck("missing country counts as one", unit.countryMissing, 1);
unitCheck("a zero-night trip still counts as a trip", unit.zeroNights.adventuresLogged, 1);
unitCheck("and contributes no nights", unit.zeroNights.nightsAway, 0);
unitCheck("an empty list is zeroes, not a throw", unit.empty.nightsAway, 0);

/* ── No unresolved tokens anywhere ──────────────────────────────────────
   The copy carries {tokens} and every component that prints copy has to run
   it through fill(). Miss one and the token reaches the reader verbatim.

   That is not theoretical: putting tokens into the masthead kickers leaked
   {YearsHimWord}, {yearsHerWord}, {overlapYearsWord}, {PostsWord} and
   {authorsWord} onto the home page and /us, because <Mast> renders its
   kicker raw. It could not call fill() itself — editorial.tsx is imported by
   a client component and fill() reaches lib/posts.ts, which uses `fs` — so
   filling happens at every call site, which is exactly the kind of thing
   nobody remembers. Hence this check. ── */
console.log("no unresolved tokens:");
for (const [name, html] of [["/", home], ["/us", us], ["/family", family]]) {
  const leaks = [...new Set(html.match(/\{[A-Za-z]\w*\}/g) ?? [])];
  if (leaks.length) failures++;
  console.log(
    `${leaks.length ? "  FAIL" : "  ok  "} ${name}` +
      (leaks.length ? ` leaked ${leaks.join(" ")}` : ""),
  );
}

console.log("\nfigures reach the page:");
check("nights away", home, `${truth.nights} nights`);
check("countries", home, `${truth.countries} countries`);
check("adventures logged", home, `${truth.adventures} adventures`);
check("top resort", home, `${truth.topResort}, mostly`);
check("top resort days", home, `${truth.topResortDays} days there`);
check("published / draft", home, `${truth.posts} published · ${truth.drafts} in draft`);
check("slots open", home, `${truth.postsGoal - truth.posts} slots open`);
check("overlap span", home, `${truth.overlapYears} years, different floors`);
check("overlap company year", home, `–${truth.overlapTo}`);
check("years between us", us, `${truth.yearsTotal} years between us`);
check("shared axes", us, `same ${truth.axes} axes`);
check("her tenure", us, `to ${truth.herTenureTo} — ${truth.herTenureYears} years in all`);
check("album frames", family, `${truth.frames} photographs`);
for (const [label, current, goal] of truth.goals) {
  check(`goal gauge ${label}`, home, `${current}/${goal}`);
}
if (commits === null) {
  console.log("  skip commit figure — GitHub unreachable from this run");
} else {
  check("commit figure", home, String(commits.toLocaleString?.() ?? commits));
}

/* Strings that were on the page before every figure had one source. Any of
   them reappearing means a literal has crept back in. "0 drafts" is
   deliberately not here: it is indistinguishable from the correct output when
   the draft count is genuinely zero. */
console.log("\nstale literals stay gone:");
for (const bad of [
  "1,203",
  "19 years between us",
  "Twenty photographs",
  "same ten axes",
  "five years, different floors",
  "Eighteen days there",
  "target of twenty",
  /* NOT here: "2014 –2019". It is now derived from the career entries, and
     the derived output is character-for-character the same as the literal
     was — so the string cannot tell stale from correct. The positive checks
     above cover it instead: the span and the shared-years count both come
     out of the same computation. */
]) {
  const where = [
    ["/", home],
    ["/us", us],
    ["/family", family],
  ]
    .filter(([, h]) => h.includes(bad))
    .map(([n]) => n);
  if (where.length) failures++;
  console.log(
    `${where.length ? "  FAIL" : "  ok  "} ${JSON.stringify(bad)}` +
      (where.length ? ` still on ${where.join(", ")}` : ""),
  );
}

console.log(
  failures ? `\n${failures} FAILURE(S)` : "\nAll figures trace to their source.",
);
process.exit(failures ? 1 : 0);
