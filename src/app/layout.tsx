import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ModalProvider } from "@/providers/modal-providers";

import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "@/providers/app-providers";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shop Pilot Admin",
  description: "Shop Pilot Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppProviders>
              <Toaster />
              <ModalProvider />
              {children}
            </AppProviders>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
