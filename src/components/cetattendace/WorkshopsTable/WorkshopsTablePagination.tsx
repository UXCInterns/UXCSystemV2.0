import React from "react";
import Pagination from "@/components/common/Pagination";
import { WorkshopsTablePaginationProps } from "@/types/workshop";

export const WorkshopsTablePagination: React.FC<WorkshopsTablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
};