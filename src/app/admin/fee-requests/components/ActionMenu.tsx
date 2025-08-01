"use client";

import { createPortal } from "react-dom";

import { FeeRequest } from "../types";

interface ActionMenuProps {
  isOpen: boolean;
  menuPosition: { x: number; y: number };
  onClose: () => void;
  onViewDetails: () => void;
  onContactParent: () => void;
  onUpdateStatus: () => void;
  onSendInvoice: () => void;
}

const ActionMenu = ({
  isOpen,
  menuPosition,
  onClose,
  onViewDetails,
  onContactParent,
  onUpdateStatus,
  onSendInvoice,
}: ActionMenuProps) => {
  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed z-[9999] w-48 bg-white border border-gray-200 rounded-md shadow-xl action-menu-container"
      style={{
        left: menuPosition.x,
        top: menuPosition.y
      }}
    >
      <div className="py-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onViewDetails();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          View Details
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onContactParent();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Contact Parent
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onUpdateStatus();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Update Status
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onSendInvoice();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer"
        >
          Send Invoice
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ActionMenu; 