import { useState, useEffect } from "react";
import { onProjectUpdate } from "@/lib/projectEvents";
import { ManpowerAllocation } from "@/types/ManpowerTypes/manpower";

export const useManpowerData = () => {
  const [manpower, setManpower] = useState<ManpowerAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchManpower = async () => {
    try {
      const response = await fetch("/api/manpower");
      if (!response.ok) throw new Error("Failed to fetch manpower");

      const data = await response.json();
      setManpower(data.manpower || []);
    } catch (err) {
      console.error("Error fetching manpower:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManpower();
    const unsubscribe = onProjectUpdate(fetchManpower);
    return unsubscribe;
  }, []);

  return { manpower, loading };
};