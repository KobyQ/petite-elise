/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { toast } from "react-toastify";
import SkeletonLoader from "../../components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import CustomTable from "../../components/CustomTable";

import supabase from "@/utils/supabaseClient";
import moment from "moment";

interface ShopOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    images?: string[];
  }>;
  total_amount: number;
  discount_code?: string;
  discount_data?: any;
  reference: string;
  order_id: string;
  status: string;
  payment_date: string;
  created_at: string;
}

const orderColumns = (
  handleViewOrder: (order: ShopOrder) => void,
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>,
  handleUpdateStatus: (order: ShopOrder) => void,
  setSelectedOrder: React.Dispatch<React.SetStateAction<ShopOrder | null>>,
  setIsActionsOpen: React.Dispatch<React.SetStateAction<string | null>>,
  isActionsOpen: string | null
) => [
  {
    name: "Order #",
    selector: (row: any) => row?.order_id ?? "N/A",
    sortable: true,
    grow: 1,
    minWidth: "120px",
  },
  {
    name: "Customer",
    cell: (row: any) => (
      <div className="py-2">
        <div className="font-medium">{row?.customer_name ?? "N/A"}</div>
        <div className="text-sm text-gray-500">{row?.customer_email ?? "N/A"}</div>
        <div className="text-xs text-gray-400">{row?.customer_phone ?? "N/A"}</div>
      </div>
    ),
    grow: 2,
    minWidth: "200px",
  },
  {
    name: "Items",
    selector: (row: any) => `${row?.items?.length || 0} items`,
    sortable: true,
    grow: 0.5,
    minWidth: "80px",
  },
  {
    name: "Total",
    selector: (row: any) => `₵${((row?.total_amount || 0) / 100).toFixed(2)}`,
    sortable: true,
    right: true,
    grow: 0.5,
    minWidth: "100px",
  },
  {
    name: "Status",
    cell: (row: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row?.status === "delivered"
            ? "bg-green-100 text-green-800"
            : row?.status === "processing"
            ? "bg-yellow-100 text-yellow-800"
            : row?.status === "paid"
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row?.status?.charAt(0).toUpperCase() + row?.status?.slice(1) || "Pending"}
      </span>
    ),
    sortable: true,
    grow: 0.5,
    minWidth: "100px",
  },
  {
    name: "Payment Date",
    selector: (row: any) => moment(row?.payment_date || row?.created_at).format("MMM DD, YYYY"),
    sortable: true,
    grow: 0.8,
    minWidth: "120px",
  },
  {
    name: "Actions",
    cell: (row: any) => (
      <div className="relative">
        <button
          onClick={() => {
            setSelectedOrder(row);
            setIsActionsOpen(row.id);
          }}
          className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        
        {/* Dropdown Menu */}
        {isActionsOpen === row.id && (
          <div className="actions-dropdown absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              <button
                onClick={() => {
                  setIsActionsOpen(null);
                  handleViewOrder(row);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Order
              </button>
              
              <button
                onClick={() => {
                  setIsActionsOpen(null);
                  handleUpdateStatus(row);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Status
              </button>
            </div>
          </div>
        )}
      </div>
    ),
    right: true,
    grow: 0,
    width: "80px",
  },
];

const Orders = () => {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const [statusForm, setStatusForm] = useState({
    status: "",
  });

  // Fetch orders from Supabase
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      let query = supabase
        .from("shop_orders")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.or(`order_id.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
      }
      
      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred");
        setOrders([]);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isActionsOpen && !(event.target as Element).closest('.actions-dropdown')) {
        setIsActionsOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionsOpen]);

  const handleViewOrder = (order: ShopOrder) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleUpdateStatus = (order: ShopOrder) => {
    setSelectedOrder(order);
    setStatusForm({
      status: "",
    });
    setIsStatusOpen(true);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder || !statusForm.status) {
      toast.error("Please select a status to update to", { position: "top-right" });
      return;
    }

    setStatusUpdateLoading(true);

    try {
      const { error } = await supabase
        .from("shop_orders")
        .update({
          status: statusForm.status,
        })
        .eq("id", selectedOrder.id);

      if (error) {
        toast.error("Failed to update order status", { position: "top-right" });
      } else {
        toast.success(`Order status updated to ${statusForm.status}!`, { position: "top-right" });
        setOrders((prev) =>
          prev.map((order) =>
            order.id === selectedOrder.id
              ? {
                  ...order,
                  status: statusForm.status,
                }
              : order
          )
        );
        setIsStatusOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!", { position: "top-right" });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const statusOptions = [
    { value: "paid", label: "Paid" },
    { value: "processing", label: "Processing" },
    { value: "delivered", label: "Delivered" },
  ];

  console.log("selectedOrder", selectedOrder)
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop Orders</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search orders by ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchOrders()}>Retry</Button>
        </div>
      ) : (
        <CustomTable
          data={orders}
          columns={orderColumns(handleViewOrder, setIsViewOpen, handleUpdateStatus, setSelectedOrder, setIsActionsOpen, isActionsOpen)}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
        />
      )}

      {/* View Order Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-lg font-bold mb-4">
            Order Details - {selectedOrder?.order_id}
          </DialogTitle>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                  <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer_phone || "N/A"}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
                  <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
                  <p><strong>Payment Date:</strong> {moment(selectedOrder.payment_date || selectedOrder.created_at).format("MMMM DD, YYYY HH:mm")}</p>
                  <p><strong>Status:</strong> <span className="capitalize">{selectedOrder.status}</span></p>
                  <p><strong>Reference:</strong> {selectedOrder.reference}</p>
                </div>
              </div>

              {/* Discount Information */}
              {selectedOrder.discount_code && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Discount Applied</h3>
                  <p><strong>Code:</strong> {selectedOrder.discount_code}</p>
                  {selectedOrder.discount_data && (
                    <p><strong>Discount Amount:</strong> ₵{((selectedOrder.discount_data.discount_amount || 0) / 100).toFixed(2)}</p>
                  )}
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-center">Quantity</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                                             {selectedOrder.items?.map((item, index) => (
                         <tr key={index} className="border-t">
                           <td className="px-4 py-2">{item.name || "N/A"}</td>
                           <td className="px-4 py-2 text-center">{item.quantity}</td>
                           <td className="px-4 py-2 text-right">₵{(item.price / 100).toFixed(2)}</td>
                           <td className="px-4 py-2 text-right">₵{((item.price * item.quantity) / 100).toFixed(2)}</td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Order Summary</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-lg">₵{(selectedOrder.total_amount / 100).toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount_code && selectedOrder.discount_data && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount Applied:</span>
                      <span>-₵{((selectedOrder.discount_data.discount_amount || 0) / 100).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold mb-4">
            Update Order Status
          </DialogTitle>
          
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Select Status</label>
                             <select
                 value={statusForm.status}
                 onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
               >
                 <option value="">Select a status...</option>
                 {statusOptions.map((option) => (
                   <option key={option.value} value={option.value}>
                     {option.label}
                   </option>
                 ))}
               </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsStatusOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={updateOrderStatus}
              disabled={statusUpdateLoading}
              className="text-white"
            >
              {statusUpdateLoading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default Orders;
