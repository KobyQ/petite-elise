"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaHome },
    { name: "Students", path: "/admin/students", icon: FaUsers },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-8">Petite Elise Admin</h1>
      <nav>
        <ul className="space-y-2"> {/* Adds spacing between items */}
          {navItems.map((item) => {
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
    </aside>
  );
};

export default Sidebar;
