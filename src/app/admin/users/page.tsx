/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { supabaseAdmin } from "@/utils/supabaseClient";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/modal";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import CustomTable from "../components/CustomTable";
import { userColumns } from "./columns";
import AddUser from "./components/AddUser";
import { useAuth } from "@/context/useAuthContext";

const Users = () => {
  const { user, logout, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();

      if (error) {
        setFetchError(error?.message || "An unexpected error occurred");
        setUsers([]);
      } else {
        // Sort users by created_at in descending order (newest first)
        const sortedUsers = (data?.users || []).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setUsers(sortedUsers);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId: string) => {
    if (!userId) return;

    // Prevent logged-in user from deleting themselves
    if (userId === user?.id) {
      toast.error("You cannot delete your own account!", { position: "top-right" });
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/delete-user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Ensure cookies are sent
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message || "Failed to delete user", {
          position: "top-right",
        });
      } else {
        toast.success("User deleted successfully!", { position: "top-right" });
        setUsers((prevUsers) => prevUsers.filter((user) => user?.id !== userId));
        setIsDeleteOpen(false);
      }
    } catch (error: any) {
      console.error("Delete user error:", error); // Debugging
      toast.error(error.message || "Something went wrong!", {
        position: "top-right",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {loading || users === null ? (
        <SkeletonLoader />
      ) : fetchError ? (
        <div className="text-red-600 text-center">
          <p>Sorry, an error occurred while fetching data: {fetchError}</p>
          <Button onClick={() => fetchUsers()}>Retry</Button>
        </div>
      ) : (
        <>
          <div className="flex justify-end ">
            <Button className="text-white" onClick={() => setIsOpen(true)}>
              Add Admin
            </Button>
          </div>
          <CustomTable
            data={users}
            columns={userColumns(setSelectedUser, setIsDeleteOpen)}
          />
        </>
      )}

      {isOpen && <AddUser isOpen={isOpen} setIsOpen={setIsOpen} setUsers={setUsers} />}
      {/* Confirm Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <DialogTitle className="text-lg font-bold">
            Confirm Deletion
          </DialogTitle>
          <p className="text-gray-600">
            Are you sure you want to delete {" "}
            <strong>{selectedUser?.user_metadata?.name}</strong>
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              color="red"
              onClick={() => deleteUser(selectedUser?.id)}
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

export default Users;
