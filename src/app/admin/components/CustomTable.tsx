/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { customStyles } from "@/utils/misc";
import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface ICustomTable {
  data: unknown[];
  columns: TableColumn<any>[];
  selectableRows?: boolean;
  handleChange?: ({ selectedRows }: { selectedRows: any }) => void;
  pagination?: boolean;
  paginationPerPage?: number;
  paginationRowsPerPageOptions?: number[];
}

const CustomTable: React.FC<ICustomTable> = ({
  data,
  columns,
  selectableRows = false,
  handleChange,
  pagination = true,
  paginationPerPage,
  paginationRowsPerPageOptions,
}) => {
  return (
    <div className="p-4 overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        highlightOnHover
        customStyles={customStyles}
        selectableRows={selectableRows}
        onSelectedRowsChange={handleChange}
      />
    </div>
  );
};

export default CustomTable;
