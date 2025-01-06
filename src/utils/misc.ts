import { type ClassValue, clsx } from "clsx"
import { TableStyles } from "react-data-table-component";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const customStyles: TableStyles = {
  table: {
    style: {
      backgroundColor: "transparent",
    },
  },
  header: {
    style: {
      minHeight: "56px",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#007f94",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
      borderTopRightRadius: "20px",
      borderTopLeftRadius: "20px",
    },
  },
  headCells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: "transparent",
      },
    },
  },
  cells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: "transparent",
        borderRadius: 0,
        paddingBottom: "1.5rem",
        paddingTop: "1.5rem",
      },
      backgroundColor: "#FFFFFF",

      // backgroundColor: "#d4ebfc",
    },
  },
  rows: {
    style: {
      "&:hover": {
        borderRadius: 0,
      },
    },
  },
  pagination: {
    style: {
      borderBottomRightRadius: "20px",
      borderBottomLeftRadius: "20px",
    },
  },
};


