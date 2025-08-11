/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { toast } from "react-toastify";
import SkeletonLoader from "../../components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import CustomTable from "../../components/CustomTable";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import ViewProduct from "./components/ViewProduct";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, 
  FaFilter, 
  FaEye, 
  FaStar, 
  FaRegStar,
  FaSync,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

import supabase from "@/utils/supabaseClient";
import { productColumns } from "./columns";
import { MdClear } from "react-icons/md";

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  images: string[];
  category: string;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  weight: number;
  dimensions: string;
  sku: string;
  tags: string[];
  details?: Record<string, string>;
  delivery?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`);
      }
      
      if (categoryFilter) {
        query = query.eq("category", categoryFilter);
      }
      
      if (statusFilter === "active") {
        query = query.eq("is_active", true);
      } else if (statusFilter === "inactive") {
        query = query.eq("is_active", false);
      }

      const { data, error } = await query;

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred");
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, statusFilter, featuredFilter, stockFilter, refreshKey]);

  const deleteProduct = async () => {
    if (!selectedProduct) return;

    setDeleteLoading(true);

    try {
      // Delete images from storage first
      if (selectedProduct.images && selectedProduct.images.length > 0) {
        await deleteImagesFromStorage(selectedProduct.images);
      }

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct.id);

      if (error) {
        toast.error("Failed to delete product. Please try again.", {
          position: "top-right",
        });
      } else {
        toast.success("Product deleted successfully!", {
          position: "top-right",
        });
        setProducts((prev) =>
          prev.filter((product) => product.id !== selectedProduct.id)
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

  const deleteImagesFromStorage = async (imageUrls: string[]) => {
    try {
      for (const imageUrl of imageUrls) {
        // Extract the file path from the URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `product-images/${fileName}`;
        
        const { error } = await supabase.storage
          .from('product-images')
          .remove([filePath]);
        
        if (error) {
          console.error('Error deleting image from storage:', error);
        }
      }
    } catch (error) {
      console.error('Error deleting images from storage:', error);
    }
  };

  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Toggle featured status
  const toggleFeatured = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_featured: !product.is_featured })
        .eq("id", product.id);

      if (error) throw error;

      toast.success(
        `Product ${product.is_featured ? "removed from" : "marked as"} featured`
      );
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, is_featured: !product.is_featured } : p
        )
      );
    } catch (err: any) {
      console.error("Error updating featured status:", err);
      toast.error(err.message || "Failed to update featured status");
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
    setFeaturedFilter("");
    setStockFilter("");
    toast.info("Filters have been reset");
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || categoryFilter !== "" || statusFilter !== "" || featuredFilter !== "" || stockFilter !== "";

  // Filter products based on all criteria
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.short_description &&
        product.short_description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === "" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "" || 
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);
    
    const matchesFeatured = featuredFilter === "" ||
      (featuredFilter === "featured" && product.is_featured) ||
      (featuredFilter === "not_featured" && !product.is_featured);
    
    const matchesStock = stockFilter === "" ||
      (stockFilter === "in_stock" && product.stock_quantity > 0) ||
      (stockFilter === "low_stock" && product.stock_quantity > 0 && product.stock_quantity <= 10) ||
      (stockFilter === "out_of_stock" && product.stock_quantity === 0);

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured && matchesStock;
  });

  // Enhanced columns with new actions
  const enhancedProductColumns = [
    ...productColumns(
      setSelectedProduct,
      setIsEditOpen,
      setIsDeleteOpen,
      setIsViewOpen
    ).slice(0, -1), // Remove the original actions column
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedProduct(row);
              setIsViewOpen(true);
            }}
            className="text-green-500 hover:text-green-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
            title="View Details"
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => toggleFeatured(row)}
            className={`p-2 rounded focus:outline-none focus:ring-2 ${
              row.is_featured 
                ? "text-yellow-500 hover:text-yellow-700 focus:ring-yellow-300" 
                : "text-gray-400 hover:text-yellow-500 focus:ring-yellow-300"
            }`}
            title={row.is_featured ? "Remove from featured" : "Mark as featured"}
          >
            {row.is_featured ? <FaStar size={16} /> : <FaRegStar size={16} />}
          </button>
          <button
            onClick={() => {
              setSelectedProduct(row);
              setIsEditOpen(true);
            }}
            className="text-blue-500 hover:text-blue-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => {
              setSelectedProduct(row);
              setIsDeleteOpen(true);
            }}
            className="text-red-500 hover:text-red-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      ),
      right: true,
    },
  ];

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Products</h1>
            <p className="text-gray-600">
              Manage your product catalog with advanced features
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="text-white flex items-center gap-2" 
              onClick={() => setIsAddOpen(true)}
            >
              <FaPlus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-64"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  🔍
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FaFilter className="h-4 w-4" />
                Filters
                {showFilters ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />}
              </Button>
            </div>

            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <MdClear className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="flex items-center gap-2"
              >
                <FaSync className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Categories</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <select
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Products</option>
                    <option value="featured">Featured Only</option>
                    <option value="not_featured">Not Featured</option>
                  </select>

                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Stock Levels</option>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock (≤10)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>

                  <div className="text-sm text-gray-600 flex items-center">
                    Showing {filteredProducts.length} of {products.length} products
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {loading ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchProducts()}>Retry</Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="overflow-hidden">
            <CustomTable
              data={filteredProducts}
              columns={enhancedProductColumns}
              pagination={true}
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30, 50]}
              // expandableRows
              // expandableRowsComponent={({ data }: { data: Product }) => renderExpandableRow(data)}
              // expandableRowExpanded={(row: Product) => expandedRows.has(row.id)}
              // onRowExpandToggled={(expanded: boolean, row: Product) => {
              //   if (expanded) {
              //     setExpandedRows(prev => new Set([...prev, row.id]));
              //   } else {
              //     setExpandedRows(prev => {
              //       const newSet = new Set(prev);
              //       newSet.delete(row.id);
              //       return newSet;
              //     });
              //   }
              // }}
            />
          </div>
        </motion.div>
      )}

      {/* Add Product Modal */}
      {isAddOpen && (
        <AddProduct
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          setProducts={setProducts}
        />
      )}

      {/* Edit Product Modal */}
      {isEditOpen && selectedProduct && (
        <EditProduct
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          product={selectedProduct}
          setProducts={setProducts}
        />
      )}

      {/* View Product Modal */}
      {isViewOpen && selectedProduct && (
        <ViewProduct
          isOpen={isViewOpen}
          setIsOpen={setIsViewOpen}
          product={selectedProduct}
        />
      )}

      {/* Confirm Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold">Confirm Deletion</DialogTitle>
          <p className="text-gray-600">
            Are you sure you want to delete the product{" "}
            <strong>{selectedProduct?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteProduct}
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

export default Products;
