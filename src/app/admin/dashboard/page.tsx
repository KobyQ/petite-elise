"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuthContext";
import { useRouter } from "next/navigation";
import { FaCode, FaUsers, FaUserShield } from "react-icons/fa";
import { LuLoader, LuLogOut } from "react-icons/lu";

const Dashboard = () => {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  // Example statistics (replace with real data)
  const stats = [
    { label: "Total Students", value: 120, icon: FaUsers, color: "bg-blue-500" },
    { label: "Total Coders", value: 80, icon: FaCode, color: "bg-green-500" },
    { label: "Total Admins", value: 10, icon: FaUserShield, color: "bg-red-500" },
  ];

  if (loading) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 -mt-36">
      {/* Welcome Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.email}!</h1>
        <p className="text-gray-500 mt-2">You are logged in.</p>
        <Button
          onClick={() => {
            logout();
            router.push("/auth/login");
          }}
          className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full mt-4 transition"
        >
          <LuLogOut size={18} />
          Logout
        </Button>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
          >
            <div className={`w-12 h-12 flex items-center justify-center text-white rounded-full ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mt-2">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
