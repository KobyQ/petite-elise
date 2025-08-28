/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import moment from "moment"
import { v4 as uuidv4 } from "uuid"
import { FormikProvider, useFormik } from "formik"
import { toast } from "react-toastify"
import supabase from "@/utils/supabaseClient"
import type { IEnrollChild } from "@/utils/interfaces"
import { enrollChildSchema } from "@/utils/validations"
import ExistingInfoCheck from "@/components/admission/ExistingInfoCheck"
import ChildAndGuardianInfo from "@/components/admission/ChildAndGuardianInfo"
import ChildMindingProgramSelection from "@/components/admission/ChildMindingProgramSelection"
import ChildHealthConditions from "@/components/admission/ChildHealthConditions"
import EnrollmentSuccess from "@/components/admission/EnrollmentSuccess"
import ClubAuthorization from "@/components/admission/ClubAuthorization"
import { sendRegistrationEmail } from "@/utils/helper"
import { formatMoneyToCedis } from "@/utils/constants"

const ChildMindingRegistration = () => {
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
  const [discountCode, setDiscountCode] = useState<string>("")
  const [discountData, setDiscountData] = useState<any>(null)
  const [validatingDiscount, setValidatingDiscount] = useState<boolean>(false)
  const [finalAmount, setFinalAmount] = useState<number>(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  // Generate familyId on component mount
  useEffect(() => {
    if (!familyId) {
      setFamilyId(uuidv4())
    }
  }, [familyId])

  const fetchPricingForSchedule = async (schedule: string) => {
    try {
      const { data, error } = await supabase
        .from("program_pricing")
        .select("*")
        .eq("program_name", "Childminding")
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

  const validateDiscountCode = async (code: string) => {
    if (!code.trim()) {
      setDiscountData(null)
      return
    }

    setValidatingDiscount(true)
    try {
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("discount_code", code.trim().toUpperCase())
        .eq("is_active", true)
        .single()

      if (error || !data) {
        toast.error("Invalid or inactive discount code")
        setDiscountData(null)
        return
      }

      setDiscountData(data)
      toast.success(`Discount code applied! ${data.discount_percentage}% off`)
    } catch (error) {
      console.error("Error validating discount code:", error)
      toast.error("Error validating discount code")
      setDiscountData(null)
    } finally {
      setValidatingDiscount(false)
    }
  }

  const calculateFinalAmount = (originalPrice: number, discount: any) => {
    if (!discount) return originalPrice
    const discountAmount = (originalPrice * discount.discount_percentage) / 100
    return originalPrice - discountAmount
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
      // Ensure only programs relevant to this page are pre-selected
      programs:
        (() => {
          const allowedPrograms = ["Childminding"]
          const fromSelected = (selectedChild?.programs || []).filter((p: string) =>
            allowedPrograms.includes(p)
          )
          return fromSelected.length ? fromSelected : ["Childminding"]
        })(),
      childMindingSchedule: selectedChild?.childMindingSchedule || [],
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
          // Add child to siblings and reset form for next child
          setSiblings((prev: any) => [...prev, childData])

          // Reset form for next child (discount code remains applied)
          setFieldValue("childName", "")
          setFieldValue("childDOB", "")
          setFieldValue("childAge", "")
          setFieldValue("childMindingSchedule", "")
          setFieldValue("hasSibling", "")
          setFieldValue("hasAllergies", "")
          setFieldValue("allergies", [])
          setFieldValue("hasSpecialHealthConditions", "")
          setFieldValue("specialHealthConditions", [])
          setFieldValue("photographUsageConsent", "")

          setCurrentStep(1)
          toast.success("Child added successfully. Please fill in details for the next child.")
        } else {
          // Final submission - process all siblings including current child
          const allChildren = [...siblings, childData]
          
          if (allChildren.length === 0) {
            toast.error("No children to register")
            return
          }

          // Validate that all children have schedules selected
          const childrenWithoutSchedules = allChildren.filter(child => !child.childMindingSchedule)
          if (childrenWithoutSchedules.length > 0) {
            toast.error("All children must have schedules selected")
            return
          }

          // Calculate total amount for all children
          let totalOriginalAmount = 0
          const childrenWithPricing = []

          for (const child of allChildren) {
            if (!child.childMindingSchedule) continue
            const pricing = await fetchPricingForSchedule(child.childMindingSchedule)
            if (!pricing) {
              toast.error(`Unable to fetch pricing for ${child.childName}'s schedule. Please try again.`)
              return
            }
            
            const childAmount = pricing.price / 100 // Convert to cedis
            totalOriginalAmount += childAmount
            childrenWithPricing.push({ ...child, pricing, amount: childAmount })
          }

          // Apply discount to total amount (not per child)
          // One discount code applies to the total cost for all children
          const finalAmountInCedis = calculateFinalAmount(totalOriginalAmount, discountData)
          const finalAmountInPesewas = Math.round(finalAmountInCedis * 100) // Convert back to pesewas
          setFinalAmount(finalAmountInCedis)

          // Store children data for payment verification
          const registrationData = {
            children: childrenWithPricing,
            familyId,
            discount_code: discountCode.trim().toUpperCase() || null,
            discount_data: discountData,
            original_amount: totalOriginalAmount,
            discount_amount: discountData ? (totalOriginalAmount * discountData.discount_percentage) / 100 : 0,
            final_amount: finalAmountInCedis,
            program_type: "Childminding",
          }

          // Initiate payment
          setSubmittingPayment(true)
          const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.parentEmail,
              amount: finalAmountInPesewas,
              callback_url: `${window.location.origin}/childminding-registration/verify`,
            }),
          })

          const result = await response.json()

          if (!result.status) {
            throw new Error(result.message || "Failed to initialize payment")
          }

          // Save transaction to database
          const { error: dbError } = await supabase.from("transactions").insert({
            amount: finalAmountInPesewas,
            reference: result.data.reference,
            paystack_response: result,
            status: "pending",
            details: registrationData,
            order_id: `CHILDMINDING-${Date.now()}`,
          })

          if (dbError) {
            throw new Error(`Failed to save transaction: ${dbError.message}`)
          }

          setPaymentUrl(result.data.authorization_url)
          setIsPaymentInitiated(true)
          toast.success("Payment initiated successfully! Please complete your payment to secure your registrations.")

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
            Your registration is almost complete! Please complete your payment to secure your children&apos;s spots.
          </p>

          {/* Show summary of all children */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Registration Summary:</h4>
            {siblings.length > 0 && (
              <div className="space-y-2 text-sm">
                {siblings.map((child, index) => (
                  <div key={index} className="flex justify-between text-blue-700">
                    <span>{child.childName}:</span>
                    <span>{child.childMindingSchedule}</span>
                  </div>
                ))}
                <div className="flex justify-between text-blue-700">
                  <span>{formik.values.childName}:</span>
                  <span>{formik.values.childMindingSchedule}</span>
                </div>
              </div>
            )}
            
            {discountData ? (
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Original Total:</span>
                  <span className="line-through text-gray-500">{formatMoneyToCedis(Math.round(finalAmount * 100 / (1 - discountData.discount_percentage / 100)))}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Discount ({discountData.discount_percentage}%):</span>
                  <span>-{formatMoneyToCedis(Math.round((finalAmount * 100 / (1 - discountData.discount_percentage / 100)) * (discountData.discount_percentage / 100)))}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">{formatMoneyToCedis(Math.round(finalAmount * 100))}</span>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  Discount code &ldquo;{discountCode.toUpperCase()}&rdquo; applied!
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <span className="font-semibold text-lg">{formatMoneyToCedis(Math.round(finalAmount * 100))}</span>
              </div>
            )}
          </div>

          {/* Payment button */}
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
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
          <h2 className="text-3xl md:text-4xl font-extrabold"> Childminding Program Registration</h2>
          <p className="mt-4 text-md md:text-lg text-gray-600">
            Fill out the form below to get started on your child&apos;s amazing journey with us!
          </p>
          
          {/* Show enrolled siblings count */}
          {siblings.length > 0 && (
            <div className="mt-4 bg-blue-100 border border-blue-300 rounded-lg p-3 inline-block">
              <p className="text-blue-800 font-medium">
                {siblings.length} child{siblings.length > 1 ? 'ren' : ''} already added. 
                {siblings.length === 1 ? ' Add one more child or complete registration.' : ' Complete registration.'}
              </p>
            </div>
          )}
        </div>
        
        <FormikProvider value={formik}>
          <form onSubmit={handleSubmit} className="bg-white p-4 md:p-10 rounded-3xl shadow-lg">
            <div className="flex justify-between w-full font-bold">
              {currentStep === 1
                ? "Existing Child Check"
                : currentStep === 2
                  ? "Child and Guardian Information"
                  : currentStep === 3
                    ? "Schedule Selection"
                    : currentStep === 4
                      ? "Health Conditions and Allergies"
                      : "Photograph Usage Authorization"}
              <h5 className="text-xs md:text-base">{`Step ${currentStep} / ${totalSteps}`}</h5>
            </div>
            
            {/* Show enrolled siblings summary */}
            {siblings.length > 0 && currentStep > 1 && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Enrolled Children:</h4>
                <div className="space-y-1 text-sm">
                  {siblings.map((child, index) => (
                    <div key={index} className="flex justify-between text-green-700">
                      <span>{child.childName}</span>
                      <span className="font-medium">{child.childMindingSchedule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
              <ChildMindingProgramSelection
                values={values}
                nextStep={nextStep}
                prevStep={prevStep}
                setFieldValue={setFieldValue}
              />
            )}
            {currentStep === 4 && <ChildHealthConditions values={values} nextStep={nextStep} prevStep={prevStep} />}
            {currentStep === 5 && (
              <div>
                {/* Discount Code Section */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Discount Code (Optional)</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Note: Discount code applies to the total amount for all children being registered.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="Enter discount code"
                        className="w-full border rounded p-3 text-sm"
                        disabled={validatingDiscount}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => validateDiscountCode(discountCode)}
                      disabled={!discountCode.trim() || validatingDiscount}
                      className="px-6 py-3 bg-primary text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {validatingDiscount ? "Checking..." : "Apply"}
                    </button>
                  </div>
                  
                  {discountData && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Discount Applied: {discountData.discount_percentage}% off</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">Code: {discountData.discount_code}</p>
                      <p className="text-green-700 text-sm mt-1">
                        This discount will be applied to the total cost for all children.
                      </p>
                    </div>
                  )}
                </div>

                <ClubAuthorization errors={errors} values={values} prevStep={prevStep} isSubmitting={isSubmitting || submittingPayment} />
              </div>
            )}
          </form>
        </FormikProvider>
      </div>
    </section>
  )
}

export default ChildMindingRegistration
