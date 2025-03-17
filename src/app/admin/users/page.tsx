/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { supabaseAdmin } from '@/utils/supabaseClient';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import SkeletonLoader from '../components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import CustomTable from '../components/CustomTable';
import { userColumns } from './columns';




const Users = () => {

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
      const [fetchError, setFetchError] = useState<string | null>(null);
    
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    
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
            setUsers(data?.users || []);
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

  console.log("users", users)

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
           <CustomTable
              data={users}
              columns={userColumns(
                setSelectedUser,
                setIsOpen,
              )}
            />
         </>
       )}
 
 
 
    
     </div>
  )
}

export default Users