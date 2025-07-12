import PrivacyPolicy from "@/components/privacy/PrivacyPolicy";
import CTA from "@/components/programs/CTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Petite Elise Preschool",
  description: "Learn about how Petite Elise Preschool collects, uses, and protects your personal information and data.",
  keywords: ["Privacy Policy", "data protection", "personal information", "Petite Elise Preschool"],
};

const PrivacyPolicyPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center text-center text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2022&q=80')",
          }}
        >
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0, 127, 148, 0.3), rgba(0, 127, 148, 0.5))`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Privacy Policy</h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md max-w-2xl mx-auto">
            Welcome to Petite Elise Preschool. This Privacy Policy explains how we collect, use, disclose, and protect your information when you access and use our services.
          </p>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <PrivacyPolicy />
      
      {/* CTA Section */}
      <CTA />
    </div>
  );
};

export default PrivacyPolicyPage;
