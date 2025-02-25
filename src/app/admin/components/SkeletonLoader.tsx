import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="w-3/4 max-w-4xl border border-gray-200 rounded-lg p-6 bg-white shadow-md">
        {/* Table Header Skeleton */}
        <div className="flex items-center mb-4 animate-pulse">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="w-1/6 h-6 bg-gray-300 rounded mx-2"></div>
          ))}
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center mb-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1/6 h-5 bg-gray-200 rounded mx-2"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
