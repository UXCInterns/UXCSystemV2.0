"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/avatar/Avatar";
import { supabase } from "@/../../lib/supabase/supabaseClient";
import type { RealtimeChannel } from '@supabase/supabase-js';

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
};

type Project = {
  id: string;
  project_name: string;
  project_description?: string;
  project_manager: Profile;
  project_lead: Profile;
  core_team: Profile[];
  support_team: Profile[];
  start_date: string;
  end_date: string;
  progress: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export default function KanbanHeader({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);
  const [liveProgress, setLiveProgress] = useState<number | null>(null);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);

  // Fetch project data from API
  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch project');
      }

      // Find the specific project
      const foundProject = data.projects.find((p: any) => p.id === projectId);
      
      if (!foundProject) {
        throw new Error('Project not found');
      }

      setProject(foundProject);
      setError(null);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  // Fetch project on mount
  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Set up Realtime subscription to listen for project updates
  useEffect(() => {
    if (!projectId) return;

    console.log('👂 Setting up realtime listener for project progress updates');
    
    const channel = supabase
      .channel(`project-progress:${projectId}`)
      // Listen to the projects table for THIS specific project
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('📊 Project updated via trigger:', payload.new);
          
          // Only update progress and status - no full refetch!
          const newProgress = payload.new.progress;
          const newStatus = payload.new.status;
          
          if (newProgress !== undefined) {
            setLiveProgress(newProgress);
          }
          if (newStatus !== undefined) {
            setLiveStatus(newStatus);
          }
        }
      )
      .subscribe((status) => {
        console.log(`📡 Project progress realtime status:`, status);
      });

    setRealtimeChannel(channel);

    // Cleanup on unmount
    return () => {
      console.log(`🔌 Unsubscribing from project progress ${projectId}`);
      channel.unsubscribe();
      setRealtimeChannel(null);
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="animate-pulse flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/[0.1]">
        <p className="text-red-600 dark:text-red-400">
          {error || 'Project not found'}
        </p>
      </div>
    );
  }

  const displayProgress = liveProgress !== null ? liveProgress : project.progress;
  const displayStatus = liveStatus !== null ? liveStatus : project.status;

  // Collect all unique team members
  const allTeamMembers: Profile[] = [];
  
  // Add project manager if exists
  if (project.project_manager?.id) {
    allTeamMembers.push(project.project_manager);
  }
  
  // Add project lead if exists and not already added
  if (project.project_lead?.id && 
      !allTeamMembers.find(m => m.id === project.project_lead.id)) {
    allTeamMembers.push(project.project_lead);
  }
  
  // Add core team members
  if (project.core_team && project.core_team.length > 0) {
    project.core_team.forEach(member => {
      if (member.id && !allTeamMembers.find(m => m.id === member.id)) {
        allTeamMembers.push(member);
      }
    });
  }
  
  // Add support team members
  if (project.support_team && project.support_team.length > 0) {
    project.support_team.forEach(member => {
      if (member.id && !allTeamMembers.find(m => m.id === member.id)) {
        allTeamMembers.push(member);
      }
    });
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    // Check if it's already formatted (contains comma or "Ongoing")
    if (dateString.includes(',') || dateString === 'Ongoing' || dateString === 'Not set') {
      return dateString;
    }
    
    // Otherwise, parse and format
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hidden md:flex items-center justify-between">
      {/* Left Section */}
      <div className="flex flex-col items-start w-[20%]">
        <button
          onClick={() => router.push("/project-board")}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors text-sm mb-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
          {project.project_name}
        </h1>
      </div>

      {/* Due Date */}
      <div className="flex flex-col text-xs text-gray-400 tracking-wide w-[20%]">
        <span className="mb-1 uppercase">Due Date</span>
        <span className="text-xl font-bold text-gray-800 dark:text-white/90 mt-0.5">
          {formatDate(project.end_date)}
        </span>
      </div>

      {/* Progress - Live Updates from Database Triggers! */}
      <div className="flex flex-col text-xs text-gray-400 tracking-wide w-[20%]">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="uppercase">Progress</span>
          {realtimeChannel?.state === 'joined' && (
            <span 
              className="w-2 h-2 rounded-full bg-green-500 animate-pulse" 
              title="Live updates active"
            />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {Math.round(displayProgress)}%
          </span>
        </div>
      </div>
      
      {/* People on Project */}
      <div className="flex flex-col text-xs text-gray-400 uppercase tracking-wide w-[20%]">
        <span className="mb-1">People on Project</span>
        <div className="flex items-center mt-1">
          {allTeamMembers.length > 0 ? (
            <div className="flex -space-x-2">
              {allTeamMembers.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="relative group"
                  title={`${member.name} (${member.email})`}
                >
                    <Avatar
                      src={member.avatar_url}
                      name={member.name}
                      size="medium"
                      className="hover:scale-110 transition-transform cursor-pointer"
                    />
                </div>
              ))}
              {allTeamMembers.length > 5 && (
                <div
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-200 text-xs font-semibold"
                  title={`${allTeamMembers.length - 5} more team members`}
                >
                  +{allTeamMembers.length - 5}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No team members</p>
          )}
        </div>
      </div>
    </div>
  );
}