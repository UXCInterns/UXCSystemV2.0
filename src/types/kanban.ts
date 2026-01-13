export type Assignee = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  assigned_at: string;
};

// src/types/kanban.ts
export type TaskComment = {
  comment_id: string;
  task_id: string;
  comment_text: string;
  commenter_id: string;
  commenter_name: string;
  commenter_avatar: string | null;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
};

export type Task = {
  id: string;
  project_id: string;
  project_name: string;
  task_name: string;
  task_description: string;
  comments: string;
  assignees: Assignee[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  due_date: string | null;
  due_date_raw: string | null;
  started_at?: string | null;  // Add this line
  comment_count: number;
  created_at: string;
  updated_at: string;
  column: string;
  name: string;
  position: number;
};

export type KanbanColumn = {
  id: string;
  name: string;
  color: string;
};