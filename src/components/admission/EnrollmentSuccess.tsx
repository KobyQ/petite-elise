/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import Link from "next/link";
import React from "react";

const EnrollmentSuccess = ({ enrolledChildren }: { enrolledChildren: any }) => {
    console.log("meee", enrolledChildren)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      {/* Success Message */}
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold">🎉 Enrollment Successful!</h2>
        <p className="mt-2">
          Congratulations! The enrollment process was completed successfully.
        </p>
      </div>

      {/* Enrolled Children List */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-6">
        <h3 className="text-lg font-medium mb-4">Enrolled Children:</h3>
        {enrolledChildren?.length > 0 ? (
          <ul className="space-y-2">
            {enrolledChildren?.map((child: any, index: any) => (
              <li
                key={index}
                className="bg-gray-100 p-3 rounded shadow-sm flex items-center"
              >
                <span className="font-medium">{child.childName}</span>
                <span className="ml-auto text-sm text-gray-500">
                  Age: {child?.childAge}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No children enrolled yet.</p>
        )}
      </div>

      {/* Visit Website Button */}
      <Link
        href="/"
        className=" bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md w-full lg:w-fit"
      >
        Visit Our Website
      </Link>
    </div>
  );
};

export default EnrollmentSuccess;
