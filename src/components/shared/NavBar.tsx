"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../../../public/images/logo-white.png";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi"; // Importing FiX for close icon
import { navigation } from "@/utils/constants";
import { usePathname } from "next/navigation";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Function to close menu after a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* Logo and Title */}
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Image
              src={logo}
              alt="Petite Elise PreSchool"
              height={50}
              width={50}
            />
            <span className="font-bold text-white">Petite Elise Preschool</span>
          </div>
        </Link>

        {/* Navigation Links on Larger Screens */}
        <ul className="hidden lg:flex space-x-6">
          {navigation?.map((nav) => (
            <Link
              key={nav?.title}
              href={nav?.href}
              className={`${
                pathname === nav?.href
                  ? "text-secondary font-bold"
                  : "hover:text-secondary "
              } transition-colors`}
            >
              {nav?.title}
            </Link>
          ))}
        </ul>

        {/* Right Section on Larger Screens */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Admissions Button */}
          <a
            href="/admissions"
            className="bg-secondary font-bold   text-white px-4 py-2 rounded hover:bg-secondary transition-all duration-300 transform hover:scale-105 "
          >
            Admissions
          </a>
        </div>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <FiMenu
            onClick={toggleMenu}
            size={30}
            className="cursor-pointer text-white"
          />
        </div>
      </nav>

      {/* Drawer Menu for Mobile Screens */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300 ease-in-out">
          <div className="flex justify-end p-6">
            <FiX
              onClick={toggleMenu}
              size={30}
              className="cursor-pointer text-white"
            />
          </div>
          <div className="bg-primary w-full h-full p-6">
            <ul className="space-y-8 flex flex-col items-start justify-start">
              {navigation?.map((nav) => (
                <li key={nav?.title}>
                  <Link
                    href={nav?.href}
                    onClick={closeMenu} // Close the menu on link click
                    className={`${
                      pathname === nav?.href
                        ? "text-secondary"
                        : "text-white hover:text-secondary"
                    } text-2xl font-medium transition-colors duration-300`}
                  >
                    {nav?.title}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Admissions Button with Full Width */}
            <div className="mt-20 w-full">
              <Link href="/admissions">
              
              <button
                  onClick={closeMenu} 
                  className="bg-secondary  text-white px-8 py-4 w-full rounded-lg  hover:text-white transition"
                >
                  Admissions
                </button></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
