import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { siteConfig } from "@/config/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "VAJCO | Čerstvá vejce z Pálavy",
    template: "%s | VAJCO",
  },
  description: siteConfig.description,
  keywords: [
    "čerstvá vejce",
    "VAJCO",
    "Klentnice",
    "Pálava",
    "Brno",
    "rezervace vajec",
    "vejce z volného chovu",
  ],
  openGraph: {
    title: "VAJCO | Čerstvá vejce z Pálavy",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "VAJCO",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VAJCO | Čerstvá vejce z Pálavy",
    description: siteConfig.description,
  },
  icons: {
    icon: "/logo/vajco-mark.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cream text-ink antialiased">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
