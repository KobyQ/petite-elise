/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import Image from "next/image";
import { formatMoneyToCedis } from "@/utils/constants";

export const productColumns = (
  setSelectedData: (row: any) => void,
  setIsEditOpen: Dispatch<SetStateAction<boolean>>,
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>,
  setIsViewOpen: Dispatch<SetStateAction<boolean>>
) => [

  {
    name: "Name",
    cell: (row: any) => (
      <div>
        <div className="font-medium text-gray-900 flex items-center gap-2">
          {row?.name ?? "N/A"}
          {row?.is_featured && (
            <span className="text-yellow-500" title="Featured Product">
              ⭐
            </span>
          )}
        </div>
        {row?.short_description && (
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
            {row.short_description}
          </div>
        )}
      </div>
    ),
    sortable: true,
    wrap: true,
  },
  {
    name: "Category",
    selector: (row: any) => row?.category ?? "N/A",
    sortable: true,
  },
  {
    name: "Price",
    cell: (row: any) => (
      <div className="text-right">
        {row?.sale_price ? (
          <div>
            <div className="font-medium text-green-600">
              {formatMoneyToCedis(row.sale_price)}
            </div>
            <div className="text-gray-400 line-through text-xs">
              {formatMoneyToCedis(row.price)}
            </div>
          </div>
        ) : (
          <div className="font-medium text-gray-900">
            {formatMoneyToCedis(row?.price)}
          </div>
        )}
      </div>
    ),
    sortable: true,
    right: true,
  },
  {
    name: "Stock",
    selector: (row: any) => row?.stock_quantity ?? 0,
    sortable: true,
    cell: (row: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          (row?.stock_quantity ?? 0) > 10
            ? "bg-green-100 text-green-800"
            : (row?.stock_quantity ?? 0) > 0
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row?.stock_quantity ?? 0}
      </span>
    ),
  },
  {
    name: "Status",
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
    name: "Featured",
    selector: (row: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row?.is_featured
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row?.is_featured ? "Yes" : "No"}
      </span>
    ),
    sortable: true,
  },

  {
    name: "Created",
    selector: (row: any) => moment(row?.created_at)?.format("MMM DD, YYYY"),
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row: any) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setSelectedData(row);
            setIsViewOpen(true);
          }}
          className="text-green-500 hover:text-green-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          title="View Details"
        >
          <AiFillEye size={20} />
        </button>
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
          className="text-red-500 hover:text-red-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Delete"
        >
          <AiFillDelete size={20} />
        </button>
      </div>
    ),
    right: true,
  },
];
