import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ModalProvider } from "@/providers/modal-providers";

import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";
import { cn } from "@/lib/utils";

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
        <body className={cn("dark", inter.className)}>
          <AppProviders>
            <Toaster />
            <ModalProvider />
            {children}
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
