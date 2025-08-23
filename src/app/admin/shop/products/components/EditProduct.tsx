/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import { formatMoneyToPesewas, formatMoneyToCedisView } from "@/utils/constants";

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

interface EditProductProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: Product;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

interface ProductDetails {
  [key: string]: string;
}

interface ImageFile {
  file: File;
  preview: string;
}

const EditProduct: React.FC<EditProductProps> = ({
  isOpen,
  setIsOpen,
  product,
  setProducts,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: "",
    category: "",
    description: "",
    price: "",
    discount_percentage: "",
    stock_quantity: "",
    
    // Step 2: Images
    images: [] as ImageFile[],
    existingImages: [] as string[],
    
    // Step 3: Details
    details: {} as ProductDetails,
  });
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newDetailKey, setNewDetailKey] = useState("");
  const [newDetailValue, setNewDetailValue] = useState("");

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      // Convert price from pesewas to cedis for display
      const priceInCedis = product.price ? formatMoneyToCedisView(product.price).toString() : "";
      
      setFormData({
        name: product.name || "",
        category: product.category || "",
        description: product.description || "",
        price: priceInCedis,
        discount_percentage: product.sale_price ? 
          (((product.price - product.sale_price) / product.price) * 100).toFixed(2) : "",
        stock_quantity: product.stock_quantity?.toString() || "",
        images: [],
        existingImages: product.images || [],
        details: product.details || {},
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
          .order("name");
        
        if (data) {
          setCategories(data.map((cat: { name: string }) => cat.name));
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newImages: ImageFile[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index: number) => {
    const imageToRemove = formData.images[index];
    
    // Clean up preview URL
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const uploadImagesToStorage = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const image of formData.images) {
      try {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${image.file.name}`;
        const filePath = `${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, image.file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Upload error:', error);
          throw new Error(`Failed to upload ${image.file.name}: ${error.message}`);
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(urlData.publicUrl);
        
      } catch (error: any) {
        console.error('Upload failed for', image.file.name, error);
        throw new Error(`Failed to upload ${image.file.name}: ${error.message}`);
      }
    }
    
    return uploadedUrls;
  };

  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      // Extract the file path from the URL (last segment is the filename)
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${fileName}`;
      
      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);
      
      if (error) {
        console.error('Error deleting image from storage:', error);
      }
    } catch (error) {
      console.error('Error deleting image from storage:', error);
    }
  };

  const addDetail = () => {
    if (newDetailKey.trim() && newDetailValue.trim()) {
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [newDetailKey.trim()]: newDetailValue.trim()
        }
      }));
      setNewDetailKey("");
      setNewDetailValue("");
    }
  };

  const removeDetail = (key: string) => {
    setFormData(prev => {
      const newDetails = { ...prev.details };
      delete newDetails[key];
      return { ...prev, details: newDetails };
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.name.trim() || !formData.category || !formData.price || !formData.stock_quantity) {
        toast.error("Please fill in all required fields", { position: "top-right" });
        return;
      }
    }
    if (currentStep === 2) {
      // Validate step 2 - ensure at least one image exists (either existing or new)
      if (formData.existingImages.length === 0 && formData.images.length === 0) {
        toast.error("Please ensure at least one product image exists", { position: "top-right" });
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Form submitted - current step:", currentStep);
    
    // Only allow submission on step 3
    if (currentStep !== 3) {
      console.log("Preventing submission - not on step 3");
      return;
    }
    
    // Final validation
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

    // Ensure at least one image exists (either existing or new)
    if (formData.existingImages.length === 0 && formData.images.length === 0) {
      toast.error("At least one product image is required", { position: "top-right" });
      return;
    }

    setLoading(true);

    try {
      // Upload new images to storage first
      const newImageUrls = await uploadImagesToStorage();
      
      // Combine existing images with new ones
      const allImages = [...formData.existingImages, ...newImageUrls];
      
      // Convert price to pesewas for backend storage
      const priceInPesewas = formatMoneyToPesewas(parseFloat(formData.price));
      const discountPercentage = formData.discount_percentage ? parseFloat(formData.discount_percentage) : null;

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: priceInPesewas,
        discount_percentage: discountPercentage,
        images: allImages,
        category: formData.category,
        stock_quantity: parseInt(formData.stock_quantity),
        is_active: product.is_active,
        is_featured: product.is_featured,
        details: Object.keys(formData.details).length > 0 ? formData.details : null,
      };

      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id)
        .select();

      if (error) {
        console.error('Product update failed:', error);
        // If product update fails, clean up uploaded images
        for (const url of newImageUrls) {
          await deleteImageFromStorage(url);
        }
        throw error;
      }

      toast.success("Product updated successfully!", {
        position: "top-right",
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? data[0] : p))
      );
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast.error(error.message || "Failed to update product. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // Clean up all preview URLs
    formData.images.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
    
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      discount_percentage: "",
      stock_quantity: "",
      images: [],
      existingImages: [],
      details: {},
    });
    setCurrentStep(1);
    setNewDetailKey("");
    setNewDetailValue("");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      formData.images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [formData.images]);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? "bg-primary text-white" 
              : "bg-gray-200 text-gray-600"
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? "bg-primary" : "bg-gray-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      
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
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
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
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Discount (%)</label>
          <input
            type="number"
            name="discount_percentage"
            value={formData.discount_percentage}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            placeholder="0"
            min="0"
            max="100"
            step="0.01"
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Product Images</h3>
      
      {/* Existing Images */}
      {formData.existingImages.length > 0 ? (
        <div>
          <label className="block font-semibold mb-2">Current Images ({formData.existingImages.length})</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {formData.existingImages.map((imageUrl, index) => (
              <div key={index} className="relative">
                <Image
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ No current images. Please add at least one new image to continue.
          </p>
        </div>
      )}
      
      <div>
        <label className="block font-semibold mb-1">Add New Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border rounded p-2"
        />
        <p className="text-sm text-gray-600 mt-1">
          Select one or more images to add. Images will be uploaded to secure storage when you update the product.
          <span className="text-red-600 font-medium">At least one image must exist (either current or new).</span>
        </p>
      </div>

      {formData.images.length > 0 && (
        <div>
          <label className="block font-semibold mb-2">New Images ({formData.images.length})</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image.preview}
                  alt={`New Product ${index + 1}`}
                  width={96}
                  height={96}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Product Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Detail Key</label>
          <input
            type="text"
            value={newDetailKey}
            onChange={(e) => setNewDetailKey(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g., Material, Color, Size"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Detail Value</label>
          <input
            type="text"
            value={newDetailValue}
            onChange={(e) => setNewDetailValue(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g., Wood, Blue, Large"
          />
        </div>
      </div>
      
      <Button
        type="button"
        onClick={addDetail}
        className="bg-blue-500 hover:bg-blue-600 text-white"
        disabled={!newDetailKey.trim() || !newDetailValue.trim()}
      >
        Add Detail
      </Button>

      {Object.keys(formData.details).length > 0 && (
        <div>
          <label className="block font-semibold mb-2">Product Details</label>
          <div className="space-y-2">
            {Object.entries(formData.details).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <span className="font-medium">{key}:</span> {value}
                </div>
                <button
                  type="button"
                  onClick={() => removeDetail(key)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={async (open: boolean) => {
      if (!open) {
        setIsOpen(false);
        resetForm();
      }
    }}>
      <DialogContent className="max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-lg font-bold mb-4">
          Edit Product: {product.name}
        </DialogTitle>
        
        {renderStepIndicator()}
        
        <form onSubmit={handleSubmit} className="space-y-6" noValidate onKeyDown={(e) => {
          if (e.key === 'Enter' && currentStep !== 3) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}>
          {renderCurrentStep()}

          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || loading}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="text-white"
                  disabled={loading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="text-white"
                  title={loading ? "Please wait for uploads to finish" : undefined}
                >
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  // On cancel, clean up any preview URLs
                  for (const image of formData.images) {
                    if (image.preview) {
                      URL.revokeObjectURL(image.preview);
                    }
                  }
                  setIsOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
