/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import CustomSelect from "../shared/forms/CustomSelect";
import { Button } from "../ui/button";

type ClubProgramSelectionProps = {
  values: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const ClubProgramSelection: React.FC<ClubProgramSelectionProps> = ({
  values,
  setFieldValue,
  nextStep,
  prevStep,
}) => {
  const programOptions = [
    { label: "Saturday Kids Club", value: "Saturday Kids Club" },
    { label: "Summer Camp", value: "Summer Camp" },
    { label: "Christmas Camp", value: "Christmas Camp" },
  ];
  const saturdayClubDuration = [
    { label: "Full Day", value: "Full Day" },
    { label: "Half Day", value: "Half Day" },
  ];

  const saturdayClubSchedule = [
    { label: "Termly", value: "Termly" },
    { label: "Walk-In", value: "Walk-In" },
  ];

  const summerCampSchedule = [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Termly", value: "Termly" },
  ];

  const isSaturdayKidsClubSelected =
    values?.programs?.includes("Saturday Kids Club");
  const isSummerCampSelected = values?.programs?.includes("Summer Camp");

  // Effect to clear schedule when Saturday Kids Club is deselected
  useEffect(() => {
    if (!isSaturdayKidsClubSelected && values?.saturdayClubDuration) {
      setFieldValue("saturdayClubDuration", "", false);
    }

    if (!isSaturdayKidsClubSelected && values?.saturdayClubSchedule) {
      setFieldValue("saturdayClubSchedule", "", false);
    }
  }, [isSaturdayKidsClubSelected, values, setFieldValue]);

  // Effect to clear schedule when Summer Camp is deselected
  useEffect(() => {
    if (!isSummerCampSelected && values?.summerCampSchedule) {
      setFieldValue("summerCampSchedule", "", false);
    }
  }, [isSummerCampSelected, values, setFieldValue]);

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

        {isSaturdayKidsClubSelected && (
          <div>
            <CustomSelect
              label="Select Duration"
              name="saturdayClubDuration"
              options={saturdayClubDuration}
              required
              placeholder="Select a duration"
            />
            <CustomSelect
              label="Select Schedule"
              name="saturdayClubSchedule"
              options={saturdayClubSchedule}
              required
              placeholder="Select a schedule"
            />
          </div>
        )}

        {isSummerCampSelected && (
          <CustomSelect
            label="Select Schedule"
            name="dayCareSchedule"
            options={summerCampSchedule}
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

export default ClubProgramSelection;
