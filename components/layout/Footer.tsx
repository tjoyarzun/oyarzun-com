import Link from "next/link";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import { siLetterboxd } from "simple-icons";

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Profiles", href: "/profiles" },
  { label: "Travels", href: "/travels" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Blog", href: "/blog" },
  { label: "Now", href: "/now" },
  { label: "Family Hub", href: "/family" },
];

function LetterboxdIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={siLetterboxd.path} />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1C1917" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-3">
            <div>
              <span className="font-display text-2xl font-bold text-white">
                Oyarzun
                <span className="text-teal">.com</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Built with <span className="text-orange">❤️</span> and data in
              Utah
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Personal site for Tommy Oyarzun and Julia Velicev. Data,
              mountains, and family life in the Wasatch.
            </p>
          </div>

          {/* Col 2: Site links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Site
            </h3>
            <ul className="flex flex-col gap-2">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-teal text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Social */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/tjoyarzun"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com/in/tom-oyarzun"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://letterboxd.com/toyarzun"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Letterboxd"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LetterboxdIcon size={18} />
              </a>
            </div>
          </div>

          {/* Col 4: Family sites */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Family
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://tomas.oyarzun.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-teal text-sm transition-colors flex items-center gap-1.5"
                >
                  Tomas Oyarzun
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.thehousekeeper.biz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-teal text-sm transition-colors flex items-center gap-1.5"
                >
                  The Housekeeper
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Oyarzun.com &middot; All rights
            reserved
          </p>
          <span
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: "#C8973E", color: "#fff" }}
          >
            Made in Utah
          </span>
        </div>
      </div>
    </footer>
  );
}
