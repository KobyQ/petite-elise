import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4 flex justify-between items-center">
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
        <p className=" text-gray-500">
          © {new Date().getFullYear()} Coding Ninjas Club. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
