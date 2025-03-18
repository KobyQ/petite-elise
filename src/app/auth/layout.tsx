/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "../globals.css";
import Provider from "../provider";
import FloatingShape from "./components/FloatingShape";

const quickSand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quick-sand",
});

export const metadata: Metadata = {
  title: "Petite Elise Admin Authentication",
  description: "Login to access the admin for Petite Elise Preschool",
};

export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${quickSand.variable}`} suppressHydrationWarning>
      <body className="antialiased font-quickSand">
        <Provider>
          <div className="min-h-screen bg-primary  flex items-center justify-center relative overflow-hidden">
            {/* Floating shapes using project colors */}
            <FloatingShape
              color="bg-secondary" 
              size="w-64 h-64"
              top="-10%"
              left="15%"
              delay={0}
            />
            <FloatingShape
              color="bg-tertiary" 
              size="w-48 h-48"
              top="80%"
              left="85%"
              delay={4}
            />
            <FloatingShape
              color="bg-secondary" 
              size="w-32 h-32"
              top="50%"
              left="-10%"
              delay={2}
            />
            <FloatingShape
              color="bg-blue-300" 
              size="w-40 h-40"
              top="30%"
              left="60%"
              delay={6}
            />
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
