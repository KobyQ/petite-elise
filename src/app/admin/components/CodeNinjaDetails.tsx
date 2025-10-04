/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Dialog, DialogContent } from "@/components/ui/modal";
import React, { useEffect, useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import supabase from "@/utils/supabaseClient";

const CodeNinjaDetails = ({
  isOpen,
  setIsOpen,
  data,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) => {
  const [transaction, setTransaction] = useState<any | null>(null);
  const [isTxnLoading, setIsTxnLoading] = useState<boolean>(false);
  const [txnError, setTxnError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!data?.reference) return;
      setIsTxnLoading(true);
      setTxnError(null);
      try {
        const { data: txn, error } = await supabase
          .from("transactions")
          .select("amount, details, reference, order_id")
          .eq("reference", data.reference)
          .maybeSingle();
        if (error) {
          setTxnError(error.message);
          setTransaction(null);
        } else {
          setTransaction(txn);
        }
      } catch (e: any) {
        setTxnError(e?.message || "Failed to load transaction");
        setTransaction(null);
      } finally {
        setIsTxnLoading(false);
      }
    };

    fetchTransaction();
  }, [data?.reference]);

  const computeAmountCedis = () => {
    if (!transaction) return null;
    // All amounts are now stored in pesewas, so convert to cedis for display
    if (typeof transaction?.amount === "number") return transaction.amount / 100;
    return null;
  };

  const paidAmount = computeAmountCedis();
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg relative">
          <h2 className="text-xl font-semibold text-center">Code Ninja Details</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Section */}
          <section className="border-b pb-6">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-4">
              <FaMoneyBillWave className="text-blue-500" />
              Payment
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Amount Paid:</strong>{" "}
                {isTxnLoading
                  ? "Loading..."
                  : paidAmount != null
                  ? `GHS ${paidAmount.toFixed(2)}`
                  : "N/A"}
              </p>
              <p>
                <strong>Reference:</strong> {data?.reference || "N/A"}
              </p>
            </div>
            {txnError && (
              <p className="text-red-600 text-sm mt-2">{txnError}</p>
            )}
          </section>

          {/* General Information */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Child Name</p>
              <p className="font-semibold text-lg">{data.childName}</p>
            </div>
            <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-semibold text-lg">{data?.dob || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="font-semibold text-lg">{data?.age || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Parent Name</p>
            <p className="font-semibold text-lg">{data.parentName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-lg">{data.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-semibold text-lg">{data.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Preferred Contact Mode</p>
            <p className="font-semibold text-lg">{data.contactMode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Has Coding Experience</p>
            <p className="font-semibold text-lg">{data.hasCodingExperience}</p>
          </div>
          {data.hasCodingExperience === "Yes" && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Coding Experience</p>
              <p className="font-semibold text-lg bg-gray-100 p-3 rounded-lg">
                {data.codingExperience || "No details provided"}
              </p>
            </div>
          )}
    
          <div>
            <p className="text-sm text-gray-500">Photograph Usage Consent</p>
            <p className="font-semibold text-lg">{data.photographUsageConsent}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Will Drop Off Child</p>
            <p className="font-semibold text-lg">{data.dropChildOffSelf}</p>
          </div>

          {data.dropChildOffSelf === "No" && data.dropOffNames?.length > 0 && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Authorized Drop-Off Persons</p>
              <ul className="bg-gray-100 p-3 rounded-lg">
                {data.dropOffNames.map((person: any, index: number) => (
                  <li key={index} className="font-semibold text-lg">
                    {person.name} - <span className="text-gray-600">{person.relationToChild}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Special Requests</p>
            <p className="font-semibold text-lg bg-gray-100 p-3 rounded-lg">{data.specialRequests || "None"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Registration Date</p>
            <p className="font-semibold text-lg">{new Date(data.created_at).toLocaleString()}</p>
          </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeNinjaDetails;
