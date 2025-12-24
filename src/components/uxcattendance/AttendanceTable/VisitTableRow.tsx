import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import TableActionButtons from './TableActionButtons';
import { Visit } from '@/types/LearningJourneyAttendanceTypes/visit';

interface VisitTableRowProps {
  visit: Visit;
  isLoading: boolean;
  onView: (visit: Visit) => void;
  onEdit: (visit: Visit) => void;
  onDelete: (visitId: string) => void;
}

const VisitTableRow: React.FC<VisitTableRowProps> = ({
  visit,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow
      key={visit.id}
      className="transition-opacity duration-200 group-hover:opacity-30 hover:!opacity-100"
    >
      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90 max-w-[200px] truncate overflow-hidden whitespace-nowrap">
        {visit.company_name}
      </TableCell>
      <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
        {new Date(visit.date_of_visit).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400 flex justify-center items-center gap-1">
        {visit.total_attended}
      </TableCell>
      <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
        {visit.duration}
      </TableCell>
      <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
        {visit.conversion_status}
      </TableCell>
      <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
        <TableActionButtons
          visit={visit}
          isLoading={isLoading}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default VisitTableRow;