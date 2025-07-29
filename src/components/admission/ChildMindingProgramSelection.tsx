/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import CustomSelect from "../shared/forms/CustomSelect";
import { Button } from "../ui/button";
import supabase from "@/utils/supabaseClient";
import { formatMoneyToCedis } from "@/utils/constants";

type ChildMindingProgramSelectionProps = {
  values: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const ChildMindingProgramSelection: React.FC<
  ChildMindingProgramSelectionProps
> = ({ values, setFieldValue, nextStep, prevStep }) => {
  const [pricingOptions, setPricingOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const programOptions = [{ label: "Childminding", value: "Childminding" }];

  // Fetch pricing from admin configuration
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data, error } = await supabase
          .from("program_pricing")
          .select("*")
          .eq("program_name", "Childminding")
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
            name="childMindingSchedule"
            options={pricingOptions}
            isDisabled={loading}
            required
            placeholder={loading ? "Loading schedules..." : "Select a schedule"}
          />
        )}

        {isChildMindingSelected && values.childMindingSchedule && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Selected Plan:</h4>
            <p className="text-blue-700">
              <strong>{values.childMindingSchedule}</strong>
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
          disabled={!values.childMindingSchedule}
          className={`w-full lg:w-1/3 py-3 font-bold rounded-lg shadow-lg border-2 text-white bg-gradient-to-r from-[#008C7E] to-[#00B597] border-[#00B597] hover:opacity-90 `}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ChildMindingProgramSelection;
