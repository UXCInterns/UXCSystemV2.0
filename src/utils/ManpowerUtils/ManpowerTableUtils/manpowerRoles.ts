// Utilities for extracting and formatting role information
import { ManpowerRecord, RoleBadge } from "@/types/ManpowerTypes/manpower";

export const normalizeRole = (role: string) => {
  const r = role.toLowerCase();

  if (r.includes("manager")) return "Manager";
  if (r.includes("lead")) return "Lead";
  if (r.includes("core")) return "Core";
  if (r.includes("support")) return "Support";

  return role;
};

export const getRoleBadgeColor = (role: string) => {
  switch (normalizeRole(role)) {
    case "Manager":
      return "error";
    case "Lead":
      return "warning";
    case "Core":
      return "primary";
    case "Support":
      return "success";
    default:
      return "gray";
  }
};

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