import { useState, useMemo } from 'react';
import type { Task } from '@/types/KanbanBoardTypes/kanban';
import type { TaskFilters } from '@/components/kanban/KanbanBoardView/KanbanToolbar';

export const useGanttFilters = (tasks: Task[], currentUserId: string | null) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [activeFilters, setActiveFilters] = useState<TaskFilters>({
    priorities: [],
    dueDateRange: { start: null, end: null },
    assignees: []
  });

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

  const hasActiveFilters = Boolean(
    searchQuery || 
    activeFilters.priorities.length > 0 || 
    activeFilters.assignees.length > 0 || 
    (activeFilters.dueDateRange.start && activeFilters.dueDateRange.end) || 
    showMyTasksOnly
  );

  return {
    searchQuery,
    setSearchQuery,
    showMyTasksOnly,
    setShowMyTasksOnly,
    activeFilters,
    setActiveFilters,
    filteredTasks,
    hasActiveFilters,
  };
};