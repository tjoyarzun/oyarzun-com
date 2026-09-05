/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /**
     * Every host that appears in a next/image `src`. The optimiser rejects any
     * unlisted host with a 400 "url parameter is not allowed" at request time,
     * which renders as a broken image rather than a build failure — so this
     * list has to be kept in step with the data by hand.
     *
     *   picsum.photos               family photos, feed, albums, gate, adventures
     *   images.unsplash.com         blog cover: ai-and-work-from-a-skeptic
     *   img-v3.deepdreamgenerator   blog cover: my-path-into-data-engineering
     *   lh3.googleusercontent.com   bucket list: Tahiti
     *
     * picsum.photos was the only entry until the <img> tags were converted to
     * next/image; the other three were previously loaded through a plain <img>,
     * which bypasses the optimiser entirely and so needed no allowlist.
     */
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img-v3.deepdreamgenerator.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  /**
   * Security response headers.
   *
   * The site previously sent only `strict-transport-security`, which Vercel
   * adds on its own. Everything below is cheap, has no effect on how the site
   * behaves, and closes gaps that were open by default.
   *
   * Deliberately NOT a full Content-Security-Policy. A complete CSP under
   * Next.js needs either `'unsafe-inline'` for styles or a nonce threaded
   * through the app; the first buys very little, and the second is easy to get
   * subtly wrong in a way that breaks the site. `frame-ancestors` is the one
   * directive that stands alone safely — it governs framing only and says
   * nothing about scripts or styles, so it cannot break a render.
   *
   * Revisit a full CSP if the site ever gains auth, forms, or third-party
   * blog authors. MDX executes JSX in a post body, so it is only safe today
   * because every .mdx file is written by the repo owner.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          /**
           * Who may embed this site in a frame. Blocks clickjacking, where a
           * third party overlays the real site inside their own page.
           *
           * Both headers are sent on purpose: frame-ancestors supersedes
           * X-Frame-Options in modern browsers, and X-Frame-Options remains
           * the fallback for anything that doesn't read CSP.
           *
           * This restricts who can frame US. It does not restrict what WE
           * frame — the click-to-load Vimeo player is unaffected, and so is
           * any future embed.
           */
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },

          /**
           * Stop the browser guessing a response's type from its bytes. Without
           * it a file served with the wrong Content-Type can be re-interpreted
           * as script.
           */
          { key: "X-Content-Type-Options", value: "nosniff" },

          /**
           * Send the full URL as referrer within the site, only the origin when
           * leaving it, and nothing at all when downgrading to HTTP. Keeps
           * paths off third-party servers without breaking analytics.
           */
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
