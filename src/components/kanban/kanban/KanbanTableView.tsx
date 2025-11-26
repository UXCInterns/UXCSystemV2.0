import React from 'react';
import { Task } from '@/types/kanban';
import Badge from '@/components/ui/badge/Badge';
import Avatar from '@/components/ui/avatar/Avatar';
import { getStatusBadgeProps, getPriorityBadgeProps } from '@/utils/badgeHelpers';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table/index';

interface KanbanTableViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  showCompactView?: boolean;
}

const KanbanTableView: React.FC<KanbanTableViewProps> = ({ tasks, onTaskClick, showCompactView = false }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string | null, status: Task['status']) => {
    if (!dueDate || status === 'Done') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <TableRow>
              <TableCell 
                isHeader 
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Task Name
              </TableCell>
              <TableCell 
                isHeader 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Assigned To
              </TableCell>
              {!showCompactView && (
                <TableCell 
                  isHeader 
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Due Date
                </TableCell>
              )}
              <TableCell 
                isHeader 
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </TableCell>
              <TableCell 
                isHeader 
                className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Priority
              </TableCell>
            </TableRow>
          </TableHeader>
          
          <TableBody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell 
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  // Use colSpan as a regular prop
                >
                  <div style={{ gridColumn: `span ${showCompactView ? 4 : 5}` }}>
                    No tasks found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => {
                // Safely handle assignees - ensure it's always an array
                const assignees = task.assignees ?? [];
                
                return (
                  <TableRow
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    {/* Task Name */}
                    <TableCell className="px-5 py-2 text-sm text-gray-500 dark:text-gray-400 text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.task_name}
                      </div>
                      {!showCompactView && task.task_description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                          {task.task_description}
                        </div>
                      )}
                    </TableCell>

                    {/* Assignees */}
                    <TableCell className="px-4 py-2 text-sm text-left">
                      {assignees.length === 0 ? (
                        <span className="text-sm text-gray-400 dark:text-gray-500">Unassigned</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {assignees.slice(0, 3).map((assignee) => (
                              <div key={assignee.id}>
                                <Avatar 
                                  src={assignee.avatar_url}
                                  name={assignee.name}
                                  size="medium"
                                />
                              </div>
                            ))}
                          </div>
                          {assignees.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              +{assignees.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Due Date */}
                    {!showCompactView && (
                      <TableCell className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                        <span
                          className={`text-sm ${
                            isOverdue(task.due_date, task.status)
                              ? 'text-red-600 dark:text-red-400 font-medium'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {formatDate(task.due_date)}
                        </span>
                      </TableCell>
                    )}

                    {/* Status */}
                    <TableCell className="px-4 py-2 text-center">
                      <Badge size="sm" {...getStatusBadgeProps(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>

                    {/* Priority */}
                    <TableCell className="px-4 py-2 text-center">
                      <Badge size="sm" {...getPriorityBadgeProps(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default KanbanTableView;