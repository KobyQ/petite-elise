/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import CustomSelect from "../shared/forms/CustomSelect";
import { Button } from "../ui/button";

type ClubProgramSelectionProps = {
  nextStep: () => void;
  prevStep: () => void;
};

const ChristmasProgramSelection: React.FC<ClubProgramSelectionProps> = ({
  nextStep,
  prevStep,
}) => {
  const programOptions = [
    { label: "Christmas Camp", value: "Christmas Camp" },
  ];



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

export default ChristmasProgramSelection;
