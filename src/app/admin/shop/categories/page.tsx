/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { toast } from "react-toastify";
import SkeletonLoader from "../../components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import CustomTable from "../../components/CustomTable";

import supabase from "@/utils/supabaseClient";

interface Category {
  id: string;
  name: string;
  created_at: string;
}

const categoryColumns = (
  handleEdit: (row: any) => void,
  setSelectedCategory: (row: any) => void,
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
) => [
  {
    name: "Name",
    selector: (row: any) => row?.name ?? "N/A",
    sortable: true,
    grow: 1,
  },
  {
    name: "Created At",
    selector: (row: any) => {
      if (!row?.created_at) return "N/A";
      const date = new Date(row.created_at);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    sortable: true,
    width: "180px",
  },
  {
    name: "Actions",
    cell: (row: any) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            handleEdit(row);
          }}
          className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => {
            setSelectedCategory(row);
            setIsDeleteOpen(true);
          }}
          className="text-red-500 hover:text-red-700 px-2 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    ),
    right: true,
    width: "200px",
  },
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("id, name, created_at")
        .order("name", { ascending: true });

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred");
        setCategories([]);
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
    });
  };

  const handleAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
    });
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleSubmit = async (isEdit: boolean) => {
    if (!formData.name.trim()) {
      toast.error("Category name is required", { position: "top-right" });
      return;
    }

    setFormLoading(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
      };

      if (isEdit && selectedCategory) {
        const { data, error } = await supabase
          .from("product_categories")
          .update(categoryData)
          .eq("id", selectedCategory.id)
          .select();

        if (error) {
          toast.error("Failed to update category", { position: "top-right" });
        } else {
          toast.success("Category updated successfully!", { position: "top-right" });
          setCategories((prev) =>
            prev.map((c) => (c.id === selectedCategory.id ? data[0] : c))
          );
          setIsEditOpen(false);
        }
      } else {
        const { data, error } = await supabase
          .from("product_categories")
          .insert([categoryData])
          .select();

        if (error) {
          toast.error("Failed to create category", { position: "top-right" });
        } else {
          toast.success("Category created successfully!", { position: "top-right" });
          setCategories((prev) => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
          setIsAddOpen(false);
          resetForm();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!", { position: "top-right" });
    } finally {
      setFormLoading(false);
    }
  };

  const deleteCategory = async () => {
    if (!selectedCategory) return;

    setDeleteLoading(true);

    try {
      const { error } = await supabase
        .from("product_categories")
        .delete()
        .eq("id", selectedCategory.id);

      if (error) {
        toast.error("Failed to delete category. Please try again.", {
          position: "top-right",
        });
      } else {
        toast.success("Category deleted successfully!", {
          position: "top-right",
        });
        setCategories((prev) =>
          prev.filter((category) => category.id !== selectedCategory.id)
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Categories</h1>
        <div className="flex justify-end">
          <Button className="text-white" onClick={handleAdd}>
            Add Category
          </Button>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchCategories()}>Retry</Button>
        </div>
      ) : (
        <CustomTable
          data={categories}
          columns={categoryColumns(handleEdit, setSelectedCategory, setIsDeleteOpen)}
        />
      )}

      {/* Add Category Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold mb-4">
            Add New Category
          </DialogTitle>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="text-white"
              >
                {formLoading ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold mb-4">
            Edit Category
          </DialogTitle>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(true); }} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="text-white"
              >
                {formLoading ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold">Confirm Deletion</DialogTitle>
          <p className="text-gray-600">
            Are you sure you want to delete the category{" "}
            <strong>{selectedCategory?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteCategory}
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

export default Categories;
