//src/hooks/useProjectData.ts

import { useState } from "react";
import useSWR, { mutate } from 'swr';
import { Project } from "@/types/project";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

export const useProjectData = () => {

  const [isLoading, setIsLoading] = useState(false);

  const { data: rawData, error, isLoading: swrLoading } = useSWR('/api/projects', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  
  const mapProjectData = (row: any): Project => ({
    project_id: row.project_id,
    project_name: row.project_name,
    start_date: row.start_date,
    end_date: row.end_date,
    status: row.status || "-",
    description: row.description || "",
    created_at: row.created_at,
    updated_at: row.updated_at,
  })

 const projects = Array.isArray(rawData) ? rawData.map(mapProjectData) : [];

 const totalProjects = projects.length

 //counting the number of status
 const statusCounts = projects.reduce(
    (acc, proj) => {
      switch (proj.status) {
        case "Completed":
          acc.completed += 1;
          break;
        case "In Progress":
          acc.inProgress += 1;
          break;
        case "Aborted":
          acc.aborted += 1;
          break;
        case "Pending":
          acc.pending += 1;
          break;
        default:
          break;
      }
      return acc;
    },
    { completed: 0, inProgress: 0, aborted: 0, pending: 0 }
  );


  const addProject = async (ProjectData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ProjectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add proj");
      }

      mutate('/api/projects');
      return { success: true };
    } catch (error) {
      console.error("Error adding proj:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (ProjectData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ProjectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update visit");
      }

      mutate('/api/projects');
      return { success: true };
    } catch (error) {
      console.error("Error updating project:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (ProjectId: string) => {
    if (!confirm("Are you sure you want to delete this Project? This action cannot be undone.")) {
      return { success: false, cancelled: true };
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects?id=${ProjectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete project");
      }

      mutate('/api/projects');
      return { success: true };
    } catch (error) {
      console.error("Error deleting project:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projects,
    totalProjects,
    statusCounts,
    isLoading: swrLoading || isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
  };




}