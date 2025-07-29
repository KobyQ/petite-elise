"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import Input from "../shared/forms/Input"
import { Button } from "../ui/button"
import moment from "moment"
import { toast } from "react-toastify"

type ExistingInfoCheckProps = {
  isChildAlreadyEnrolled: string
  setIsChildAlreadyEnrolled: (val: string) => void
  values: {
    parentEmail: string
    parentPhoneNumber: string
  }
  fetchAllDocuments: (email: string, phone: string) => void
  fetchingData: boolean
  existingData: any[]
  selectedChild?: any
  setSelectedChild: (data: any) => void
  setExistingData: (data: any) => void
  nextStep: () => void
  searchStatus?: {
    emailFound: boolean
    phoneFound: boolean
  } | null
}

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
  searchStatus,
}: ExistingInfoCheckProps) => {
  const [disableButton, setDisableButton] = useState(true)
  const [searchAttempted, setSearchAttempted] = useState(false)

  // Reset the disableButton state when either parentEmail, parentPhoneNumber, or isChildAlreadyEnrolled changes
  useEffect(() => {
    // Only reset the disableButton state when values change AND we're not currently fetching
    if (!fetchingData) {
      setDisableButton(false)
    }
  }, [values.parentEmail, values.parentPhoneNumber, isChildAlreadyEnrolled, fetchingData])

  const handleSearchClick = () => {
    if (!values.parentEmail || !values.parentPhoneNumber) {
      toast.error("Please enter both email and phone number to search")
      return
    }

    setDisableButton(true) // Disable the button during fetch
    setSearchAttempted(true) // Mark that a search has been attempted
    fetchAllDocuments(values.parentEmail, values.parentPhoneNumber)
  }

  // Helper function to get the appropriate message based on search status
  const getNoResultsMessage = () => {
    if (!searchStatus) return "We couldn't find any children registered with the provided information."

    if (!searchStatus.emailFound && !searchStatus.phoneFound) {
      return "We couldn't find any records with this email address or phone number. Please check your information and try again."
    }

    if (!searchStatus.emailFound) {
      return "We found records with this phone number, but not with this email address. Please check your email and try again."
    }

    if (!searchStatus.phoneFound) {
      return "We found records with this email address, but not with this phone number. Please check your phone number and try again."
    }

    return "We found records with both your email and phone number, but they don't belong to the same account. Please contact support for assistance."
  }

  return (
    <div>
      <div className="mb-10 mt-5">
        <p className="text-lg font-medium mb-2">Has your child already registered for any program at Petite Elise?</p>
        <div>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="isChildAlreadyEnrolled"
              value="No"
              checked={isChildAlreadyEnrolled === "No"}
              onChange={(e) => {
                setIsChildAlreadyEnrolled(e.target.value)
                setSelectedChild(null)
                setExistingData(null) // Clear existing data
                setSearchAttempted(false) // Reset search attempt flag
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
              onChange={(e) => {
                setIsChildAlreadyEnrolled(e.target.value)
                setSearchAttempted(false) // Reset search attempt flag
              }}
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
            <Input label="Parent's Email" type="email" name="parentEmail" required />
            <Input label="Parent's Phone Number" type="tel" name="parentPhoneNumber" required />
          </div>

          {/* Search Child Button */}
          <div className="w-full flex justify-end mb-6">
            <Button
              onClick={handleSearchClick}
              disabled={!values.parentEmail || !values.parentPhoneNumber || fetchingData || disableButton}
              className="w-full lg:w-1/3 py-3 bg-gradient-to-r from-[#008C7E] to-[#00B597] text-white font-bold rounded-lg hover:opacity-90 shadow-lg"
            >
              {fetchingData ? "Searching..." : "Search Child"}
            </Button>
          </div>

          {/* No results message with specific feedback */}
          {searchAttempted && existingData && existingData.length === 0 && !fetchingData && (
            <div className="mb-6 p-4 border rounded-lg bg-amber-50 border-amber-200 text-amber-800">
              <h3 className="font-semibold text-lg mb-2">No records found</h3>
              <p>{getNoResultsMessage()}</p>
              <div className="mt-4">
                <Button onClick={() => setIsChildAlreadyEnrolled("No")} variant="outline" className="mr-2">
                  Register as New Child
                </Button>
                <Button
                  onClick={() => {
                    setSearchAttempted(false)
                    setDisableButton(false)
                  }}
                  variant="ghost"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Existing child cards */}
      {existingData && existingData.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3">Select your child:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingData.map((child: any) => {
              const isSelected = selectedChild === child
              return (
                <div
                  key={child.id || child.collectionId}
                  onClick={() => setSelectedChild(child)} // Set the selected child
                  className={`p-4 border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 
              ${isSelected ? "border-[#00B597] bg-[#E6FAF6]" : "border-gray-300 bg-white"}`}
                >
                  <h3 className="text-lg font-semibold text-gray-700">{child.childName}</h3>
                  <p className="text-sm text-gray-500">Date of Birth: {moment(child.childDOB).format("YYYY-MM-DD")}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
  )
}

export default ExistingInfoCheck
