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
      // First try to find the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("reference", reference)
        .single();

      if (transactionError || !transaction) {
        setError("Order not found");
        setLoading(false);
        return;
      }

      // Then try to find the shop order
      const { data: shopOrder, error: shopOrderError } = await supabase
        .from("shop_orders")
        .select("*")
        .eq("reference", reference)
        .single();

      if (shopOrderError || !shopOrder) {
        setError("Shop order details not found");
        setLoading(false);
        return;
      }

      setOrderDetails(shopOrder);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
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
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Return to Shop
            </Button>
          </Link>
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
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Return to Shop
            </Button>
          </Link>
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
                      {formatMoneyToCedis(item.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatMoneyToCedis(item.price)} each
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
                    <span>{formatMoneyToCedis(orderDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({orderDetails.discount_data.discount_percentage}%):</span>
                    <span>-{formatMoneyToCedis(orderDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0) - orderDetails.total_amount)}</span>
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
                <span className="text-primary">{formatMoneyToCedis(orderDetails.total_amount)}</span>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
              Download Receipt
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Need help? Contact us at{" "}
            <a href="mailto:support@petiteelise.com" className="text-primary hover:underline">
              support@petiteelise.com
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
