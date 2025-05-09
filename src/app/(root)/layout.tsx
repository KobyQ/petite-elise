import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Theme } from "@radix-ui/themes";

import "../globals.css";
import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";
import MainProvider from "../mainProvider";

const quickSand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quick-sand",
});


export const metadata: Metadata = {
  title: {
    default: "Petite Elise Preschool",
    template: "%s | Petite Elise Preschool",
  },
  description:
    "Nurturing young minds to become curious, resilient, and independent thinkers in a safe, loving environment",
  keywords: [
    "preschool Accra",
    "daycare Ghana",
    "early childhood education",
    "Petite Elise",
    "Montessori Accra",
    "baby care",
    "after school program",
    "nursery school Accra",
  ],
  metadataBase: new URL("https://www.petiteelise.com"),
  openGraph: {
    title: "Petite Elise Preschool",
    description:
      "Petite Elise Preschool, a Talkative Mom initiative, provides nurturing care and early learning for children aged 3 months to 5 years in Accra, Ghana.",
    url: "https://www.petiteelise.com",
    siteName: "Petite Elise Preschool",
    type: "website",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Petite Elise Preschool logo",
      },
    ],
  },
  icons: {
    icon: "/icons/logo.petite-elise.ico",
    shortcut: "/favicon.ico",
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
          <MainProvider>
            {/* Sticky Navbar */}
            <NavBar />

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
          </MainProvider>
        </Theme>
      </body>
    </html>
  );
}
