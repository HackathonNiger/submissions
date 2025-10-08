import type { Metadata } from "next/types";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Providers } from "./providers";
import { Footer } from "@/components/footer";
import NavigationLoader from "@/components/NavigationLoader";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Refreeg | Crowdfunding for Causes, Communities & Change",
  description:
    "Refreeg is a secure crowdfunding platform where you can donate, raise funds, and support meaningful causes. Empower communities, back local initiatives, and make a real impact today.",
  keywords: [
    "Refreeg",
    "crowdfunding platform",
    "donate online",
    "fundraising website",
    "support causes",
    "raise funds",
    "charity crowdfunding",
    "community projects",
    "donation platform",
    "fundraising for change",
    "List a cause",
    "List a cause on Refreeg",
  ],
  generator: "v0.dev",
  other: {
    "google-adsense-account": "ca-pub-6133323682562865",
  },
  openGraph: {
    title: "Refreeg | Crowdfunding for Causes, Communities & Change",
    description:
      "Join Refreeg, the crowdfunding platform that empowers you to support causes you care about. List a cause or donate today.",
    url: "https://refreeg.com",
    siteName: "Refreeg",
    images: [
      {
        url: "https://refreeg.com/logo.svg",
        width: 1200,
        height: 630,
        alt: "Refreeg Crowdfunding Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refreeg | Crowdfunding for Causes, Communities & Change",
    description:
      "Raise funds, donate, and support meaningful causes with Refreeg. Join today and empower communities.",
    images: ["https://refreeg.com/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <NavigationLoader />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* <footer className="border-t py-6">
              <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  &copy; {new Date().getFullYear()} Refreeg. All rights reserved.
                </p>
              </div>
            </footer> */}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
