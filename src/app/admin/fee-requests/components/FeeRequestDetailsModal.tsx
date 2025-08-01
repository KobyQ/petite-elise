"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { formatMoneyToCedis } from "@/utils/constants";

import { FeeRequest } from "../types";

interface FeeRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: FeeRequest | null;
  getStatusBadge: (status: string) => JSX.Element;
  getProgramsDisplay: (programs: string[]) => string;
}

const FeeRequestDetailsModal = ({
  isOpen,
  onClose,
  selectedRequest,
  getStatusBadge,
  getProgramsDisplay,
}: FeeRequestDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border border-gray-300 rounded-lg shadow-lg p-6">
        <DialogTitle className="text-lg font-bold mb-4">Fee Request Details</DialogTitle>
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Parent Name</p>
                <p className="text-gray-900">{selectedRequest.parent_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-900">{selectedRequest.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-gray-900">{selectedRequest.phone_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Child Name</p>
                <p className="text-gray-900">{selectedRequest.child_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Programs</p>
                <p className="text-gray-900">{getProgramsDisplay(selectedRequest.programs)}</p>
              </div>
              {selectedRequest.day_care_schedule && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Daycare Schedule</p>
                  <p className="text-gray-900">{selectedRequest.day_care_schedule}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Requested On</p>
                <p className="text-gray-900">
                  {new Date(selectedRequest.created_at).toLocaleString()}
                </p>
              </div>
              {selectedRequest.invoice_amount && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Invoice Amount</p>
                  <p className="text-gray-900">{formatMoneyToCedis(selectedRequest.invoice_amount)}</p>
                </div>
              )}
              {selectedRequest.invoice_sent_at && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Invoice Sent</p>
                  <p className="text-gray-900">
                    {new Date(selectedRequest.invoice_sent_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            {selectedRequest.additional_notes && (
              <div>
                <p className="text-sm font-medium text-gray-700">Additional Notes</p>
                <p className="text-gray-900">{selectedRequest.additional_notes}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeeRequestDetailsModal; 