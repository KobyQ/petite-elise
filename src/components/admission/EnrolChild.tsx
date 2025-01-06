/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { FormikProvider, useFormik } from "formik";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient"; // Ensure this is a singleton
import { IEnrollChild } from "@/utils/interfaces";
import { enrollChildSchema } from "@/utils/validations";
import ChildAndGuardianInfo from "./ChildAndGuardianInfo";
import ProgramSelection from "./ProgramSelection";
import ChildHealthConditions from "./ChildHealthConditions";
import Authorization from "./Authorization";
import ExistingInfoCheck from "./ExistingInfoCheck";
import Link from "next/link";

const EnrolChild = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isChildAlreadyEnrolled, setIsChildAlreadyEnrolled] =
    useState<string>("");
  const [existingData, setExistingData] = useState<any>(null);
  const [fetchingData, setFetchingData] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [isEnrollmentSuccessful, setIsEnrollmentSuccessful] =
    useState<boolean>(false);

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentStep]);

  const fetchAllDocuments = async (
    parentEmail: string,
    parentPhoneNumber: string
  ) => {
    try {
      setFetchingData(true);
      setSelectedChild(null);

      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("parentEmail", parentEmail)
        .eq("parentPhoneNumber", parentPhoneNumber);

      if (error) {
        throw error;
      }

      setExistingData(data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
      toast.error("Failed to fetch child records. Please try again.");
    } finally {
      setFetchingData(false);
    }
  };

  const formik = useFormik<IEnrollChild>({
    initialValues: {
      childName: selectedChild?.childName || "",
      childDOB: selectedChild?.childDOB
        ? moment(selectedChild.childDOB).format("YYYY-MM-DD")
        : "",
      childAge: selectedChild?.childAge || "",
      parentName: selectedChild?.parentName || "",
      parentEmail: selectedChild?.parentEmail || "",
      parentPhoneNumber: selectedChild?.parentPhoneNumber || "",
      parentWhatsappNumber: selectedChild?.parentWhatsappNumber || "",
      address: selectedChild?.address || "",
      emergencyContactName: selectedChild?.emergencyContactName || "",
      emergencyContactPhoneNumber:
        selectedChild?.emergencyContactPhoneNumber || "",
      emergencyContactWhatsappNumber:
        selectedChild?.emergencyContactWhatsappNumber || "",
      emergencyContactRelationshipToChild:
        selectedChild?.emergencyContactRelationshipToChild || "",
      dropChildOffSelf: selectedChild?.dropChildOffSelf || "",
      dropOffNames: selectedChild?.dropOffNames || [
        { name: "", relationToChild: "" },
      ],
      programs: selectedChild?.programs || [],
      dayCareSchedule: selectedChild?.dayCareSchedule || "",
      feeding: selectedChild?.feeding || "",
      hasSibling: selectedChild?.hasSibling || "",
      sibling: selectedChild?.sibling || "",
      hasAllergies: selectedChild?.hasAllergies || "",
      allergies: selectedChild?.allergies || [],
      hasSpecialHealthConditions:
        selectedChild?.hasSpecialHealthConditions || "",
      specialHealthConditions: selectedChild?.specialHealthConditions || [],
      photographUsageConsent: selectedChild?.photographUsageConsent || "",
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (selectedChild) {
          const { error } = await supabase
            .from("children")
            .update(values)
            .eq("id", selectedChild.id);

          if (error) throw error;
        } else {
          const { error } = await supabase.from("children").insert(values);

          if (error) throw error;
        }

        toast.success("Child enrollment successful!");
        setIsEnrollmentSuccessful(true);
      } catch (error: any) {
        console.error("Submission Error:", error);
        toast.error(`An error occurred during submission: ${error?.message}`);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
    validationSchema: enrollChildSchema,
  });

  if (isEnrollmentSuccessful) {
    return (
      <section
        id="enroll-success"
        className="py-12 md:py-20 bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] text-[#2d3d3d] animate-fadeIn"
      >
        <div className="max-w-5xl mx-auto px-2 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-600">
            Enrollment Successful!
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-700">
            Your child has been enrolled successfully. Thank you for choosing
            us!
          </p>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6 mt-8 ">
            <button
              onClick={() => {
                setIsEnrollmentSuccessful(false);
                setCurrentStep(1);
              }}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md w-full lg:w-fit"
            >
              Enroll Another Child
            </button>
            <Link
              href="/"
              className=" bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md w-full lg:w-fit"
            >
              Visit Our Website
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { values, setFieldValue, handleSubmit, isSubmitting } = formik;

  const totalSteps = 5;

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  return (
    <section
      id="enroll-child"
      className="py-12 md:py-20 bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] text-[#2d3d3d] animate-fadeIn"
    >
      <div className="max-w-5xl mx-auto px-2 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Enroll Your Child
          </h2>
          <p className="mt-4 text-md md:text-lg text-gray-600">
            Fill out the form below to get started on your child’s amazing
            journey with us!
          </p>
        </div>
        <FormikProvider value={formik}>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 md:p-10 rounded-3xl shadow-lg"
          >
            <div className="flex justify-between w-full font-bold">
              {currentStep === 1
                ? "Existing Child Check"
                : currentStep === 2
                  ? "Child and Guardian Information"
                  : currentStep === 3
                    ? "Program Selection and Schedule"
                    : currentStep === 4
                      ? "Feeding, Health Conditions and Allergies"
                      : "Required Documents and Photograph Usage Authorization"}
              <h5 className="text-xs md:text-base">{`Step ${currentStep} / ${totalSteps}`}</h5>
            </div>
            {currentStep === 1 && (
              <ExistingInfoCheck
                isChildAlreadyEnrolled={isChildAlreadyEnrolled}
                setIsChildAlreadyEnrolled={setIsChildAlreadyEnrolled}
                values={values}
                fetchAllDocuments={fetchAllDocuments}
                fetchingData={fetchingData}
                existingData={existingData}
                selectedChild={selectedChild}
                setSelectedChild={setSelectedChild}
                setExistingData={setExistingData}
                nextStep={nextStep}
              />
            )}
            {currentStep === 2 && (
              <ChildAndGuardianInfo
                values={values}
                setFieldValue={setFieldValue}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}
            {currentStep === 3 && (
              <ProgramSelection
                values={values}
                nextStep={nextStep}
                prevStep={prevStep}
                setFieldValue={setFieldValue}
              />
            )}
            {currentStep === 4 && (
              <ChildHealthConditions
                values={values}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {currentStep === 5 && (
              <Authorization prevStep={prevStep} isSubmitting={isSubmitting} />
            )}
          </form>
        </FormikProvider>
      </div>
    </section>
  );
};

export default EnrolChild;
