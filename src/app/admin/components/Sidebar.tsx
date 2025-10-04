"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaCode, FaHome, FaUsers, FaUserShield, FaMoneyBillWave, FaFileInvoiceDollar, FaTicketAlt, FaStore, FaShoppingCart, FaTags, FaChevronDown, FaChevronRight, FaCog } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isShopOpen, setIsShopOpen] = useState(pathname.includes("/admin/shop"));

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaHome },
    { name: "Students", path: "/admin/students", icon: FaUsers },
    { name: "Code Ninjas", path: "/admin/code-ninjas", icon: FaCode },
    { name: "Code Ninja Config", path: "/admin/code-ninja-config", icon: FaCog },
    { name: "Fee Requests", path: "/admin/fee-requests", icon: FaFileInvoiceDollar },
    { name: "Discount Codes", path: "/admin/discount-codes", icon: FaTicketAlt },
    { name: "Payment Configs", path: "/admin/payments", icon: FaMoneyBillWave },
  ];

  const shopItems = [
    { name: "Products", path: "/admin/shop/products", icon: FaStore },
    { name: "Orders", path: "/admin/shop/orders", icon: FaShoppingCart },
    { name: "Categories", path: "/admin/shop/categories", icon: FaTags },
  ];

  const adminItems = [
    { name: "Users", path: "/admin/users", icon: FaUserShield },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="p-6 flex-shrink-0">
        <h1 className="text-2xl font-bold">Petite Elise Admin</h1>
      </div>
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-hide">
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-4 p-4 rounded-md cursor-pointer ${
                      isActive ? "bg-[#005f6b]" : "hover:bg-[#006d7a]"
                    }`}
                    onClick={() => router.push(item.path)}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
            
            {/* Shop Menu with Submenu */}
            <li>
              <div
                className={`flex items-center gap-4 p-4 rounded-md cursor-pointer ${
                  pathname.includes("/admin/shop") ? "bg-[#005f6b]" : "hover:bg-[#006d7a]"
                }`}
                onClick={() => setIsShopOpen(!isShopOpen)}
              >
                <FaStore className="h-6 w-6" />
                <span className="flex-1">Shop</span>
                {isShopOpen ? (
                  <FaChevronDown className="h-4 w-4" />
                ) : (
                  <FaChevronRight className="h-4 w-4" />
                )}
              </div>
              
              {/* Shop Submenu */}
              {isShopOpen && (
                <ul className="ml-6 mt-2 space-y-1">
                  {shopItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.path}
                          className={`flex items-center gap-3 p-3 rounded-md cursor-pointer text-sm ${
                            isActive ? "bg-[#004d56] text-white" : "hover:bg-[#006d7a] text-gray-200"
                          }`}
                          onClick={() => router.push(item.path)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Fixed Footer */}
      <div className="border-t border-gray-300 flex-shrink-0">
        <nav className="p-6">
          <ul className="space-y-2">
            {adminItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-4 p-4 rounded-md cursor-pointer ${
                      isActive ? "bg-[#005f6b]" : "hover:bg-[#006d7a]"
                    }`}
                    onClick={() => router.push(item.path)}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
