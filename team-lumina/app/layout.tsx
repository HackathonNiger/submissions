import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Lumina - AI-Powered Learning Content Curation",
  description: "Personalized learning content curation powered by AI. Discover, learn, and grow with Lumina.",
  generator: "Team Lumina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }>
          <ThemeProvider>
            <DataProvider>
              <Header />
              {children}
              <Toaster />
            </DataProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
