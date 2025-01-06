import Link from "next/link";
import React from "react";

const AboutUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-10 pb-16 lg:pb-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Image Section */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-full max-w-full sm:max-w-[500px] md:max-w-[600px] aspect-square">
            {/* Cloud Background */}
            <svg
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="#FCE5D8"
            >
              <path d="M390 190c0-40-32-72-72-72-8 0-16 2-24 4-8-22-30-38-56-38-26 0-48 16-56 38-8-2-16-4-24-4-40 0-72 32-72 72 0 2 0 6 0 8-24 6-40 28-40 54 0 30 24 56 56 56h272c30 0 56-24 56-56 0-26-16-48-40-54z" />
            </svg>

            {/* Cloud Image */}
            <svg
              className="absolute inset-4 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <defs>
                <clipPath id="cloudClipPath">
                  <path d="M390 190c0-40-32-72-72-72-8 0-16 2-24 4-8-22-30-38-56-38-26 0-48 16-56 38-8-2-16-4-24-4-40 0-72 32-72 72 0 2 0 6 0 8-24 6-40 28-40 54 0 30 24 56 56 56h272c30 0 56-24 56-56 0-26-16-48-40-54z" />
                </clipPath>
              </defs>
              <image
                href="https://images.squarespace-cdn.com/content/v1/5d84e6b80e37fa228b201806/1579206594469-OOCJYPYF18VDDJ0DJ44N/IMG_2963.jpg"
                width="512"
                height="512"
                clipPath="url(#cloudClipPath)"
                preserveAspectRatio="xMidYMid slice"
              />
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center gap-6 -mt-20 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">
            Our Mission
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
            Committed to providing the best early years foundation through a safe, nurturing home-like environment
          </p>
          <Link href="/about">
            <button className="w-full sm:w-auto px-6 py-2 md:px-8 md:py-3 border-2 border-secondary text-secondary font-bold rounded-full hover:bg-secondary hover:text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-secondary/50">
              More About Us
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
