/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Required for Next.js app directory
import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import { supabaseAuth } from "@/utils/supabaseClient";



// Create Auth Context
const AuthContext = createContext<any>(null);

// Custom Hook to Access Auth Context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check Session and Listen for Changes
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data, error } = await supabaseAuth.auth.getUser();
      if (!error) setUser(data?.user);
      setLoading(false);
    };

    const { data: authListener } = supabaseAuth.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    checkUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Logout function
  const logout = async () => {
    await supabaseAuth.auth.signOut();
    setUser(null);
    toast.info("Logged out successfully", { position: "top-right" });
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
