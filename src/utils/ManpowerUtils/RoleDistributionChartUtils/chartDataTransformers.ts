import { ManpowerAllocation } from "@/types/ManpowerTypes/manpower";

export const transformManpowerToChartData = (manpower: ManpowerAllocation[]) => {
  return {
    categories: manpower.map(p => p.full_name.split(' ')[0]),
    series: [
      {
        name: "Manager",
        data: manpower.map(p => p.projects_as_manager),
      },
      {
        name: "Lead",
        data: manpower.map(p => p.projects_as_lead),
      },
      {
        name: "Core Team",
        data: manpower.map(p => p.projects_as_core_team),
      },
      {
        name: "Support Team",
        data: manpower.map(p => p.projects_as_support_team),
      },
    ],
  };
};