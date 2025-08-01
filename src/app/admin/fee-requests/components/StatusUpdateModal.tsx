"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

import { FeeRequest } from "../types";

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: FeeRequest | null;
  selectedStatus: string;
  onStatusSelect: (status: string) => void;
  onStatusUpdate: () => void;
  getStatusBadge: (status: string) => JSX.Element;
}

const StatusUpdateModal = ({
  isOpen,
  onClose,
  selectedRequest,
  selectedStatus,
  onStatusSelect,
  onStatusUpdate,
  getStatusBadge,
}: StatusUpdateModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
        <DialogTitle className="text-lg font-bold mb-4">Update Status</DialogTitle>
        {selectedRequest && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Update status for <strong>{selectedRequest.parent_name}</strong>'s request for <strong>{selectedRequest.child_name}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Current Status: {getStatusBadge(selectedRequest.status)}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onStatusSelect("pending")}
                  className={`p-3 text-left border rounded-md transition-colors ${
                    selectedStatus === "pending" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span className="text-sm font-medium">Pending</span>
                    {selectedStatus === "pending" && (
                      <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Request is being reviewed</p>
                </button>
                
                <button
                  onClick={() => onStatusSelect("invoiced")}
                  className={`p-3 text-left border rounded-md transition-colors ${
                    selectedStatus === "invoiced" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                    <span className="text-sm font-medium">Invoiced</span>
                    {selectedStatus === "invoiced" && (
                      <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Invoice has been sent</p>
                </button>
                
                <button
                  onClick={() => onStatusSelect("paid")}
                  className={`p-3 text-left border rounded-md transition-colors ${
                    selectedStatus === "paid" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                    <span className="text-sm font-medium">Paid</span>
                    {selectedStatus === "paid" && (
                      <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Payment completed</p>
                </button>
                
                <button
                  onClick={() => onStatusSelect("cancelled")}
                  className={`p-3 text-left border rounded-md transition-colors ${
                    selectedStatus === "cancelled" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                    <span className="text-sm font-medium">Cancelled</span>
                    {selectedStatus === "cancelled" && (
                      <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Request cancelled</p>
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end pt-4">
              <Button
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={onStatusUpdate}
                disabled={!selectedStatus}
                className="bg-primary hover:bg-opacity-90 text-white"
              >
                Update Status
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal; 