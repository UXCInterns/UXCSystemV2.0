// Hook for managing status distribution chart state and data
import { useState, useEffect, useMemo } from "react";
import { onProjectUpdate } from "@/lib/projectEvents";
import { ManpowerAllocation, StatusDistribution } from "@/types/ManpowerTypes/manpower";
import { calculateStatusDistribution } from "@/utils/ManpowerUtils/StatusDistributionChartUtils/statusDistribution";

export const useStatusDistribution = () => {
  const [manpower, setManpower] = useState<ManpowerAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const fetchManpower = async () => {
    try {
      const response = await fetch('/api/manpower');
      if (!response.ok) throw new Error('Failed to fetch manpower data');
      
      const data = await response.json();
      setManpower(data.manpower || []);
    } catch (error) {
      console.error('Error fetching manpower:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManpower();
    const unsubscribe = onProjectUpdate(fetchManpower);
    return unsubscribe;
  }, []);

  const statusData = useMemo(
    () => calculateStatusDistribution(manpower),
    [manpower]
  );

  const totalPeople = useMemo(
    () => statusData.reduce((sum, item) => sum + item.count, 0),
    [statusData]
  );

  const handleDataPointMouseEnter = (dataPointIndex: number) => {
    setHoveredValue(statusData[dataPointIndex].count);
    setHoveredLabel(statusData[dataPointIndex].status);
  };

  const handleDataPointMouseLeave = () => {
    setHoveredValue(null);
    setHoveredLabel(null);
  };

  return {
    statusData,
    totalPeople,
    loading,
    hoveredValue,
    hoveredLabel,
    handleDataPointMouseEnter,
    handleDataPointMouseLeave,
  };
};