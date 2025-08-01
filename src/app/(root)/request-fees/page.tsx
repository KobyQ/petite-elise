"use client";

import { useState } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";


// Fee request programs with shorter descriptions
const feeRequestPrograms = [
  {
    title: "Daycare",
    description: "Flexible care for babies 3 months - 3 years",
  },
  {
    title: "Preschool",
    description: "Full-term education for children 3-5 years",
  },
  {
    title: "Afterschool Care",
    description: "Extended care from 4pm-6pm with dinner",
  },
  {
    title: "Baby & Me",
    description: "Monthly program for babies 3-15 months with parents",
  },
  {
    title: "Developmental Playgroup",
    description: "Monthly play-based intervention for toddlers 16-35 months",
  },
  {
    title: "Experiental Learning Activities",
    description: "Weekly Ballet, Taekwondo, and Piano classes",
  },
];
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HeroSection from "@/components/shared/HeroSection";
import CTA from "@/components/programs/CTA";
import Input from "@/components/shared/forms/Input";
import RadioButton from "@/components/shared/forms/RadioButton";

const validationSchema = Yup.object({
  parentName: Yup.string().required("Parent/Guardian name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  childName: Yup.string().required("Child's name is required"),
  programs: Yup.array().min(1, "Please select at least one program").required("Please select a program"),
  dayCareSchedule: Yup.string().when("programs", {
    is: (programs: string[]) => programs && programs.includes("Daycare"),
    then: (schema) => schema.required("Please select a daycare schedule"),
    otherwise: (schema) => schema,
  }),
  additionalNotes: Yup.string(),
});

export default function RequestFees() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      parentName: "",
      email: "",
      phoneNumber: "",
      childName: "",
      programs: [] as string[],
      dayCareSchedule: "",
      additionalNotes: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      setIsSubmitting(true);

      try {
        // Save fee request to database
        const { error } = await supabase
          .from("fee_requests")
          .insert({
            parent_name: values.parentName,
            email: values.email,
            phone_number: values.phoneNumber,
            child_name: values.childName,
            programs: values.programs,
            day_care_schedule: values.dayCareSchedule,
            additional_notes: values.additionalNotes,
            status: "pending",
          });

        if (error) {
          console.error("Error saving fee request:", error);
          toast.error("Failed to submit request. Please try again.");
          return;
        }

        // Send confirmation email to parent
        try {
          const response = await fetch("/api/fee-request-confirmation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              parentName: values.parentName,
              email: values.email,
              childName: values.childName,
              programs: values.programs,
              dayCareSchedule: values.dayCareSchedule,
            }),
          });

          if (!response.ok) {
            console.error("Failed to send confirmation email");
          }
        } catch (emailError) {
          console.error("Email error:", emailError);
        }

        toast.success("Fee request submitted successfully! We'll contact you soon.");
        setIsSubmitted(true);
        resetForm();
        
        // Scroll to the success section
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">Request Submitted Successfully!</CardTitle>
              <CardDescription>
                Thank you for your fee request. We have received your request and will contact you soon with the invoice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                You will receive a confirmation email shortly. Our admin team will review your request and send you an invoice for payment.
              </p>
                             <Button 
                 onClick={() => {
                   setIsSubmitted(false);
                   setIsSubmitting(false);
                 }}
                 className="bg-primary hover:bg-opacity-90 text-white"
               >
                 Submit Another Request
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection 
        image="https://media.istockphoto.com/id/639407632/photo/excited-school-girls-during-chemistry-experiment.jpg?s=612x612&w=0&k=20&c=-W-vGm-bJ9XnxiCyFIxmLz3Asi0NJEiUjJoPShtBGLo=" 
        title="Request School Fees" 
        subTitle="Request an invoice for your child's school fees. We'll contact you with payment details."
      />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Fee Request Form</CardTitle>
              <CardDescription className="text-center">
                Please fill out the form below to request an invoice for your child's school fees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Parent/Guardian Name"
                      name="parentName"
                      required
                    />

                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                    />

                    <Input
                      label="Phone Number"
                      name="phoneNumber"
                      required
                    />

                    <Input
                      label="Child's Name"
                      name="childName"
                      required
                    />
                  </div>

                                     {/* Program Selection */}
                   <div className="col-span-2">
                     <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm font-medium text-gray-700">
                         Select Programs <span className="text-red-500">*</span>
                       </label>
                       <a 
                         href="/programs" 
                         className="text-sm text-primary hover:underline"
                         target="_blank"
                         rel="noopener noreferrer"
                       >
                         Find out more about programs →
                       </a>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {feeRequestPrograms.map((program) => (
                         <label key={program.title} className="flex items-start space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                           <input
                             type="checkbox"
                             value={program.title}
                             checked={formik.values.programs.includes(program.title)}
                             onChange={(e) => {
                               const value = e.target.value;
                               const checked = e.target.checked;
                               const newPrograms = checked
                                 ? [...formik.values.programs, value]
                                 : formik.values.programs.filter((p) => p !== value);
                               formik.setFieldValue("programs", newPrograms);
                             }}
                             className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                           />
                           <div>
                             <p className="font-medium text-gray-900">{program.title}</p>
                             <p className="text-sm text-gray-600">{program.description}</p>
                           </div>
                         </label>
                       ))}
                     </div>
                     {formik.touched.programs && formik.errors.programs && (
                       <p className="mt-1 text-sm text-red-500">{formik.errors.programs}</p>
                     )}
                   </div>

                  {/* Conditional Daycare Schedule */}
                  {formik.values.programs.includes("Daycare") && (
                    <div className="col-span-2">
                      <RadioButton
                        label="Daycare Schedule"
                        name="dayCareSchedule"
                        options={[
                          { label: "Daily", value: "Daily" },
                          { label: "Weekly", value: "Weekly" },
                          { label: "Monthly", value: "Monthly" },
                          { label: "Termly", value: "Termly" },
                        ]}
                        required
                      />
                    </div>
                  )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Any additional information or special requests..."
                    value={formik.values.additionalNotes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-opacity-90 text-white px-8 py-3 rounded-md transition-all duration-300"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Fee Request"}
                  </Button>
                </div>
              </form>
              </FormikProvider>
            </CardContent>
          </Card>
        </div>
      </section>

      <CTA />
    </div>
  );
} 