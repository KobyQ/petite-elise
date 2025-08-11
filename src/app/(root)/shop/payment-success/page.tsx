"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShoppingBag, FaEnvelope, FaPhone } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import supabase from "@/utils/supabaseClient";
import { formatMoneyToCedis } from "@/utils/constants";

interface OrderDetails {
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    images: string[];
  }>;
  total_amount: number;
  discount_code?: string;
  discount_data?: { discount_percentage: number; discount_amount: number };
  status: string;
  payment_date: string;
}

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 20; // Maximum 20 retries (60 seconds total)

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    if (reference || trxref) {
      fetchOrderDetails(reference || trxref || "");
    } else {
      setError("No payment reference found");
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (reference: string) => {
    try {
      // Check retry limit BEFORE making any API calls
      if (retryCount >= MAX_RETRIES) {
        console.log(`Max retries (${MAX_RETRIES}) reached, stopping retry loop`);
        setError("Order processing is taking longer than expected. Please contact support with your reference number.");
        setLoading(false);
        return;
      }

      console.log(`Attempt ${retryCount + 1}: Fetching order details for reference: ${reference}`);

      // First try to find the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("reference", reference)
        .single();

      if (transactionError || !transaction) {
        console.error("Transaction lookup error:", transactionError);
        setError("Order not found");
        setLoading(false);
        return;
      }

      console.log("Transaction found:", {
        status: transaction.status,
        order_id: transaction.order_id,
        amount: transaction.amount
      });

      // Check if transaction is successful
      if (transaction.status !== "success") {
        console.log(`Transaction status is ${transaction.status}, retrying in 3 seconds...`);
        // If transaction is still pending, retry after delay
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchOrderDetails(reference);
        }, 3000); // Retry every 3 seconds
        return;
      }

      console.log("Transaction is successful, looking for shop order...");

      // Then try to find the shop order
      const { data: shopOrder, error: shopOrderError } = await supabase
        .from("shop_orders")
        .select("*")
        .eq("reference", reference)
        .single();

      if (shopOrderError) {
        if (shopOrderError.code === "PGRST116") {
          console.log("Shop order not found yet (PGRST116), retrying in 3 seconds...");
          // Shop order not found yet, retry after delay (webhook might still be processing)
          setRetryCount(prev => prev + 1);
          // Check retry limit again before setting timeout
          if (retryCount + 1 >= MAX_RETRIES) {
            console.log(`Max retries (${MAX_RETRIES}) reached, stopping retry loop`);
            setError("Order processing is taking longer than expected. Please contact support with your reference number.");
            setLoading(false);
            return;
          }
          setTimeout(() => {
            fetchOrderDetails(reference);
          }, 3000); // Retry every 3 seconds
          return;
        } else {
          console.error("Shop order lookup error:", shopOrderError);
          setError(shopOrderError.message);
          setLoading(false);
          return;
        }
      }

      if (shopOrder) {
        console.log("Shop order found successfully:", shopOrder);
        setOrderDetails(shopOrder);
        setLoading(false);
      } else {
        console.log("Shop order not found, retrying in 3 seconds...");
        // If shop order not found, retry after delay
        setRetryCount(prev => prev + 1);
        // Check retry limit again before setting timeout
        if (retryCount + 1 >= MAX_RETRIES) {
          console.log(`Max retries (${MAX_RETRIES}) reached, stopping retry loop`);
          setError("Order processing is taking longer than expected. Please contact support with your reference number.");
          setLoading(false);
          return;
        }
        setTimeout(() => {
          fetchOrderDetails(reference);
        }, 3000); // Retry every 3 seconds
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to fetch order details");
      setLoading(false);
    }
  };

  // Manual fallback to create shop order if webhook failed
  const manuallyCreateShopOrder = async () => {
    // This function is no longer needed
    return;
  };

  if (loading) {
    const estimatedTimeLeft = Math.max(0, MAX_RETRIES - retryCount) * 3;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">Processing Your Order</h2>
          <p className="text-gray-600 mb-4">
            We&apos;re currently processing your payment and preparing your order details.
          </p>
          <p className="text-gray-600 text-sm mb-4">
            This usually takes less than a minute. Please don&apos;t close this page.
          </p>

          {/* Progress indicator */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(retryCount / MAX_RETRIES) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Attempt {retryCount + 1} of {MAX_RETRIES} • Est. {estimatedTimeLeft}s remaining
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Reference:</span> {searchParams.get("reference") || searchParams.get("trxref")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && error.includes("Order processing is taking longer than expected")) {
    // Show a helpful message with transaction details
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Processing Delayed</h1>
          <p className="text-gray-600 mb-6">
            Your payment was successful, but order processing is taking longer than expected.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Payment Confirmed:</h4>
            <div className="space-y-1 text-sm text-blue-700">
              <p><strong>Reference:</strong> {searchParams.get("reference") || searchParams.get("trxref")}</p>
              <p><strong>Status:</strong> Payment Successful</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Please contact support with your reference number if you need immediate assistance.
          </p>

          <div className="space-y-3">
            <Link href="/shop">
              <Button variant="outline" className="w-full">
                Return to Shop
              </Button>
            </Link>
            <p className="text-xs text-gray-400">
              Support: info@petiteelise.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>

          <div className="space-y-3">
            <Link href="/shop">
              <Button variant="outline" className="w-full">
                Return to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn&apos;t find your order details. Please contact support.</p>

          <div className="space-y-3">
            <Link href="/shop">
              <Button variant="outline" className="w-full">
                Return to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono font-semibold text-gray-900">{orderDetails.order_id}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <FaShoppingBag className="text-primary text-xl" />
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold text-gray-900">{orderDetails.customer_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-primary text-xl" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{orderDetails.customer_email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-primary text-xl" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">{orderDetails.customer_phone}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">📦</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatMoneyToCedis((item.price * item.quantity) * 100)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatMoneyToCedis(item.price * 100)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <div className="space-y-3">
              {orderDetails.discount_code && orderDetails.discount_data && (
                <>
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatMoneyToCedis(orderDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0) * 100)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({orderDetails.discount_data.discount_percentage}%):</span>
                    <span>-{formatMoneyToCedis((orderDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0) - orderDetails.total_amount) * 100)}</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 text-center">
                      Discount code &quot;{orderDetails.discount_code}&quot; applied!
                    </p>
                  </div>
                </>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span>Total:</span>
                <span className="text-primary">{formatMoneyToCedis(orderDetails.total_amount * 100)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-blue-800 mb-4">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Order Confirmation</h4>
              <p className="text-blue-700 text-sm">You&apos;ll receive an email confirmation with your order details</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Order Processing</h4>
              <p className="text-blue-700 text-sm">We&apos;ll process your order and prepare it for pickup or delivery</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Ready for Pickup</h4>
              <p className="text-blue-700 text-sm">We&apos;ll contact you when your order is ready for pickup</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Link href="/shop">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                Go Home
              </Button></Link>
          </div>
          <p className="text-sm text-gray-500">
            Need help? Contact us at{" "}
            <a href="mailto:info@petiteelise.com" className="text-primary hover:underline">
              info@petiteelise.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const PaymentSuccess = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccess;
