/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  FaUserAlt,
  FaPhoneAlt,
  FaClipboardList,
  FaBirthdayCake,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import supabase from "@/utils/supabaseClient";

const StudentDetails = ({
  isOpen,
  setIsOpen,
  data,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data: any;
}) => {
  const [transaction, setTransaction] = useState<any | null>(null);
  const [isTxnLoading, setIsTxnLoading] = useState<boolean>(false);
  const [txnError, setTxnError] = useState<string | null>(null);
  const [siblings, setSiblings] = useState<any[]>([]);
  const [isSiblingsLoading, setIsSiblingsLoading] = useState<boolean>(false);

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

  // Fetch siblings if this child has a familyId
  useEffect(() => {
    const fetchSiblings = async () => {
      if (!data?.familyId) return;
      setIsSiblingsLoading(true);
      try {
        const { data: siblingsData, error } = await supabase
          .from("children")
          .select("childName, programs, created_at")
          .eq("familyId", data.familyId)
          .eq("is_active", true)
          .order("created_at", { ascending: true });

        if (!error && siblingsData) {
          setSiblings(siblingsData);
        }
      } catch (e) {
        console.error("Failed to fetch siblings:", e);
      } finally {
        setIsSiblingsLoading(false);
      }
    };

    fetchSiblings();
  }, [data?.familyId]);

  const computeAmountCedis = () => {
    if (!transaction) return null;
    // All amounts are now stored in pesewas, so convert to cedis for display
    if (typeof transaction?.amount === "number") return transaction.amount / 100;
    return null;
  };

  const computeSchedulePaid = () => {
    const d = transaction?.details || {};
    const programType = d?.program_type;
    if (!programType) return null;
    switch (programType) {
      case "Code Ninjas Club":
        return d?.schedule || null;
      case "Childminding":
        return d?.childMindingSchedule || null;
      case "Summer Camp":
        return d?.summerCampSchedule || null;
      case "Christmas Camp":
        return d?.christmasCampSchedule || null;
      case "Saturday Kids Club":
        return d?.saturdayClubSchedule || null;
      case "Baby & Me":
      case "Developmental Playgroup":
        return "Monthly";
      default:
        return (
          d?.dayCareSchedule ||
          d?.schedule ||
          d?.saturdayClubSchedule ||
          d?.summerCampSchedule ||
          d?.christmasCampSchedule ||
          null
        );
    }
  };

  const paidAmount = computeAmountCedis();
  const paidSchedule = computeSchedulePaid();
  const paidProgram = transaction?.details?.program_type || null;
  
  // Check if this is a sibling registration
  const isSiblingRegistration = transaction?.details?.children && Array.isArray(transaction.details.children) && transaction.details.children.length > 1;
  const totalChildrenInPayment = isSiblingRegistration ? transaction.details.children.length : 1;
  const amountPerChild = isSiblingRegistration && paidAmount ? paidAmount / totalChildrenInPayment : paidAmount;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-3xl h-[80vh] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
        hideDefaultCloseButton={true}
      >
        <DialogTitle className="sr-only">Student Details</DialogTitle>
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg relative">
          <h2 className="text-xl font-semibold text-center">Student Details</h2>
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className=" overflow-y-auto p-6 space-y-6 bg-gray-50">
          {/* Payment */}
          <section className="border-b pb-10">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <FaMoneyBillWave className="text-blue-500" />
              Payment
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              {isSiblingRegistration ? (
                <>
                  <p>
                    <strong>Total Payment Amount:</strong>{" "}
                    {isTxnLoading
                      ? "Loading..."
                      : paidAmount != null
                      ? `GHS ${paidAmount.toFixed(2)}`
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Amount Per Child:</strong>{" "}
                    {isTxnLoading
                      ? "Loading..."
                      : amountPerChild != null
                      ? `GHS ${amountPerChild.toFixed(2)}`
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Total Children in Payment:</strong> {totalChildrenInPayment}
                  </p>
                  <p className="col-span-2 bg-blue-50 p-2 rounded border border-blue-200">
                    <strong>Note:</strong> This is a sibling registration. The total payment covers {totalChildrenInPayment} child{totalChildrenInPayment > 1 ? 'ren' : ''}.
                  </p>
                </>
              ) : (
                <p>
                  <strong>Amount Paid:</strong>{" "}
                  {isTxnLoading
                    ? "Loading..."
                    : paidAmount != null
                    ? `GHS ${paidAmount.toFixed(2)}`
                    : "N/A"}
                </p>
              )}
              <p>
                <strong>Program:</strong> {paidProgram || "N/A"}
              </p>
              <p>
                <strong>Paid Schedule:</strong>{" "}
                {isTxnLoading ? "Loading..." : paidSchedule || "N/A"}
              </p>
              <p>
                <strong>Reference:</strong> {data?.reference || "N/A"}
              </p>
            </div>
            {txnError && (
              <p className="text-red-600 text-sm mt-2">{txnError}</p>
            )}
          </section>

          {/* Siblings Information */}
          {isSiblingRegistration && (
            <section className="border-b pb-10">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                <FaUsers className="text-blue-500" />
                Children in This Payment
              </h3>
              <div className="mt-2 space-y-2">
                <div className="space-y-2">
                  {transaction.details.children.map((child: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded border">
                      <span className="font-medium text-blue-600">
                        {child.childName === data.childName ? "→ " : ""}
                        {child.childName}
                      </span>
                      <span className="text-sm text-gray-600">
                        {child.programs?.join(", ") || "No programs"}
                      </span>
                      {child.childName === data.childName && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Current Child
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Note:</strong> All children above share the same payment transaction.
                </p>
              </div>
            </section>
          )}



          {/* General Information */}
          <section className="border-b pb-10">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <FaUserAlt className="text-blue-500" />
              General Information
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <p>
                <strong>Child&apos;s Name:</strong> {data?.childName || "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {data?.childDOB || "N/A"}
              </p>
              <p>
                <strong>Age:</strong> {data?.childAge || "N/A"}
              </p>
              <p>
                <strong>Parent&apos;s Name:</strong> {data?.parentName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {data?.parentEmail || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {data?.parentPhoneNumber || "N/A"}
              </p>
              <p>
                <strong>WhatsApp:</strong> {data?.parentWhatsappNumber || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {data?.address || "N/A"}
              </p>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="border-b pb-10">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <FaPhoneAlt className="text-blue-500" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <p>
                <strong>Name:</strong> {data?.emergencyContactName || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {data?.emergencyContactPhoneNumber || "N/A"}
              </p>
              <p>
                <strong>WhatsApp:</strong>{" "}
                {data?.emergencyContactWhatsappNumber || "N/A"}
              </p>
              <p>
                <strong>Relationship:</strong>{" "}
                {data?.emergencyContactRelationshipToChild || "N/A"}
              </p>
            </div>
          </section>

          {/* Drop-Off Information */}
          <section className="border-b pb-10">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <MdPlace className="text-blue-500" />
              Drop-Off Information
            </h3>
            <div className="mt-2 text-sm">
              <p>
                <strong>Will Drop Off Self:</strong>{" "}
                {data?.dropChildOffSelf === "true" ? "Yes" : "No"}
              </p>
              <p>
                <strong>Authorized Drop-Off Names:</strong>
              </p>
              {data?.dropOffNames?.length > 0 ? (
                <ul className="list-disc pl-5">
                  {data?.dropOffNames?.map(
                    (
                      dropOff: { name: string; relationToChild: string },
                      index: number
                    ) => (
                      <li key={index}>
                        <strong>{dropOff.name}</strong> -{" "}
                        {dropOff.relationToChild}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-gray-500">No authorized drop-off names</p>
              )}
            </div>
          </section>

          {/* Registered Programs */}

          <section className="border-b pb-10">
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <FaClipboardList className="text-blue-500" />
              Registered Programs
            </h3>

            <div className="mt-2 space-y-2 text-sm">
              <p>
                <strong>Programs:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {data?.programs?.length > 0 ? (
                  data.programs.map((program: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow"
                    >
                      {program}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No programs registered</p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                {data?.dayCareSchedule && (
                  <p>
                    <strong>Day Care Schedule:</strong>{" "}
                    {data?.dayCareSchedule || "N/A"}
                  </p>
                )}{" "}
                {data?.saturdayClubSchedule && (
                  <p>
                    <strong>Saturday Club Schedule:</strong>{" "}
                    {data?.saturdayClubSchedule || "N/A"}
                  </p>
                )}{" "}
                {data?.summerCampSchedule && (
                  <p>
                    <strong>Summer Camp Schedule:</strong>{" "}
                    {data?.summerCampSchedule || "N/A"}
                  </p>
                )}{" "}
                {data?.christmasCampSchedule && (
                  <p>
                    <strong>Christmas Camp Schedule:</strong>{" "}
                    {data?.christmasCampSchedule || "N/A"}
                  </p>
                )}
                {data?.childMindingSchedule && (
                  <p>
                    <strong>Childminding Schedule:</strong>{" "}
                    {data?.childMindingSchedule || "N/A"}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Feeding and Allergies */}
          <section>
            <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              <FaBirthdayCake className="text-blue-500" />
              Feeding & Allergies
            </h3>

            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Feeding:</strong> {data?.feeding || "N/A"}
              </p>
              <p>
                <strong>Has Sibling:</strong> {data?.hasSibling === "true" ? "Yes" : "No"}
              </p>
              <p>
                <strong>Sibling:</strong> {data?.sibling || "N/A"}
              </p>
              <p>
                <strong>Has Allergies:</strong>{" "}
                {data?.hasAllergies === "true" ? "Yes" : "No"}
              </p>
              <p>
                <strong>Allergies:</strong>{" "}
                {data?.allergies?.length > 0
                  ? data.allergies.join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong>Special Education Conditions:</strong>{" "}
                {data?.specialHealthConditions?.length > 0
                  ? data.specialHealthConditions.join(", ")
                  : "N/A"}
              </p>
              <p className="capitalize">
                <strong>Photo Consent:</strong>{" "}
                {data?.photographUsageConsent === "permit"
                  ? "Permit certain features (except for face and full body photos)"
                  : data?.photographUsageConsent}
              </p>
              {data?.familyId && (
                <p>
                  <strong>
                    Family Id (Siblings have the same family ID) :
                  </strong>{" "}
                  {data?.familyId || "N/A"}
                </p>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetails;
