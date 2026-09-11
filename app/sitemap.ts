import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

/**
 * The site's public URLs.
 *
 * /family is deliberately absent. It sets `robots: { index: false }` in its
 * own metadata, and listing a page in the sitemap while asking robots not to
 * index it is a contradiction a crawler resolves however it likes. The one
 * place that decides whether a URL is public is the page itself; this file
 * only reports the ones that are.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.oyarzun.com";
  const posts = getAllPosts().filter((p) => !p.draft);
  /* The newest post's date, so the home page's lastModified moves when the
     issue actually changes rather than on every deploy. */
  const newest = posts[0]?.date;

  return [
    { url: base, lastModified: newest ? new Date(newest) : undefined, priority: 1 },
    { url: `${base}/us`, priority: 0.8 },
    ...posts.map((p) => ({
      url: `${base}/written/${p.slug}`,
      lastModified: new Date(p.date),
      priority: 0.7,
    })),
  ];
}
