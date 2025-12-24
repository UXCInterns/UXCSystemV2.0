import type { Task } from '@/types/KanbanBoardTypes/kanban';

// Priority colors matching your badges
export const priorityColors: Record<Task['priority'], string> = {
  'Critical': '#EF4444', // red
  'High': '#F59E0B',     // orange
  'Medium': '#3B82F6',   // blue
  'Low': '#10B981',      // green
};

// Status order for grouping
export const statusOrder: Task['status'][] = ['To Do', 'In Progress', 'Review', 'Done'];

// Zoom configuration
export const ZOOM_MIN = 50;
export const ZOOM_MAX = 200;
export const ZOOM_STEP = 25;