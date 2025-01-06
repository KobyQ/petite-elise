/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Input from "../shared/forms/Input";
import RadioButton from "../shared/forms/RadioButton";
import { FieldArray } from "formik";
import { MdAdd, MdClose } from "react-icons/md";
import { IEnrollChild } from "@/utils/interfaces";
import { Button } from "../ui/button";

type ChildAndGuardianInfoProps = {
  values: IEnrollChild;
  setFieldValue: (field: string, val: string) => void;
  prevStep: () => void;
  nextStep: () => void;
};

const ChildAndGuardianInfo = ({
  values,
  setFieldValue,
  prevStep,
  nextStep,
}: ChildAndGuardianInfoProps) => {



  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const dateValue = event.target.value;
  
    // Calculate age in months
    const today = new Date();
    const selectedDate = new Date(dateValue);
    const ageInMonths =
      (today.getFullYear() - selectedDate.getFullYear()) * 12 +
      (today.getMonth() - selectedDate.getMonth());
  
    const ageDisplay = ageInMonths > 0 ? `${ageInMonths} months` : "";
  
    setFieldValue("childDOB", dateValue);
    setFieldValue("childAge", ageDisplay);
  };
  

  return (
    <div>
      <div className="mb-10 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Input label="Child’s Full Name" name="childName" required />
          <Input
            label="Child’s Date of Birth"
            name="childDOB"
            type="date"
            required
            max={new Date().toISOString().split("T")[0]} 
            onChange={(e) => handleDateChange(e, setFieldValue)}
          />
          <Input
            label="Child’s Age (in months)"
            name="childAge"
            value={values.childAge || ""}
            required
          />
          <Input label="⁠Parent’s Full Name" name="parentName" required />
          <Input
            label="⁠Parent’s  Email"
            type="email"
            name="parentEmail"
            required
          />
          <Input
            label="Parent’s Phone Number"
            type="tel"
            name="parentPhoneNumber"
            required
          />
          <Input
            label="Parent’s Whatsapp Number"
            type="tel"
            name="parentWhatsappNumber"
            required
          />
          <Input label=" ⁠House Address" name="address" required />
        </div>

        <div className="border-b pt-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 pt-8">
          <Input
            label="Emergency Contact Full Name"
            name="emergencyContactName"
            required
          />
          <Input
            label="Emergency Contact’s Phone Number "
            type="tel"
            name="emergencyContactPhoneNumber"
            required
          />
          <Input
            label="Emergency Contact’s Whatsapp Number"
            type="tel"
            name="emergencyContactWhatsappNumber"
            required
          />
          <Input
            label="⁠Emergency Contact’s Relationship with Child"
            name="emergencyContactRelationshipToChild"
            required
          />
        </div>

        <div className="border-b pt-8" />

        <div className="grid grid-cols-1  gap-x-6 pt-8">
          <div className="col-span-1">
            <RadioButton
              label="Will you do the drop off & pick up of your child daily? (If no, please state two alternative names that may do the drop off and pick up) "
              name="dropChildOffSelf"
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              required
            />
          </div>
          {values?.dropChildOffSelf === false && (
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
                      values?.dropOffNames?.map((val: any, index: any) => (
                        <div className="flex gap-5 items-center " key={index}>
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

                          <div className="flex gap-2">
                            <MdAdd
                              className="w-5 h-5 bg-primary text-white border-primary mt-3 cursor-pointer rounded-md "
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
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="w-full lg:w-1/3 py-3 "
        >
          Back
        </Button>

        {/* Next Button */}
        <Button
          type="button"
          onClick={nextStep}
          // disabled={hasErrors ||  !dirty }

          className={`w-full lg:w-1/3 py-3 font-bold rounded-lg shadow-lg border-2 text-white bg-gradient-to-r from-[#008C7E] to-[#00B597] border-[#00B597] hover:opacity-90 `}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ChildAndGuardianInfo;
