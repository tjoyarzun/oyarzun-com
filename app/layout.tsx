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
import Behaviours from "@/components/thrasher/Behaviours";

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
  title: "Oyarzun · Issue 04",
  description:
    "Tommy Oyarzun and Julia Velicev — analytics and data engineering in Sandy, Utah.",
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
       * No Tailwind colour classes on <body>. The design system in
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
          <Behaviours />
        </Providers>
      </body>
    </html>
  );
}
