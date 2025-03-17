/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";

export const userColumns = (
  setSelectedData: (row: any) => void, 
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>
) => [
  {
    name: "Name",
    selector: (row: any) => row?.user_metadata?.name ?? "N/A",
  },
  {
    name: "Email",
    selector: (row: any) => row?.email,
  },

  {
    name: "Date Created",
    selector: (row: any) => moment(row?.created_at)?.format("lll"),
  },
  {
    name: "Actions",
    cell: (row: any) => (
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setSelectedData(row);
            setIsDeleteOpen(true);
          }}
          className="text-red-500 hover:text-red-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Delete"
        >
          <AiFillDelete size={20} />
        </button>
      </div>
    ),
    right: true,
    style: {
      display: "flex",
      justifyContent: "flex-end",
    },
    width: "100px",
  },
];
