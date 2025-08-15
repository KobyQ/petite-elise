/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import CustomSelect from "../shared/forms/CustomSelect";
import { Button } from "../ui/button";
import supabase from "@/utils/supabaseClient";
import { formatMoneyToCedis } from "@/utils/constants";

type ClubProgramSelectionProps = {
  values: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const SummerCampProgramSelection: React.FC<ClubProgramSelectionProps> = ({
  values,
  setFieldValue,
  nextStep,
  prevStep,
}) => {
  const [pricingOptions, setPricingOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Ensure Summer Camp is always selected
  useEffect(() => {
    if (!values.programs || !values.programs.includes("Summer Camp")) {
      setFieldValue("programs", ["Summer Camp"], false);
    }
  }, [values.programs, setFieldValue]);



  // Fetch pricing from admin configuration
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data, error } = await supabase
          .from("program_pricing")
          .select("*")
          .eq("program_name", "Summer Camp")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching pricing:", error);
        } else {
          const options = data?.map((item) => ({
            label: `${item.schedule} - ${formatMoneyToCedis(item.price)}`,
            value: item.schedule,
            price: item.price,
            id: item.id,
          })) || [];
          setPricingOptions(options);
        }
      } catch (error) {
        console.error("Error fetching pricing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);



  return (
    <div>
      <div className="mb-10 mt-5">
        {/* Show selected program (read-only) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Program
          </label>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-blue-800 font-medium">Summer Camp</span>
          </div>
        </div>

        {/* Schedule selection */}
        <CustomSelect
          label="Select Schedule"
          name="summerCampSchedule"
          options={pricingOptions}
          isDisabled={loading}
          required
          placeholder={loading ? "Loading schedules..." : "Select a schedule"}
        />

        {values.summerCampSchedule && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Selected Plan:</h4>
            <p className="text-blue-700">
              <strong>{values.summerCampSchedule}</strong>
            </p>
          </div>
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
          disabled={!values.summerCampSchedule}
          className={`w-full lg:w-1/3 py-3 font-bold rounded-lg shadow-lg border-2 text-white bg-gradient-to-r from-[#008C7E] to-[#00B597] border-[#00B597] hover:opacity-90 `}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SummerCampProgramSelection;
