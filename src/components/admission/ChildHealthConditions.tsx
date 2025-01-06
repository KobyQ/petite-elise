/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import CustomSelect from "../shared/forms/CustomSelect";
import RadioButton from "../shared/forms/RadioButton";
import CustomInputList from "../shared/forms/CustomInputList";
import { IEnrollChild } from "@/utils/interfaces";
import { Button } from "../ui/button";
import Input from "../shared/forms/Input";

type ChildHealthConditionsProps = {
  values: IEnrollChild;
  nextStep: () => void;
  prevStep: () => void;
};

const ChildHealthConditions = ({
  values,
  nextStep,
  prevStep,
}: ChildHealthConditionsProps) => {
  const options = [
    { label: "ADHD", value: "ADHD" },
    { label: "Dyslexia", value: "Dyslexia" },
    { label: "Autism", value: "Autism" },
    { label: "None", value: "None" },
    { label: "Other", value: "Other" },
  ];

  const foodOptions = [
    {
      label: "Feeding Full Package (breakfast , lunch, fruit snack) ",
      value: "Full Package",
    },
    { label: "Feeding ( lunch)", value: "Lunch" },
  ];

  return (
    <div className="mb-10 mt-5">
      <CustomSelect
        label="Add Ons (optional)"
        name="feeding"
        options={foodOptions}
        placeholder="Select an option"
      />

      <div className="flex flex-col gap-6 mt-8 ">
        <div>
          <RadioButton
            label="Does the child have any allergies? "
            name="hasAllergies"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            required
          />
          {values?.hasAllergies === true && (
            <CustomInputList
              label="Enter Allergies"
              name="allergies"
              required={values?.hasAllergies}
            />
          )}
        </div>

        <div>
          <RadioButton
            label="Does the child have any special health education considerations? "
            name="hasSpecialHealthConditions"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            required
          />
          {values?.hasSpecialHealthConditions === true && (
            <>
              <CustomSelect
                label="Special Health Consideration"
                name="specialHealthConditions"
                options={options}
                required={values?.hasSpecialHealthConditions}
                isMulti
                placeholder="Select special health consideration"
              />
              <p>
                Kindly see front desk for additional information regarding
                Special Education needs
              </p>
            </>
          )}
        </div>

        <div>
          <RadioButton
            label="Are you enrolling a sibling?"
            name="hasSibling"
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            required
          />
          {values?.hasSibling === true && (
            <Input label="Existing Sibling’s Full Name" name="sibling" required />
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
          className={`w-full lg:w-1/3 py-3 font-bold rounded-lg shadow-lg border-2 text-white bg-gradient-to-r from-[#008C7E] to-[#00B597] border-[#00B597] hover:opacity-90 `}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ChildHealthConditions;
