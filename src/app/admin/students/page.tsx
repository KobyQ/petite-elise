/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../components/CustomTable";
import { userColumns } from "./columns";
import supabase from "@/utils/supabaseClient";
import StudentDetails from "../components/StudentDetails";
import { IEnrollChild } from "@/utils/interfaces";
import CustomTabs from "@/components/shared/CustomTabs";

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

  const groupItems = (items: IEnrollChild[]) => {
    const grouped = {
      mainRegistration: [] as IEnrollChild[],
      buildingSchoolClub: [] as IEnrollChild[],
    };

    items?.forEach((item) => {
      if (
        item?.programs?.some((program) =>
          ["Daycare", "Preschool", "Afterschool Care"].includes(program)
        )
      ) {
        grouped?.mainRegistration?.push(item);
      } else {
        grouped?.buildingSchoolClub?.push(item);
      }
    });

    return grouped;
  };

  const groupedData = groupItems(students);

  const tabs = [
    {
      label: "Main Registration",
      content: (
        <CustomTable
          data={groupedData?.mainRegistration}
          columns={userColumns(setSelectedData, setIsOpen)}
        />
      ),
    },
    {
      label: "Building Blocks Club",
      content: (
        <CustomTable
          data={groupedData?.buildingSchoolClub}
          columns={userColumns(setSelectedData, setIsOpen)}
        />
      ),
    },
  ];

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
    </div>
  );
};

export default Students;
