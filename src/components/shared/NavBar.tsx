"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../../../public/images/logo-white.png";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClubsOpen, setIsClubsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleClubs = () => setIsClubsOpen((prev) => !prev);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsClubsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-white ">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src={logo} alt="Petite Elise PreSchool" height={50} width={50} />
            <span className="font-bold text-white text-lg">Petite Elise Preschool</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-6 items-center">
          <Link href="/" className={`hover:text-secondary transition-all duration-300 ${pathname === "/" ? "text-secondary font-bold" : ""}`}>Home</Link>
          <Link href="/about" className={`hover:text-secondary transition-all duration-300 ${pathname === "/about" ? "text-secondary font-bold" : ""}`}>About</Link>
          <Link href="/programs" className={`hover:text-secondary transition-all duration-300 ${pathname === "/programs" ? "text-secondary font-bold" : ""}`}>Programs</Link>
          {/* <Link href="/shop" className={`hover:text-secondary transition-all duration-300 ${pathname === "/shop" ? "text-secondary font-bold" : ""}`}>Shop</Link> */}
          <Link href="/trustees" className={`hover:text-secondary transition-all duration-300 ${pathname === "/trustees" ? "text-secondary font-bold" : ""}`}>Trustees</Link>
          
          {/* Clubs Dropdown */}
          <div className="relative group">
            <button className="hover:text-secondary flex items-center transition-all duration-300">Clubs ▾</button>
            <div className="absolute left-0 mt-2 bg-white text-primary rounded-lg shadow-lg w-56 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 ease-in-out">
              <Link href="/building-blocks-club" className="block px-6 py-3 hover:bg-gray-200 rounded-t-lg transition-all duration-300">Building Blocks Club</Link>
              <Link href="/code-ninjas-club" className="block px-6 py-3 hover:bg-gray-200 rounded-b-lg transition-all duration-300">Code Ninjas Club</Link>
            </div>
          </div>

          <Link href="/contact" className={`hover:text-secondary transition-all duration-300 ${pathname === "/contact" ? "text-secondary font-bold" : ""}`}>Contact</Link>
        </ul>

        <div className="hidden lg:flex items-center space-x-4">
          <a href="/register-your-child" className="bg-secondary font-bold text-white px-5 py-2 rounded-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105">
            Admissions
          </a>
        </div>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <FiMenu onClick={toggleMenu} size={30} className="cursor-pointer text-white" />
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300 ease-in-out">
          <div className="flex justify-end p-6">
            <FiX onClick={toggleMenu} size={30} className="cursor-pointer text-white" />
          </div>
          <div className="bg-primary w-full h-full p-6">
            <ul className="space-y-6 flex flex-col items-start text-xl">
              <Link href="/" onClick={closeMenu} className="text-white hover:text-secondary transition-all duration-300">Home</Link>
              <Link href="/about" onClick={closeMenu} className="text-white hover:text-secondary transition-all duration-300">About</Link>
              <Link href="/programs" onClick={closeMenu} className="text-white hover:text-secondary transition-all duration-300">Programs</Link>
              <Link href="/shop" onClick={closeMenu} className="text-white hover:text-secondary transition-all duration-300">Shop</Link>
              <Link href="/trustees" onClick={closeMenu} className="text-white hover:text-secondary transition-all duration-300">Trustees</Link>
              
              {/* Clubs Dropdown */}
              <div>
                <button onClick={toggleClubs} className="text-white hover:text-secondary transition-all duration-300 flex items-center">Clubs ▾</button>
                {isClubsOpen && (
                  <div className="mt-2 ml-4 bg-white text-primary rounded-lg shadow-lg w-56 py-2">
                    <Link href="/building-blocks-club" onClick={closeMenu} className="block px-6 py-3 hover:bg-gray-200 transition-all duration-300">Building Blocks Club</Link>
                    <Link href="/code-ninjas-club" onClick={closeMenu} className="block px-6 py-3 hover:bg-gray-200 transition-all duration-300">Code Ninjas Club</Link>
                  </div>
                )}
              </div>

              <Link href="/contact" onClick={closeMenu} className="text-white hover:text-secondary transition-all duration-300">Contact</Link>
            </ul>

            <div className="mt-20 w-full">
              <Link href="/register-your-child">
                <button onClick={closeMenu} className="bg-secondary text-white px-8 py-4 w-full rounded-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105">Admissions</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
