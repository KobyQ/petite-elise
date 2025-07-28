"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import supabase from "@/utils/supabaseClient"
import { formatMoneyToCedis } from "@/utils/constants"
import Link from "next/link"

const VerifyPage = () => {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registration, setRegistration] = useState<any>(null)
  const [emailSent, setEmailSent] = useState(false)

  const ref = searchParams.get("reference")

  useEffect(() => {
    async function verifyTransaction() {
      try {
        if (!ref) {
          setError("No reference provided")
          setLoading(false)
          return
        }

        // Fetch transaction data
        const { data: transaction, error: transactionError } = await supabase
          .from("transactions")
          .select("*")
          .eq("reference", ref)
          .single()

        if (transactionError || !transaction) {
          setError(transactionError?.message || "Transaction not found")
          setLoading(false)
          return
        }

        // Check if registration already exists
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

          // Send confirmation email if not already sent
          if (!emailSent) {
            try {
              const emailData = {
                childName: registrationData.childName,
                parentEmail: registrationData.parentEmail,
                parentPhoneNumber: registrationData.parentPhoneNumber,
                childDOB: registrationData.childDOB,
              }

              await fetch("/api/contact", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: registrationData.parentName,
                  email: registrationData.parentEmail,
                  message: `Registration confirmed for ${registrationData.childName} in Saturday Kids Club. Payment reference: ${ref}`,
                }),
              })

              setEmailSent(true)
            } catch (emailError) {
              console.error("Email sending error:", emailError)
            }
          }

          setLoading(false)
        } else {
          // If registration not found, retry after delay
          setTimeout(() => {
            verifyTransaction()
          }, 5000)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        setLoading(false)
      }
    }

    verifyTransaction()
  }, [ref, emailSent])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Payment</h2>
          <p className="text-gray-600 mb-6">
            We're processing your payment and completing your registration. Please don't close this page.
          </p>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Verifying payment...</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${emailSent ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span>{emailSent ? "Confirmation sent" : "Preparing confirmation..."}</span>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            Reference: {ref}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>

          <div className="space-y-3">
            <Link
              href="/saturday-kids-club"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
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
    <div className="min-h-screen bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Complete!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for registering your child for Saturday Kids Club. Your payment has been confirmed.
        </p>

        {registration && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-blue-800 mb-2">Registration Details:</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p><strong>Child:</strong> {registration.childName}</p>
              <p><strong>Parent:</strong> {registration.parentName}</p>
              <p><strong>Email:</strong> {registration.parentEmail}</p>
              <p><strong>Program:</strong> Saturday Kids Club</p>
              <p><strong>Schedule:</strong> {registration.saturdayClubSchedule}</p>
              <p><strong>Reference:</strong> {registration.reference}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
          >
            Return Home
          </Link>
          <Link
            href="/building-blocks-club"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
          >
            View Other Programs
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  )
}

export default VerifyPage 