"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import SkeletonLoader from "../components/SkeletonLoader";
import SearchBar from "../components/SearchBar";
import CustomTable from "../components/CustomTable";
import CustomTabs from "@/components/shared/CustomTabs";
import { formatMoneyToCedis } from "@/utils/constants";
import { FeeRequest } from "./types";
import FeeRequestDetailsModal from "./components/FeeRequestDetailsModal";
import StatusUpdateModal from "./components/StatusUpdateModal";
import ProgramInvoiceModal from "./components/ProgramInvoiceModal";
import ActionMenu from "./components/ActionMenu";
import TableActions from "./components/TableActions";



const FeeRequests = () => {
  const [feeRequests, setFeeRequests] = useState<FeeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<FeeRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isProgramInvoiceModalOpen, setIsProgramInvoiceModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [programPrices, setProgramPrices] = useState<{ [key: string]: number }>({});

  const fetchFeeRequests = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      let query = supabase.from("fee_requests").select("*").order("created_at", { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(`parent_name.ilike.%${searchQuery}%,child_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred");
        setFeeRequests([]);
      } else {
        setFeeRequests(data || []);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
      setFeeRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFeeRequests();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchFeeRequests]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (actionMenuOpen && !target.closest('.action-menu-container')) {
        setActionMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionMenuOpen]);

  // Group requests by status
  const groupRequestsByStatus = (requests: FeeRequest[] | null) => {
    const grouped: Record<string, FeeRequest[]> = {
      pending: [],
      invoiced: [],
      paid: [],
      cancelled: [],
    };

    requests?.forEach((request) => {
      if (grouped[request.status]) {
        grouped[request.status].push(request);
      }
    });

    return grouped;
  };

  const groupedData = groupRequestsByStatus(feeRequests);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      invoiced: { color: "bg-blue-100 text-blue-800", label: "Invoiced" },
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("fee_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (error) {
        toast.error("Failed to update status");
      } else {
        toast.success("Status updated successfully!");
        fetchFeeRequests();
        setIsStatusModalOpen(false);
        setSelectedStatus("");
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
    }
  };

  const feeRequestColumns = () => [
    { name: "Parent Name", selector: (row: FeeRequest) => row.parent_name },
    { name: "Email", selector: (row: FeeRequest) => row.email },
    { name: "Phone", selector: (row: FeeRequest) => row.phone_number },
    { 
      name: "Status", 
      cell: (row: FeeRequest) => getStatusBadge(row.status) 
    },
    { 
      name: "Created At", 
      selector: (row: FeeRequest) => formatDateTime(row.created_at) 
    },
    {
      name: "Actions",
      cell: (row: FeeRequest) => (
        <TableActions
          rowId={row.id}
          buttonRefs={buttonRefs}
          actionMenuOpen={actionMenuOpen}
          onActionMenuToggle={(rowId) => setActionMenuOpen(rowId || null)}
          onMenuPositionUpdate={setMenuPosition}
        />
      ),
    },
  ];

  const handleSendInvoice = async () => {
    if (!selectedRequest || !invoiceAmount) {
      toast.error("Please enter an invoice amount");
      return;
    }

    setSendingInvoice(true);

    try {
      // Update the fee request status to invoiced
      const { error: updateError } = await supabase
        .from("fee_requests")
        .update({
          status: "invoiced",
          invoice_amount: parseFloat(invoiceAmount) * 100, // Convert to pesewas
          invoice_sent_at: new Date().toISOString(),
        })
        .eq("id", selectedRequest.id);

      if (updateError) {
        console.error("Error updating fee request:", updateError);
        toast.error("Failed to update fee request");
        return;
      }

      // Send invoice email
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          parentName: selectedRequest.parent_name,
          email: selectedRequest.email,
          childName: selectedRequest.child_name,
          programs: selectedRequest.programs,
          dayCareSchedule: selectedRequest.day_care_schedule,
          amount: parseFloat(invoiceAmount),
        }),
      });

      if (!response.ok) {
        toast.error("Failed to send invoice email");
        return;
      }

      toast.success("Invoice sent successfully!");
      setIsInvoiceModalOpen(false);
      setSelectedRequest(null);
      setInvoiceAmount("");
      fetchFeeRequests(); // Refresh the list
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("An error occurred while sending invoice");
    } finally {
      setSendingInvoice(false);
    }
  };

  const handleSendProgramInvoice = async () => {
    if (!selectedRequest) {
      toast.error("No request selected");
      return;
    }

    // Check if all programs have prices
    const missingPrices = selectedRequest.programs.filter(program => !programPrices[program] || programPrices[program] <= 0);
    if (missingPrices.length > 0) {
      toast.error(`Please enter valid prices for: ${missingPrices.join(", ")}`);
      return;
    }

    const totalAmount = selectedRequest.programs.reduce((total, program) => {
      return total + (programPrices[program] || 0);
    }, 0);

    if (totalAmount <= 0) {
      toast.error("Total amount must be greater than 0");
      return;
    }

    setSendingInvoice(true);

    try {
      // Update the fee request status to invoiced
      const { error: updateError } = await supabase
        .from("fee_requests")
        .update({
          status: "invoiced",
          invoice_amount: totalAmount * 100, // Convert to pesewas
          invoice_sent_at: new Date().toISOString(),
        })
        .eq("id", selectedRequest.id);

      if (updateError) {
        console.error("Error updating fee request:", updateError);
        toast.error("Failed to update fee request");
        return;
      }

      // Send invoice email with program breakdown
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          parentName: selectedRequest.parent_name,
          email: selectedRequest.email,
          childName: selectedRequest.child_name,
          programs: selectedRequest.programs,
          dayCareSchedule: selectedRequest.day_care_schedule,
          amount: totalAmount,
          programBreakdown: programPrices,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to send invoice email");
        return;
      }

      toast.success(`Invoice sent successfully! Email with payment link sent to ${selectedRequest.email}`);
      setIsProgramInvoiceModalOpen(false);
      setSelectedRequest(null);
      setProgramPrices({});
      fetchFeeRequests(); // Refresh the list
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("An error occurred while sending invoice");
    } finally {
      setSendingInvoice(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedRequest) return 0;
    return selectedRequest.programs.reduce((total, program) => {
      return total + (programPrices[program] || 0);
    }, 0);
  };

  const handleContactParent = (request: FeeRequest) => {
    // Open email client with pre-filled details
    const subject = encodeURIComponent(`Fee Request - ${request.programs.join(", ")}`);
    const body = encodeURIComponent(`
Dear ${request.parent_name},

Regarding your fee request for ${request.child_name}:

Programs: ${request.programs.join(", ")}
${request.day_care_schedule ? `Daycare Schedule: ${request.day_care_schedule}` : ''}
Child Name: ${request.child_name}

We are processing your request and will send you an invoice shortly.

Best regards,
Petite Elise Preschool Team
    `);
    
    window.open(`mailto:${request.email}?subject=${subject}&body=${body}`);
  };

  const tabs = [
    {
      label: "Pending",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by parent name, child name, program, or email..." />
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData.pending}
              columns={feeRequestColumns()}
            />
          )}
        </div>
      ),
    },
    {
      label: "Invoiced",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by parent name, child name, program, or email..." />
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData.invoiced}
              columns={feeRequestColumns()}
            />
          )}
        </div>
      ),
    },
    {
      label: "Paid",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by parent name, child name, program, or email..." />
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData.paid}
              columns={feeRequestColumns()}
            />
          )}
        </div>
      ),
    },
    {
      label: "Cancelled",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by parent name, child name, program, or email..." />
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData.cancelled}
              columns={feeRequestColumns()}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {isLoading || feeRequests === null ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchFeeRequests()}>Retry</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Fee Requests</h1>
              <p className="text-gray-600">Manage fee requests from parents</p>
            </div>
          </div>
          
          {feeRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No fee requests found</div>
              <p className="text-gray-400 mb-6">No fee requests have been submitted yet</p>
            </div>
          ) : (
            <CustomTabs tabs={tabs} activeColor="text-blue-600" inactiveColor="text-gray-400" />
          )}
        </>
      )}

             {/* Details Modal */}
       <FeeRequestDetailsModal
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         selectedRequest={selectedRequest}
         getStatusBadge={getStatusBadge}
         getProgramsDisplay={getProgramsDisplay}
       />

      {/* Invoice Modal */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold mb-4">Send Invoice</DialogTitle>
          {selectedRequest && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Send an invoice to {selectedRequest.parent_name} for {selectedRequest.child_name}&apos;s {selectedRequest.programs.join(", ")} fees.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Amount (GHS)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter amount in Ghana Cedis"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setIsInvoiceModalOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendInvoice}
                  disabled={sendingInvoice || !invoiceAmount}
                  className="bg-primary hover:bg-opacity-90 text-white"
                >
                  {sendingInvoice ? "Sending..." : "Send Invoice"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
                    </Dialog>

                      {/* Status Update Modal */}
       <StatusUpdateModal
         isOpen={isStatusModalOpen}
         onClose={() => {
           setIsStatusModalOpen(false);
           setSelectedStatus("");
         }}
         selectedRequest={selectedRequest}
         selectedStatus={selectedStatus}
         onStatusSelect={setSelectedStatus}
         onStatusUpdate={() => {
           if (selectedStatus && selectedRequest) {
             handleStatusUpdate(selectedRequest.id, selectedStatus);
           }
         }}
         getStatusBadge={getStatusBadge}
       />

                {/* Program Invoice Modal */}
       <ProgramInvoiceModal
         isOpen={isProgramInvoiceModalOpen}
         onClose={() => {
           setIsProgramInvoiceModalOpen(false);
           setProgramPrices({});
         }}
         selectedRequest={selectedRequest}
         programPrices={programPrices}
         onProgramPriceChange={(program, price) => {
           setProgramPrices(prev => ({
             ...prev,
             [program]: price
           }));
         }}
         onSendInvoice={handleSendProgramInvoice}
         sendingInvoice={sendingInvoice}
         calculateTotal={calculateTotal}
       />

                {/* Action Menu Portal */}
       <ActionMenu
         isOpen={!!actionMenuOpen}
         menuPosition={menuPosition}
         onClose={() => setActionMenuOpen(null)}
         onViewDetails={() => {
           const selectedRow = feeRequests.find(r => r.id === actionMenuOpen);
           if (selectedRow) {
             setSelectedRequest(selectedRow);
             setIsModalOpen(true);
           }
           setActionMenuOpen(null);
         }}
         onContactParent={() => {
           const selectedRow = feeRequests.find(r => r.id === actionMenuOpen);
           if (selectedRow) {
             handleContactParent(selectedRow);
           }
           setActionMenuOpen(null);
         }}
         onUpdateStatus={() => {
           const selectedRow = feeRequests.find(r => r.id === actionMenuOpen);
           if (selectedRow) {
             setSelectedRequest(selectedRow);
             setIsStatusModalOpen(true);
           }
           setActionMenuOpen(null);
         }}
         onSendInvoice={() => {
           const selectedRow = feeRequests.find(r => r.id === actionMenuOpen);
           if (selectedRow) {
             setSelectedRequest(selectedRow);
             setIsProgramInvoiceModalOpen(true);
           }
           setActionMenuOpen(null);
         }}
       />
     </div>
   );
 };

export default FeeRequests; 