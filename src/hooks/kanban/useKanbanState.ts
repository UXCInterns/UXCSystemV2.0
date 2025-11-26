import { useState, useRef } from 'react';
import type { Task } from '@/types/kanban';
import type { TaskFilters } from '@/components/kanban/kanban/KanbanToolbar';

export function useKanbanState() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    priorities: [],
    dueDateRange: { start: null, end: null },
    assignees: []
  });
  const dragStartColumnRef = useRef<{ [key: string]: string }>({});

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedTask,
    setSelectedTask,
    showMyTasksOnly,
    setShowMyTasksOnly,
    showCreatePanel,
    setShowCreatePanel,
    filters,
    setFilters,
    dragStartColumnRef
  };
}