import React, { useState } from 'react';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader as KanbanColumnHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { TaskCard } from './TaskCard';
import type { Task, KanbanColumn } from '@/types/kanban';

type Props = {
  columns: KanbanColumn[];
  tasks: Task[];
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  onTaskClick: (task: Task) => void;
};

export function KanbanBoardView({
  columns,
  tasks,
  onDragStart,
  onDragEnd,
  onTaskClick,
}: Props) {
  const [localTasks, setLocalTasks] = useState(tasks);

  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDataChange = (updatedTasks: Task[]) => {
    setLocalTasks(updatedTasks);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 h-full">
      <div className="col-span-12">
        <KanbanProvider
          columns={columns}
          data={localTasks}
          onDataChange={handleDataChange}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {(column) => (
            <KanbanBoard id={column.id} key={column.id}>
              <KanbanColumnHeader>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-3">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <span>{column.name}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {localTasks.filter(t => t.column === column.id).length}
                  </span>
                </div>
              </KanbanColumnHeader>
              <KanbanCards id={column.id}>
                {(task: Task) => (
                  <KanbanCard
                    column={column.id}
                    id={task.id}
                    key={task.id}
                    name={task.name}
                  >
                    <TaskCard task={task} onExpand={onTaskClick} />
                  </KanbanCard>
                )}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>
    </div>
  );
}