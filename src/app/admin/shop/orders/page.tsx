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

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  billing_address: string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_reference: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const orderColumns = (
  handleViewOrder: (order: Order) => void,
  setIsViewOpen: React.Dispatch<React.SetStateAction<boolean>>,
  handleUpdateStatus: (order: Order) => void
) => [
  {
    name: "Order #",
    selector: (row: any) => row?.order_number ?? "N/A",
    sortable: true,
    minWidth: "120px",
  },
  {
    name: "Customer",
    cell: (row: any) => (
      <div>
        <div className="font-medium">{row?.customer_name ?? "N/A"}</div>
        <div className="text-sm text-gray-500">{row?.customer_email ?? "N/A"}</div>
      </div>
    ),
    minWidth: "200px",
  },
  {
    name: "Total",
    selector: (row: any) => `₵${row?.total_amount?.toFixed(2) ?? "0.00"}`,
    sortable: true,
    right: true,
    minWidth: "100px",
  },
  {
    name: "Status",
    cell: (row: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row?.status === "delivered"
            ? "bg-green-100 text-green-800"
            : row?.status === "shipped"
            ? "bg-blue-100 text-blue-800"
            : row?.status === "processing"
            ? "bg-yellow-100 text-yellow-800"
            : row?.status === "confirmed"
            ? "bg-purple-100 text-purple-800"
            : row?.status === "cancelled"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row?.status?.charAt(0).toUpperCase() + row?.status?.slice(1) || "Pending"}
      </span>
    ),
    sortable: true,
    minWidth: "120px",
  },
  {
    name: "Payment",
    cell: (row: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row?.payment_status === "paid"
            ? "bg-green-100 text-green-800"
            : row?.payment_status === "failed"
            ? "bg-red-100 text-red-800"
            : row?.payment_status === "refunded"
            ? "bg-orange-100 text-orange-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {row?.payment_status?.charAt(0).toUpperCase() + row?.payment_status?.slice(1) || "Pending"}
      </span>
    ),
    sortable: true,
    minWidth: "120px",
  },
  {
    name: "Date",
    selector: (row: any) => moment(row?.created_at).format("MMM DD, YYYY"),
    sortable: true,
    minWidth: "120px",
  },
  {
    name: "Actions",
    cell: (row: any) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            handleViewOrder(row);
          }}
          className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded text-sm"
        >
          View
        </button>
        <button
          onClick={() => {
            handleUpdateStatus(row);
          }}
          className="text-green-500 hover:text-green-700 px-2 py-1 rounded text-sm"
        >
          Update
        </button>
      </div>
    ),
    right: true,
    width: "140px",
  },
];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const [statusForm, setStatusForm] = useState({
    status: "",
    payment_status: "",
    notes: "",
  });

  // Fetch orders from Supabase
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.or(`order_number.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
      }
      
      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }
      
      if (paymentFilter) {
        query = query.eq("payment_status", paymentFilter);
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
  }, [searchTerm, statusFilter, paymentFilter]);

  // Fetch order items for selected order
  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (error) {
        console.error("Error fetching order items:", error);
        setOrderItems([]);
      } else {
        setOrderItems(data || []);
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      setOrderItems([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
    setIsViewOpen(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setStatusForm({
      status: order.status || "",
      payment_status: order.payment_status || "",
      notes: order.notes || "",
    });
    setIsStatusOpen(true);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    setStatusUpdateLoading(true);

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: statusForm.status,
          payment_status: statusForm.payment_status,
          notes: statusForm.notes,
        })
        .eq("id", selectedOrder.id);

      if (error) {
        toast.error("Failed to update order status", { position: "top-right" });
      } else {
        toast.success("Order status updated successfully!", { position: "top-right" });
        setOrders((prev) =>
          prev.map((order) =>
            order.id === selectedOrder.id
              ? {
                  ...order,
                  status: statusForm.status,
                  payment_status: statusForm.payment_status,
                  notes: statusForm.notes,
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
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop Orders</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search orders..."
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
          
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Payment Status</option>
            {paymentStatusOptions.map((option) => (
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
          columns={orderColumns(handleViewOrder, setIsViewOpen, handleUpdateStatus)}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
        />
      )}

      {/* View Order Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-lg font-bold mb-4">
            Order Details - {selectedOrder?.order_number}
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
                  <p><strong>Order Number:</strong> {selectedOrder.order_number}</p>
                  <p><strong>Date:</strong> {moment(selectedOrder.created_at).format("MMMM DD, YYYY HH:mm")}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Payment Status:</strong> {selectedOrder.payment_status}</p>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Shipping Address</h3>
                  <p className="whitespace-pre-wrap">{selectedOrder.shipping_address}</p>
                </div>
                
                {selectedOrder.billing_address && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Billing Address</h3>
                    <p className="whitespace-pre-wrap">{selectedOrder.billing_address}</p>
                  </div>
                )}
              </div>

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
                      {orderItems.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-2">{item.product_name}</td>
                          <td className="px-4 py-2 text-center">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">₵{item.product_price?.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">₵{item.subtotal?.toFixed(2)}</td>
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
                    <span>Subtotal:</span>
                    <span>₵{selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₵{selectedOrder.discount_amount?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>₵{selectedOrder.shipping_fee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-1">
                    <span>Total:</span>
                    <span>₵{selectedOrder.total_amount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
                  <p className="whitespace-pre-wrap">{selectedOrder.notes}</p>
                </div>
              )}
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
              <label className="block font-semibold mb-1">Order Status</label>
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border rounded p-2"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Payment Status</label>
              <select
                value={statusForm.payment_status}
                onChange={(e) => setStatusForm(prev => ({ ...prev, payment_status: e.target.value }))}
                className="w-full border rounded p-2"
              >
                {paymentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Notes</label>
              <textarea
                value={statusForm.notes}
                onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Add any notes about this update..."
              />
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
