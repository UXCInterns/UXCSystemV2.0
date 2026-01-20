import React from 'react';
import TableActionButtons from './TableActionButtons';
import { Visit } from '@/types/LearningJourneyAttendanceTypes/visit';

interface VisitMobileCardProps {
  visit: Visit;
  isLoading: boolean;
  onView: (visit: Visit) => void;
  onEdit: (visit: Visit) => void;
  onDelete: (visitId: string) => void;
}

const VisitMobileCard: React.FC<VisitMobileCardProps> = ({
  visit,
  isLoading,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mb-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden hover:shadow-sm transition">
      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Header */}
        <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
          <h3
            className="text-sm font-semibold text-gray-900 dark:text-white truncate"
            title={visit.company_name}
          >
            {visit.company_name}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {new Date(visit.date_of_visit).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Visit Details Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Attended */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-blue-50 dark:bg-blue-900/20 mb-1.5">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Attended</p>
            <p className="text-[11px] font-semibold text-gray-900 dark:text-white">
              {visit.total_attended}
            </p>
          </div>

          {/* Duration */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-purple-50 dark:bg-purple-900/20 mb-1.5">
              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Duration</p>
            <p className="text-[11px] font-semibold text-gray-900 dark:text-white">
                {visit.duration
                .replace(/hours?/g, 'hr')
                .replace(/minutes?/g, 'min')}
            </p>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-emerald-50 dark:bg-emerald-900/20 mb-1.5">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Status</p>
            <p className="text-[11px] font-semibold text-gray-900 dark:text-white truncate">
              {visit.conversion_status}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
        <TableActionButtons
          visit={visit}
          isLoading={isLoading}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default VisitMobileCard;
