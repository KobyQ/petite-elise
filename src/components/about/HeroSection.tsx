import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="bg-[#d3eee7] min-h-screen flex items-center justify-center">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-[#007f94] to-[#009ca5] bg-clip-text text-transparent">
              Nurturing Young Minds for a Brighter Future
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Petite Elise Preschool, a subsidiary of Talkative Mom Ltd, is a
              childcare center that enrolls children from 3 months - 5 years. We
              provide a safe, nurturing environment to build curious, resilient,
              and independent thinkers; inspiring children to be life-long
              learners.
            </p>
            <p className="text-lg sm:text-xl font-[500] text-primary">
              Here, we believe that every child has the potential to become
              exceptional.
            </p>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#007f94] to-[#009ca5] rounded-2xl transform rotate-3" />
              <Image
                src="https://st5.depositphotos.com/1049680/65173/i/450/depositphotos_651732926-stock-photo-african-american-girl-preschool-student.jpg"
                alt="Preschool children playing"
                width={600}
                height={400}
                className="w-full h-auto rounded-2xl shadow-xl relative transform -rotate-3 transition-transform hover:rotate-0 duration-300"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
