import React from 'react';

const MissionSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-16 bg-white">
      {/* Cloud Design */}
      <div className="relative w-80 h-80 flex-shrink-0">
        {/* Solid Cloud Background */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="#FCE5D8"
        >
          <path d="M400,224c0-48-40-80-80-80c-12.6,0-32.6,4.6-46,12c-16-20-42-28-66-28c-50,0-76,38-76,64c0,6,2,18,4,22 c-40,2-80,32-80,76c0,52,42,80,88,80h272c48,0,80-36,80-80C512,270,472,224,400,224z" />
        </svg>

        {/* Image Cloud */}
        <svg
          className="absolute inset-4 w-[92%] h-[92%]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <defs>
            <clipPath id="cloud-clip-path">
              <path d="M400,224c0-48-40-80-80-80c-12.6,0-32.6,4.6-46,12c-16-20-42-28-66-28c-50,0-76,38-76,64c0,6,2,18,4,22 c-40,2-80,32-80,76c0,52,42,80,88,80h272c48,0,80-36,80-80C512,270,472,224,400,224z" />
            </clipPath>
          </defs>
          <image
            href="https://images.squarespace-cdn.com/content/v1/5d84e6b80e37fa228b201806/1579206594469-OOCJYPYF18VDDJ0DJ44N/IMG_2963.jpg" // Replace with your actual image
            width="512"
            height="512"
            clipPath="url(#cloud-clip-path)"
            preserveAspectRatio="xMidYMid slice"
          />
        </svg>
      </div>

      {/* Text Section */}
      <div className="text-center md:text-left max-w-md">
        <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
        <p className="text-gray-700 mt-4">
          Sun Prairie Nursery School encourages preschool children to grow and
          learn through exploration and active play in a parent-cooperative
          setting.
        </p>
        <button className="mt-6 px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default MissionSection;
