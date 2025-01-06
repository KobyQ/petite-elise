/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../components/CustomTable";
import { userColumns } from "./columns";
import supabase from "@/utils/supabaseClient";
import StudentDetails from "../components/StudentDetails";

const Students = () => {
  const [fetchError, setFetchError] = useState<any>(null);
  const [students, setStudents] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);


  const fetchStudents = async () => {
    setIsLoading(true);
    setFetchError(null); 
    try {
      const { data, error } = await supabase.from("children").select();
      if (error) {
        console.error("Supabase error details:", error);
        setFetchError(error?.message || "An unexpected error occurred");
        setStudents(null);
      } else {
        setStudents(data);
      }
    } catch (error) {
      setFetchError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      {isLoading && <div>Loading data, please wait...</div>}
      {fetchError && (
        <div>
          <div>Sorry, an error occurred while fetching data: {fetchError}</div>
          <button onClick={fetchStudents}>Retry</button>
        </div>
      )}
      {!isLoading && !fetchError && students && (
        <CustomTable
          data={students}
          columns={userColumns(setSelectedData, setIsOpen)}
        />
      )}
      {isOpen && (
        <StudentDetails
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          data={selectedData}
        />
      )}
    </div>
  );
};

export default Students;
