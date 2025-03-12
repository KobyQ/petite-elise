"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCode, FaBars, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/misc";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/code-ninjas-club">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Image
                src="/images/coding-ninjas-logo.png"
                alt="Coding Ninjas Club"
                height={150}
                width={150}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/building-blocks-club"
              className="text-gray-300 hover:text-lime-500 transition-colors font-medium"
            >
              Building Blocks
            </Link>
            <Link
              href="/code-ninjas-club"
              className="text-gray-300 hover:text-lime-500 transition-colors font-medium"
            >
              Coding Club
            </Link>
           <Link href="/code-ninjas-club/register">
           <Button  className="ml-4 bg-coding hover:bg-lime-600 text-black font-bold">Enroll Now</Button>
           </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300  hover:text-lime-500 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-gray-950 border-b border-gray-800 absolute w-full transition-all duration-300 ease-in-out",
          isMenuOpen
            ? "max-h-60 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <Link
            href="/building-blocks-club"
            className="block text-gray-300 hover:text-lime-500 transition-colors font-medium py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Building Blocs
          </Link>
          <Link
            href="/coding-club"
            className="block text-gray-300 hover:text-lime-500 transition-colors font-medium py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Coding Club
          </Link>
          <Link href="/code-ninjas-club/register" >
          <Button className="w-full bg-coding hover:bg-lime-600 text-black font-bold">Enroll Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
