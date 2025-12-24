import type { KanbanColumn } from '../types/KanbanBoardTypes/kanban';

export const columns: KanbanColumn[] = [
  { id: 'To Do', name: 'To Do', color: '#E53E3E' },
  { id: 'In Progress', name: 'In Progress', color: '#D69E2E' },
  { id: 'Review', name: 'Review', color: '#6B46C1' },
  { id: 'Done', name: 'Done', color: '#38A169' },
];