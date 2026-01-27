import React from 'react';
import { KanbanBoardView } from '@/components/kanban/KanbanBoardView/KanbanBoardView';
import KanbanTableView from '@/components/kanban/KanbanBoardView/KanbanTableView';
import { columns } from '@/constants/KanbanBoardConstants/kanbanConstants';
import type { Task } from '@/types/KanbanBoardTypes/kanban';

interface KanbanBoardContentProps {
  viewMode: 'kanban' | 'table';
  tasks: Task[];
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  onTaskClick: (task: Task) => void;
  showCompactView: boolean;
  canEdit?: boolean; // NEW: Permission prop
}

export default function KanbanBoardContent({
  viewMode,
  tasks,
  onDragStart,
  onDragEnd,
  onTaskClick,
  showCompactView,
  canEdit = true // Default to true for backward compatibility
}: KanbanBoardContentProps) {
  return (
    <>
      {/* Board View */}
      {viewMode === 'kanban' && (
        <div className="flex-1 overflow-auto custom-scrollbar">
          <KanbanBoardView
            columns={columns}
            tasks={tasks}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onTaskClick={onTaskClick}
            canEdit={canEdit} // Pass permission to board view
          />
        </div>
      )}
      
      {/* Table View */}
      {viewMode === 'table' && (
        <div className="flex-1 overflow-auto custom-scrollbar">
          <KanbanTableView
            tasks={tasks}
            onTaskClick={onTaskClick}
            showCompactView={showCompactView}
            canEdit={canEdit} // Pass permission to table view
          />
        </div>
      )}
    </>
  );
}