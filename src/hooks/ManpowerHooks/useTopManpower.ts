import { useState, useEffect, useCallback } from "react";
import { onProjectUpdate } from "@/lib/projectEvents";
import { ManpowerAllocation } from "@/types/ManpowerTypes/manpower";

export const useTopManpower = (limit: number = 10) => {
  const [manpower, setManpower] = useState<ManpowerAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchManpower = useCallback(async () => {
    try {
      const response = await fetch('/api/manpower');
      if (!response.ok) throw new Error('Failed to fetch manpower data');
      
      const data = await response.json();
      const sortedData = (data.manpower || [])
        .sort((a: ManpowerAllocation, b: ManpowerAllocation) => 
          b.total_projects - a.total_projects
        )
        .slice(0, limit);
      setManpower(sortedData);
    } catch (error) {
      console.error('Error fetching manpower:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchManpower();
    const unsubscribe = onProjectUpdate(fetchManpower);
    return unsubscribe;
  }, [fetchManpower]);

  return { manpower, loading };
};