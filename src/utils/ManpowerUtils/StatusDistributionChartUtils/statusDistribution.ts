// Utilities for calculating status distribution from manpower data
import { ManpowerAllocation, StatusType, StatusDistribution } from "@/types/ManpowerTypes/manpower";

export const computeStatus = (record: ManpowerAllocation): StatusType => {
  const coreCount = record.projects_as_core_team;
  const supportCount = record.projects_as_support_team;
  
  // Overloaded: 5+ core OR 5+ support
  if (coreCount >= 5 || supportCount >= 5) {
    return "Overloaded";
  }
  
  // Busy: More than 2 core OR more than 3 support
  if (coreCount > 2 || supportCount > 3) {
    return "Busy";
  }
  
  // Available: 2 or fewer core AND 3 or fewer support
  return "Available";
};

export const calculateStatusDistribution = (
  manpower: ManpowerAllocation[]
): StatusDistribution[] => {
  const availableCount = manpower.filter(p => computeStatus(p) === "Available").length;
  const busyCount = manpower.filter(p => computeStatus(p) === "Busy").length;
  const overloadedCount = manpower.filter(p => computeStatus(p) === "Overloaded").length;

  return [
    { status: "Available" as StatusType, count: availableCount },
    { status: "Busy" as StatusType, count: busyCount },
    { status: "Overloaded" as StatusType, count: overloadedCount },
  ].filter(item => item.count > 0);
};