/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import supabase from "@/utils/supabaseClient"
import { LuLoader, LuTriangleAlert } from "react-icons/lu"
import { IoHome } from "react-icons/io5"
import { BsArrowLeft } from "react-icons/bs"

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

  const ref = searchParams.get("reference")

  useEffect(() => {
    async function verifyTransaction() {
      try {
        if (!ref) {
          setError("No reference provided")
          setLoading(false)
          return
        }

        console.log("Verifying transaction with reference:", ref)

        // Fetch transaction data
        const { data: transaction, error: transactionError } = await supabase
          .from("transactions")
          .select("*")
          .eq("reference", ref)
          .single()

        if (transactionError || !transaction) {
          console.error("Transaction error:", transactionError)
          setError(transactionError?.message || "Transaction not found")
          setLoading(false)
          return
        }

        console.log("Transaction found:", transaction)

        // Check if transaction is successful
        if (transaction.status !== "success") {
          console.log("Transaction status:", transaction.status)
          // If transaction is still pending, retry after delay
          setTimeout(() => {
            verifyTransaction()
          }, 5000) // Reduced delay to 5 seconds
          return
        }

        // Look for registration in code-ninjas table
        const { data: registrationData, error: registrationError } = await supabase
          .from("code-ninjas")
          .select("*")
          .eq("reference", ref)
          .maybeSingle()

        console.log("Registration lookup result:", { registrationData, registrationError })

        if (registrationError && registrationError.code !== "PGRST116") {
          console.error("Registration lookup error:", registrationError)
          setError(registrationError.message)
          setLoading(false)
          return
        }
  
        if (registrationData) {
          console.log("Registration found:", registrationData)
          setRegistration(registrationData)
          setLoading(false)
        } else {
          console.log("Registration not found, retrying...")
          // If registration not found, retry after delay
          setTimeout(() => {
            verifyTransaction()
          }, 5000) // Reduced delay to 5 seconds
        }
      } catch (error) {
        console.error("Verification error:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        setLoading(false)
      }
    }

    verifyTransaction()
  }, [ref])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 md:top-20 md:right-20 w-32 h-32 md:w-64 md:h-64 bg-lime-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-32 h-32 md:w-64 md:h-64 bg-zinc-800/50 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900 rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 max-w-md w-full text-center border border-lime-500/30 relative z-10"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-lime-500/30 border-t-lime-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <LuLoader className="w-8 h-8 md:w-10 md:h-10 text-lime-500 animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            Verifying Your Code Ninjas Registration
          </h2>

          <div className="space-y-2 md:space-y-4 mb-6 md:mb-8">
            <p className="text-sm md:text-base text-gray-300">
              We&apos;re currently processing your transaction and preparing your Code Ninjas registration details.
            </p>
            <p className="text-sm md:text-base text-gray-300">
              This usually takes less than a minute. Please don&apos;t close this page.
            </p>
          </div>

          <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
            <div className="flex items-center justify-center gap-2 p-2 md:p-3 bg-zinc-800 rounded-lg md:rounded-xl">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-lime-500 animate-pulse"></div>
              <span className="text-white">Verifying payment...</span>
            </div>
          </div>

          <div className="mt-6 md:mt-8 text-xs md:text-sm text-gray-400">
            <span className="font-medium">Reference:</span> {ref}
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900 rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 max-w-md w-full border border-red-500/30"
        >
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-full flex items-center justify-center">
              <LuTriangleAlert className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 text-center">
            Payment Verification Error
          </h2>
          <p className="text-center text-gray-300 mb-6 md:mb-8 text-sm md:text-base">{error}</p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link href="/" className="flex-1">
              <button className="w-full py-2.5 md:py-3 bg-lime-500 text-black rounded-xl font-medium hover:bg-lime-600 transition-all duration-300 flex items-center justify-center text-sm md:text-base">
                <IoHome className="mr-2 h-4 w-4" />
                Return to Homepage
              </button>
            </Link>

            <Link href="/code-ninjas-club/register" className="flex-1">
              <button className="w-full py-2.5 md:py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-all duration-300 flex items-center justify-center text-sm md:text-base">
                <BsArrowLeft className="mr-2 h-4 w-4" />
                Try Again
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-lime-500/30 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-lime-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Registration Complete!</h2>
        <p className="text-gray-300 mb-6">
          Thank you for registering your child for Code Ninjas Club. Your payment has been confirmed and your registration is complete.
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
          A confirmation email with your receipt has been sent to your registered email address.
        </p>
      </div>
    </div>
  )
}

const VerifyPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-zinc-900 rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 max-w-md w-full text-center border border-lime-500/30">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-lime-500/30 border-t-lime-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <LuLoader className="w-8 h-8 md:w-10 md:h-10 text-lime-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  )
}

export default VerifyPage 