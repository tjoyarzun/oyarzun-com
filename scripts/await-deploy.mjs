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
 *   node scripts/await-deploy.mjs --expect Throughline --path /us
 *   DEPLOY_TIMEOUT=600 node scripts/await-deploy.mjs
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const PROJECT = process.env.VERCEL_PROJECT ?? "oyarzun-com";
const SCOPE = process.env.VERCEL_SCOPE ?? "agora-innovations";
const DOMAIN = process.env.DEPLOY_DOMAIN ?? "www.oyarzun.com";
const TIMEOUT_S = Number(process.env.DEPLOY_TIMEOUT ?? 600);
/* How long to keep confirming AFTER the build is READY. Short, because a
   failure to confirm is not a failure to deploy. */
const CONFIRM_S = Number(process.env.DEPLOY_CONFIRM ?? 120);
const POLL_S = 8;

/* Parsed strictly. An earlier version treated any non-flag argument as the
   commit, so passing an option it did not know about made that option's VALUE
   the SHA — it then hunted for a deployment of "/us" and polled until timeout
   with no hint as to why. Unknown arguments stop the script instead. */
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
const say = (m) => process.stdout.write(`${m}\n`);

const argv = process.argv.slice(2);
const FLAGS = { "--expect": null, "--path": null };
let SHA_ARG = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a in FLAGS) {
    if (argv[i + 1] === undefined || argv[i + 1].startsWith("--")) {
      say(`${a} needs a value`);
      process.exit(2);
    }
    FLAGS[a] = argv[++i];
  } else if (a.startsWith("--")) {
    say(`unknown option ${a} — expected --expect or --path`);
    process.exit(2);
  } else if (SHA_ARG === null) {
    SHA_ARG = a;
  } else {
    say(`unexpected argument ${a}`);
    process.exit(2);
  }
}
const EXPECT = FLAGS["--expect"];
/* The change may not be on the home page — the projects list lives on /us. */
const PATH = FLAGS["--path"] ?? "/";

const report = (d) => {
  say(`  ${d.url}`);
  say(`  ${(d.meta?.githubCommitMessage ?? "").split("\n")[0]}`);
};

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
    (json.deployments ?? []).find((d) =>
      (d.meta?.githubCommitSha ?? "").startsWith(sha),
    ) ?? null
  );
}

/**
 * Best-effort: does the alias listing say this deployment holds the domain?
 *
 * NOT `vercel inspect`. Its "Aliases" block prints the project's configured
 * domains identically for every deployment, current or three weeks dead, so a
 * check against it passes for anything — that is how the first version of this
 * script green-lit a commit from two deploys ago.
 *
 * `vercel alias ls` maps source deployment -> alias, which is the right
 * question, but it LAGS: it kept reporting the previous deployment for well
 * over ten minutes after the domain was demonstrably serving the new build.
 * So this is a confirmation, never a gate — see the note on `--expect`.
 */
const bare = (d) =>
  d
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .trim();

async function aliasHolds(deploymentUrl) {
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

/**
 * Precise: is a string you expect from this change actually on the page?
 *
 * There is no fingerprint that ties the served HTML to a deployment from
 * outside — chunk hashes differ from a local build because Vercel builds on a
 * different Node, the deployment's own URL is behind SSO, and the domain's
 * HTML is edge-cached. But if you know something the change added, asking for
 * it directly answers the question the alias listing only approximates.
 */
async function serves(expect) {
  const res = await fetch(`https://${DOMAIN}${PATH}?cb=${Date.now()}`, {
    headers: { "Cache-Control": "no-cache" },
    redirect: "follow",
  });
  return (await res.text()).includes(expect);
}

const sha = (
  SHA_ARG ?? (await run("git", ["rev-parse", "HEAD"])).stdout.trim()
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
    /* READY means the build of THIS commit succeeded, which is the part that
       can be established for certain. Whether the domain is already serving it
       cannot be, so that is confirmed on a short leash and reported honestly
       either way — never claimed. */
    if (state === "READY") {
      announce("READY — confirming the domain…");
      const until = Date.now() + CONFIRM_S * 1000;
      while (Date.now() < until) {
        if (EXPECT ? await serves(EXPECT) : await aliasHolds(deployment.url)) {
          say(`\nserving https://${DOMAIN}`);
          report(deployment);
          process.exit(0);
        }
        await sleep(POLL_S);
      }
      say(`\nbuilt and promoted — NOT confirmed serving`);
      report(deployment);
      say(
        EXPECT
          ? `  https://${DOMAIN}${PATH} did not contain ${JSON.stringify(EXPECT)} within ${CONFIRM_S}s`
          : `  the alias listing did not catch up within ${CONFIRM_S}s, which it often does not.\n` +
              `  Pass --expect "<something the change adds>" to check the page itself.`,
      );
      process.exit(0);
    }
    announce(state);
  }
  await sleep(POLL_S);
}

say(`\nTIMEOUT after ${TIMEOUT_S}s — last state: ${phase}`);
if (deployment) say(`  https://${deployment.url}`);
process.exit(1);
