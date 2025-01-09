/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { FormikProvider, useFormik } from "formik";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import { IEnrollChild } from "@/utils/interfaces";
import { enrollChildSchema } from "@/utils/validations";
import ExistingInfoCheck from "@/components/admission/ExistingInfoCheck";
import ChildAndGuardianInfo from "@/components/admission/ChildAndGuardianInfo";
import Authorization from "@/components/admission/Authorization";
import ClubProgramSelection from "@/components/admission/ClubProgramSelection";
import ClubChildHealthConditions from "@/components/admission/ClubChildHealthConditions";
import EnrollmentSuccess from "@/components/admission/EnrollmentSuccess";
import ClubAuthorization from "@/components/admission/ClubAuthorization";

const JoinOurClub = () => {
    const [familyId, setFamilyId] = useState<string | null>(null);
    const [siblings, setSiblings] = useState<IEnrollChild[]>([]);
    const [finalSiblings, setFinalSiblings] = useState<any[]>([]);
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
      familyId: selectedChild?.familyId || familyId,
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
      saturdayClubSchedule: selectedChild?.saturdayClubSchedule || "",
      summerCampSchedule: selectedChild?.summerCampSchedule || "",
      hasSibling: selectedChild?.hasSibling || "",
      hasAllergies: selectedChild?.hasAllergies || "",
      allergies: selectedChild?.allergies || [],
      hasSpecialHealthConditions:
        selectedChild?.hasSpecialHealthConditions || "",
      specialHealthConditions: selectedChild?.specialHealthConditions || [],
      photographUsageConsent: selectedChild?.photographUsageConsent || "",
    },
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      try {
        const childData = { ...values};
     
    
        if (values.hasSibling === true) {
          // Add child to siblings and reset form
          setSiblings((prev: any) => [...prev, childData]);
    
          setFieldValue("childName", "");
          setFieldValue("childDOB", "");
          setFieldValue("childAge", "");
          setFieldValue("hasSibling", "");
    
          setCurrentStep(1);
          toast.success("Child added successfully. You can enroll another child.");
          console.log("siblings", siblings)
        } else {
          const allSiblings = [...siblings, values ]
          console.log("allSiblings", allSiblings)
          // Submit all siblings together
          const siblingsWithFamilyId = allSiblings?.map((sibling) => ({
            ...sibling,
            familyId,
          }));
          const { error } = await supabase
            .from("children")
            .insert(siblingsWithFamilyId);
          if (error) throw error;
    
          toast.success("Enrollment complete!");
          setFinalSiblings(siblingsWithFamilyId)
          setSiblings([]);
          setFamilyId(null);
          setIsEnrollmentSuccessful(true);
        }
      } catch (error: any) {
        console.log("error", error)
        toast.error(`An error occurred: ${error?.message}`);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
    validationSchema: enrollChildSchema,
  });

  if (isEnrollmentSuccessful) {
    return <EnrollmentSuccess enrolledChildren={finalSiblings} />;
  }

  const { values, errors, setFieldValue, handleSubmit, isSubmitting } = formik;

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
            Join our Building Blocks Club
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
                      ? "Health Conditions and Allergies"
                      : "Photograph Usage Authorization"}
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
              <ClubProgramSelection
                values={values}
                nextStep={nextStep}
                prevStep={prevStep}
                setFieldValue={setFieldValue}
              />
            )}
            {currentStep === 4 && (
              <ClubChildHealthConditions
                values={values}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {currentStep === 5 && (
              <ClubAuthorization
                values={values}
                errors={errors}
                prevStep={prevStep}
                isSubmitting={isSubmitting}
              />
            )}
          </form>
        </FormikProvider>
      </div>
    </section>
  );
};

export default JoinOurClub;
