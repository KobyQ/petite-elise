/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Form, FormikProvider, useFormik } from "formik";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/context/useAuthContext";
import Input from "../components/Input";
import { loginSchema } from "@/utils/validations";

const supabase = createClientComponentClient();

const Login = () => {
  const router = useRouter();
  const { user } = useAuth(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message, { position: "top-right" });
        setIsSubmitting(false);
      } else {
        toast.success("Login successful!", { position: "top-right" });
        router.push("/admin/dashboard"); // Redirect to dashboard
      }
    },
    validationSchema: loginSchema
  });

  // Redirect if already logged in
  if (user) {
    router.push("/admin/dashboard");
    return null;
  }

  const { isValid, dirty } = formik;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit} className="space-y-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <Button
                type="submit"
                disabled={isSubmitting || !(isValid && dirty)}
                className="w-full bg-tertiary text-black font-semibold py-6 text-lg relative overflow-hidden group"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Login</span>
                    <span className="absolute inset-0 h-full w-0 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full"></span>
                  </>
                )}
              </Button>
            </motion.div>
          </Form>
        </FormikProvider>
      </div>
    </motion.div>
  );
};

export default Login;
