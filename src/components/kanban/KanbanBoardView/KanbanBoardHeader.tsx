import React from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import { KanbanViewToggle } from '@/components/kanban/KanbanBoardView/KanbanViewToggle';
import { KanbanToolbar, type TaskFilters } from '@/components/kanban/KanbanBoardView/KanbanToolbar';
import type { Profile } from '@/types/ProjectsTypes/project';

interface KanbanBoardHeaderProps {
  viewMode: 'kanban' | 'table';
  setViewMode: (mode: 'kanban' | 'table') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showMyTasksOnly: boolean;
  setShowMyTasksOnly: (show: boolean) => void;
  currentUserId?: string;
  profiles: Profile[];
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
  onCreateTask: () => void;
}

export default function KanbanBoardHeader({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  showMyTasksOnly,
  setShowMyTasksOnly,
  currentUserId,
  profiles,
  filters,
  onFilterChange,
  onCreateTask
}: KanbanBoardHeaderProps) {
  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <KanbanViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        <Button
          size="sm"
          variant="primary"
          startIcon={<Plus size={16} />}
          onClick={onCreateTask}
          className="px-4 py-3"
        >
          Create Task
        </Button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Toolbar with all filter props */}
      <KanbanToolbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        showMyTasksOnly={showMyTasksOnly}
        setShowMyTasksOnly={setShowMyTasksOnly}
        currentUserId={currentUserId}
        profiles={profiles}
        onFilterChange={onFilterChange}
        activeFilters={filters}
      />
    </>
  );
}