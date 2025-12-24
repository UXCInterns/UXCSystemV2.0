// Legend component displaying all status items
import React from "react";
import { StatusDistribution } from "@/types/ManpowerTypes/manpower";
import { StatusLegendItem } from "./StatusLegendItem";

interface StatusLegendProps {
  statusData: StatusDistribution[];
  totalPeople: number;
}

export const StatusLegend = ({ statusData, totalPeople }: StatusLegendProps) => {
  return (
    <div className="flex flex-col gap-4 w-full xl:w-auto">
      {statusData.map((item, index) => (
        <StatusLegendItem 
          key={index} 
          item={item} 
          totalPeople={totalPeople} 
        />
      ))}
    </div>
  );
};