/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import CustomSelect from "../shared/forms/CustomSelect";
import { Button } from "../ui/button";

type ProgramSelectionProps = {
  values: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const ProgramSelection: React.FC<ProgramSelectionProps> = ({
  values,
  setFieldValue,
  nextStep,
  prevStep,
}) => {
  const programOptions = [
    { label: "Daycare", value: "Daycare" },
    { label: "Preschool", value: "Preschool" },
    { label: "Afterschool Care", value: "Afterschool Care" },
    { label: "Baby & Me", value: "Baby & Me" },
    { label: "Developmental Playgroup", value: "Developmental Playgroup" },
    {
      label: "Experiental Learning Activities",
      value: "Experiental Learning Activities",
    },
    { label: "Summer Camp", value: "Summer Camp" },
    { label: "Christmas Camp", value: "Christmas Camp" },
    { label: "Childminding", value: "Childminding" },
  ];

  const scheduleOptions = [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Termly", value: "Termly" },
  ];

  const isDaycareSelected = values?.programs?.includes("Daycare");

  // Effect to clear schedule when Daycare is deselected
  useEffect(() => {
    if (!isDaycareSelected && values?.schedule) {
      setFieldValue("schedule", "", false);
    }
  }, [isDaycareSelected, values, setFieldValue]);

  return (
    <div>
      <div className="mb-10 mt-5">
        <CustomSelect
          label="Program Selection"
          name="programs"
          options={programOptions}
          isMulti
          placeholder="Select program(s) you would like to enroll your child in"
          required
        />

        {isDaycareSelected && (
          <CustomSelect
            label="Select Schedule"
            name="dayCareSchedule"
            options={scheduleOptions}
            required
            placeholder="Select a schedule for Daycare"
          />
        )}
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

export default ProgramSelection;
