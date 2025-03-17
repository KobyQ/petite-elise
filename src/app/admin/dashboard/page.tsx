/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuthContext";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaUsers, FaCode, FaUserShield } from "react-icons/fa";
import { LuLoader, LuLogOut } from "react-icons/lu";



const Dashboard = () => {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  const [stats, setStats] = useState([
    { label: "Total Students", value: null, icon: FaUsers, color: "bg-blue-500" },
    { label: "Total Coders", value: null, icon: FaCode, color: "bg-green-500" },
    { label: "Total Admins", value: null, icon: FaUserShield, color: "bg-red-500" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch Code Ninjas
        const { count: ninjasCount, error: ninjasError } = await supabase
          .from("code-ninjas") 
          .select("*", { count: "exact", head: true });

        if (ninjasError) throw new Error("Failed to fetch code ninjas");

        // Fetch Students
        const { count: childrenCount, error: childrenError } = await supabase
          .from("children")
          .select("*", { count: "exact", head: true });

        if (childrenError) throw new Error("Failed to fetch students");

        // Fetch Users via API (Avoid Forbidden Error)
        const usersResponse = await fetch("/api/fetch-user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store", // Prevents caching issues
        });
        const usersData = await usersResponse.json();
        
        if (!usersResponse.ok) throw new Error(usersData.error || "Failed to fetch users");
        

        setStats([
          { label: "Total Students", value: childrenCount, icon: FaUsers, color: "bg-blue-500" },
          { label: "Total Coders", value: ninjasCount, icon: FaCode, color: "bg-green-500" },
          { label: "Total Admins", value: usersData.users.length, icon: FaUserShield, color: "bg-red-500" },
        ]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

 

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LuLoader className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (!user) {
    router.replace("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-700">Hello, {user.user_metadata?.name ?? user?.email}!</h2>
        <Button
          onClick={() => {
            logout();
            router.push("/auth/login");
          }}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition"
        >
          <LuLogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto ">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white flex flex-col items-center justify-center shadow-md rounded-lg p-5 text-center">
            <div className={`w-12 h-12 flex items-center justify-center text-white rounded-full ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-3">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stat.value === null ? "No data" : stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
