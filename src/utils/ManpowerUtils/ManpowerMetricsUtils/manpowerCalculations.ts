import { ManpowerAllocation, StatusType } from "@/types/ManpowerTypes/manpower";

export const computeStatus = (record: ManpowerAllocation): StatusType => {
  const core = record.projects_as_core_team;
  const support = record.projects_as_support_team;

  if (core >= 5 || support >= 5) return "Overloaded";
  if (core > 2 || support > 3) return "Busy";
  return "Available";
};

export const calculateManpowerStats = (manpower: ManpowerAllocation[]) => {
  const totalWorkforce = manpower.length;

  const availableCount = manpower.filter(
    (p) => computeStatus(p) === "Available"
  ).length;

  const busyCount = manpower.filter(
    (p) => computeStatus(p) === "Busy"
  ).length;

  const overloadedCount = manpower.filter(
    (p) => computeStatus(p) === "Overloaded"
  ).length;

  const currentlyBusy = busyCount + overloadedCount;

  const avgWorkload =
    totalWorkforce > 0
      ? (
          manpower.reduce((sum, p) => sum + p.active_projects_count, 0) /
          totalWorkforce
        ).toFixed(1)
      : "0";

  const utilizationRate =
    totalWorkforce > 0
      ? ((currentlyBusy / totalWorkforce) * 100).toFixed(0)
      : "0";

  const availabilityRate =
    totalWorkforce > 0
      ? ((availableCount / totalWorkforce) * 100).toFixed(0)
      : "0";

  return {
    totalWorkforce,
    availableCount,
    busyCount,
    overloadedCount,
    currentlyBusy,
    avgWorkload,
    utilizationRate,
    availabilityRate,
  };
};

export const getWorkloadBadge = (avgWorkload: string) => {
  const workload = Number(avgWorkload);
  
  if (workload > 3) {
    return { text: "High load", color: "orange" as const };
  }
  if (workload > 2) {
    return { text: "Moderate", color: "purple" as const };
  }
  return { text: "Balanced", color: "green" as const };
};