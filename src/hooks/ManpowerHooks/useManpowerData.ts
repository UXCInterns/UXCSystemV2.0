import { useState, useEffect } from "react";
import { onProjectUpdate } from "@/lib/projectEvents";
import { ManpowerAllocation } from "@/types/ManpowerTypes/manpower";

interface Project {
  project_id: string;
  project_name: string;
  project_status: string;
  roles: string[]; // Changed from 'role: string' to 'roles: string[]'
  tasks_assigned: number;
  start_date: string;
  end_date: string | null;
}

export const useManpowerData = () => {
  const [manpower, setManpower] = useState<ManpowerAllocation[]>([]);
  const [projectsByProfile, setProjectsByProfile] = useState<
    Record<string, Project[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState<
    Record<string, boolean>
  >({});

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

  const fetchProjects = async (profile_id: string) => {
    if (projectsByProfile[profile_id]) return;

    setLoadingProjects((prev) => ({ ...prev, [profile_id]: true }));

    try {
      const response = await fetch("/api/manpower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id }),
      });

      if (!response.ok) throw new Error("Failed to fetch project details");

      const data = await response.json();

      setProjectsByProfile((prev) => ({
        ...prev,
        [profile_id]: data.projects || [],
      }));
    } catch (err) {
      console.error("Error fetching project details:", err);
      setProjectsByProfile((prev) => ({ ...prev, [profile_id]: [] }));
    } finally {
      setLoadingProjects((prev) => ({ ...prev, [profile_id]: false }));
    }
  };

  useEffect(() => {
    fetchManpower();
    const unsubscribe = onProjectUpdate(fetchManpower);
    return unsubscribe;
  }, []);

  return {
    manpower,
    loading,
    fetchManpower,
    fetchProjects,
    projectsByProfile,
    loadingProjects,
  };
};