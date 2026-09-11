import Link from "next/link";
import { departments, footer, issue, runningOrder } from "@/lib/copy";
import { profiles } from "@/lib/data";
import { fill } from "@/lib/thrasher/fill";

/**
 * The foot of every page: a contents list, where to find us, and the
 * family's other sites.
 *
 * This replaced a single long paragraph describing how the halftone engine
 * worked. It read as filler, and a footer's job is to get you somewhere —
 * which the paragraph did not do at all.
 *
 * The contents column is built from `runningOrder` in lib/copy.ts, the same
 * list the nav at the top reads, with the folio numbers coming from
 * `departments`. A footer and a nav that keep their own copies of the site
 * structure are two things that drift.
 *
 * Social links are composed from the handles in lib/data.ts rather than
 * written out, so changing a handle changes both the profile and the footer.
 */

/** Letterboxd has no Lucide icon; this is its mark, drawn. */
function Letterboxd() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {/* The real mark's three dots overlap and are told apart by colour.
          In one ink they merge into a blob, so they are spaced instead. */}
      <circle cx="4.6" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="19.4" cy="12" r="3.5" />
    </svg>
  );
}

function Github() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.8c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.08 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.42-2.33-.26-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.09-2.83-.11-.27-.47-1.34.1-2.8 0 0 .88-.28 2.9 1.08a10 10 0 0 1 5.28 0c2.01-1.36 2.9-1.08 2.9-1.08.57 1.46.21 2.53.1 2.8.68.74 1.09 1.68 1.09 2.83 0 4.04-2.46 4.93-4.8 5.19.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}

function Linkedin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.5c0-1.3-.03-3-1.85-3-1.85 0-2.13 1.44-2.13 2.9V21h-4V9Z" />
    </svg>
  );
}

export default function Colophon() {
  const { him, her } = profiles;

  /* Handle as well as icon. Two LinkedIn profiles share one mark, so icons
     alone give the reader no way to tell Tommy's from Julia's — and the
     handles are already facts in lib/data.ts, so printing them costs
     nothing and cannot drift. */
  const social = [
    him.github && {
      label: "Github",
      handle: him.github,
      href: `https://github.com/${him.github}`,
      icon: <Github />,
    },
    him.linkedin && {
      label: "LinkedIn",
      handle: him.linkedin,
      href: `https://linkedin.com/in/${him.linkedin}`,
      icon: <Linkedin />,
    },
    her.linkedin && {
      label: "LinkedIn",
      handle: her.linkedin,
      href: `https://linkedin.com/in/${her.linkedin}`,
      icon: <Linkedin />,
    },
    him.letterboxd && {
      label: "Letterboxd",
      handle: him.letterboxd,
      href: `https://letterboxd.com/${him.letterboxd}`,
      icon: <Letterboxd />,
    },
  ].filter(Boolean) as {
    label: string;
    handle: string;
    href: string;
    icon: React.ReactNode;
  }[];

  return (
    <footer className="colo">
      <div className="colgrid">
        <div className="cbrand">
          <div className="lg">Oyarzun</div>
          <p>{footer.blurb}</p>
          <div className="mono">
            {footer.place} · {issue.elevation}
          </div>
        </div>

        <nav className="ccol" aria-label="Contents">
          <h4>Contents</h4>
          <ul>
            {runningOrder.map((e) => {
              const d = departments[e.key];
              return (
                <li key={e.key}>
                  {e.kind === "go" ? (
                    <Link href={e.href}>
                      <b>{d.folio}</b>
                      {d.name}
                    </Link>
                  ) : (
                    <a href={`/${e.href}`}>
                      <b>{d.folio}</b>
                      {d.name}
                    </a>
                  )}
                </li>
              );
            })}
            <li>
              <Link href="/family">
                <b>07</b>Family
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ccol">
          <h4>Connect</h4>
          <ul className="cicons">
            {social.map((s) => (
              <li key={`${s.label}-${s.handle}`}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label}: ${s.handle}`}
                >
                  <i>{s.icon}</i>
                  {s.handle}
                  <span className="ext" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="ccol">
          <h4>Family</h4>
          <ul>
            {footer.family.map((f) => (
              <li key={f.href}>
                <a href={f.href} target="_blank" rel="noopener noreferrer">
                  {f.label}
                  <span className="ext" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="cbar">
        <span>
          © {issue.year} Oyarzun.com · {footer.rights}
        </span>
        <span>{fill("Issue {issueNumber} · {dateline}")}</span>
      </div>
    </footer>
  );
}
