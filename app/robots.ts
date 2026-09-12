import type { MetadataRoute } from "next";

/**
 * `/family` is disallowed here as well as noindexed on the page itself.
 *
 * The two do different jobs and neither replaces the other: this stops a
 * well-behaved crawler requesting the URL at all, while the page's own
 * `robots: { index: false }` is what keeps it out of an index if something
 * reaches it anyway — through a shared link, say, which this file cannot
 * prevent. Neither is access control; the album is not secret, it is unlisted.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/family" },
    sitemap: "https://www.oyarzun.com/sitemap.xml",
  };
}
