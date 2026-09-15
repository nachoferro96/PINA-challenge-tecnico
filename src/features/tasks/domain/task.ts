export const taskStatuses = ['pending', 'inProgress', 'completed'] as const;
export const taskPriorities = ['low', 'medium', 'high'] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];

export type Task = Readonly<{
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  area: string;
  assignee: string;
  dueAt: string;
  createdAt: string;
}>;

export type TaskFilters = Readonly<{
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
}>;

export const defaultTaskFilters: TaskFilters = {
  status: 'all',
  priority: 'all',
};

