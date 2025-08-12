/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import moment from "moment";
import Image from "next/image";
import { formatMoneyToCedis } from "@/utils/constants";

interface ViewProductProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: any;
}

const ViewProduct: React.FC<ViewProductProps> = ({
  isOpen,
  setIsOpen,
  product,
}) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-lg font-bold mb-4">
          Product Details
        </DialogTitle>
        
        <div className="space-y-6">
          {/* Product Images */}
          {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
            <div>
              <label className="block font-semibold text-gray-700 mb-3">Product Images</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map((image: string, index: number) => (
                  <div key={index} className="relative">
                    <div className="relative w-full h-32">
                      <Image
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover rounded-lg border"
                      />
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : product.image_url ? (
            <div className="text-center">
              <label className="block font-semibold text-gray-700 mb-3">Product Image</label>
              <div className="relative w-48 h-48 mx-auto">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg border"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No images available</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Product Name</label>
              <p className="text-gray-900">{product.name}</p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category</label>
              <p className="text-gray-900">{product.category || "N/A"}</p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Price</label>
              <p className="text-gray-900 text-lg font-bold">{formatMoneyToCedis(product.price)}</p>
              {product.discount_percentage && (
                <p className="text-sm text-green-600 font-medium">
                  {product.discount_percentage}% off
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Stock Quantity</label>
              <p className={`text-lg font-semibold ${
                (product.stock_quantity || 0) > 10 
                  ? "text-green-600" 
                  : (product.stock_quantity || 0) > 0 
                  ? "text-yellow-600" 
                  : "text-red-600"
              }`}>
                {product.stock_quantity || 0}
              </p>
            </div>



            <div>
              <label className="block font-semibold text-gray-700 mb-1">Status</label>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </span>
                {product.is_featured && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Description</label>
              <p className="text-gray-900 whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* Product Details */}
          {product.details && typeof product.details === 'object' && Object.keys(product.details).length > 0 && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Product Details</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.details).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                    <span className="block font-medium text-gray-700 mb-1">{key}</span>
                    <span className="text-gray-900">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Created At</label>
              <p className="text-gray-600">{moment(product.created_at).format("MMMM DD, YYYY HH:mm")}</p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Last Updated</label>
              <p className="text-gray-600">{moment(product.updated_at).format("MMMM DD, YYYY HH:mm")}</p>
            </div>
          </div>


        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProduct;
