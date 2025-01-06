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
}

const CustomTable: React.FC<ICustomTable> = ({
  data,
  columns,
  selectableRows = true,
  handleChange,
}) => {
  return (
    <div className="p-4 ">
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        customStyles={customStyles}
        selectableRows={selectableRows}
        onSelectedRowsChange={handleChange}
      />
    </div>
  );
};

export default CustomTable;
