/* eslint-disable @typescript-eslint/no-explicit-any */


import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { AiOutlineEye } from "react-icons/ai";

export const userColumns  = (setSelectedData: (row: any) => void,
  setIsOpen: Dispatch<SetStateAction<boolean>>) => [
    {
      name: "Parent's Name",
      selector: (row: any) => row?.parentName,
      grow: 2
    },
    {
      name: "Parent's Phone",
      selector: (row: any) => row?.parentPhoneNumber,
    },
    {
      name: "Child's Name",
      selector: (row: any) => row?.childName,
      grow: 2
    },
    {
      name: "Child's Age",
      selector: (row: any) => row?.childAge,
    },
   

  
    {
      name: "Date Registered",
      selector: (row: any) => moment(row?.created_at)?.format("lll"),
      grow: 2
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <button
          onClick={() => {
            setIsOpen(true)
            setSelectedData(row)
          }} 
          className="text-blue-500 hover:text-blue-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="View Details"
        >
          <AiOutlineEye size={20} />
        </button>
      ),
    },
  

 

  ];