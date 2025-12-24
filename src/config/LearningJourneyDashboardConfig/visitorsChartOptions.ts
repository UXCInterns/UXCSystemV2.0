import { ApexOptions } from "apexcharts";
import { CHART_COLORS } from "@/constants/LearningJourneyDashboardConstants/visitorsConstants";

interface ChartOptionsParams {
  isComparisonMode: boolean;
  isLoading: boolean;
  maxValue: number;
  primaryVisitors: number;
  comparisonVisitors: number;
  trackBackgroundColor: string;
}

export const getVisitorsChartOptions = ({
  isComparisonMode,
  isLoading,
  maxValue,
  primaryVisitors,
  comparisonVisitors,
  trackBackgroundColor,
}: ChartOptionsParams): ApexOptions => {
  return {
    colors: isComparisonMode 
      ? [CHART_COLORS.PRIMARY, CHART_COLORS.COMPARISON] 
      : [CHART_COLORS.PRIMARY],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -95,
        endAngle: 95,
        hollow: { size: isComparisonMode ? "66%" : "77%" },
        track: { 
          background: trackBackgroundColor, 
          strokeWidth: "100%", 
          margin: 5
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: 10,
            color: "#1D2939",
            fontSize: "16px",
            fontWeight: "600",
          },
          value: {
            show: true,
            fontSize: "60px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function(val: number) {
              return isLoading ? "..." : `${Math.round((val / 100) * maxValue)}`;
            },
          },
          total: {
            show: isComparisonMode,
            label: 'Total Visitors Attended',
            fontSize: '16px',
            fontWeight: '600',
            color: '#64748B',
            formatter: function () {
              return isLoading ? "..." : `${primaryVisitors + comparisonVisitors}`;
            }
          }
        },
      },
    },
    fill: { 
      type: "solid", 
      colors: isComparisonMode 
        ? [CHART_COLORS.PRIMARY, CHART_COLORS.COMPARISON] 
        : [CHART_COLORS.PRIMARY]
    },
    stroke: { lineCap: "round" },
    labels: isComparisonMode 
      ? ["Primary Period", "Comparison Period"] 
      : ["Visitors Attended"],
  };
};