/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface CardProps {
  icon: string;
  title: string;
  description: string;
  time: string;
}

const Card: React.FC<CardProps> = ({ icon, title,time, description }) => {
  return (
    <div className="relative flex flex-col items-center bg-white p-6 rounded-lg max-w-sm text-center mt-16">
      {/* Icon Container */}
      <div className="absolute -top-10 w-20 h-20">
        {/* Hexagonal Icon Background */}
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <polygon
            points="50,3 93.3,25 93.3,75 50,97 6.7,75 6.7,25"
            className="fill-[#fb9039] stroke-[#007f94] stroke-[3px]"
          />
        </svg>
        <img
          src={icon}
          alt={`${title} icon`}
          className="absolute inset-0 w-8 h-8 m-auto"
        />
      </div>
      {/* Card Content */}
      <div className="mt-12 flex flex-col gap-3">
        <h3 className="text-lg font-bold text-gray-800 ">{title}</h3>
        <h6 className="text-sm text-gray-600">{time}</h6>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Card;
