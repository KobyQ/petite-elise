"use client";
import React, { useEffect } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "@/context/useAuthContext";
import { useRouter } from "next/navigation";
import { LuLoader } from "react-icons/lu";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login"); // Prevents back navigation
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-3 animate-fadeIn">
          <LuLoader className="w-10 h-10 text-gray-700 animate-spin" />
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ProgressBar height="4px" color="#eab308" shallowRouting />
      <ToastContainer />
      <AuthWrapper>{children}</AuthWrapper>
    </AuthProvider>
  );
};

export default Provider;
