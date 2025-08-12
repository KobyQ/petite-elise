"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import SkeletonLoader from "../../components/SkeletonLoader";
import SearchBar from "../../components/SearchBar";
import CustomTable from "../../components/CustomTable";
import { formatMoneyToCedis } from "@/utils/constants";
import { SchoolFeesPayment } from "../types";

const SchoolFeesPayments = () => {
  const [payments, setPayments] = useState<SchoolFeesPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<SchoolFeesPayment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      let query = supabase
        .from("school_fees_payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(
          `parent_name.ilike.%${searchQuery}%,child_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,order_id.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred");
        setPayments([]);
      } else {
        setPayments(data || []);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPayments();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchPayments]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { color: "bg-green-100 text-green-800", label: "Success" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      failed: { color: "bg-red-100 text-red-800", label: "Failed" },
      cancelled: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      color: "bg-blue-100 text-blue-800", 
      label: status.charAt(0).toUpperCase() + status.slice(1) 
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getProgramsDisplay = (programs: string[]) => {
    return programs.join(", ");
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const columns = [
    { name: "Parent Name", selector: (row: SchoolFeesPayment) => row.parent_name },
    { name: "Child Name", selector: (row: SchoolFeesPayment) => row.child_name },
    { name: "Email", selector: (row: SchoolFeesPayment) => row.email },
    { name: "Phone", selector: (row: SchoolFeesPayment) => row.phone_number },
    { 
      name: "Amount", 
      selector: (row: SchoolFeesPayment) => formatMoneyToCedis(row.amount) 
    },
    { 
      name: "Status", 
      cell: (row: SchoolFeesPayment) => getStatusBadge(row.status) 
    },
    {
      name: "Actions",
      cell: (row: SchoolFeesPayment) => (
        <Button
          onClick={() => {
            setSelectedPayment(row);
            setIsModalOpen(true);
          }}
          variant="outline"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchPayments()}>Retry</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">School Fees Payments</h2>
              <p className="text-gray-600">View all successfully paid invoices</p>
            </div>
          </div>
          
          <SearchBar 
            query={searchQuery} 
            setQuery={setSearchQuery} 
            placeholder="Search by parent name, child name, email, or order ID..." 
          />
          
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No payments found</div>
              <p className="text-gray-400 mb-6">No school fees payments have been recorded yet</p>
            </div>
          ) : (
            <CustomTable
              data={payments}
              columns={columns}
            />
          )}
        </>
      )}

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-xl font-bold mb-4">Payment Details</DialogTitle>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                  <p className="text-gray-900">{selectedPayment.parent_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                  <p className="text-gray-900">{selectedPayment.child_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedPayment.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedPayment.phone_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <p className="text-gray-900 font-semibold">{formatMoneyToCedis(selectedPayment.amount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <p className="text-gray-900">{selectedPayment.order_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                  <p className="text-gray-900">{selectedPayment.reference}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                  <p className="text-gray-900">{formatDateTime(selectedPayment.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request ID</label>
                  <p className="text-gray-900">{selectedPayment.request_id}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Programs</label>
                <p className="text-gray-900">{getProgramsDisplay(selectedPayment.programs)}</p>
              </div>
              
              {selectedPayment.day_care_schedule && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daycare Schedule</label>
                  <p className="text-gray-900">{selectedPayment.day_care_schedule}</p>
                </div>
              )}
              
              {selectedPayment.additional_notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <p className="text-gray-900">{selectedPayment.additional_notes}</p>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolFeesPayments;
