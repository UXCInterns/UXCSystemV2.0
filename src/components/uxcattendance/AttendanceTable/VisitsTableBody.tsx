import React from 'react';
import { TableBody } from "@/components/ui/table";
import VisitTableRow from './VisitTableRow';
import TableEmptyState from './TableEmptyState';
import { Visit } from '@/types/LearningJourneyAttendanceTypes/visit';

interface VisitsTableBodyProps {
  visits: Visit[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  searchQuery: string;
  onView: (visit: Visit) => void;
  onEdit: (visit: Visit) => void;
  onDelete: (visitId: string) => void;
}

const VisitsTableBody: React.FC<VisitsTableBodyProps> = ({
  visits,
  isLoading,
  hasActiveFilters,
  searchQuery,
  onView,
  onEdit,
  onDelete,
}) => {
  const hasData = visits.length > 0;

  return (
    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] group">
      <TableEmptyState
        isLoading={isLoading}
        hasData={hasData}
        hasActiveFilters={hasActiveFilters}
        searchQuery={searchQuery}
      />
      
      {!isLoading && hasData && visits.map((visit) => (
        <VisitTableRow
          key={visit.id}
          visit={visit}
          isLoading={isLoading}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </TableBody>
  );
};

export default VisitsTableBody;