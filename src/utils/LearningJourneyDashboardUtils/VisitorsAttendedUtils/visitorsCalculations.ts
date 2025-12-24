// Utility functions for visitor metrics calculations
import { MAX_VISITORS, ATTENDANCE_THRESHOLDS } from "@/constants/LearningJourneyDashboardConstants/visitorsConstants";

export const calculatePercentageChange = (
  current: number, 
  previous: number
): string => {
  if (previous === 0) {
    return current > 0 ? "100" : "0";
  }
  return (((current - previous) / previous) * 100).toFixed(1);
};

export const calculateDifference = (
  current: number, 
  previous: number
): number => {
  return current - previous;
};

export const getAttendanceStatus = (visitors: number): string => {
  const ratio = visitors / MAX_VISITORS;
  
  if (ratio >= ATTENDANCE_THRESHOLDS.EXCELLENT) {
    return "Excellent Attendance";
  }
  if (ratio >= ATTENDANCE_THRESHOLDS.GOOD) {
    return "Good Turnout";
  }
  return "Needs Improvement";
};

export const getAttendanceMessage = (visitors: number): string => {
  const ratio = visitors / MAX_VISITORS;
  
  if (ratio >= ATTENDANCE_THRESHOLDS.EXCELLENT) {
    return " Excellent attendance!";
  }
  if (ratio >= ATTENDANCE_THRESHOLDS.GOOD) {
    return " Good turnout!";
  }
  return " Room for growth in attendance.";
};

export const calculateChartSeries = (
  primaryVisitors: number,
  comparisonVisitors: number,
  isComparisonMode: boolean,
  maxValue: number
): number[] => {
  const primaryPercentage = (primaryVisitors / maxValue) * 100;
  const comparisonPercentage = (comparisonVisitors / maxValue) * 100;
  
  return isComparisonMode 
    ? [primaryPercentage, comparisonPercentage]
    : [primaryPercentage];
};