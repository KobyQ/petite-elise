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

const SaturdayProgramSelection: React.FC<ClubProgramSelectionProps> = ({
  values,
  setFieldValue,
  nextStep,
  prevStep,
}) => {
  const [pricingOptions, setPricingOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  // Fetch pricing from admin configuration
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data, error } = await supabase
          .from("program_pricing")
          .select("*")
          .eq("program_name", "Saturday Kids Club")
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

  // Auto-set Saturday Kids Club program
  useEffect(() => {
    if (!values?.programs?.includes("Saturday Kids Club")) {
      setFieldValue("programs", ["Saturday Kids Club"], false);
    }
  }, [values?.programs, setFieldValue]);

  // Get selected pricing details
  const selectedPricing = pricingOptions.find(
    (option) => option.value === values?.saturdayClubSchedule
  );

  return (
    <div>
      <div className="mb-10 mt-5">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Program</h3>
          <p className="text-blue-700">
            <strong>Saturday Kids Club</strong> - Weekly sessions for children aged 3-8 years
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Fun-filled activities including arts, crafts, games, and educational play every Saturday.
          </p>
        </div>

        <CustomSelect
          label="Select Schedule"
          name="saturdayClubSchedule"
          options={pricingOptions}
          required
          placeholder={loading ? "Loading pricing..." : "Select a schedule"}
          isDisabled={loading}
        />

        {selectedPricing && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Selected Plan:</h4>
            <p className="text-green-700">
              <strong>{selectedPricing.value}</strong> - {formatMoneyToCedis(selectedPricing.price)}
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
          disabled={!values?.saturdayClubSchedule}
          className={`w-full lg:w-1/3 py-3 font-bold rounded-lg shadow-lg border-2 text-white bg-gradient-to-r from-[#008C7E] to-[#00B597] border-[#00B597] hover:opacity-90 ${
            !values?.saturdayClubSchedule ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SaturdayProgramSelection;
