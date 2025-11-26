import React, { useState, useMemo } from 'react';
import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttToday,
  type GanttFeature,
  type Range,
} from '@/components/ui/shadcn-io/gantt';
import { useTasks } from '@/hooks/kanban/useTasks';
import { supabase } from '@/../../lib/supabase/supabaseClient';
import type { Task } from '@/types/kanban';
import Avatar from '@/components/ui/avatar/Avatar';
import { KanbanToolbar, type TaskFilters } from '@/components/kanban/kanban/KanbanToolbar';
import { useUser } from '@/hooks/useUser';
import Button from '@/components/ui/button/Button';
import Toggle from '@/components/ui/toggle/Toggle';

interface GanttChartProps {
  projectId: string;
}

// Priority colors matching your badges
const priorityColors: Record<Task['priority'], string> = {
  'Critical': '#EF4444', // red
  'High': '#F59E0B',     // orange
  'Medium': '#3B82F6',   // blue
  'Low': '#10B981',      // green
};

// Status order for grouping
const statusOrder: Task['status'][] = ['To Do', 'In Progress', 'Review', 'Done'];

// Convert Kanban tasks to Gantt features
const convertTasksToFeatures = (tasks: Task[]): GanttFeature[] => {
  return tasks.map(task => {
    // Use started_at if available, otherwise fallback to created_at
    const startDate = task.started_at 
      ? new Date(task.started_at) 
      : (task.created_at ? new Date(task.created_at) : new Date());
    
    const endDate = task.due_date 
      ? new Date(task.due_date) 
      : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Default 7 days later

    return {
      id: task.id,
      name: task.task_name,
      startAt: startDate,
      endAt: endDate,
      status: {
        id: task.status.toLowerCase().replace(' ', '-'),
        name: task.status,
        color: priorityColors[task.priority],
      },
      lane: task.status, // Group by status
    };
  });
};

// Group features by status in the correct order
const groupFeaturesByStatus = (features: GanttFeature[]) => {
  const grouped = new Map<string, GanttFeature[]>();
  
  // Initialize with all statuses in order
  statusOrder.forEach(status => {
    grouped.set(status, []);
  });
  
  // Add features to their respective groups
  features.forEach(feature => {
    const status = feature.lane || 'To Do';
    if (grouped.has(status)) {
      grouped.get(status)?.push(feature);
    }
  });
  
  // Remove empty groups
  statusOrder.forEach(status => {
    if (grouped.get(status)?.length === 0) {
      grouped.delete(status);
    }
  });
  
  return grouped;
};

export default function GanttChart({ projectId }: GanttChartProps) {
  const [range, setRange] = useState<Range>('monthly');
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [activeFilters, setActiveFilters] = useState<TaskFilters>({
    priorities: [],
    dueDateRange: { start: null, end: null },
    assignees: []
  });

  const { tasks, loading, error, setTasks } = useTasks(projectId);
  const { id: currentUserId } = useUser();
  
  // Fetch profiles for the project (same logic as Kanban)
  const [profiles, setProfiles] = useState<any[]>([]);
  
  React.useEffect(() => {
    const fetchProjectProfiles = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch projects');
        }

        const foundProject = data.projects.find((p: any) => p.id === projectId);
        
        if (!foundProject) {
          console.error('Project not found');
          return;
        }

        const teamProfiles: any[] = [];
        const addedIds = new Set<string>();

        const addProfile = (member: any) => {
          if (member && member.id && !addedIds.has(member.id)) {
            teamProfiles.push({
              id: member.id,
              full_name: member.name,
              email: member.email,
              avatar_url: member.avatar_url || undefined,
            });
            addedIds.add(member.id);
          }
        };

        // Add project manager
        if (foundProject.project_manager) {
          addProfile(foundProject.project_manager);
        }

        // Add project lead
        if (foundProject.project_lead) {
          addProfile(foundProject.project_lead);
        }

        // Add core team
        if (Array.isArray(foundProject.core_team)) {
          foundProject.core_team.forEach(addProfile);
        }

        // Add support team
        if (Array.isArray(foundProject.support_team)) {
          foundProject.support_team.forEach(addProfile);
        }

        setProfiles(teamProfiles);
      } catch (error) {
        console.error('Error fetching project profiles:', error);
      }
    };
    
    if (projectId) {
      fetchProjectProfiles();
    }
  }, [projectId]);

  // Filter tasks based on search, filters, and "My Tasks"
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.task_name.toLowerCase().includes(query) ||
        task.task_description?.toLowerCase().includes(query)
      );
    }

    // Priority filter
    if (activeFilters.priorities.length > 0) {
      filtered = filtered.filter(task =>
        activeFilters.priorities.includes(task.priority)
      );
    }

    // Due date range filter
    if (activeFilters.dueDateRange.start && activeFilters.dueDateRange.end) {
      const startDate = new Date(activeFilters.dueDateRange.start);
      const endDate = new Date(activeFilters.dueDateRange.end);
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        const taskDueDate = new Date(task.due_date);
        return taskDueDate >= startDate && taskDueDate <= endDate;
      });
    }

    // Assignee filter
    if (activeFilters.assignees.length > 0) {
      filtered = filtered.filter(task =>
        task.assignees?.some(assignee =>
          activeFilters.assignees.includes(assignee.id)
        )
      );
    }

    // My Tasks filter
    if (showMyTasksOnly && currentUserId) {
      filtered = filtered.filter(task =>
        task.assignees?.some(assignee => assignee.id === currentUserId)
      );
    }

    return filtered;
  }, [tasks, searchQuery, activeFilters, showMyTasksOnly, currentUserId]);

  // Convert filtered tasks to features - memoized to prevent re-renders
  const features = useMemo(() => {
    return convertTasksToFeatures(filteredTasks);
  }, [filteredTasks]);
  
  const groupedFeatures = useMemo(() => {
    return groupFeaturesByStatus(features);
  }, [features]);

  const handleMove = async (id: string, startAt: Date, endAt: Date | null) => {
    console.log(`🔄 Task ${id} moved - Start: ${startAt}, End: ${endAt}`);
    
    if (!endAt) {
      console.log('❌ No end date provided');
      return;
    }

    const originalTask = tasks.find(t => t.id === id);
    if (!originalTask) {
      console.log('❌ Task not found');
      return;
    }

    try {
      // Convert dates to local date strings (YYYY-MM-DD) to avoid timezone issues
      const formatDateForStorage = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDateStr = formatDateForStorage(startAt);
      const endDateStr = formatDateForStorage(endAt);

      // Optimistic update
      console.log('⏳ Applying optimistic update...');
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id
            ? {
                ...task,
                started_at: startDateStr,
                due_date: endDateStr,
                due_date_raw: endDateStr,
                updated_at: new Date().toISOString()
              }
            : task
        )
      );

      // Update in database
      console.log('💾 Updating database...');
      const { data, error: updateError } = await supabase
        .from('kanban_tasks')
        .update({
          started_at: startDateStr,
          due_date: endDateStr,
          updated_at: new Date().toISOString()
        })
        .eq('task_id', id)
        .select();

      if (updateError) {
        console.error('❌ Database error:', updateError);
        throw updateError;
      }

      console.log('✅ Task dates updated successfully:', data);
    } catch (err) {
      console.error('❌ Error updating task dates:', err);
      
      // Revert optimistic update on error
      console.log('↩️ Reverting changes...');
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? originalTask : task
        )
      );
      
      alert('Failed to update task dates. Please try again.');
    }
  };

  const handleFilterChange = (filters: TaskFilters) => {
    setActiveFilters(filters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] p-6">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="p-6 space-y-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col">
        {/* Header and Toolbar */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">Gantt Chart</h1>
              {(searchQuery || activeFilters.priorities.length > 0 || activeFilters.assignees.length > 0 || 
                (activeFilters.dueDateRange.start && activeFilters.dueDateRange.end) || showMyTasksOnly) && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Showing {filteredTasks.length} of {tasks.length} tasks
                </p>
              )}
            </div>

            {/* Range Selector */}
            <Toggle
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' }
              ]}
              selectedValue={range}
              onChange={(value) => setRange(value as Range)}
            />

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                className="!px-3 !py-1.5"
              >
                −
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[50px] text-center">
                {zoom}%
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="!px-3 !py-1.5"
              >
                +
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Kanban Toolbar with Filters */}
          <KanbanToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showMyTasksOnly={showMyTasksOnly}
            setShowMyTasksOnly={setShowMyTasksOnly}
            currentUserId={currentUserId}
            profiles={profiles}
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          {filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">No tasks found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Try adjusting your filters or search query
                </p>
              </div>
            </div>
          ) : (
            <GanttProvider range={range} zoom={zoom}>
              <GanttSidebar className="bg-white dark:bg-gray-900">
                {Array.from(groupedFeatures.entries()).map(([status, statusFeatures]) => (
                  <GanttSidebarGroup key={status} name={status}>
                    {statusFeatures.map((feature) => {
                      const task = tasks.find(t => t.id === feature.id);
                      return (
                        <GanttSidebarItem
                          key={feature.id}
                          feature={feature}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        />
                      );
                    })}
                  </GanttSidebarGroup>
                ))}
              </GanttSidebar>
              
              <GanttTimeline className="bg-gray-50 dark:bg-gray-900">
                <GanttHeader />
                <GanttFeatureList>
                  {Array.from(groupedFeatures.entries()).map(([status, statusFeatures]) => (
                    <GanttFeatureListGroup key={status}>
                      {statusFeatures.map((feature) => {
                        const task = tasks.find(t => t.id === feature.id);
                        const assignees = task?.assignees || [];
                        return (
                          <GanttFeatureRow
                            key={feature.id}
                            features={[feature]}
                            onMove={handleMove}
                          >
                            {(f) => (
                              <div className="flex items-center gap-2 w-full px-2">
                                {/* Priority indicator circle */}
                                <div
                                  className="h-2 w-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: f.status.color }}
                                />
                                <p className="flex-1 truncate text-xs font-medium text-gray-800 dark:text-white">
                                  {f.name}
                                </p>
                                {/* Assignee avatars - only show if assignees exist */}
                                {assignees && assignees.length > 0 && (
                                  <div className="flex -space-x-1 flex-shrink-0">
                                    {assignees.slice(0, 2).map((assignee) => (
                                      <div key={assignee.id} title={assignee.name}>
                                        <Avatar
                                          src={assignee.avatar_url}
                                          name={assignee.name}
                                          size="xsmall"
                                        />
                                      </div>
                                    ))}
                                    {assignees.length > 2 && (
                                      <div
                                        className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-[9px] font-medium border border-white dark:border-gray-800"
                                        title={`+${assignees.length - 2} more`}
                                      >
                                        +{assignees.length - 2}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </GanttFeatureRow>
                        );
                      })}
                    </GanttFeatureListGroup>
                  ))}
                </GanttFeatureList>
                <GanttToday className="bg-blue-500" />
              </GanttTimeline>
            </GanttProvider>
          )}
        </div>
      </div>
    </div>
  );
}