import type { Metadata } from "next";
import { Inter, Audiowide, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackgroundHud from "./components/BackgroundHud";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "purpleLap — Motorsport Media Management",
  description: "Premium media management for motorsport teams, drivers and sponsors.",
  keywords: ["motorsport", "media management", "video editing", "F1", "GT", "WEC", "endurance", "racing"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "purpleLap — Motorsport Media Management",
    description: "Premium media management for motorsport teams, drivers and sponsors.",
    url: "https://purplelap.com",
    siteName: "purpleLap",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "purpleLap — Motorsport Media Management",
    description: "Premium media management for motorsport teams, drivers and sponsors.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${audiowide.variable} ${orbitron.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="bg-[#0c0418] text-white font-sans antialiased">
        <Navbar />
        <BackgroundHud />
        {children}
        <Footer />
      </body>
    </html>
  );
}