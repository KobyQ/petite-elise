/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import supabase from "@/utils/supabaseClient"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal"

import SkeletonLoader from "../components/SkeletonLoader"
import CustomTable from "../components/CustomTable"
import { codeNinjaColumns } from "../students/columns"
import { Button } from "@/components/ui/button"
import CodeNinjaDetails from "../components/CodeNinjaDetails"
import SearchBar from "../components/SearchBar"

const CodingNinjas = () => {
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [students, setStudents] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedData, setSelectedData] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchStudents = async () => {
    setIsLoading(true)
    setFetchError(null)

    try {
      let query = supabase
        .from("code-ninjas")
        .select()
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (searchQuery.trim()) {
        query = query.or(`childName.ilike.%${searchQuery}%,parentName.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred")
        setStudents(null)
      } else {
        setStudents(data || [])
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const deleteStudent = async () => {
    if (!selectedData) return
    setDeleteLoading(true)
    try {
      const { error } = await supabase
        .from("code-ninjas")
        .update({ is_active: false })
        .eq("id", selectedData?.id)

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

  return (
    <div>
      {isLoading || students === null ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchStudents()}>Retry</Button>
        </div>
      ) : (
        <>
          <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          <CustomTable
            data={students}
            columns={codeNinjaColumns(setSelectedData, setIsOpen, setIsDeleteOpen)}
          />
        </>
      )}

      {isOpen && (
        <CodeNinjaDetails
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          data={selectedData}
        />
      )}

      {/* Confirm Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold">Confirm Deactivation</DialogTitle>
          <p className="text-gray-600">
            Are you sure you want to deactivate <strong>{selectedData?.parentName}</strong> and their ward{" "}
            <strong>{selectedData?.childName}</strong>? They will no longer appear in the system but their data will be preserved.
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
              {deleteLoading ? "Deactivating..." : "Deactivate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CodingNinjas
