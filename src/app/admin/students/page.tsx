/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react";
import CustomTable from "../components/CustomTable";
import { userColumns } from "./columns";
import supabase from "@/utils/supabaseClient";
import StudentDetails from "../components/StudentDetails";
import { IEnrollChild } from "@/utils/interfaces";
import CustomTabs from "@/components/shared/CustomTabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";

const Students = () => {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [students, setStudents] = useState<IEnrollChild[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedData, setSelectedData] = useState<IEnrollChild | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = async () => {
    setIsLoading(true);
    setFetchError(null);
  
    try {
      let query = supabase
        .from("children")
        .select()
        .order("created_at", { ascending: false }); 
  
      if (searchQuery.trim()) {
        query = query.or(
          `childName.ilike.%${searchQuery}%,parentName.ilike.%${searchQuery}%`
        );
      }
  
      const { data, error } = await query;
  
      if (error) {
        setFetchError(error?.message || "An unexpected error occurred");
        setStudents(null);
      } else {
        setStudents(data || []);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const deleteStudent = async () => {
    if (!selectedData) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from("children")
        .delete()
        .eq("id", selectedData?.id);
      if (error) {
        toast.error("Failed to delete student. Please try again.");
      } else {
        toast.success("Student deleted successfully.");
        setStudents(
          (prev) =>
            prev?.filter((student: any) => student.id !== selectedData?.id) ||
            []
        );
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsDeleteOpen(false);
      setDeleteLoading(false);
    }
  };

  const groupItems = (items: IEnrollChild[] | null) => {
    const grouped = {
      mainRegistration: [] as IEnrollChild[],
      buildingSchoolClub: [] as IEnrollChild[],
      babyAndMe: [] as IEnrollChild[],
      playgroup: [] as IEnrollChild[],
      childMindinggroup: [] as IEnrollChild[],
      saturdaygroup: [] as IEnrollChild[],
    };
    
    items?.forEach((item) => {
      if (
        item?.programs?.some((p) =>
          ["Daycare", "Preschool", "Afterschool Care"].includes(p)
        )
      ) {
        grouped.mainRegistration.push(item);
      } else if (item?.programs?.includes("Baby & Me")) {
        grouped.babyAndMe.push(item);
      } else if (item?.programs?.includes("Developmental Playgroup")) {
        grouped.playgroup.push(item);
      } 
      else if (item?.programs?.includes("Childminding")) {
        grouped.childMindinggroup.push(item); } 
        else if (item?.programs?.includes("Saturday Kids Club")) {
          grouped.saturdaygroup.push(item); }
        else {
        grouped.buildingSchoolClub.push(item);
      }
    });

    return grouped;
  };

  const groupedData = groupItems(students);

  const tabs = [
    {
      label: "Main Registration",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          {isLoading ? <SkeletonLoader /> : (
            <CustomTable
              data={groupedData.mainRegistration}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
 
    {
      label: "Baby & Me",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          {isLoading ? <SkeletonLoader /> : (
            <CustomTable
              data={groupedData.babyAndMe}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Developmental Playgroup",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          {isLoading ? <SkeletonLoader /> : (
            <CustomTable
              data={groupedData.playgroup}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Saturday Kids Club",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          {isLoading ? <SkeletonLoader /> : (
            <CustomTable
              data={groupedData.saturdaygroup}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Childminding",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          {isLoading ? <SkeletonLoader /> : (
            <CustomTable
              data={groupedData.childMindinggroup}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },

    {
      label: "Building Blocks Club",
      content: (
        <div>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          {isLoading ? <SkeletonLoader /> : (
            <CustomTable
              data={groupedData.buildingSchoolClub}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {fetchError && (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchStudents()}>Retry</Button>
        </div>
      )}
      {(isLoading || students === null) && <SkeletonLoader />}
      {!isLoading && !fetchError && students && (
        <CustomTabs
          tabs={tabs}
          activeColor="text-blue-600"
          inactiveColor="text-gray-400"
        />
      )}

      {isOpen && (
        <StudentDetails
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          data={selectedData}
        />
      )}

        {/* Confirm Delete Modal */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold">
            Confirm Deletion
          </DialogTitle>
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <strong>{selectedData?.parentName}</strong> and their ward{" "}
            <strong>{selectedData?.childName}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              color="red"
              onClick={deleteStudent}
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

export default Students;

const SearchBar = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <input
      type="text"
      placeholder="Search by child or parent name..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="border border-gray-300 rounded-md px-4 py-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
    />
    {query && (
      <button
        onClick={() => setQuery("")}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
      >
        Reset
      </button>
    )}
  </div>
);

