import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Profiles", href: "/profiles" },
  { label: "Travels", href: "/travels" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Blog", href: "/blog" },
  { label: "Now", href: "/now" },
  { label: "Family Hub", href: "/family" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/tjoyarzun", icon: Github },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/tom-oyarzun",
    icon: Linkedin,
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1C1917" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
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
