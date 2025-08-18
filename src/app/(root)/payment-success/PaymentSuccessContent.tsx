"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { formatMoneyToCedis } from "@/utils/constants";

interface PaymentDetails {
  reference: string;
  amount: number;
  email: string;
  program: string;
  created_at: string;
  status: string;
}

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    const paymentReference = reference || trxref;
    if (paymentReference) {
      // Fetch payment details from the database
      fetchPaymentDetails(paymentReference);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchPaymentDetails = async (reference: string) => {
    try {
      const response = await fetch(`/api/payment-details?reference=${reference}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentDetails(data);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <FiCheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for your payment. Your transaction has been completed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {paymentDetails && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reference</p>
                    <p className="text-gray-900">{paymentDetails.reference}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Amount</p>
                    <p className="text-gray-900">{formatMoneyToCedis(paymentDetails.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Program</p>
                    <p className="text-gray-900">{paymentDetails.program}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="text-gray-900">
                      {new Date(paymentDetails.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary hover:bg-opacity-90">
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/programs">View Programs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 