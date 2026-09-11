import type { Metadata } from "next";
import {
  Big_Shoulders_Display,
  Archivo_Narrow,
  Anonymous_Pro,
} from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Nav from "@/components/thrasher/Nav";
import Colophon from "@/components/thrasher/Colophon";
import Lightbox from "@/components/thrasher/Lightbox";
import Behaviors from "@/components/thrasher/Behaviors";

/**
 * The three faces of Issue 04. All three are SIL Open Font License — free for
 * commercial use, free to self-host, no attribution required in the UI — so
 * there is nothing to license here. next/font downloads them at build time and
 * serves them from our own origin, which the OFL explicitly permits and which
 * also means no request ever leaves for fonts.googleapis.com at runtime.
 *
 * Weights are pinned to exactly what the design system uses. Every extra
 * weight is a font file a visitor downloads for nothing.
 */
const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const cred = Anonymous_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-cred",
  display: "swap",
});

export const metadata: Metadata = {
  /* Without this, Next resolves a relative share image against whatever host
     it is running on — in production that is the per-deployment Vercel URL, so
     a shared post's picture pointed at a build rather than at the site. Every
     relative URL in metadata is resolved against this. */
  metadataBase: new URL("https://www.oyarzun.com"),
  title: "Oyarzun · Issue 04",
  description:
    "Tommy Oyarzun and Julia Velicev — analytics and data engineering in Sandy, Utah.",
  /* Shared links had no picture and no site name — a bare URL in a message.
     The cover photograph is the share image because it is the cover; if that
     plate changes, this should change with it.

     Deliberately NOT set on /family: that page is unlisted, and an OG image is
     a copy of the picture served to anyone who gets hold of the link, cached
     by whoever renders the preview. The album should not travel that way. */
  openGraph: {
    type: "website",
    siteName: "Oyarzun",
    title: "Oyarzun · Issue 04",
    description:
      "Tommy Oyarzun and Julia Velicev — analytics and data engineering in Sandy, Utah.",
    url: "/",
    images: [{ url: "/images/costa_rica.jpg", width: 2000, height: 1500 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${cred.variable}`}
    >
      {/**
       * No Tailwind color classes on <body>. The design system in
       * globals.css owns paper, ink and the newsprint tooth, and it has to,
       * because those three invert together under Negative.
       */}
      <body>
        <Providers>
          <a className="skip" href="#main">
            Skip to content
          </a>
          <Nav />
          {/* Pages own their running head, their <main> and their folio,
              because all three read differently per department. */}
          {children}
          <Colophon />
          <Lightbox />
          <Behaviors />
        </Providers>
      </body>
    </html>
  );
}
