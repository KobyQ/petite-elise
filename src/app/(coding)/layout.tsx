import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Theme } from "@radix-ui/themes";

import "../globals.css";
import Provider from "../provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const quickSand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quick-sand",
});

export const metadata: Metadata = {
  title: "Code Ninjas Club",
  description:
    "Nurturing young minds to become curious, resilient, and independent thinkers in a safe, loving environment",
  icons: {
    icon: "/icons/logo.petite-elise.ico",
  },
  openGraph: {
    images: ["/images/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${quickSand.variable}`}>
      <body className="antialiased flex flex-col min-h-screen font-quick-sand">
        <Theme>
          <Provider>
            <Navbar />

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
          </Provider>
        </Theme>
      </body>
    </html>
  );
}
