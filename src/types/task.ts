export type Priority = 'low' | 'medium' | 'high';
export type Status = string;

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: Date;
  dueDate?: Date;
  assignee?: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}