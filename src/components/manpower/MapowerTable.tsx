"use client";

import React, { useState, useEffect } from "react";
import Pagination from "@/components/common/Pagination";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";
import { onProjectUpdate } from "@/lib/projectEvents";
import { supabase } from "../../../lib/supabase/supabaseClient";

type ManpowerRecord = {
  profile_id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  projects_as_manager: number;
  projects_as_lead: number;
  projects_as_core_team: number;
  projects_as_support_team: number;
  total_projects: number;
  tasks_assigned: number;
  active_projects_count: number;
};

type StatusFilter = "All" | "Available" | "Busy" | "Overloaded";

export default function ManpowerTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [manpower, setManpower] = useState<ManpowerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const pageSize = 10;

  // Compute status based on core and support team involvement
  const computeStatus = (record: ManpowerRecord): StatusFilter => {
    const coreCount = record.projects_as_core_team;
    const supportCount = record.projects_as_support_team;
    
    // Overloaded: 5+ core OR 5+ support
    if (coreCount >= 5 || supportCount >= 5) {
      return "Overloaded";
    }
    
    // Busy: More than 2 core OR more than 3 support
    if (coreCount > 2 || supportCount > 3) {
      return "Busy";
    }
    
    // Available: 2 or fewer core AND 3 or fewer support
    return "Available";
  };

  // Fetch manpower data
  const fetchManpower = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/manpower');
      if (!response.ok) throw new Error('Failed to fetch manpower data');
      const data = await response.json();
      setManpower(data.manpower || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching manpower:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManpower();
    
    // Listen for project updates
    const unsubscribe = onProjectUpdate(() => {
      console.log('🔔 Project update event received, refetching manpower...');
      fetchManpower();
    });

    // Listen for realtime changes
    console.log('👂 Setting up realtime listener for manpower changes');
    const channel = supabase
      .channel('manpower-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        () => {
          console.log('🔔 Projects table changed, refetching manpower...');
          fetchManpower();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_core_team',
        },
        () => {
          fetchManpower();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_support_team',
        },
        () => {
          fetchManpower();
        }
      )
      .subscribe((status) => {
        console.log('📡 Manpower realtime status:', status);
      });

    return () => {
      unsubscribe();
      channel.unsubscribe();
    };
  }, []);

  // Filter and search
  const filteredManpower = manpower.filter((person) => {
    const matchesStatus = statusFilter === "All" || computeStatus(person) === statusFilter;
    return matchesStatus;
  });

  const totalPages = Math.ceil(filteredManpower.length / pageSize);
  const paginatedManpower = filteredManpower.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const getStatusBadgeProps = (status: StatusFilter) => {
    switch (status) {
      case "Available":
        return { color: "success" as const, variant: "light" as const };
      case "Busy":
        return { color: "warning" as const, variant: "light" as const };
      case "Overloaded":
        return { color: "error" as const, variant: "light" as const };
      default:
        return { color: "light" as const, variant: "light" as const };
    }
  };

  const getRoles = (person: ManpowerRecord) => {
    const roles: Array<{ label: string; count: number; color: string }> = [];
    if (person.projects_as_manager > 0) {
      roles.push({ label: 'Manager', count: person.projects_as_manager, color: 'error' });
    }
    if (person.projects_as_lead > 0) {
      roles.push({ label: 'Lead', count: person.projects_as_lead, color: 'warning' });
    }
    if (person.projects_as_core_team > 0) {
      roles.push({ label: 'Core', count: person.projects_as_core_team, color: 'primary' });
    }
    if (person.projects_as_support_team > 0) {
      roles.push({ label: 'Support', count: person.projects_as_support_team, color: 'success' });
    }
    return roles;
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      <div className="w-full">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] h-full flex flex-col">
          <div className="max-w-full overflow-x-auto flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.05]">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Manpower Allocation
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Filter by status:</span>
                {(["All", "Available", "Busy", "Overloaded"] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      statusFilter === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="px-5 py-3 border-b border-gray-200 dark:border-white/[0.05]">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {loading ? 'Loading...' : error ? 'Error loading data' : `Showing ${paginatedManpower.length} of ${filteredManpower.length} people`}
              </span>
            </div>

            {/* Table */}
            <div className="min-w-full flex-1 overflow-auto custom-scrollbar">
              <table className="w-full">
                <thead className="sticky top-0 border-b border-gray-100 dark:border-white/[0.05] bg-gray-200 dark:bg-gray-900">
                  <tr>
                    <th className="w-[12%] px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Person
                    </th>
                    <th className="w-[13%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Projects
                    </th>
                    <th className="w-[13%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Active Projects
                    </th>
                    <th className="w-[30%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="w-[13%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tasks Assigned
                    </th>
                    <th className="w-[11%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Loading manpower data...
                        </div>
                      </td>
                    </tr>
                  ) : paginatedManpower.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                        {statusFilter !== "All" ? "No people match your filter." : "No manpower data found."}
                      </td>
                    </tr>
                  ) : (
                    paginatedManpower.map((person) => {
                      const status = computeStatus(person);
                      return (
                        <tr 
                          key={person.profile_id} 
                          className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-5 py-4 text-sm text-left">
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar 
                                src={person.avatar_url}
                                name={person.full_name}
                                size="medium"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                  {person.full_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {person.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-white text-center font-medium">
                            {person.total_projects}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-white text-center font-medium">
                            {person.active_projects_count}
                          </td>
                          <td className="px-4 py-4 text-sm text-left">
                            <div className="flex flex-wrap gap-1.5">
                              {getRoles(person).length > 0 ? (
                                getRoles(person).map((role, idx) => (
                                  <Badge 
                                    key={idx} 
                                    size="sm" 
                                    color={role.color as any} 
                                    variant="light"
                                  >
                                    {role.label} ({role.count})
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-gray-500 dark:text-gray-400">No roles</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-white text-center font-medium">
                            {person.tasks_assigned}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge size="sm" {...getStatusBadgeProps(status)}>
                              {status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-auto border-t border-gray-200 dark:border-white/[0.05]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}