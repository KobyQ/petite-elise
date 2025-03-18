/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { contactSchema } from "@/utils/validations";
import { useFormik } from "formik";
import React from "react";
import {  LuMail,  LuMessageSquareText,  LuPhone, LuUser } from "react-icons/lu";
import { toast } from "react-toastify";

const SendMessage = () => {
  const {
    values,
    handleSubmit,
    isSubmitting,
    setSubmitting,
    resetForm,
    errors,
    dirty,
    touched,
    handleBlur,
    handleChange,
    isValid, 
  } = useFormik({
    initialValues: {
      subject: "Registration Request from Petite Elise Website",
      fullName: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
    validationSchema: contactSchema,
    onSubmit: async (_values) => {
      try {
        setSubmitting(true);
        const response = await fetch("/api/contact", {
          method: "POST",
          body: JSON.stringify(_values),
          headers: {
            "Content-Type": "application/json",
          },
        });
    
    
        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(errorData?.message || "HTTP error! status: " + response.status);
        }
    
      
        resetForm();
        toast.success("Message sent Successfully!");
      } catch (error: any) {
        console.error("Error during submission:", error);
        toast.error(error?.message || "An error occurred. Try again");
      } finally {
        setSubmitting(false);
      }
    },
    
  });
  
  return (
    <div className="space-y-6 sm:space-y-8 w-full lg:w-1/2">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 relative overflow-hidden">
        <p className="text-sm lg:text-lg text-gray-700 font-medium text-center leading-relaxed pb-6">
          Need any help? We are here to help
        </p>

        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div>
            <div
              className={`flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 ${
                errors.fullName && touched.fullName
                  ? "outline-red-500"
                  : "outline-gray-300"
              } focus-within:outline-indigo-600`}
            >
              <LuUser className="shrink-0 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={values.fullName}
                onChange={handleChange} 
                onBlur={handleBlur}
                placeholder="Your Full Name"
                className="block min-w-0 grow p-3 sm:p-4 pl-1 text-base placeholder:text-gray-400 focus:ring-blue-300 focus:outline-none"
                required
              />
            </div>
            {errors.fullName && touched.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <div
              className={`flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 ${
                errors.email && touched.email
                  ? "outline-red-500"
                  : "outline-gray-300"
              } focus-within:outline-indigo-600`}
            >
              <LuMail className="shrink-0 text-gray-400" />
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange} 
                onBlur={handleBlur}
                placeholder="Your Email"
                className="block min-w-0 grow p-3 sm:p-4 pl-1 text-base placeholder:text-gray-400 focus:ring-blue-300 focus:outline-none"
                required
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <div
              className={`flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 ${
                errors.phoneNumber && touched.phoneNumber
                  ? "outline-red-500"
                  : "outline-gray-300"
              } focus-within:outline-indigo-600`}
            >
              <LuPhone className="shrink-0 text-gray-400" />
              <input
                type="tel"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange} 
                onBlur={handleBlur}
                placeholder="Your Phone Number"
                className="block min-w-0 grow p-3 sm:p-4 pl-1 text-base placeholder:text-gray-400 focus:ring-blue-300 focus:outline-none"
                required
              />
            </div>
            {errors.phoneNumber && touched.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

           {/* message Input */}
           <div>
            <div
              className={`flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 ${
                errors.message && touched.message
                  ? "outline-red-500"
                  : "outline-gray-300"
              } focus-within:outline-indigo-600`}
            >
              <LuMessageSquareText className="shrink-0 text-gray-400" />
              <textarea
                name="message"
                value={values.message}
                onChange={handleChange} 
                onBlur={handleBlur}
                placeholder="Please share the programs you want to enroll your child in or any questions you have."
                className="block min-w-0 grow p-3 sm:p-4 pl-1 h-40 text-base placeholder:text-gray-400 focus:ring-blue-300 focus:outline-none"
                required
              />
            </div>
            {errors.message && touched.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !dirty || !isValid}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 sm:py-3 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Request Registration"}
          </button>
        </form>

        <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-blue-200 rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default SendMessage;
