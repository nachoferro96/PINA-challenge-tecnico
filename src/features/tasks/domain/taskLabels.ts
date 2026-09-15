import type {TaskPriority, TaskStatus} from './task';

export const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  inProgress: 'En progreso',
  completed: 'Completada',
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

