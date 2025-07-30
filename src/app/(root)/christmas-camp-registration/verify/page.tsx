"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import supabase from "@/utils/supabaseClient"
import Link from "next/link"

interface RegistrationData {
  childName: string;
  parentName: string;
  parentEmail: string;
  christmasCampSchedule: string;
  reference: string;
}

const VerifyPageContent = () => {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [processing, setProcessing] = useState(false)

  const ref = searchParams.get("reference")

  useEffect(() => {
    async function checkRegistration() {
      try {
        if (!ref) {
          setError("No reference provided")
          setLoading(false)
          return
        }

        // First, check if transaction exists and its status
        const { data: transaction, error: transactionError } = await supabase
          .from("transactions")
          .select("status, details")
          .eq("reference", ref)
          .single()

        if (transactionError || !transaction) {
          setError("Transaction not found. Please contact support if you believe this is an error.")
          setLoading(false)
          return
        }

        // If transaction is still pending, show processing message
        if (transaction.status === "pending") {
          setProcessing(true)
          setLoading(false)
          return
        }

        // If transaction is successful, fetch registration data
        if (transaction.status === "success") {
          // Fetch registration data from children table
          const { data: registrationData, error: registrationError } = await supabase
            .from("children")
            .select("*")
            .eq("reference", ref)
            .single()

          if (registrationError && registrationError.code !== "PGRST116") {
            setError(registrationError.message)
            setLoading(false)
            return
          }

          if (registrationData) {
            setRegistration(registrationData)
            setLoading(false)
          } else {
            // If registration not found, retry after delay
            setTimeout(() => {
              checkRegistration()
            }, 5000)
          }
        } else {
          setError("Payment was not successful. Please try again.")
          setLoading(false)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        setLoading(false)
      }
    }

    checkRegistration()
  }, [ref])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your registration details.</p>
        </div>
      </div>
    )
  }

  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Payment</h2>
          <p className="text-gray-600 mb-6">
            Your payment is being processed. This usually takes a few moments. Please wait while we complete your registration.
          </p>
          <p className="text-sm text-gray-500">
            Reference: {ref}
          </p>
          <div className="mt-6">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Check Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>

          <div className="space-y-3">
            <Link
              href="/christmas-camp-registration"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Complete!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for registering your child for Christmas Camp. Your payment has been confirmed and your registration is complete.
        </p>

        {registration && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-blue-800 mb-2">Registration Details:</h4>
            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Child:</strong> {registration.childName}</p>
              <p><strong>Parent:</strong> {registration.parentName}</p>
              <p><strong>Email:</strong> {registration.parentEmail}</p>
              <p><strong>Program:</strong> Christmas Camp</p>
              <p><strong>Schedule:</strong> {registration.christmasCampSchedule}</p>
              <p><strong>Reference:</strong> {registration.reference}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
          >
            Return Home
          </Link>
          <Link
            href="/programs"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
          >
            View Other Programs
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          A confirmation email with your receipt has been sent to your registered email address.
        </p>
      </div>
    </div>
  )
}

const VerifyPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while we load the verification page.</p>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  )
}

export default VerifyPage 