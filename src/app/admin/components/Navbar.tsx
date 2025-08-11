"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Students", path: "/admin/students" },
    { name: "Code Ninjas", path: "/admin/code-ninjas" },
    { name: "Fee Requests", path: "/admin/fee-requests" },
    { name: "Discount Codes", path: "/admin/discount-codes" },
    { name: "Payments", path: "/admin/payments" },
    { name: "Users", path: "/admin/users" },
  ];

  // Find the active menu item's name
  const activeItem = navItems.find((item) => item.path === pathname)?.name || "Dashboard";

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      <div>
        <h2 className="text-lg font-medium">{activeItem}</h2>
      </div>
      
   
    </header>
  );
};

export default Navbar;
