"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CustomTable from "../components/CustomTable";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import SkeletonLoader from "../components/SkeletonLoader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatMoneyToCedis, formatMoneyToPesewas } from "@/utils/constants";
import CustomTabs from "@/components/shared/CustomTabs";
import SearchBar from "../components/SearchBar";

interface PricingItem {
  id: string;
  program_name: string;
  schedule: string;
  price: number;
  created_at: string;
}

const PROGRAM_OPTIONS = [
  { label: "Saturday Kids Club", value: "Saturday Kids Club" },
  { label: "Summer Camp", value: "Summer Camp" },
  { label: "Christmas Camp", value: "Christmas Camp" },
  { label: "Childminding", value: "Childminding" },
  { label: "Code Ninjas Club", value: "Code Ninjas Club" },
  { label: "Baby & Me", value: "Baby & Me" },
  { label: "Developmental Playgroup", value: "Developmental Playgroup" },
];

const SCHEDULE_OPTIONS: Record<string, string[]> = {
  "Saturday Kids Club": [
    "termly full day",
    "termly half day",
    "walk in full day",
    "walk in half day",
  ],
  "Summer Camp": ["full month", "weekly", "daily"],
  "Christmas Camp": ["weekly", "daily"],
  "Childminding": ["hourly", "full day", "monthly"],
  "Code Ninjas Club": ["full term"],
  "Baby & Me": ["monthly"],
  "Developmental Playgroup": ["monthly"],
};

export default function PaymentsPage() {
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [form, setForm] = useState({
    program_name: "",
    schedule: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PricingItem | null>(null);

  // Fetch pricing from Supabase
  const fetchPricing = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      let query = supabase.from("program_pricing").select("*").order("created_at", { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(`program_name.ilike.%${searchQuery}%,schedule.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) {
        setFetchError(error?.message || "An unexpected error occurred");
        setPricing([]);
      } else {
        setPricing(data || []);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
      setPricing([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPricing();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchPricing]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle program selection
  const handleProgramChange = (value: string) => {
    setForm({ ...form, program_name: value, schedule: "" });
  };

  // Handle schedule selection
  const handleScheduleChange = (value: string) => {
    setForm({ ...form, schedule: value });
  };

  // Handle add/update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert price to pesewas before saving
      const priceInPesewas = formatMoneyToPesewas(parseFloat(form.price));
      const formDataWithPesewas = {
        ...form,
        price: priceInPesewas
      };

      if (isEditMode && editingItem) {
        // Update existing item
        const { error, data } = await supabase
          .from("program_pricing")
          .update(formDataWithPesewas)
          .eq("id", editingItem.id)
          .select();

        if (error) {
          toast.error("Failed to update pricing");
        } else {
          toast.success("Pricing updated successfully!");
          setPricing(pricing.map(item => 
            item.id === editingItem.id ? data[0] : item
          ));
        }
      } else {
        // Add new item
        const { error, data } = await supabase.from("program_pricing").insert([formDataWithPesewas]).select();
        if (error) {
          toast.error("Failed to add pricing");
        } else {
          toast.success("Pricing added successfully!");
          setPricing([...(data || []), ...pricing]);
        }
      }

      setForm({ program_name: "", schedule: "", price: "" });
      setIsEditMode(false);
      setEditingItem(null);
      setIsOpen(false);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (item: PricingItem) => {
    setEditingItem(item);
    setIsEditMode(true);
    setForm({
      program_name: item.program_name,
      schedule: item.schedule,
      price: (item.price / 100).toString(), // Convert pesewas back to cedis for display
    });
    setIsOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedItem) return;
    
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from("program_pricing")
        .delete()
        .eq("id", selectedItem.id);

      if (error) {
        toast.error("Failed to delete pricing");
      } else {
        toast.success("Pricing deleted successfully!");
        setPricing(pricing.filter(item => item.id !== selectedItem.id));
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsDeleteOpen(false);
      setDeleteLoading(false);
    }
  };

  // Group pricing by program
  const groupPricingByProgram = (items: PricingItem[] | null) => {
    const grouped: Record<string, PricingItem[]> = {
      "Saturday Kids Club": [],
      "Summer Camp": [],
      "Christmas Camp": [],
      "Childminding": [],
      "Code Ninjas Club": [],
      "Baby & Me": [],
      "Developmental Playgroup": [],
    };

    items?.forEach((item) => {
      if (grouped[item.program_name]) {
        grouped[item.program_name].push(item);
      }
    });

    return grouped;
  };

  const groupedData = groupPricingByProgram(pricing);

  const pricingColumns = (
    setSelectedData: (item: PricingItem) => void, 
    setIsOpen: (open: boolean) => void, 
    setIsDeleteOpen: (open: boolean) => void
  ) => [
    { name: "Program", selector: (row: PricingItem) => row.program_name },
    { name: "Schedule", selector: (row: PricingItem) => row.schedule },
    { name: "Price", selector: (row: PricingItem) => formatMoneyToCedis(row.price) },
    {
      name: "Actions",
      cell: (row: PricingItem) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-500 hover:text-blue-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => {
              setSelectedData(row);
              setIsDeleteOpen(true);
            }}
            className="text-red-500 hover:text-red-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const tabs = [
    {
      label: "Saturday Kids Club",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by program or schedule..." />
          {loading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData["Saturday Kids Club"]}
              columns={pricingColumns(setSelectedItem, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Summer Camp",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by program or schedule..." />
          {loading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData["Summer Camp"]}
              columns={pricingColumns(setSelectedItem, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Christmas Camp",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by program or schedule..." />
          {loading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData["Christmas Camp"]}
              columns={pricingColumns(setSelectedItem, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Childminding",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by program or schedule..." />
          {loading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData["Childminding"]}
              columns={pricingColumns(setSelectedItem, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Code Ninjas Club",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by program or schedule..." />
          {loading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData["Code Ninjas Club"]}
              columns={pricingColumns(setSelectedItem, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Baby & Me",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by program or schedule..." />
          {loading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData["Baby & Me"]}
              columns={pricingColumns(setSelectedItem, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Developmental Playgroup",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} placeholder="Search by program or schedule..." />
          {loading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={groupedData["Developmental Playgroup"]}
              columns={pricingColumns(setSelectedItem, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {loading || pricing === null ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchPricing()}>Retry</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button className="text-white" onClick={() => setIsOpen(true)}>
              Add Payment Config
            </Button>
          </div>
          
          {pricing.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No payment configurations found</div>
              <p className="text-gray-400 mb-6">Get started by adding your first payment configuration</p>
              <Button onClick={() => setIsOpen(true)} className="bg-primary text-white">
                Add Payment Config
              </Button>
            </div>
          ) : (
            <CustomTabs tabs={tabs} activeColor="text-blue-600" inactiveColor="text-gray-400" />
          )}
        </>
      )}

      {/* Add/Edit Payment Config Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold mb-4">
            {isEditMode ? "Edit Payment Configuration" : "Add Payment Configuration"}
          </DialogTitle>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Program</label>
              <Select value={form.program_name} onValueChange={handleProgramChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAM_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {form.program_name && (
              <div>
                <label className="block font-semibold mb-1">Schedule</label>
                <Select value={form.schedule} onValueChange={handleScheduleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_OPTIONS[form.program_name].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="block font-semibold mb-1">Price (GHS)</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="Enter price"
                className="w-full border rounded p-2"
              />
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsOpen(false);
                  setIsEditMode(false);
                  setEditingItem(null);
                  setForm({ program_name: "", schedule: "", price: "" });
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Configuration" : "Add Configuration")}
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
            Are you sure you want to delete the pricing configuration for{" "}
            <strong>{selectedItem?.program_name}</strong> - <strong>{selectedItem?.schedule}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              color="red"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 