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
};

export default nextConfig;
