"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaCode, FaHome, FaUsers, FaUserShield, FaMoneyBillWave, FaFileInvoiceDollar } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaHome },
    { name: "Students", path: "/admin/students", icon: FaUsers },
    { name: "Code Ninjas", path: "/admin/code-ninjas", icon: FaCode },
    { name: "Fee Requests", path: "/admin/fee-requests", icon: FaFileInvoiceDollar },
    { name: "Payment Configs", path: "/admin/payments", icon: FaMoneyBillWave }, // Payments tab moved here
  ];

  const adminItems = [
    { name: "Users", path: "/admin/users", icon: FaUserShield },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-screen justify-between">
      <div className="p-6 ">
        <h1 className="text-2xl font-bold mb-8">Petite Elise Admin</h1>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                key={item.name}
                href={item.path}
                
                  className={`flex items-center gap-4 p-4 rounded-md cursor-pointer ${
                    isActive ? "bg-[#005f6b]" : "hover:bg-[#006d7a]"
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </ul>
        </nav>
      </div>
      
      <div className="border-t border-gray-300 ">
        <nav className="p-6">
          <ul className="space-y-2">
            {adminItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li
                  key={item.name}
                  className={`flex items-center gap-4 p-4 rounded-md cursor-pointer ${
                    isActive ? "bg-[#005f6b]" : "hover:bg-[#006d7a]"
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.name}</span>
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
