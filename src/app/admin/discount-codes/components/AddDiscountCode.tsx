/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";

interface AddDiscountCodeProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setDiscountCodes: React.Dispatch<React.SetStateAction<any[]>>;
}

const AddDiscountCode: React.FC<AddDiscountCodeProps> = ({
  isOpen,
  setIsOpen,
  setDiscountCodes,
}) => {
  const [formData, setFormData] = useState({
    discount_code: "",
    discount_percentage: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.discount_code.trim()) {
      toast.error("Discount code is required", { position: "top-right" });
      return;
    }

    if (!formData.discount_percentage || parseFloat(formData.discount_percentage) <= 0) {
      toast.error("Valid discount percentage is required", { position: "top-right" });
      return;
    }

    if (parseFloat(formData.discount_percentage) > 100) {
      toast.error("Discount percentage cannot exceed 100%", { position: "top-right" });
      return;
    }

    setLoading(true);

    try {
      // Check if discount code already exists
      const { data: existingCode } = await supabase
        .from("discount_codes")
        .select("discount_code")
        .eq("discount_code", formData.discount_code.trim().toUpperCase())
        .single();

      if (existingCode) {
        toast.error("Discount code already exists", { position: "top-right" });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("discount_codes")
        .insert([
          {
            discount_code: formData.discount_code.trim().toUpperCase(),
            discount_percentage: parseFloat(formData.discount_percentage),
            is_active: formData.is_active,
            usage_count: 0,
          },
        ])
        .select();

      if (error) {
        toast.error("Failed to create discount code. Please try again.", {
          position: "top-right",
        });
      } else {
        toast.success("Discount code created successfully!", {
          position: "top-right",
        });
        setDiscountCodes((prev) => [data[0], ...prev]);
        setIsOpen(false);
        setFormData({
          discount_code: "",
          discount_percentage: "",
          is_active: true,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
        <DialogTitle className="text-lg font-bold mb-4">
          Add New Discount Code
        </DialogTitle>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Discount Code</label>
            <input
              type="text"
              id="discount_code"
              name="discount_code"
              value={formData.discount_code}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              placeholder="Enter discount code"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Discount Percentage</label>
            <input
              type="number"
              id="discount_percentage"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              placeholder="Enter percentage (1-100)"
              min="0.01"
              max="100"
              step="0.01"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-white"
            >
              {loading ? "Creating..." : "Create Discount Code"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDiscountCode;
