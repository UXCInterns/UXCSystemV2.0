// Utilities for extracting and formatting role information
import { ManpowerRecord, RoleBadge } from "@/types/ManpowerTypes/manpower";

export const getRoles = (person: ManpowerRecord): RoleBadge[] => {
  const roles: RoleBadge[] = [];
  
  if (person.projects_as_manager > 0) {
    roles.push({ 
      label: 'Manager', 
      count: person.projects_as_manager, 
      color: 'error' 
    });
  }
  
  if (person.projects_as_lead > 0) {
    roles.push({ 
      label: 'Lead', 
      count: person.projects_as_lead, 
      color: 'warning' 
    });
  }
  
  if (person.projects_as_core_team > 0) {
    roles.push({ 
      label: 'Core', 
      count: person.projects_as_core_team, 
      color: 'primary' 
    });
  }
  
  if (person.projects_as_support_team > 0) {
    roles.push({ 
      label: 'Support', 
      count: person.projects_as_support_team, 
      color: 'success' 
    });
  }
  
  return roles;
};