import Link from "next/link";
import { departments, footer, issue, runningOrder } from "@/lib/copy";
import { profiles } from "@/lib/data";
import { fill } from "@/lib/thrasher/fill";
import { Github, Letterboxd, Linkedin } from "@/components/thrasher/icons";

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
          <h2>Contents</h2>
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
          <h2>Connect</h2>
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
          <h2>Family</h2>
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
