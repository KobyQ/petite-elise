import Link from "next/link";
import React from "react";

const CTA = () => {
  return (
    <div className="bg-gradient-to-r from-[#007f94] to-[#f9f871] relative px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20 overflow-hidden rounded-t-3xl">
      {/* Decorative Elements */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="absolute top-10 left-10 w-16 h-16 sm:w-24 sm:h-24 bg-[#aee87d] rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 sm:w-32 sm:h-32 bg-[#fb9039] rounded-full opacity-40 animate-bounce"></div>
      </div>

      <div className="max-w-3xl lg:max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
          🌟 Ready to join? 🌟
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 max-w-md sm:max-w-2xl mx-auto font-medium">
          Enroll your child today and give them the best start in their educational journey.
        </p>
        <Link href="/admissions">
        <button className="bg-[#fb9039] text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 rounded-full text-lg sm:text-xl md:text-2xl font-semibold hover:bg-[#f77f2f] transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto shadow-lg">
          Enroll Now
        </button>
        </Link>
   
      </div>

      {/* Decorative animated shapes */}
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-[#aee87d] rounded-t-3xl transform translate-y-1/4 z-0"></div>
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-6 sm:w-16 sm:h-8 bg-[#fb9039] rounded-full opacity-50 animate-pulse"></div>
    </div>
  );
};

export default CTA;
