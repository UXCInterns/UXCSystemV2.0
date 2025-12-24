import React from 'react';
import { TableHeader, TableRow, TableCell } from "@/components/ui/table";

const TABLE_HEADERS = ["Company Name", "Date of Visit", "Total Attended", "Duration", "Conversion", "Actions"];

const TableHeaderRow: React.FC = () => {
  return (
    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-200 dark:bg-gray-900">
      <TableRow>
        {TABLE_HEADERS.map((header) => (
          <TableCell
            key={header}
            isHeader
            className={`px-4 py-3 font-large text-gray-500 text-theme-sm dark:text-gray-400 ${
              header === "Company Name" ? "text-start" : "text-center"
            }`}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default TableHeaderRow;