/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import CustomSelect from "../shared/forms/CustomSelect";
import { Button } from "../ui/button";

type ChildMindingProgramSelectionProps = {
  values: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const ChildMindingProgramSelection: React.FC<
  ChildMindingProgramSelectionProps
> = ({ values, setFieldValue, nextStep, prevStep }) => {
  const programOptions = [{ label: "Childminding", value: "Childminding" }];
  const childMindingSchedule = [
    { label: "Full Day", value: "Full Day" },
    { label: "Half Day", value: "Half Day" },
  ];

  const isChildMindingSelected = values?.programs?.includes("Childminding");

  // Effect to clear schedule when Childminding is deselected
  useEffect(() => {
    if (!isChildMindingSelected && values?.childMindingSchedule) {
      setFieldValue("childMindingSchedule", "", false);
    }
  }, [isChildMindingSelected, values, setFieldValue]);

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

        {isChildMindingSelected && (
          <CustomSelect
            label="Select Schedule"
            name="dayCareSchedule"
            options={childMindingSchedule}
            required
            placeholder="Select a schedule"
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

export default ChildMindingProgramSelection;
