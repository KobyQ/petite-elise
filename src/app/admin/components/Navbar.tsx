"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Students", path: "/admin/students" },
  ];

  // Find the active menu item's name
  const activeItem = navItems.find((item) => item.path === pathname)?.name || "Dashboard";

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      <div>
        <h2 className="text-lg font-medium">{activeItem}</h2>
      </div>
      
        <Image
          src="/images/profile.png"
          alt="Profile"
          height={50}
          width={50}
          className="rounded-full object-cover border border-gray-300"
        />
    </header>
  );
};

export default Navbar;
