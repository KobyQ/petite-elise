import ContactInfo from "@/components/contact/ContactInfo";
import SendMessage from "@/components/contact/SendMessage";
import CTA from "@/components/programs/CTA";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Contact Us | Petite Elise Preschool",
  description: "Get in touch with us to learn more about our programs and enrollment process.",
  keywords: ["contact Petite Elise", "preschool contact Accra", "enroll child preschool"],
};

const ContactUsPage = () => {
  return (
 <div className="">

<div className="bg-gradient-to-b from-blue-100 to-pink-100 min-h-screen py-16 relative overflow-hidden">
      {/* Decorative Shapes */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-yellow-200 rounded-full opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 md:w-60 md:h-60 bg-blue-300 rounded-full opacity-30 transform translate-x-1/2 translate-y-1/2"></div>

      {/* Header */}
      <header className="text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mt-4">
          We&apos;d love to hear from you! Fill out the form or reach out
          directly.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto flex  flex-col-reverse lg:flex-row justify-center gap-10 items-center px-6 sm:px-10 w-full relative mt-12">
        {/* Send Us a Message */}
        <SendMessage />

        {/* Contact Info */}
        <ContactInfo />
      </main>

      {/* Footer Decorative Shape */}
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-pink-200 rounded-full opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
    </div>
    <CTA />

 </div>
  );
};

export default ContactUsPage;
