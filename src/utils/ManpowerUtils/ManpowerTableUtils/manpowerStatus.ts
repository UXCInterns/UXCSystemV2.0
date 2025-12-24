// Utilities for computing and managing manpower status
import { ManpowerRecord, StatusFilter } from "@/types/ManpowerTypes/manpower";

export const computeStatus = (record: ManpowerRecord): StatusFilter => {
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