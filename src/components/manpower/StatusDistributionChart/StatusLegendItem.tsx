// Individual legend item showing status with color, percentage, and count
import React from "react";
import { StatusDistribution } from "@/types/ManpowerTypes/manpower";
import { STATUS_COLORS } from "@/constants/ManpowerConstants/manpowerConstants";

interface StatusLegendItemProps {
  item: StatusDistribution;
  totalPeople: number;
}

export const StatusLegendItem = ({ item, totalPeople }: StatusLegendItemProps) => {
  const percentage = totalPeople > 0 
    ? Math.round((item.count / totalPeople) * 100) 
    : 0;
  
  const color = STATUS_COLORS[item.status] || '#93c5fd';

  return (
    <div className="flex items-start gap-2.5">
      <div className="flex gap-1 mt-1.5">
        <div 
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <div>
        <h5 className="mb-1 font-medium text-gray-800 text-sm dark:text-white/90">
          {item.status}
        </h5>
        <div className="flex flex-col gap-0.5 text-sm">
          <div className="flex items-center gap-2">
            <p 
              className="font-medium"
              style={{ color }}
            >
              {percentage}%
            </p>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <p className="text-gray-500 dark:text-gray-400">
              {item.count} {item.count !== 1 ? 'People' : 'Person'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};