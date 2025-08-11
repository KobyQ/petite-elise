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

  // Auto-set Childminding program
  useEffect(() => {
    if (!values?.programs?.includes("Childminding")) {
      setFieldValue("programs", ["Childminding"], false);
    }
  }, [values?.programs, setFieldValue]);

  return (
    <div>
      <div className="mb-10 mt-5">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Program</h3>
          <p className="text-blue-700">
            <strong>Childminding Program</strong> - Professional childcare services
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Safe, nurturing care for your child with flexible scheduling options to meet your family&apos;s needs.
          </p>
        </div>

        <CustomSelect
          label="Select Schedule"
          name="childMindingSchedule"
          options={pricingOptions}
          isDisabled={loading}
          required
          placeholder={loading ? "Loading schedules..." : "Select a schedule"}
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
          disabled={!values.childMindingSchedule}
          className={`w-full lg:w-1/3 py-3 font-bold rounded-lg shadow-lg border-2 text-white bg-gradient-to-r from-[#008C7E] to-[#00B597] border-[#00B597] hover:opacity-90 ${
            !values.childMindingSchedule ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ChildMindingProgramSelection;
