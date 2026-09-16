import type {
  Task,
  TaskFilters,
  TaskPriority,
  TaskSort,
  TaskStatus,
} from '../domain/task';

export type TaskStatistics = Readonly<{
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
}>;

const normalizeSearchValue = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');

const statusOrder: Record<TaskStatus, number> = {
  pending: 0,
  in_progress: 1,
  done: 2,
};

const priorityOrder: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export const filterTasks = (
  tasks: readonly Task[],
  filters: TaskFilters,
): readonly Task[] => {
  const normalizedQuery = normalizeSearchValue(filters.query.trim());

  return tasks.filter(task => {
    const searchableContent = normalizeSearchValue(
      `${task.title} ${task.area} ${task.assignee}`,
    );
    const matchesQuery = searchableContent.includes(normalizedQuery);
    const matchesStatus =
      filters.status === 'all' || task.status === filters.status;
    const matchesPriority =
      filters.priority === 'all' || task.priority === filters.priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });
};

export const sortTasks = (
  tasks: readonly Task[],
  sort: TaskSort,
): readonly Task[] => {
  const direction = sort.direction === 'ascending' ? 1 : -1;
  const getOrder =
    sort.field === 'status'
      ? (task: Task) => statusOrder[task.status]
      : (task: Task) => priorityOrder[task.priority];

  return tasks
    .map((task, index) => ({ task, index }))
    .sort((left, right) => {
      const difference = getOrder(left.task) - getOrder(right.task);

      return difference === 0
        ? left.index - right.index
        : difference * direction;
    })
    .map(({ task }) => task);
};

export const calculateTaskStatistics = (
  tasks: readonly Task[],
): TaskStatistics =>
  tasks.reduce<TaskStatistics>(
    (statistics, task) => ({
      total: statistics.total + 1,
      byStatus: {
        ...statistics.byStatus,
        [task.status]: statistics.byStatus[task.status] + 1,
      },
      byPriority: {
        ...statistics.byPriority,
        [task.priority]: statistics.byPriority[task.priority] + 1,
      },
    }),
    {
      total: 0,
      byStatus: { pending: 0, in_progress: 0, done: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
    },
  );

export const findTaskById = (tasks: readonly Task[], id: string) =>
  tasks.find(task => task.id === id);
