"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import { formatMoneyToCedis } from "@/utils/constants";
import { Button } from "@/components/ui/button";

interface FeeRequest {
  id: string;
  parent_name: string;
  email: string;
  phone_number: string;
  child_name: string;
  programs: string[];
  day_care_schedule?: string;
  additional_notes?: string;
  status: string;
  created_at: string;
  invoice_amount?: number;
  invoice_sent_at?: string;
}

export default function FeePaymentContent() {
  const searchParams = useSearchParams();
  const [feeRequest, setFeeRequest] = useState<FeeRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const requestId = searchParams.get("requestId");

  const fetchFeeRequest = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("fee_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (error) {
        console.error("Error fetching fee request:", error);
        toast.error("Fee request not found or has expired");
        return;
      }

      setFeeRequest(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while fetching the fee request");
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    if (requestId) {
      fetchFeeRequest();
    } else {
      setIsLoading(false);
    }
  }, [requestId, fetchFeeRequest]);

  const handlePayment = async () => {
    if (!feeRequest) return;

    setSubmittingPayment(true);

    try {
      // Generate Paystack payment link
      const paymentData = {
        email: feeRequest.email,
        amount: feeRequest.invoice_amount || 0, // Already in pesewas
        callback_url: `${window.location.origin}/fee-payment/verify`,
      };

      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!result.status || !result.data?.authorization_url) {
        throw new Error(result.message || "Failed to initialize payment");
      }

      // Save transaction to our database
      const { error: dbError } = await supabase.from("transactions").insert({
        amount: feeRequest.invoice_amount || 0, // Already in cedis
        reference: result.data.reference,
        paystack_response: result,
        status: "pending",
        details: {
          parentName: feeRequest.parent_name,
          childName: feeRequest.child_name,
          programs: feeRequest.programs,
          dayCareSchedule: feeRequest.day_care_schedule,
          program_type: "School Fees",
          request_id: feeRequest.id,
        },
        order_id: `FEE_${feeRequest.id}`,
      });

      if (dbError) {
        throw new Error(`Failed to save transaction: ${dbError.message}`);
      }

      // Redirect to Paystack authorization URL
      window.location.href = result.data.authorization_url;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`An error occurred: ${errorMessage}`);
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (!feeRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">
            The invoice you&apos;re looking for could not be found or may have expired.
          </p>
          
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-opacity-90 text-white"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffec89] to-[#a9e2a0] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            School Fees Payment
          </h1>
          <p className="text-lg text-gray-600">
            Review your invoice and complete your payment securely
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Invoice Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Invoice</h2>
                <p className="text-gray-600">
                  <strong>Parent:</strong> {feeRequest.parent_name}
                </p>
                <p className="text-gray-600">
                  <strong>Child:</strong> {feeRequest.child_name}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {feeRequest.email}
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-sm text-gray-500">Invoice Date</p>
                <p className="text-gray-800">
                  {new Date(feeRequest.invoice_sent_at || feeRequest.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">Invoice #</p>
                <p className="text-gray-800 font-mono">{feeRequest.id}</p>
              </div>
            </div>
          </div>

          {/* Programs and Schedule */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Programs & Schedule</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selected Programs</p>
                  <p className="text-gray-800">{feeRequest.programs.join(", ")}</p>
                </div>
                {feeRequest.day_care_schedule && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Daycare Schedule</p>
                    <p className="text-gray-800">{feeRequest.day_care_schedule}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {feeRequest.additional_notes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Notes</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-800">{feeRequest.additional_notes}</p>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatMoneyToCedis(feeRequest.invoice_amount || 0)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * Payment will be processed securely through Paystack
            </p>
          </div>

          {/* Payment Button */}
          <div className="text-center">
            <Button
              onClick={handlePayment}
              disabled={submittingPayment}
              className="bg-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-md transition-all duration-300 text-lg font-semibold"
            >
              {submittingPayment ? "Processing..." : "Pay Now"}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              You will be redirected to a secure payment page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 