/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Field } from "formik";
import { Button } from "../ui/button";

type AuthorizationProps = {
  prevStep: () => void;
  isSubmitting: boolean;
};

const Authorization = ({ prevStep, isSubmitting }: AuthorizationProps) => {
  return (
    <div className="my-10">
      <div>
        <p className="mb-6 font-bold text-gray-600 text-lg">
          Please present the following documents to the admin desk in person
          during school hours:
        </p>
        <ul className="list-disc list-inside bg-white p-5 shadow-md rounded-lg border border-gray-200">
          <li>Child&apos;s Passport Photo</li>
          <li>Parent&apos;s Passport Photo</li>
          <li>Emergency Contact&apos;s Passport Photo</li>
          <li>1st Pickup Person&apos;s Passport Photo</li>
          <li>2nd Pickup Person&apos;s Passport Photo</li>
          <li>Child&apos;s G6pd report</li>
          <li>Copy of Child&apos;s vaccinations</li>
        </ul>
      </div>

      <div className="mt-8">
        <p className="mb-6 font-bold text-gray-600 text-lg">
          Kindly note that photographs and videos may be taken at our Preschool.
          By registering your child, you give Petite Elise Preschool the
          permission to use photographs, images, and/or video footage of your
          child for promotional reference for our future kid-friendly programs.
        </p>
        <div className="mb-4">
          <div className="flex flex-col gap-6 mt-2">
            <label className="inline-flex items-center">
              <Field
                type="radio"
                name="photographUsageConsent"
                value="authorize"
                className="form-radio text-green-400 border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <span className="ml-2 text-gray-700">
                I authorize my child&apos;s photograph or image to be used in
                any of Petite Elise Preschool promotional reference for
                kid-friendly events.
              </span>
            </label>
            <label className="inline-flex items-center">
              <Field
                type="radio"
                name="photographUsageConsent"
                value="do-not-authorize"
                className="form-radio text-green-400 border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <span className="ml-2 text-gray-700">
                I do not authorize my child&apos;s photograph or image to be
                used in any of Petite Elise Preschool promotional reference for
                kid-friendly events.
              </span>
            </label>
            <label className="inline-flex items-center">
              <Field
                type="radio"
                name="photographUsageConsent"
                value="permit"
                className="form-radio text-green-400 border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <span className="ml-2 text-gray-700">
                I permit certain features (except for face and full body photos)
                of my child to be used in any of Petite Elise Preschool
                promotional reference for kid-friendly events.
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row justify-between gap-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="w-full lg:w-1/3 py-3 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full lg:w-1/3 py-3 font-bold rounded-lg shadow-lg border-2 text-white bg-gradient-to-r from-[#008C7E] to-[#00B597] border-[#00B597] hover:opacity-90 `}
        >
          {isSubmitting ? "Registering..." : "Register Your Child"}
        </Button>
      </div>
    </div>
  );
};

export default Authorization;
