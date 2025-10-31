import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import AppLayout from "./components/AppLayout";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenKudi — Waste-to-Energy & Rewards",
  description:
    "Transforming waste into opportunity with mapping, rewards, and data dashboards.",
  metadataBase: new URL("https://greenkudi.local"),
  openGraph: {
    title: "GreenKudi — Waste-to-Energy & Rewards",
    description:
      "Transforming waste into opportunity with mapping, rewards, and data dashboards.",
    url: "/",
    siteName: "GreenKudi",
    images: [{ url: "/logo.svg", width: 1200, height: 630, alt: "GreenKudi" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenKudi — Waste-to-Energy & Rewards",
    description:
      "Transforming waste into opportunity with mapping, rewards, and data dashboards.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeRegistry>
          <AppLayout>{children}</AppLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
