import { useMemo } from 'react';
import type { Task } from '@/types/KanbanBoardTypes/kanban';
import type { TaskFilters } from '@/components/kanban/KanbanBoardView/KanbanToolbar';

interface UseTaskFiltersProps {
  tasks: Task[];
  searchQuery: string;
  showMyTasksOnly: boolean;
  currentUserId: string | null;
  filters: TaskFilters;
}

export function useTaskFilters({
  tasks,
  searchQuery,
  showMyTasksOnly,
  currentUserId,
  filters
}: UseTaskFiltersProps) {
  
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const assignees = task.assignees ?? [];

      // Search filter
      const matchesSearch =
        task.task_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.task_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignees.some(a => a.name?.toLowerCase().includes(searchQuery.toLowerCase()));

      // My tasks filter - only show tasks where current user is assigned
      const matchesMyTasks =
        !showMyTasksOnly ||
        (currentUserId && assignees.some(a => a.id === currentUserId));

      // Priority filter
      const matchesPriority =
        filters.priorities.length === 0 || filters.priorities.includes(task.priority);

      // Due date range filter
      const matchesDueDate = (() => {
        if (!filters.dueDateRange.start || !filters.dueDateRange.end) return true;
        if (!task.due_date) return false;

        const taskDate = new Date(task.due_date);
        const startDate = new Date(filters.dueDateRange.start);
        const endDate = new Date(filters.dueDateRange.end);

        return taskDate >= startDate && taskDate <= endDate;
      })();

      // Assignees filter
      const matchesAssignees =
        filters.assignees.length === 0 ||
        assignees.some(a => filters.assignees.includes(a.id));

      return matchesSearch && matchesMyTasks && matchesPriority && matchesDueDate && matchesAssignees;
    });
  }, [tasks, searchQuery, showMyTasksOnly, currentUserId, filters]);

  return filteredTasks;
}