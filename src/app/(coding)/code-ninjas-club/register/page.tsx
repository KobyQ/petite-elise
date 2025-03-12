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
import Intro from "../../components/Intro";
import Input from "../../components/forms/Input";
import RadioButton from "../../components/forms/RadioButton";
import Textarea from "../../components/forms/Textarea";
import { MdAdd, MdClose } from "react-icons/md";

const phoneRegExp = /^(\+\d{1,3})?\d{9,15}$/;

const validationSchema = Yup.object({
  parentName: Yup.string().required("Parent/Guardian name is required"),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  contactMode: Yup.string().required("Please select a contact mode"),
  childName: Yup.string().required("Child's name is required"),
  ageGroup: Yup.string().required("Please select an age group"),
  hasCodingExperience: Yup.string().required("Please select an option"),
  codingExperience: Yup.string().when("hasCodingExperience", {
    is: "yes",
    then: (schema) => schema.required("Please describe the coding experience"),
    otherwise: (schema) => schema,
  }),
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
  paymentMethod: Yup.string().required("Please select a payment method"),
  photographUsageConsent: Yup.string().required(
    "Photograph Usage Consent is required"
  ),
  specialRequests: Yup.string(),
});

export default function RegistrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik<any>({
    initialValues: {
      parentName: "",
      phoneNumber: "",
      email: "",
      contactMode: "",
      dropChildOffSelf: "",
      dropOffNames: [{ name: "", relationToChild: "" }],
      childName: "",
      ageGroup: "",
      hasCodingExperience: "",
      codingExperience: "",
      paymentMethod: "",
      photographUsageConsent: "",
      specialRequests: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);

      try {
        const submissionValues = { ...values };
        if (values.dropChildOffSelf === "Yes") {
          delete submissionValues.dropOffNames;
        }

        const { error } = await supabase
          .from("code-ninjas")
          .insert([submissionValues]);

        if (error) {
          throw error;
        }

        toast.success("Form submitted successfully!");

        setIsSubmitted(true);
        resetForm();

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } catch (error: any) {
        console.error("Error submitting form:", error.message);
        toast.error(`Submission failed: ${error.message}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, errors, handleSubmit, isSubmitting, isValid, dirty } = formik;

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
            <p className="text-gray-400 text-lg">April 2025 Cohort</p>
          </motion.div>

          <Intro />

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-8 text-center"
            >
              <FiCheckCircle size={60} className="text-lime-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Registration Submitted!
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
                                  {({
                                    remove,
                                    push,
                                  }: {
                                    remove: (val: number) => void;
                                    push: (val: string) => void;
                                  }) => (
                                    <div className="grid gap-2">
                                      {values?.dropOffNames &&
                                        values?.dropOffNames?.length > 0 &&
                                        values?.dropOffNames?.map(
                                          (val: any, index: any) => (
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
                                                    onClick={() =>
                                                      remove(index)
                                                    }
                                                  />
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                    </div>
                                  )}
                                </FieldArray>
                                {typeof errors?.dropOffNames === "string" && (
                                  <p className="mt-1 text-sm text-red-500">
                                    {errors.dropOffNames}
                                  </p>
                                )}

                              
                              </div>
                            )}
                          </div>
                        </motion.div>
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

                            <RadioButton
                              label="Child's Age Group"
                              name="ageGroup"
                              options={[
                                {
                                  label: "6 - 9 years (Mini Coder)",
                                  value: "6 - 9 years (Mini Coder)",
                                },
                                {
                                  label: "10 - 13 years (Little Ninja)",
                                  value: "10 - 13 years (Little Ninja)",
                                },
                              ]}
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
                        <motion.div variants={itemVariants} className="mb-8">
                          <h3 className="text-lg text-coding font-semibold mb-4 pb-2 border-b border-zinc-800">
                            Payment Information
                          </h3>
                          <div className="space-y-4">
                            <RadioButton
                              label="Preferred Payment Method"
                              name="paymentMethod"
                              options={[
                                {
                                  label: "Mobile Money",
                                  value: "Mobile Money",
                                },
                                {
                                  label: "Bank Transfer",
                                  value: "Bank Transfer",
                                },
                                { label: "Cash", value: "Cash" },
                              ]}
                              required
                            />
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mb-8">
                          <div className="mb-4 pb-2 border-b border-zinc-800">
                            <h3 className="text-lg text-coding font-semibold ">
                              Photo Usage and Consent
                            </h3>
                            <p className="mb-6 font-bold text-gray-600 text-sm">
                              Kindly note that photographs and videos may be
                              taken at our Preschool. By registering your child,
                              you give Petite Elise Preschool and Code
                              Ninjas Club the permission to use photographs,
                              images, and/or video footage of your child for
                              promotional reference for our future kid-friendly
                              programs.
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
                                    " I do not authorize my child's photograph or image to be used in any of Petite Elise Preschool promotional reference for kid-friendly events.",
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

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="pt-4"
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting || !(isValid && dirty)}
                          className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold py-6 text-lg relative overflow-hidden group"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            <>
                              <span className="relative z-10">
                                Submit Registration
                              </span>
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
