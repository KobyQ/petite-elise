/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import CustomTable from "../components/CustomTable";
import AddDiscountCode from "./components/AddDiscountCode";

import supabase from "@/utils/supabaseClient";
import { discountCodeColumns } from "./columns";
import EditDiscountCode from "./components/EditDiscountCode";

interface DiscountCode {
  id: string;
  discount_code: string;
  discount_percentage: number;
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

const DiscountCodes = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedDiscountCode, setSelectedDiscountCode] = useState<DiscountCode | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch discount codes from Supabase
  const fetchDiscountCodes = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred");
        setDiscountCodes([]);
      } else {
        setDiscountCodes(data || []);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  const deleteDiscountCode = async () => {
    if (!selectedDiscountCode) return;

    setDeleteLoading(true);

    try {
      const { error } = await supabase
        .from("discount_codes")
        .delete()
        .eq("id", selectedDiscountCode.id);

      if (error) {
        toast.error("Failed to delete discount code. Please try again.", {
          position: "top-right",
        });
      } else {
        toast.success("Discount code deleted successfully!", {
          position: "top-right",
        });
        setDiscountCodes((prev) =>
          prev.filter((code) => code.id !== selectedDiscountCode.id)
        );
        setIsDeleteOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!", {
        position: "top-right",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchDiscountCodes()}>Retry</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button className="text-white" onClick={() => setIsAddOpen(true)}>
              Add Discount Code
            </Button>
          </div>
          <CustomTable
            data={discountCodes}
            columns={discountCodeColumns(
              setSelectedDiscountCode,
              setIsEditOpen,
              setIsDeleteOpen
            )}
          />
        </>
      )}

      {/* Add Discount Code Modal */}
      {isAddOpen && (
        <AddDiscountCode
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          setDiscountCodes={setDiscountCodes}
        />
      )}

      {/* Edit Discount Code Modal */}
      {isEditOpen && (
        <EditDiscountCode
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          discountCode={selectedDiscountCode}
          setDiscountCodes={setDiscountCodes}
        />
      )}

      {/* Confirm Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold">Confirm Deletion</DialogTitle>
          <p className="text-gray-600">
            Are you sure you want to delete the discount code{" "}
            <strong>{selectedDiscountCode?.discount_code}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteDiscountCode}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscountCodes;
