import { BadgeColor } from "@/types/LearningJourneyDashboardTypes/metrics";

export const getBadgeColor = (change: string | number): BadgeColor => {
  const numChange = typeof change === "string" ? parseFloat(change) : change;
  if (numChange === 0) return "primary";
  return numChange > 0 ? "success" : "error";
};

export const getBadgeIconType = (change: string | number): "up" | "down" | null => {
  const numChange = typeof change === "string" ? parseFloat(change) : change;
  if (numChange === 0) return null;
  return numChange > 0 ? "up" : "down";
};

export const formatChange = (change: string | number): string => {
  const numChange = typeof change === "string" ? parseFloat(change) : change;
  if (numChange === 0) return "0%";
  return `${numChange > 0 ? "+" : ""}${numChange}%`;
};

export const calculatePercentageChange = (current: number, previous: number): string | null => {
  if (previous === 0) return null;
  const change = (((current - previous) / previous) * 100).toFixed(1);
  return change;
};