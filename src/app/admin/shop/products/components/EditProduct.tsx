/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";

interface EditProductProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: any;
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
}

const EditProduct: React.FC<EditProductProps> = ({
  isOpen,
  setIsOpen,
  product,
  setProducts,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    stock_quantity: "",
    is_active: true,
    is_featured: false,
    weight: "",
    dimensions: "",
    sku: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        image_url: product.image_url || "",
        category: product.category || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        weight: product.weight?.toString() || "",
        dimensions: product.dimensions || "",
        sku: product.sku || "",
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      });
    }
  }, [product]);

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from("product_categories")
          .select("name")
          .eq("is_active", true)
          .order("name");
        
        if (data) {
          setCategories(data.map(cat => cat.name));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required", { position: "top-right" });
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error("Valid price is required", { position: "top-right" });
      return;
    }

    if (!formData.category) {
      toast.error("Category is required", { position: "top-right" });
      return;
    }

    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      toast.error("Valid stock quantity is required", { position: "top-right" });
      return;
    }

    setLoading(true);

    try {
      // Check if SKU already exists (excluding current product)
      if (formData.sku.trim() && formData.sku !== product.sku) {
        const { data: existingSku } = await supabase
          .from("products")
          .select("sku")
          .eq("sku", formData.sku.trim())
          .neq("id", product.id)
          .single();

        if (existingSku) {
          toast.error("SKU already exists", { position: "top-right" });
          setLoading(false);
          return;
        }
      }

      // Process tags
      const tagsArray = formData.tags 
        ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
        : [];

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        image_url: formData.image_url.trim() || null,
        category: formData.category,
        stock_quantity: parseInt(formData.stock_quantity),
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions.trim() || null,
        sku: formData.sku.trim() || product.sku,
        tags: tagsArray.length > 0 ? tagsArray : null,
      };

      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id)
        .select();

      if (error) {
        toast.error("Failed to update product. Please try again.", {
          position: "top-right",
        });
      } else {
        toast.success("Product updated successfully!", {
          position: "top-right",
        });
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data[0] : p))
        );
        setIsOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-lg font-bold mb-4">
          Edit Product
        </DialogTitle>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Price (₵) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="Product SKU"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="0.0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Dimensions</label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="e.g., 30x20x10 cm"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Image URL</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              placeholder="educational, wooden, children"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Featured
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-white"
            >
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
