import { ManpowerAllocation } from "@/types/ManpowerTypes/manpower";

export const transformManpowerToChartData = (
  manpower: ManpowerAllocation[]
) => {
  return {
    categories: manpower.map((p, index) => {
      if (!p.full_name || typeof p.full_name !== "string") {
        return `User ${index + 1}`;
      }

      return p.full_name.trim().split(" ")[0];
    }),

    series: [
      {
        name: "Manager",
        data: manpower.map((p) => p.projects_as_manager ?? 0),
      },
      {
        name: "Lead",
        data: manpower.map((p) => p.projects_as_lead ?? 0),
      },
      {
        name: "Core Team",
        data: manpower.map((p) => p.projects_as_core_team ?? 0),
      },
      {
        name: "Support Team",
        data: manpower.map((p) => p.projects_as_support_team ?? 0),
      },
    ],
  };
};
