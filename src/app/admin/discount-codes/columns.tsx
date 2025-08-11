/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

export const discountCodeColumns = (
  setSelectedData: (row: any) => void,
  setIsEditOpen: Dispatch<SetStateAction<boolean>>,
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>
) => [
  {
    name: "Discount Code",
    selector: (row: any) => row?.discount_code ?? "N/A",
    sortable: true,
  },
  {
    name: "Discount Percentage",
    selector: (row: any) => `${row?.discount_percentage ?? 0}%`,
    sortable: true,
  },
  {
    name: "Active",
    selector: (row: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row?.is_active
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row?.is_active ? "Active" : "Inactive"}
      </span>
    ),
    sortable: true,
  },
  {
    name: "Usage Count",
    selector: (row: any) => row?.usage_count ?? 0,
    sortable: true,
  },
  {
    name: "Created At",
    selector: (row: any) => moment(row?.created_at)?.format("lll"),
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row: any) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setSelectedData(row);
            setIsEditOpen(true);
          }}
          className="text-blue-500 hover:text-blue-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Edit"
        >
          <AiFillEdit size={20} />
        </button>
        <button
          onClick={() => {
            setSelectedData(row);
            setIsDeleteOpen(true);
          }}
          className="text-red-500 hover:text-red-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
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
    width: "120px",
  },
];
