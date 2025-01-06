/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Input from "../shared/forms/Input";
import { Button } from "../ui/button";
import moment from "moment";

type ExistingInfoCheckProps = {
  isChildAlreadyEnrolled: string;
  setIsChildAlreadyEnrolled: (val: string) => void;
  values: {
    parentEmail: string;
    parentPhoneNumber: string;
  };
  fetchAllDocuments: (email: string, phone: string) => void;
  fetchingData: boolean;
  existingData: any[];
  selectedChild?: any;
  setSelectedChild: (data: any) => void;
  setExistingData: (data: any) => void;
  nextStep: () => void;
};

const ExistingInfoCheck = ({
  isChildAlreadyEnrolled,
  setIsChildAlreadyEnrolled,
  values,
  fetchAllDocuments,
  fetchingData,
  existingData,
  selectedChild,
  setSelectedChild,
  setExistingData,
  nextStep,
}: ExistingInfoCheckProps) => {
  const [disableButton, setDisableButton] = useState(true);

 // Reset the disableButton state when either parentEmail, parentPhoneNumber, or isChildAlreadyEnrolled changes
useEffect(() => {
    setDisableButton(false);
  }, [values.parentEmail, values.parentPhoneNumber, isChildAlreadyEnrolled]);
  

  const handleSearchClick = () => {
    setDisableButton(true); // Disable the button after the fetch
    fetchAllDocuments(values.parentEmail, values.parentPhoneNumber);
  };

  return (
    <div>
      <div className="mb-10 mt-5">
        <p className="text-lg font-medium mb-2">
          Has your child already registered for any program at Petite Elise?
        </p>
        <div>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="isChildAlreadyEnrolled"
              value="No"
              checked={isChildAlreadyEnrolled === "No"}
              onChange={(e) => {
                setIsChildAlreadyEnrolled(e.target.value);
                setSelectedChild(null);
                setExistingData(null); // Clear existing data
              }}
              className="form-radio text-[#00B597]"
            />
            <span className="ml-2">No, this is for a new child</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="isChildAlreadyEnrolled"
              value="Yes"
              checked={isChildAlreadyEnrolled === "Yes"}
              onChange={(e) => setIsChildAlreadyEnrolled(e.target.value)}
              className="form-radio text-[#00B597]"
            />
            <span className="ml-2">Yes, enrolling for another program</span>
          </label>
        </div>
      </div>

      {isChildAlreadyEnrolled === "Yes" && (
        <>
          {/* Input fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mb-6">
            <Input
              label="Parent’s Email"
              type="email"
              name="parentEmail"
              required
            />
            <Input
              label="Parent’s Phone Number"
              type="tel"
              name="parentPhoneNumber"
              required
            />
          </div>

          {/* Search Child Button */}
          <div className="w-full flex justify-end mb-6">
            <Button
              onClick={handleSearchClick}
              disabled={
                !values.parentEmail ||
                !values.parentPhoneNumber ||
                fetchingData ||
                disableButton
              }
              className="w-full lg:w-1/3 py-3 bg-gradient-to-r from-[#008C7E] to-[#00B597] text-white font-bold rounded-lg hover:opacity-90 shadow-lg"
            >
              {fetchingData ? "Searching..." : "Search Child"}
            </Button>
          </div>
        </>
      )}

      {/* Existing child cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {existingData?.map((child: any) => {
          const isSelected = selectedChild === child;
          return (
            <div
              key={child.collectionId}
              onClick={() => setSelectedChild(child)} // Set the selected child
              className={`p-4 border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 
          ${isSelected ? "border-[#00B597] bg-[#E6FAF6]" : "border-gray-300 bg-white"}`}
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {child.childName}
              </h3>
              <p className="text-sm text-gray-500">
                Date of Birth: {moment(child.childDOB).format("YYYY-MM-DD")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Next Button */}
      {(isChildAlreadyEnrolled === "No" || selectedChild) && (
        <div className="w-full flex justify-end mt-6">
          <button
            type="button"
            onClick={nextStep}
            className="w-full lg:w-1/3 py-3 bg-gradient-to-r from-[#008C7E] to-[#00B597] text-white font-bold rounded-lg hover:opacity-90 shadow-lg"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExistingInfoCheck;
