import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Theme } from "@radix-ui/themes";

import "../globals.css";
import Provider from "../provider";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const quickSand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quick-sand",
});

export const metadata: Metadata = {
  title: "Petite Elise Preschool Admin",
  description: "Manage Petite Elise Preschool students and activities",
  icons: {
    icon: "/icons/logo.petite-elise.ico",
  },
  openGraph: {
    images: ["/images/logo.jpg"],
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${quickSand.variable}`}>
      <body className="antialiased flex flex-col min-h-screen font-quick-sand">
        <Theme>
          <Provider>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
              </div>
            </div>
          </Provider>
        </Theme>
      </body>
    </html>
  );
}
