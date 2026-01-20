import type { Task } from '@/types/KanbanBoardTypes/kanban';
import type { GanttFeature } from '@/components/ui/shadcn-io/gantt';
import { priorityColors, statusOrder } from '@/constants/GanttChartConstants/ganttConstants';

// Convert Kanban tasks to Gantt features
export const convertTasksToFeatures = (tasks: Task[]): GanttFeature[] => {
  return tasks.map(task => {
    const startDate = task.started_at 
      ? new Date(task.started_at) 
      : (task.created_at ? new Date(task.created_at) : new Date());
    
    const endDate = task.due_date 
      ? new Date(task.due_date) 
      : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

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
      lane: task.status,
    };
  });
};

// Group features by status in the correct order
export const groupFeaturesByStatus = (features: GanttFeature[]) => {
  const grouped = new Map<string, GanttFeature[]>();
  
  statusOrder.forEach(status => {
    grouped.set(status, []);
  });
  
  features.forEach(feature => {
    const status = feature.lane || 'To Do';
    if (grouped.has(status)) {
      grouped.get(status)?.push(feature);
    }
  });
  
  statusOrder.forEach(status => {
    if (grouped.get(status)?.length === 0) {
      grouped.delete(status);
    }
  });
  
  return grouped;
};

// Format date for storage (YYYY-MM-DD) to avoid timezone issues
export const formatDateForStorage = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};