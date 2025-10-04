/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import supabase from "@/utils/supabaseClient";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiCode } from "react-icons/fi";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Input from "../../components/forms/Input";
import RadioButton from "../../components/forms/RadioButton";
import Textarea from "../../components/forms/Textarea";
import { MdAdd, MdClose } from "react-icons/md";
import { formatMoneyToCedis } from "@/utils/constants";
import { BsCalendar } from "react-icons/bs";


const validationSchema = Yup.object({
  parentName: Yup.string().required("Parent/Guardian name is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  contactMode: Yup.string().required("Please select a contact mode"),
  childName: Yup.string().required("Child's name is required"),
  // ageGroup: Yup.string().required("Please select an age group"),
  hasCodingExperience: Yup.string().required("Please select an option"),
  codingExperience: Yup.string().when("hasCodingExperience", {
    is: "yes",
    then: (schema) => schema.required("Please describe the coding experience"),
    otherwise: (schema) => schema,
  }),
  schedule: Yup.string().required("Please select a schedule"),
  dropChildOffSelf: Yup.string().required(
    "Please specify if you will drop off the child"
  ),
  dropOffNames: Yup.array().when("dropChildOffSelf", {
    is: "No",
    then: (schema) =>
      schema.min(2, "You must provide at least two people").of(
        Yup.object().shape({
          name: Yup.string().required("Name is required"),
          relationToChild: Yup.string().required(
            "Relation to child is required"
          ),
        })
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
  photographUsageConsent: Yup.string().required(
    "Photograph Usage Consent is required"
  ),
  specialRequests: Yup.string(),
});

export default function RegistrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [isPaymentInitiated, setIsPaymentInitiated] = useState<boolean>(false);
  const [submittingPayment, setSubmittingPayment] = useState<boolean>(false);
  const [selectedPricing, setSelectedPricing] = useState<any>(null);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountData, setDiscountData] = useState<any>(null);
  const [validatingDiscount, setValidatingDiscount] = useState<boolean>(false);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [scheduleOptions, setScheduleOptions] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState<boolean>(true);
  const [isChildAlreadyEnrolled, setIsChildAlreadyEnrolled] = useState<string>("");
  const [existingData, setExistingData] = useState<any>(null);
  const [fetchingData, setFetchingData] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [searchStatus, setSearchStatus] = useState<{
    emailFound: boolean;
    phoneFound: boolean;
  } | null>(null);

  // Fetch schedule options from API
  const fetchScheduleOptions = async () => {
    try {
      setLoadingSchedules(true);
      const { data, error } = await supabase
        .from("program_pricing")
        .select("*")
        .eq("program_name", "Code Ninjas Club")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching schedule options:", error);
        return;
      }

      const options = data?.map((item) => ({
        label: `${item.schedule} - ${formatMoneyToCedis(item.price)}`,
        value: item.schedule,
        price: item.price,
        id: item.id,
      })) || [];

      setScheduleOptions(options);
    } catch (error) {
      console.error("Error fetching schedule options:", error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Fetch existing child data
  const fetchAllDocuments = async (parentEmail: string, parentPhoneNumber: string) => {
    try {
      setFetchingData(true);
      setSelectedChild(null);
      setSearchStatus(null);

      // First try with strict AND condition for security
      const { data: strictData, error: strictError } = await supabase
        .from("code-ninjas")
        .select("*")
        .eq("email", parentEmail)
        .eq("phoneNumber", parentPhoneNumber);

      if (strictError) {
        throw strictError;
      }
      // If we found records with the strict query, use those
      if (strictData && strictData.length > 0) {
        setExistingData(strictData);
        return;
      }

      // If no records found with strict query, check if email exists
      const { data: emailData, error: emailError } = await supabase
        .from("children")
        .select("id")
        .eq("parentEmail", parentEmail)
        .limit(1);

      if (emailError) {
        console.error("Error checking email:", emailError);
      }

      // Check if phone number exists
      const { data: phoneData, error: phoneError } = await supabase
        .from("children")
        .select("id")
        .eq("parentPhoneNumber", parentPhoneNumber)
        .limit(1);

      if (phoneError) {
        console.error("Error checking phone:", phoneError);
      }

      // Set search status based on what was found
      setSearchStatus({
        emailFound: Boolean(emailData && emailData.length > 0),
        phoneFound: Boolean(phoneData && phoneData.length > 0),
      });

      // Set empty array for the main results
      setExistingData([]);
    } catch (err) {
      console.error("Error fetching documents:", err);
      toast.error("Failed to fetch child records. Please try again.");
      setExistingData([]);
    } finally {
      setFetchingData(false);
    }
  };

  // Load schedule options on component mount
  useEffect(() => {
    fetchScheduleOptions();
  }, []);

  const validateDiscountCode = async (code: string) => {
    if (!code.trim()) {
      setDiscountData(null);
      return;
    }

    setValidatingDiscount(true);
    try {
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("discount_code", code.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast.error("Invalid or inactive discount code");
        setDiscountData(null);
        return;
      }

      setDiscountData(data);
      toast.success(`Discount code applied! ${data.discount_percentage}% off`);
    } catch (error) {
      console.error("Error validating discount code:", error);
      toast.error("Error validating discount code");
      setDiscountData(null);
    } finally {
      setValidatingDiscount(false);
    }
  };

  const calculateFinalAmount = (originalPrice: number, discount: any) => {
    if (!discount) return originalPrice;
    const discountAmount = (originalPrice * discount.discount_percentage) / 100;
    return originalPrice - discountAmount;
  };

  const fetchPricingForSchedule = async (schedule: string) => {
    try {
      const { data, error } = await supabase
        .from("program_pricing")
        .select("*")
        .eq("program_name", "Code Ninjas Club")
        .ilike("schedule", schedule)
        .maybeSingle();

      if (error) {
        console.error("Error fetching pricing:", error);
        return null;
      }

      if (!data) {
        console.error("No pricing found for schedule:", schedule);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching pricing:", error);
      return null;
    }
  };


  const formik = useFormik<any>({
    initialValues: {
      parentName: selectedChild?.parentName || "",
      phoneNumber: selectedChild?.phoneNumber || "",
      email: selectedChild?.email || "",
      contactMode: selectedChild?.contactMode ||  "",
      dropChildOffSelf: selectedChild?.dropChildOffSelf || "",
      dropOffNames: selectedChild?.dropOffNames || [{ name: "", relationToChild: "" }],
      childName: selectedChild?.childName || "",
      // ageGroup: selectedChild?.ageGroup || "",
      hasCodingExperience: selectedChild?.hasCodingExperience || "",
      codingExperience:  selectedChild?.hasCodingExperience || "",
      schedule: selectedChild?.schedule?.toLowerCase()|| "",
      photographUsageConsent: selectedChild?.photographUsageConsent || "",
      specialRequests: selectedChild?.specialRequests || "",
      dateOfBirth: selectedChild?.dateOfBirth || "",
      age: selectedChild?.age || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      setSubmittingPayment(true);

      try {
        // Fetch pricing for the selected schedule
        const pricing = await fetchPricingForSchedule(values.schedule || "");
        if (!pricing) {
          toast.error("Unable to fetch pricing information. Please try again.");
          return;
        }

        setSelectedPricing(pricing);

        // Calculate final amount with discount
        const originalAmount = pricing.price / 100; // Convert to cedis
        const finalAmountInCedis = calculateFinalAmount(originalAmount, discountData);
        const finalAmountInPesewas = Math.round(finalAmountInCedis * 100); // Convert back to pesewas
        setFinalAmount(finalAmountInCedis);

        // Prepare registration data for payment (don't save to code-ninjas table yet)
        const registrationData = {
          ...values,
          pricing_id: pricing.id,
          program_type: "Code Ninjas Club",
          discount_code: discountCode.trim().toUpperCase() || null,
          discount_data: discountData,
          original_amount: originalAmount,
          discount_amount: discountData ? (originalAmount * discountData.discount_percentage) / 100 : 0,
          final_amount: finalAmountInCedis,
        };

        // Remove dropOffNames if not needed
        if (values.dropChildOffSelf === "Yes") {
          delete registrationData.dropOffNames;
        }

        // Initiate payment first - registration will be saved only after payment verification
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            amount: finalAmountInPesewas, // Use discounted amount in pesewas 
            callback_url: `${window.location.origin}/code-ninjas-club/verify`,
          }),
        });

        const result = await response.json();

        if (!result.status) {
          throw new Error(result.message || "Failed to initialize payment");
        }

        // Save transaction to our database
        const { error: dbError } = await supabase.from("transactions").insert({
          amount: finalAmountInPesewas, // Store final discounted amount in pesewas to match Paystack
          reference: result.data.reference,
          paystack_response: result,
          status: "pending",
          details: registrationData,
          order_id: `CODE-NINJAS-${Date.now()}`,
        });

        if (dbError) {
          throw new Error(`Failed to save transaction: ${dbError.message}`);
        }

        setPaymentUrl(result.data.authorization_url);
        setIsPaymentInitiated(true);
        toast.success("Payment initiated successfully! Please complete your payment to secure your registration.");

        // Scroll to payment section when payment screen is shown
        setTimeout(() => {
          const paymentSection = document.getElementById('payment-section');
          if (paymentSection) {
            paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } catch (error: any) {
        console.error("Error submitting form:", error.message);
        toast.error(`Submission failed: ${error.message}`);
      } finally {
        setSubmitting(false);
        setSubmittingPayment(false);
      }
    },
  });

  const { values, errors, handleSubmit, isSubmitting, setFieldValue,validateForm, setFieldError, isValid, dirty } = formik;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className=" bg-black text-white">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-block p-3 rounded-full bg-lime-500/10 mb-4">
              <FiCode size={40} className="text-lime-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-lime-500 bg-clip-text text-transparent">
              Registration - Code Ninjas Club
            </h1>
          </motion.div>


          {isPaymentInitiated && paymentUrl ? (
            <motion.div
              id="payment-section"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-8 text-center"
            >
              <FiCheckCircle size={60} className="text-lime-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Registration Initiated!
              </h2>
              <p className="text-gray-300 mb-6">
                Your registration is almost complete! Please complete your payment to secure your child&apos;s spot.
              </p>

              {selectedPricing && (
                <div className="bg-zinc-800 border border-lime-500/30 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-lime-500 mb-2">Selected Plan:</h4>
                  <p className="text-gray-300">
                    <strong>{selectedPricing.schedule}</strong>
                  </p>

                  {discountData ? (
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Original Price:</span>
                        <span className="line-through text-gray-500">{formatMoneyToCedis(selectedPricing.price)}</span>
                      </div>
                      <div className="flex justify-between text-lime-400">
                        <span>Discount ({discountData.discount_percentage}%):</span>
                        <span>-{formatMoneyToCedis(Math.round((selectedPricing.price / 100 * discountData.discount_percentage / 100) * 100))}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t border-gray-600 pt-2">
                        <span>Total:</span>
                        <span className="text-lime-500">{formatMoneyToCedis(Math.round(finalAmount * 100))}</span>
                      </div>
                      <div className="bg-lime-500/20 text-lime-400 px-2 py-1 rounded text-xs">
                        Discount code &quot;{discountCode.toUpperCase()}&quot; applied!
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <span className="font-semibold text-lg text-gray-300">{formatMoneyToCedis(selectedPricing.price)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Payment button */}
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Continue with Paystack</span>
              </a>

              <p className="text-sm text-gray-400 mb-4">
                You will be redirected to Paystack to complete your payment securely.
              </p>

              {/* Important notice */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm text-amber-400">
                  Your registration is not confirmed until payment is received. If you have any questions, please contact our
                  support team.
                </p>
              </div>
            </motion.div>
          ) : isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-8 text-center"
            >
              <FiCheckCircle size={60} className="text-lime-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Registration Submitted Successfully!
              </h2>
              <p className="text-gray-300 mb-6">
                Thank you for registering for the Code Ninjas Club. We will
                contact you shortly with further details.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-lime-500 hover:bg-lime-600 text-black"
              >
                Register Another Child
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-2xl">Registration Form</CardTitle>
                  <CardDescription>
                    Please fill out all the required information below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormikProvider value={formik}>
                    <Form onSubmit={handleSubmit} className="space-y-8">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {/* Existing Child Check */}
                        <motion.div variants={itemVariants} className="mb-8">
                          <h3 className="text-lg text-coding font-semibold mb-4 pb-2 border-b border-zinc-800">
                            Existing Child Check
                          </h3>
                          <div className="space-y-4">
                            <div className="mb-6">
                              <p className="text-lg font-medium mb-4 text-gray-300">
                                Has your child registered for the Code Ninjas Club before?
                              </p>
                              <div className="space-y-3">
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name="isChildAlreadyEnrolled"
                                    value="No"
                                    checked={isChildAlreadyEnrolled === "No"}
                                    onChange={(e) => {
                                      setIsChildAlreadyEnrolled(e.target.value);
                                      setSelectedChild(null);
                                      setExistingData(null);
                                    }}
                                    className="form-radio text-lime-500 mr-3"
                                  />
                                  <span className="text-gray-300">No, this is for a new child</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name="isChildAlreadyEnrolled"
                                    value="Yes"
                                    checked={isChildAlreadyEnrolled === "Yes"}
                                    onChange={(e) => {
                                      setIsChildAlreadyEnrolled(e.target.value);
                                    }}
                                    className="form-radio text-lime-500 mr-3"
                                  />
                                  <span className="text-gray-300">
                                    Yes, enrolling for Code Ninjas Club
                                  </span>
                                </label>
                              </div>
                            </div>

                            {isChildAlreadyEnrolled === "Yes" && (
                              <>
                                {/* Input fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                  <Input
                                    label="Parent's Email"
                                    type="email"
                                    name="email"
                                    value={values.email || ""}
                                    required
                                  />
                                  <Input
                                    label="Parent's Phone Number"
                                    type="tel"
                                    name="phoneNumber"
                                    value={values.phoneNumber || ""}
                                    required
                                  />
                                </div>

                                {/* Search Child Button */}
                                <div className="w-full flex justify-end mb-6">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      fetchAllDocuments(values.email, values.phoneNumber)
                                    }
                                    disabled={!values.email || !values.phoneNumber || fetchingData}
                                    className="w-full lg:w-1/3 py-3 bg-lime-500 hover:bg-lime-600 text-black font-bold rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg transition-colors"
                                  >
                                    {fetchingData ? "Searching..." : "Search Child"}
                                  </button>
                                </div>

                                {/* No results message */}
                                {existingData &&
                                  existingData.length === 0 &&
                                  !fetchingData &&
                                  searchStatus && (
                                    <div className="mb-6 p-4 border rounded-lg bg-amber-500/10 border-amber-500/30 text-amber-400">
                                      <h3 className="font-semibold text-lg mb-2">
                                        No records found
                                      </h3>
                                      <p className="mb-4">
                                        {!searchStatus.emailFound && !searchStatus.phoneFound
                                          ? "We couldn't find any records with this email address or phone number. Please check your information and try again."
                                          : !searchStatus.emailFound
                                            ? "We found records with this phone number, but not with this email address. Please check your email and try again."
                                            : !searchStatus.phoneFound
                                              ? "We found records with this email address, but not with this phone number. Please check your phone number and try again."
                                              : "We found records with both your email and phone number, but they don't belong to the same account. Please contact support for assistance."}
                                      </p>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setIsChildAlreadyEnrolled("No")}
                                          className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded hover:bg-amber-500/30 transition-colors"
                                        >
                                          Register as New Child
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setExistingData(null);
                                            setSearchStatus(null);
                                          }}
                                          className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors"
                                        >
                                          Try Again
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                {/* Existing child cards */}
                                {existingData && existingData.length > 0 && (
                                  <div className="mb-6">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-300">
                                      Select your child:
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {existingData?.map((child: any) => {
                                        const isSelected = selectedChild === child;
                                        return (
                                          <div
                                            key={child.id}
                                            onClick={() => setSelectedChild(child)}
                                            className={`p-4 border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 
                        ${isSelected
                                                ? "border-lime-500 bg-lime-500/10"
                                                : "border-zinc-700 bg-zinc-800"
                                              }`}
                                          >
                                            <h3 className="text-lg font-semibold text-gray-300">
                                              {child.childName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                              Parent: {child.parentName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                              Email: {child.email}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>

                        {/* Parent Information */}
                        <motion.div variants={itemVariants} className="mb-8">
                          <h3 className="text-lg text-coding font-semibold mb-4 pb-2 border-b border-zinc-800">
                            Parent/Guardian Information
                          </h3>
                          <div className="space-y-4">
                            <Input
                              label="Full Name of Parent/Guardian"
                              name="parentName"
                              value={values.parentName || ""}
                              required
                            />
                            <Input
                              label="Phone Number Of Parent/Guardian"
                              type="tel"
                              name="phoneNumber"
                              value={values.phoneNumber || ""}
                              required
                            />
                            <Input
                              label="Email Address Of Parent/Guardian"
                              type="email"
                              name="email"
                              value={values.email || ""}
                              required
                            />
                            <RadioButton
                              label="Preferred Mode Of Contact "
                              name="contactMode"
                              options={[
                                { label: "Phone/SMS", value: "Phone/SMS" },
                                { label: "Email", value: "Email" },
                              ]}
                              required
                            />

                            <RadioButton
                              label="Will you do the drop off & pick up of your child daily? (If no, please state two alternative names that may do the drop off and pick up) "
                              name="dropChildOffSelf"
                              options={[
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" },
                              ]}
                              required
                            />

                            {values?.dropChildOffSelf === "No" && (
                              <div className="col-span-2">
                                <FieldArray name="dropOffNames">
                                  {({ remove, push }: { remove: (val: number) => void; push: (val: string) => void }) => (
                                    <div className="grid gap-2">
                                      {values?.dropOffNames &&
                                        values?.dropOffNames?.length > 0 &&
                                        values?.dropOffNames?.map((val: any, index: any) => (
                                          <div
                                            className="flex flex-col lg:flex-row gap-5 items-center "
                                            key={index}
                                          >
                                            <div className="w-full">
                                              <Input
                                                label="Full name"
                                                name={`dropOffNames.${index}.name`}
                                                required
                                              />
                                            </div>
                                            <div className="w-full">
                                              <Input
                                                label="Relationship with the child."
                                                name={`dropOffNames.${index}.relationToChild`}
                                                required
                                              />
                                            </div>

                                            <div className="flex justify-end w-full lg:w-auto gap-2">
                                              <MdAdd
                                                className="w-5 h-5 bg-coding text-white border-coding mt-3 cursor-pointer rounded-md "
                                                onClick={() => push("")}
                                              />
                                              {index > 0 && (
                                                <MdClose
                                                  className="w-5 h-5 bg-red-400 text-white border-red-400 mt-3 cursor-pointer rounded-md"
                                                  onClick={() => remove(index)}
                                                />
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </FieldArray>
                                {typeof errors?.dropOffNames === "string" && (
                                  <p className="mt-1 text-sm text-red-500">{errors.dropOffNames}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>

                        {/* Child Information (updated with DOB + auto Age) */}
                        <motion.div variants={itemVariants} className="mb-8">
                          <h3 className="text-lg text-coding font-semibold mb-4 pb-2 border-b border-zinc-800">
                            Child Information
                          </h3>
                          <div className="space-y-4">
                            <Input
                              label="Child's Full Name"
                              name="childName"
                              value={values.childName || ""}
                              required
                            />
                            {/* Child Date of Birth */}
                            <Input
                              id="dob"
                              label="Child's Date of Birth"
                              type="date"
                              name="dateOfBirth"
                              value={values.dateOfBirth || ""}
                              min="2000-01-01" // optional earliest allowed
                              max={`${new Date().getFullYear() - 6}-12-31`}
                              onChange={(e) => {
                                const dob = e.target.value;
                                setFieldValue("dateOfBirth", dob);

                                if (dob) {
                                  const birthDate = new Date(dob);
                                  const today = new Date();
                                  let age = today.getFullYear() - birthDate.getFullYear();
                                  const m = today.getMonth() - birthDate.getMonth();
                                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                    age--;
                                  }

                                  setFieldValue("age", age);
                                }
                              }}
                              required
                            />


                            {/* Auto Age */}
                            <Input
                              label="Child's Age"
                              name="age"
                              value={values.age || ""}
                              readOnly
                            />



                            <RadioButton
                              label="Program Schedule"
                              name="schedule"
                              options={loadingSchedules ? [] : scheduleOptions}
                              required
                            />

                            <RadioButton
                              label="Does your child have prior coding experience?"
                              name="hasCodingExperience"
                              options={[
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" },
                              ]}
                              required
                            />
                            {values?.hasCodingExperience === "Yes" && (
                              <Textarea
                                label="Briefly describe their experience"
                                name="codingExperience"
                                value={values.codingExperience || ""}
                              />
                            )}
                          </div>
                        </motion.div>

                        {/* Photo Usage & Consent */}
                        <motion.div variants={itemVariants} className="mb-8">
                          <div className="mb-4 pb-2 border-b border-zinc-800">
                            <h3 className="text-lg text-coding font-semibold ">
                              Photo Usage and Consent
                            </h3>
                            <p className="mb-6 font-bold text-gray-600 text-sm">
                              Kindly note that photographs and videos may be taken at our Preschool.
                              By registering your child, you give Petite Elise Preschool and Code
                              Ninjas Club the permission to use photographs, images, and/or video
                              footage of your child for promotional reference for our future
                              kid-friendly programs.
                            </p>
                          </div>
                          <div className="space-y-4">
                            <RadioButton
                              label="Photograph Usage Consent"
                              name="photographUsageConsent"
                              options={[
                                {
                                  label:
                                    "I authorize my child's photograph or image to be used in any of Petite Elise Preschool promotional reference for kid-friendly events.",
                                  value: "Authorize",
                                },
                                {
                                  label:
                                    "I do not authorize my child's photograph or image to be used in any of Petite Elise Preschool promotional reference for kid-friendly events.",
                                  value: "Do not Authorize",
                                },
                                {
                                  label:
                                    "I permit certain features (except for face and full body photos) of my child to be used in any of Petite Elise Preschool promotional reference for kid-friendly events.",
                                  value: "Permit Certain Features",
                                },
                              ]}
                              required
                            />

                            <Textarea
                              label="Any questions or special requests?"
                              name="specialRequests"
                              value={values.specialRequests || ""}
                            />
                          </div>
                        </motion.div>
                      </motion.div>

                      {/* Discount Code Section */}
                      <motion.div className="mb-8">
                        <h3 className="text-lg text-coding font-semibold mb-4 pb-2 border-b border-zinc-800">
                          Discount Code (Optional)
                        </h3>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={discountCode}
                              onChange={(e) =>
                                setDiscountCode(e.target.value.toUpperCase())
                              }
                              placeholder="Enter discount code"
                              className="w-full border border-zinc-700 bg-zinc-800 text-white rounded p-3 text-sm focus:border-lime-500 focus:outline-none"
                              disabled={validatingDiscount}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => validateDiscountCode(discountCode)}
                            disabled={!discountCode.trim() || validatingDiscount}
                            className="px-6 py-3 bg-lime-500 text-black rounded disabled:bg-gray-600 disabled:cursor-not-allowed text-sm font-medium hover:bg-lime-600 transition-colors"
                          >
                            {validatingDiscount ? "Checking..." : "Apply"}
                          </button>
                        </div>

                        {discountData && (
                          <div className="mt-4 p-4 bg-lime-500/20 border border-lime-500/30 rounded-lg">
                            <div className="flex items-center gap-2 text-lime-400">
                              <FiCheckCircle className="w-5 h-5" />
                              <span className="font-medium">
                                Discount Applied: {discountData.discount_percentage}% off
                              </span>
                            </div>
                            <p className="text-lime-300 text-sm mt-1">
                              Code: {discountData.discount_code}
                            </p>
                          </div>
                        )}
                      </motion.div>

                      {/* Submit */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="pt-4"
                      >
                    <Button
  type="button" // ⬅️ not "submit", so we can manually control validation
  onClick={async () => {
    const errors = await validateForm(); // Formik validate
    if (Object.keys(errors).length > 0) {
      // Show toast for the first error
      const firstErrorField = Object.keys(errors)[0];
      toast.error(`${firstErrorField} is required`, {
        position: "top-right",
      });
    } else {
      // No errors → actually submit form
      handleSubmit();
    }
  }}
  className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold py-6 text-lg relative overflow-hidden group"
>
  {isSubmitting || submittingPayment ? (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
      Processing...
    </div>
  ) : (
    <>
      <span className="relative z-10">Submit Registration</span>
      <span className="absolute inset-0 h-full w-0 bg-lime-600 transition-all duration-300 ease-out group-hover:w-full"></span>
    </>
  )}
</Button>
                      </motion.div>
                    </Form>

                  </FormikProvider>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
