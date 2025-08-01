"use client";

import { Suspense } from "react";
import FeePaymentContent from "./FeePaymentContent";

export default function FeePayment() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment page...</p>
        </div>
      </div>
    }>
      <FeePaymentContent />
    </Suspense>
  );
} 