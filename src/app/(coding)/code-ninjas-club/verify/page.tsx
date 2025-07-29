"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import supabase from "@/utils/supabaseClient"
import { formatMoneyToCedis } from "@/utils/constants"
import Link from "next/link"

interface RegistrationData {
  childName: string;
  parentName: string;
  email: string;
  schedule: string;
  reference: string;
}

const VerifyPageContent = () => {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 10 // Maximum 10 retries

  const ref = searchParams.get("reference")

  useEffect(() => {
    async function verifyTransaction() {
      try {
        if (!ref) {
          setError("No reference provided")
          setLoading(false)
          return
        }

        if (retryCount >= MAX_RETRIES) {
          setError("Payment verification is taking longer than expected. Please contact support.")
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

        // Check if registration exists (webhook should have created it)
        const { data: registrationData, error: registrationError } = await supabase
          .from("code-ninjas")
          .select("*")
          .eq("reference", ref)
          .maybeSingle()

        if (registrationError) {
          setError(registrationError.message)
          setLoading(false)
          return
        }

        if (registrationData) {
          setRegistration(registrationData)

          // Try to send confirmation email, but don't block the success page
          if (!emailSent) {
            try {
              await fetch("/api/contact", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: registrationData.parentName,
                  email: registrationData.email,
                  message: `Registration confirmed for ${registrationData.childName} in Code Ninjas Club. Payment reference: ${ref}`,
                }),
              })

              setEmailSent(true)
            } catch (emailError) {
              console.error("Email sending error:", emailError)
              // Don't fail the page if email fails - just log the error
            }
          }

          setLoading(false)
        } else {
          // Registration not found, retry after longer delay
          setRetryCount(prev => prev + 1)
          const timeout = setTimeout(() => {
            verifyTransaction()
          }, 5000) // Increased to 5 seconds
          setRetryTimeout(timeout)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        setLoading(false)
      }
    }

    verifyTransaction()

    // Cleanup timeout on unmount
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [ref, emailSent, retryTimeout, retryCount])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Verifying Payment</h2>
          <p className="text-gray-400 mb-6">
            We&apos;re processing your payment and completing your registration. Please don&apos;t close this page.
          </p>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
              <span>Verifying payment... (Attempt {retryCount + 1}/{MAX_RETRIES})</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${emailSent ? "bg-lime-500" : "bg-gray-600"}`}></div>
              <span>{emailSent ? "Confirmation sent" : "Preparing confirmation..."}</span>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-600">
            Reference: {ref}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Payment Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>

          <div className="space-y-3">
            <Link
              href="/code-ninjas-club/register"
              className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-lime-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Registration Complete!</h2>
        <p className="text-gray-400 mb-6">
          Thank you for registering your child for Code Ninjas Club. Your payment has been confirmed.
        </p>

        {registration && (
          <div className="bg-zinc-800 border border-lime-500/30 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-lime-500 mb-2">Registration Details:</h4>
            <div className="space-y-1 text-sm text-gray-300">
              <p><strong>Child:</strong> {registration.childName}</p>
              <p><strong>Parent:</strong> {registration.parentName}</p>
              <p><strong>Email:</strong> {registration.email}</p>
              <p><strong>Program:</strong> Code Ninjas Club</p>
              <p><strong>Schedule:</strong> {registration.schedule}</p>
              <p><strong>Reference:</strong> {registration.reference}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
          >
            Return Home
          </Link>
          <Link
            href="/code-ninjas-club"
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 inline-block"
          >
            View Code Ninjas Club
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  )
}

const VerifyPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
          <p className="text-gray-400">Please wait while we load the verification page.</p>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  )
}

export default VerifyPage 