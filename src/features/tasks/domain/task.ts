export const taskStatuses = ['pending', 'inProgress', 'completed'] as const;
export const taskPriorities = ['low', 'medium', 'high'] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];
export type TaskSortField = 'status' | 'priority';
export type TaskSortDirection = 'ascending' | 'descending';

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
  query: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
}>;

export const defaultTaskFilters: TaskFilters = {
  query: '',
  status: 'all',
  priority: 'all',
};

export type TaskSort = Readonly<{
  field: TaskSortField;
  direction: TaskSortDirection;
}>;

export const defaultTaskSort: TaskSort = {
  field: 'status',
  direction: 'ascending',
};
