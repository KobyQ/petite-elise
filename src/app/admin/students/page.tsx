/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useRef } from "react"
import CustomTable from "../components/CustomTable"
import { userColumns } from "./columns"
import supabase from "@/utils/supabaseClient"
import StudentDetails from "../components/StudentDetails"
import type { IEnrollChild } from "@/utils/interfaces"
import CustomTabs from "@/components/shared/CustomTabs"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import SkeletonLoader from "../components/SkeletonLoader"
import SearchBar from "../components/SearchBar"
import DateRangeFilter from "./components/DateRangeFilter"

const Students = () => {
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [students, setStudents] = useState<IEnrollChild[] | null>(null)
  const [filteredStudents, setFilteredStudents] = useState<IEnrollChild[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedData, setSelectedData] = useState<IEnrollChild | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [isFiltering, setIsFiltering] = useState(false)
  const [activeTab, setActiveTab] = useState("mainRegistration")
  const hasInitialData = useRef(false)

  const handleDateRangeChange = (start: string | null, end: string | null) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue)
    // Fetch data for the new tab
    fetchTabData(tabValue)
  }

  // Initial data fetch - only runs once on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      setFetchError(null)

      try {
        const { data, error } = await supabase
          .from("children")
          .select()
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        if (error) {
          setFetchError(error?.message || "An unexpected error occurred")
          setStudents(null)
        } else {
          setStudents(data || [])
          setFilteredStudents(data || []) // Initialize filtered data with all data
          hasInitialData.current = true
          // Fetch data for the default tab
          fetchTabData(activeTab)
        }
      } catch (error) {
        setFetchError("Failed to fetch data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Effect for search and date filtering with debounce
  useEffect(() => {
    if (!hasInitialData.current || students === null) return // Don't run if no initial data

    const delayDebounceFn = setTimeout(() => {
      fetchTabData(activeTab)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, startDate, endDate, activeTab])

  // Function to refresh all data (for retry button)
  const refreshAllData = async () => {
    setIsLoading(true)
    setFetchError(null)
    setStartDate(null)
    setEndDate(null)
    setSearchQuery("")
    hasInitialData.current = false

    try {
      const { data, error } = await supabase
        .from("children")
        .select()
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred")
        setStudents(null)
      } else {
        setStudents(data || [])
        hasInitialData.current = true
        // Fetch data for the current tab
        fetchTabData(activeTab)
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch data for specific program tab with filters
  const fetchTabData = async (programType: string) => {
    if (!hasInitialData.current) return
    
    setIsFiltering(true)
    setFetchError(null)

    try {
      let query = supabase
        .from("children")
        .select()
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      // Add program filter
      if (programType !== "mainRegistration") {
        const programMap: { [key: string]: string } = {
          babyAndMe: "Baby & Me",
          playgroup: "Developmental Playgroup", 
          childMindinggroup: "Childminding",
          saturdaygroup: "Saturday Kids Club",
          summerCamp: "Summer Camp",
          christmasCamp: "Christmas Camp"
        }
        
        const programName = programMap[programType]
        if (programName) {
          query = query.contains("programs", [programName])
        }
      } else {
        // For main registration, we'll filter client-side to avoid complex Supabase queries
        // This will be handled in the client after fetching
      }

      // Add search filter
      if (searchQuery.trim()) {
        query = query.or(`childName.ilike.%${searchQuery}%,parentName.ilike.%${searchQuery}%`)
      }

      // Add date range filtering
      if (startDate && endDate) {
        query = query.gte("created_at", startDate).lte("created_at", endDate + "T23:59:59")
      }

      const { data, error } = await query

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred")
        setFilteredStudents(null)
      } else {
        let finalData = data || []
        
        // Handle main registration filtering on client side
        if (programType === "mainRegistration") {
          const specificPrograms = ["Baby & Me", "Developmental Playgroup", "Childminding", "Saturday Kids Club", "Summer Camp", "Christmas Camp"]
          finalData = finalData.filter((student: any) => {
            const studentData = student as any
            if (!studentData.programs || !Array.isArray(studentData.programs)) return true
            // Keep students whose programs array doesn't contain any of the specific programs
            return !studentData.programs.some((program: string) => specificPrograms.includes(program))
          })
        }
        
        setFilteredStudents(finalData)
      }
    } catch (error) {
      setFetchError("Failed to fetch tab data. Please try again.")
    } finally {
      setIsFiltering(false)
    }
  }

  const deleteStudent = async () => {
    if (!selectedData) return
    setDeleteLoading(true)
    try {
      const { error } = await supabase.from("children").update({ is_active: false }).eq("id", selectedData?.id)
      if (error) {
        toast.error("Failed to delete student. Please try again.")
      } else {
        toast.success("Student deleted successfully.")
        setStudents((prev) => prev?.filter((student: any) => student.id !== selectedData?.id) || [])
      }
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsDeleteOpen(false)
      setDeleteLoading(false)
    }
  }

  const tabs = [
    {
      label: "Main Registration",
      value: "mainRegistration",
      content: (
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={filteredStudents || []}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Baby & Me",
      value: "babyAndMe",
      content: (
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={filteredStudents || []}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Developmental Playgroup",
      value: "playgroup",
      content: (
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={filteredStudents || []}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Saturday Kids Club",
      value: "saturdaygroup",
      content: (
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={filteredStudents || []}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Childminding",
      value: "childMindinggroup",
      content: (
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={filteredStudents || []}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Summer Camp",
      value: "summerCamp",
      content: (
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={filteredStudents || []}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
    {
      label: "Christmas Camp",
      value: "christmasCamp",
      content: (
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              data={filteredStudents || []}
              columns={userColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
            />
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      {/* Filters - now above all tabs */}
      <div className="mb-4 space-y-3">
        <SearchBar query={searchQuery} setQuery={setSearchQuery} />
        <DateRangeFilter onDateRangeChange={handleDateRangeChange} isLoading={isFiltering} />
      </div>

      {isLoading || students === null ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={refreshAllData}>Retry</Button>
        </div>
      ) : (
        <CustomTabs 
          tabs={tabs} 
          activeColor="text-blue-600" 
          inactiveColor="text-gray-400"
          onTabChange={handleTabChange}
          defaultTab={activeTab}
        />
      )}

      {isOpen && <StudentDetails isOpen={isOpen} setIsOpen={setIsOpen} data={selectedData} />}

      {/* Confirm Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold">Confirm Deactivation</DialogTitle>
          <p className="text-gray-600">
            Are you sure you want to deactivate <strong>{selectedData?.parentName}</strong> and their ward{" "}
            <strong>{selectedData?.childName}</strong>? They will no longer appear in the system but their data will be
            preserved.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" color="red" onClick={deleteStudent} disabled={deleteLoading}>
              {deleteLoading ? "Deactivating..." : "Deactivate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Students

