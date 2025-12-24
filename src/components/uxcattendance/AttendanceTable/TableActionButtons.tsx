import React from 'react';
import { Visit } from '@/types/LearningJourneyAttendanceTypes/visit';

interface TableActionButtonsProps {
  visit: Visit;
  isLoading: boolean;
  onView: (visit: Visit) => void;
  onEdit: (visit: Visit) => void;
  onDelete: (visitId: string) => void;
}

const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  visit,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex justify-center gap-5 items-center">
      <button
        aria-label="View Details"
        className="hover:text-green-600 dark:hover:text-green-400 disabled:opacity-50"
        onClick={() => onView(visit)}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17 2a1 1 0 1 0 0 2h1.586l-4.293 4.293a1 1 0 0 0 1.414 1.414L20 5.414V7a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1h-4zM4 18.586V17a1 1 0 1 0-2 0v4a1 1 0 0 0 1 1h4a1 1 0 1 0 0-2H5.414l4.293-4.293a1 1 0 0 0-1.414-1.414L4 18.586z" />
        </svg>
      </button>
      <button
        aria-label="Edit"
        className="hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
        onClick={() => onEdit(visit)}
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 576 512">
          <path fill="currentColor" d="m402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9L216.2 301.8l-7.3 65.3l65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1l30.9-30.9c4-4.2 4-10.8-.1-14.9z"/>
        </svg>
      </button>
      <button
        aria-label="Delete"
        className="hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
        onClick={() => onDelete(visit.id)}
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
            <path d="M9 10v34h30V10H9Z"/>
            <path strokeLinecap="round" d="M20 20v13m8-13v13M4 10h40"/>
            <path d="m16 10l3.289-6h9.488L32 10H16Z"/>
          </g>
        </svg>
      </button>
    </div>
  );
};

export default TableActionButtons;