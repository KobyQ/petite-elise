import React from "react";

interface PricingCardProps {
  number: string;
  title: string;
  description: string;
  time: string;
  price: string;
}

const ProgramCard = ({
  number,
  title,
  description,
  time,
  price,
}: PricingCardProps) => {
  return (
    <div className="rounded-2xl flex flex-col justify-between bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-8 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out border border-gray-700">
      <p className="text-sm font-medium text-yellow-400">{number}</p>
      <h3 className="mt-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">
        {title}
      </h3>
      <p className="mt-4 text-gray-200 leading-relaxed">{description}</p>
      <div className="mt-8 pt-8 border-t border-gray-600">
        <div className=" space-y-4">
          {/* Time with Icon */}
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-md text-gray-300 font-medium">{time}</span>
          </div>
          
          {/* Price with Icon */}
          <div className="flex items-center space-x-2 justify-start">
            <span className="text-2xl font-bold text-yellow-400">{price}</span>
            <span className="text-gray-400 ml-1 text-lg">/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
