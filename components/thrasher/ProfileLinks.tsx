import type { Profile } from "@/lib/data";
import { Document, Github, Linkedin } from "@/components/thrasher/icons";

/**
 * Where to find one of us: GitHub, LinkedIn, and the résumé.
 *
 * These were two rows in the field table reading `Github tjoyarzun` and
 * `Linkedin tom-oyarzun` — a handle is a fact about a person, but it is not
 * a way to get to them, and neither was clickable. The résumé was worse: the
 * PDFs have been in public/documents/ and served at 200 the whole time, with
 * `resume` sitting in lib/data.ts, and nothing anywhere linked to either.
 *
 * URLs are composed from the handles rather than stored, so a handle and its
 * link cannot disagree — the footer does the same, from the same fields.
 *
 * `download` on the résumé asks the browser to save rather than navigate.
 * Browsers honour it for same-origin files, which these are.
 */
export default function ProfileLinks({
  profile,
  className,
}: {
  profile: Profile;
  /** Extra classes for context — `.plinks` is the base. */
  className?: string;
}) {
  const links = [
    profile.github && {
      key: "github",
      href: `https://github.com/${profile.github}`,
      label: "GitHub",
      icon: <Github />,
      title: `${profile.name} on GitHub — @${profile.github}`,
    },
    profile.linkedin && {
      key: "linkedin",
      href: `https://www.linkedin.com/in/${profile.linkedin}`,
      label: "LinkedIn",
      icon: <Linkedin />,
      title: `${profile.name} on LinkedIn — ${profile.linkedin}`,
    },
    profile.resume && {
      key: "resume",
      href: profile.resume,
      label: "Résumé",
      icon: <Document />,
      title: `${profile.name}'s résumé (PDF)`,
      download: true,
    },
  ].filter(Boolean) as {
    key: string;
    href: string;
    label: string;
    icon: React.ReactNode;
    title: string;
    download?: boolean;
  }[];

  if (!links.length) return null;

  return (
    <div className={className ? `plinks ${className}` : "plinks"}>
      {links.map((l) => (
        <a
          key={l.key}
          className="btn gho plink"
          href={l.href}
          title={l.title}
          /* The résumé is ours and same-origin; the other two leave the site. */
          {...(l.download
            ? { download: "" }
            : { target: "_blank", rel: "noopener noreferrer" })}
        >
          <i aria-hidden="true">{l.icon}</i>
          {l.label}
        </a>
      ))}
    </div>
  );
}
