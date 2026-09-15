import type {Task, TaskFilters, TaskPriority, TaskStatus} from '../domain/task';

export type TaskStatistics = Readonly<{
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
}>;

export const filterTasks = (
  tasks: readonly Task[],
  filters: TaskFilters,
): readonly Task[] =>
  tasks.filter(task => {
    const matchesStatus =
      filters.status === 'all' || task.status === filters.status;
    const matchesPriority =
      filters.priority === 'all' || task.priority === filters.priority;

    return matchesStatus && matchesPriority;
  });

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
      byStatus: {pending: 0, inProgress: 0, completed: 0},
      byPriority: {low: 0, medium: 0, high: 0},
    },
  );

export const findTaskById = (tasks: readonly Task[], id: string) =>
  tasks.find(task => task.id === id);

