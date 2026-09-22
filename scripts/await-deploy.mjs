#!/usr/bin/env node
/**
 * Wait until the commit you just pushed is actually serving on the domain.
 *
 * Replaces this, which was typed by hand after every push and was wrong:
 *
 *   until vercel ls --prod | head -1 | xargs vercel inspect | grep -q Ready;
 *     do sleep 8; done
 *
 * Two distinct bugs, both of which produced a confident "deployed" against a
 * page that was still the old one:
 *
 *   1. It asked "is the newest deployment Ready?". Straight after a push
 *      Vercel has not created the new deployment yet, so `head -1` returned
 *      the PREVIOUS one — already Ready — and the loop exited immediately,
 *      before the build it was supposed to wait for even existed.
 *
 *   2. Ready is not serving. A deployment reaches Ready before the production
 *      alias moves to it, so checks run in that window read the old build.
 *      That is what made the favicon and the analytics beacon look broken
 *      when both were fine.
 *
 * So this matches the deployment by `meta.githubCommitSha` — the only field
 * that ties a deployment to a commit — waits for READY, and then waits again
 * for the domain to appear in that deployment's alias list. It exits non-zero
 * on build failure or timeout rather than falling through to a green report.
 *
 *   node scripts/await-deploy.mjs                 # waits for HEAD
 *   node scripts/await-deploy.mjs <sha>           # waits for a specific commit
 *   DEPLOY_TIMEOUT=600 node scripts/await-deploy.mjs
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const PROJECT = process.env.VERCEL_PROJECT ?? "oyarzun-com";
const SCOPE = process.env.VERCEL_SCOPE ?? "agora-innovations";
const DOMAIN = process.env.DEPLOY_DOMAIN ?? "www.oyarzun.com";
const TIMEOUT_S = Number(process.env.DEPLOY_TIMEOUT ?? 600);
const POLL_S = 8;

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
const say = (m) => process.stdout.write(`${m}\n`);

/* The two commands this script uses disagree about which stream to write to,
   so they get one helper each rather than a shared one with a flag.

   `vercel ls --json` puts the JSON on stdout and a progress banner on stderr.
   Merging them appends the banner after the closing brace and JSON.parse
   throws on the trailing text.

   `vercel inspect` writes its whole report — including the alias list this
   script depends on — to stderr, leaving stdout empty. Reading stdout there
   makes the alias check unpassable, which is a check that silently never
   succeeds: the same failure shape as the loop this file replaces. */
async function vercelJson(args) {
  const { stdout } = await run("npx", ["vercel", ...args, "--scope", SCOPE], {
    maxBuffer: 32 * 1024 * 1024,
  });
  return JSON.parse(stdout.slice(stdout.indexOf("{")));
}

async function vercelText(args) {
  const { stdout, stderr } = await run(
    "npx",
    ["vercel", ...args, "--scope", SCOPE],
    { maxBuffer: 32 * 1024 * 1024 },
  );
  return stdout + stderr;
}

/** The production deployment built from `sha`, or null if it does not exist yet. */
async function findBySha(sha) {
  const json = await vercelJson(["ls", PROJECT, "--prod", "--json"]);
  return (
    (json.deployments ?? []).find(
      (d) => (d.meta?.githubCommitSha ?? "").startsWith(sha),
    ) ?? null
  );
}

/**
 * Does the production domain currently point at this deployment?
 *
 * NOT `vercel inspect`. Its "Aliases" block lists the project's configured
 * domains and prints the identical list for every deployment, current or
 * three weeks dead — so a check against it passes for any deployment at all.
 * That is how the first version of this script green-lit a commit from two
 * deploys ago, which is the exact bug it exists to prevent.
 *
 * `vercel alias ls` maps source deployment -> alias, which is the question.
 * The apex is what the mapping records, so both sides are compared with any
 * leading "www." removed.
 */
const bare = (d) => d.replace(/^https?:\/\//, "").replace(/^www\./, "").trim();

async function isServing(deploymentUrl) {
  const out = await vercelText(["alias", "ls"]);
  const want = bare(DOMAIN);
  const src = bare(deploymentUrl);
  return out
    .split("\n")
    .filter((line) => line.includes(src))
    .some((line) =>
      line
        .trim()
        .split(/\s+/)
        .some((cell) => bare(cell) === want),
    );
}

const sha = (
  process.argv[2] ??
  (await run("git", ["rev-parse", "HEAD"])).stdout.trim()
).trim();

say(`waiting for ${sha.slice(0, 7)} on ${DOMAIN} (timeout ${TIMEOUT_S}s)`);

const deadline = Date.now() + TIMEOUT_S * 1000;
let phase = "";
let deployment = null;
const announce = (p) => {
  if (p !== phase) say(`  ${p}`);
  phase = p;
};

while (Date.now() < deadline) {
  deployment = await findBySha(sha);

  if (!deployment) {
    announce("no deployment for this commit yet…");
  } else {
    const state = deployment.state ?? deployment.readyState ?? "UNKNOWN";

    if (state === "ERROR" || state === "CANCELED") {
      say(`\nBUILD ${state} — https://${deployment.url}`);
      process.exit(1);
    }
    /* READY is not the finish line: the alias has to move before the domain
       serves this build. Checking a page in that window reads the old one. */
    if (state === "READY") {
      if (await isServing(deployment.url)) {
        say(`\nserving https://${DOMAIN}`);
        say(`  ${deployment.url}`);
        say(`  ${(deployment.meta?.githubCommitMessage ?? "").split("\n")[0]}`);
        process.exit(0);
      }
      announce("READY — waiting for the alias to move…");
    } else {
      announce(state);
    }
  }
  await sleep(POLL_S);
}

say(`\nTIMEOUT after ${TIMEOUT_S}s — last state: ${phase}`);
if (deployment) say(`  https://${deployment.url}`);
process.exit(1);
