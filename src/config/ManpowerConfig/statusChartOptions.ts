// ApexCharts configuration for status distribution donut chart
import { STATUS_COLORS } from "@/constants/manpowerConstants";

interface ChartOptionsParams {
  labels: string[];
  series: number[];
  hoveredLabel: string | null;
  hoveredValue: number | null;
  totalPeople: number;
  onDataPointMouseEnter: (dataPointIndex: number) => void;
  onDataPointMouseLeave: () => void;
}

export const getStatusChartOptions = ({
  labels,
  series,
  hoveredLabel,
  hoveredValue,
  totalPeople,
  onDataPointMouseEnter,
  onDataPointMouseLeave,
}: ChartOptionsParams): ApexCharts.ApexOptions => {
  const colors = labels.map(label => STATUS_COLORS[label] || '#93c5fd');

  return {
    chart: {
      type: "donut",
      background: "transparent",
      events: {
        dataPointMouseEnter: function (event, chartContext, config) {
          onDataPointMouseEnter(config.dataPointIndex);
        },
        dataPointMouseLeave: function () {
          onDataPointMouseLeave();
        }
      }
    },
    labels,
    colors,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontFamily: "inherit",
              fontWeight: 600,
              color: "#6b7280",
              formatter: function () {
                return hoveredLabel || "Total";
              }
            },
            value: {
              show: true,
              fontSize: "28px",
              fontFamily: "inherit",
              fontWeight: 700,
              color: "#111827",
              offsetY: 5,
              formatter: function (val) {
                return hoveredValue !== null ? String(hoveredValue) : String(totalPeople);
              }
            },
            total: {
              show: true,
              fontSize: "15px",
              fontFamily: "inherit",
              fontWeight: 600,
            }
          }
        }
      }
    },
    tooltip: {
      enabled: false,
    },
    states: {
      hover: {
        filter: { type: "lighten" }
      },
      active: {
        filter: { type: "none" }
      }
    }
  };
};