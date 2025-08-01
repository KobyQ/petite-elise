/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import moment from "moment"
import { FormikProvider, useFormik } from "formik"
import { toast } from "react-toastify"
import supabase from "@/utils/supabaseClient"
import type { IEnrollChild } from "@/utils/interfaces"
import { enrollChildSchema } from "@/utils/validations"
import ExistingInfoCheck from "@/components/admission/ExistingInfoCheck"
import ChildAndGuardianInfo from "@/components/admission/ChildAndGuardianInfo"
import ClubChildHealthConditions from "@/components/admission/ClubChildHealthConditions"
import EnrollmentSuccess from "@/components/admission/EnrollmentSuccess"
import ClubAuthorization from "@/components/admission/ClubAuthorization"
import { sendRegistrationEmail } from "@/utils/helper"
import { formatMoneyToCedis } from "@/utils/constants"
import SummerCampProgramSelection from "@/components/admission/SummerCampProgramSelection"

const SummerCampRegistration = () => {
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [siblings, setSiblings] = useState<IEnrollChild[]>([])
  const [finalSiblings, setFinalSiblings] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isChildAlreadyEnrolled, setIsChildAlreadyEnrolled] = useState<string>("")
  const [existingData, setExistingData] = useState<any>(null)
  const [fetchingData, setFetchingData] = useState<boolean>(false)
  const [selectedChild, setSelectedChild] = useState<any>(null)
  const [isEnrollmentSuccessful, setIsEnrollmentSuccessful] = useState<boolean>(false)
  const [searchStatus, setSearchStatus] = useState<{
    emailFound: boolean
    phoneFound: boolean
  } | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string>("")
  const [isPaymentInitiated, setIsPaymentInitiated] = useState<boolean>(false)
  const [submittingPayment, setSubmittingPayment] = useState<boolean>(false)
  const [selectedPricing, setSelectedPricing] = useState<any>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  const fetchPricingForSchedule = async (schedule: string) => {
    try {
      const { data, error } = await supabase
        .from("program_pricing")
        .select("*")
        .eq("program_name", "Summer Camp")
        .eq("schedule", schedule)
        .single()

      if (error) {
        console.error("Error fetching pricing:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error fetching pricing:", error)
      return null
    }
  }

  const fetchAllDocuments = async (parentEmail: string, parentPhoneNumber: string) => {
    try {
      setFetchingData(true)
      setSelectedChild(null)
      setSearchStatus(null)

      // First try with strict AND condition for security
      const { data: strictData, error: strictError } = await supabase
        .from("children")
        .select("*")
        .eq("parentEmail", parentEmail)
        .eq("parentPhoneNumber", parentPhoneNumber)


      if (strictError) {
        throw strictError
      }

      // If we found records with the strict query, use those
      if (strictData && strictData.length > 0) {
        setExistingData(strictData)
        return
      }

      // If no records found with strict query, check if email exists
      const { data: emailData, error: emailError } = await supabase
        .from("children")
        .select("id")
        .eq("parentEmail", parentEmail)
        .limit(1)

      if (emailError) {
        console.error("Error checking email:", emailError)
      }

      // Check if phone number exists
      const { data: phoneData, error: phoneError } = await supabase
        .from("children")
        .select("id")
        .eq("parentPhoneNumber", parentPhoneNumber)
        .limit(1)

      if (phoneError) {
        console.error("Error checking phone:", phoneError)
      }

      // Set search status based on what was found - fix the type error by ensuring boolean values
      setSearchStatus({
        emailFound: Boolean(emailData && emailData.length > 0),
        phoneFound: Boolean(phoneData && phoneData.length > 0),
      })

      // Set empty array for the main results
      setExistingData([])
     
    } catch (err) {
      console.error("Error fetching documents:", err)
      toast.error("Failed to fetch child records. Please try again.")
      setExistingData([])
    } finally {
      setFetchingData(false)
    }
  }

  const formik = useFormik<IEnrollChild>({
    initialValues: {
      familyId: selectedChild?.familyId || familyId,
      childName: selectedChild?.childName || "",
      childDOB: selectedChild?.childDOB ? moment(selectedChild.childDOB).format("YYYY-MM-DD") : "",
      childAge: selectedChild?.childAge || "",
      parentName: selectedChild?.parentName || "",
      parentEmail: selectedChild?.parentEmail || "",
      parentPhoneNumber: selectedChild?.parentPhoneNumber || "",
      parentWhatsappNumber: selectedChild?.parentWhatsappNumber || "",
      address: selectedChild?.address || "",
      emergencyContactName: selectedChild?.emergencyContactName || "",
      emergencyContactPhoneNumber: selectedChild?.emergencyContactPhoneNumber || "",
      emergencyContactWhatsappNumber: selectedChild?.emergencyContactWhatsappNumber || "",
      emergencyContactRelationshipToChild: selectedChild?.emergencyContactRelationshipToChild || "",
      dropChildOffSelf: selectedChild?.dropChildOffSelf || "",
      dropOffNames: selectedChild?.dropOffNames || [{ name: "", relationToChild: "" }],
      programs: selectedChild?.programs || [],
      saturdayClubSchedule: selectedChild?.saturdayClubSchedule || "",
      summerCampSchedule: selectedChild?.summerCampSchedule || "",
      hasSibling: selectedChild?.hasSibling || "",
      hasAllergies: selectedChild?.hasAllergies || "",
      allergies: selectedChild?.allergies || [],
      hasSpecialHealthConditions: selectedChild?.hasSpecialHealthConditions || "",
      specialHealthConditions: selectedChild?.specialHealthConditions || [],
      photographUsageConsent: selectedChild?.photographUsageConsent || "",
    },
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      try {
        const childData = { ...values }

        if (values.hasSibling === "true") {
          // Add child to siblings and reset form
          setSiblings((prev: any) => [...prev, childData])

          setFieldValue("childName", "")
          setFieldValue("childDOB", "")
          setFieldValue("childAge", "")
          setFieldValue("hasSibling", "")

          setCurrentStep(1)
          toast.success("Child added successfully. You can enroll another child.")
        } else {
          // Fetch pricing for the selected schedule
          const pricing = await fetchPricingForSchedule(values.summerCampSchedule || "")
          if (!pricing) {
            toast.error("Unable to fetch pricing information. Please try again.")
            return
          }

          setSelectedPricing(pricing)

          // Prepare registration data for payment (don't save to children table yet)
          const registrationData = {
            ...values,
            familyId,
            pricing_id: pricing.id,
            program_type: "Summer Camp",
          }

          // Initiate payment first - registration will be saved only after payment verification
          setSubmittingPayment(true)
          const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.parentEmail,
              amount: pricing.price, // Already in pesewas from database
              callback_url: `${window.location.origin}/summer-camp-registration/verify`,
            }),
          })

          const result = await response.json()

          if (!result.status) {
            throw new Error(result.message || "Failed to initialize payment")
          }

          // Save transaction to our database
          const { error: dbError } = await supabase.from("transactions").insert({
            amount: pricing.price / 100, // Convert back to cedis for storage
            reference: result.data.reference,
            paystack_response: result,
            status: "pending",
            details: registrationData,
            order_id: `SUMMER-${Date.now()}`,
          })

          if (dbError) {
            throw new Error(`Failed to save transaction: ${dbError.message}`)
          }

          setPaymentUrl(result.data.authorization_url)
          setIsPaymentInitiated(true)
          toast.success("Payment initiated successfully! Please complete your payment to secure your registration.")
          
          // Scroll to top when payment screen is shown
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch (error: any) {
        toast.error(`An error occurred: ${error?.message}`)
      } finally {
        setSubmitting(false)
        setSubmittingPayment(false)
      }
    },
    enableReinitialize: true,
    validationSchema: enrollChildSchema,
  })

  if (isPaymentInitiated && paymentUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Initiated!</h2>
          <p className="text-gray-600 mb-6">
            Your registration is almost complete! Please complete your payment to secure your child&apos;s spot.
          </p>

          {selectedPricing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Selected Plan:</h4>
              <p className="text-blue-700">
                <strong>{selectedPricing.schedule}</strong> - {formatMoneyToCedis(selectedPricing.price)}
              </p>
            </div>
          )}

          {/* Payment button */}
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-300 inline-block flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Continue with Paystack</span>
          </a>

          <p className="text-sm text-gray-500 mt-4">
            You will be redirected to Paystack to complete your payment securely.
          </p>

          {/* Important notice */}
          <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4">
            <p className="text-sm text-amber-700">
              Your registration is not confirmed until payment is received. If you have any questions, please contact our
              support team.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isEnrollmentSuccessful) {
    return <EnrollmentSuccess enrolledChildren={finalSiblings} />
  }

  const { values, errors, setFieldValue, handleSubmit, isSubmitting } = formik

  const totalSteps = 5

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1)
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1)

  return (
    <section
      id="enroll-child"
      className="py-12 md:py-20 bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] text-[#2d3d3d] animate-fadeIn"
    >
      <div className="max-w-5xl mx-auto px-2 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">Summer Camp Registration</h2>
          <p className="mt-4 text-md md:text-lg text-gray-600">
            Fill out the form below to get started on your child&apos;s amazing journey with us!
          </p>
        </div>
        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit} className="bg-white p-4 md:p-10 rounded-3xl shadow-lg">
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
                searchStatus={searchStatus}
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
              <SummerCampProgramSelection
                values={values}
                nextStep={nextStep}
                prevStep={prevStep}
                setFieldValue={setFieldValue}
              />
            )}
            {currentStep === 4 && <ClubChildHealthConditions values={values} nextStep={nextStep} prevStep={prevStep} />}
            {currentStep === 5 && (
              <ClubAuthorization values={values} errors={errors} prevStep={prevStep} isSubmitting={isSubmitting || submittingPayment} />
            )}
          </form>
        </FormikProvider>
      </div>
    </section>
  )
}

export default SummerCampRegistration
