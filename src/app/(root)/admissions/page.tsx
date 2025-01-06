import SendMessage from "@/components/contact/SendMessage";

import React from "react";

const AdmissionsPage = () => {
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#007f94] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center space-y-8">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight ">
              Welcome to Our Admissions Portal
            </h1>
            <p className="text-md md:text-xl text-white/80 max-w-3xl mx-auto">
              Join our vibrant community where education meets exploration.
              Enroll your child today and give them the best start to their
              future with a comprehensive, hands-on learning experience.
            </p>
          </div>
        </div>
      </section>
      <SendMessage />
     
    </div>
  );
};

export default AdmissionsPage;
