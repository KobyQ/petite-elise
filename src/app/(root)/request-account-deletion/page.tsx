"use client";

import { useState } from "react";

const RequestAccountDeletionPage = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/account-deletion-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          subject: "Account Deletion Request - Petite Elise Preschool",
          message: `Account deletion request received from:\n\nPhone Number: ${formData.phoneNumber}\nEmail: ${formData.email}\n\nThis is an automated request for account deletion.`,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ phoneNumber: "", email: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Request Account Deletion
          </h1>
          <p className="text-gray-600">
            Please provide your contact information to request account deletion
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007f94] focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007f94] focus:border-transparent transition-all duration-200"
                placeholder="Enter your email address"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#007f94] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#005a6b] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✓ Your request has been submitted successfully. We will contact you shortly.
              </p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                ✗ There was an error submitting your request. Please try again.
              </p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            We will process your request within 30 days as required by data protection regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestAccountDeletionPage; 