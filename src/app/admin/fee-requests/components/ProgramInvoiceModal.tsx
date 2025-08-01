"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

import { FeeRequest } from "../types";

interface ProgramInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: FeeRequest | null;
  programPrices: { [key: string]: number };
  onProgramPriceChange: (program: string, price: number) => void;
  onSendInvoice: () => void;
  sendingInvoice: boolean;
  calculateTotal: () => number;
}

const ProgramInvoiceModal = ({
  isOpen,
  onClose,
  selectedRequest,
  programPrices,
  onProgramPriceChange,
  onSendInvoice,
  sendingInvoice,
  calculateTotal,
}: ProgramInvoiceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white border border-gray-300 rounded-lg shadow-lg p-6 overflow-hidden flex flex-col">
        <DialogTitle className="text-lg font-bold mb-4 flex-shrink-0">Create & Send Invoice with Payment Link</DialogTitle>
        {selectedRequest && (
          <>
            <div className="space-y-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Create a detailed invoice for <strong>{selectedRequest.parent_name}</strong>'s request for <strong>{selectedRequest.child_name}</strong>
                </p>
                {selectedRequest.day_care_schedule && (
                  <p className="text-sm text-gray-500">
                    Schedule: {selectedRequest.day_care_schedule}
                  </p>
                )}
                <p className="text-sm text-blue-600 mt-2">
                  <strong>Note:</strong> This will send an email with a payment breakdown and a secure Paystack payment link.
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Program Pricing Breakdown
                </label>
                <div className="space-y-3">
                  {selectedRequest.programs.map((program, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{program}</p>
                        <p className="text-xs text-gray-500 mt-1">Individual program fee</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 font-medium">GHS</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={programPrices[program] || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            onProgramPriceChange(program, value);
                          }}
                          className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900">Subtotal:</span>
                    <span className="text-lg font-semibold text-gray-700">
                      GHS {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-xl font-bold text-blue-600">
                      GHS {calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * This amount will be charged via Paystack payment gateway
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end pt-4 border-t mt-4 flex-shrink-0">
              <Button
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={onSendInvoice}
                disabled={sendingInvoice || calculateTotal() <= 0}
                className="bg-primary hover:bg-opacity-90 text-white"
              >
                {sendingInvoice ? "Creating Invoice..." : "Send Invoice & Payment Link"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProgramInvoiceModal; 