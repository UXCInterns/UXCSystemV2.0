import React from 'react';
import { KanbanBoardView } from '@/components/kanban/kanban/KanbanBoardView';
import KanbanTableView from '@/components/kanban/kanban/KanbanTableView';
import { columns } from '@/constants/kanbanColumns';
import type { Task } from '@/types/kanban';

interface KanbanBoardContentProps {
  viewMode: 'kanban' | 'table';
  tasks: Task[];
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  onTaskClick: (task: Task) => void;
  showCompactView: boolean;
}

export default function KanbanBoardContent({
  viewMode,
  tasks,
  onDragStart,
  onDragEnd,
  onTaskClick,
  showCompactView
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
          />
        </div>
      )}
    </>
  );
}