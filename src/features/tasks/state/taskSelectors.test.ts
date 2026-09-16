import { mockTasks } from '../data/mockTasks';
import {
  calculateTaskStatistics,
  filterTasks,
  findTaskById,
  sortTasks,
} from './taskSelectors';

describe('task selectors', () => {
  it('combina los filtros de estado y prioridad', () => {
    const result = filterTasks(mockTasks, {
      query: '',
      status: 'done',
      priority: 'high',
    });

    expect(result).toHaveLength(0);
  });

  it('conserva todas las tareas con filtros abiertos', () => {
    const result = filterTasks(mockTasks, {
      query: '',
      status: 'all',
      priority: 'all',
    });

    expect(result).toHaveLength(mockTasks.length);
  });

  it('busca por título, área o responsable sin distinguir tildes ni mayúsculas', () => {
    const openFilters = { status: 'all', priority: 'all' } as const;

    expect(
      filterTasks(mockTasks, { ...openFilters, query: 'SEÑALIZACION' }),
    ).toHaveLength(1);
    expect(
      filterTasks(mockTasks, { ...openFilters, query: 'sotano' }),
    ).toHaveLength(1);
    expect(
      filterTasks(mockTasks, { ...openFilters, query: 'sofia nunez' }),
    ).toHaveLength(1);
  });

  it('combina la búsqueda con estado y prioridad', () => {
    const result = filterTasks(mockTasks, {
      query: 'revisar',
      status: 'pending',
      priority: 'high',
    });

    expect(result.map(task => task.id)).toEqual(['task-001', 'task-004']);
  });

  it('ordena por prioridad en ambas direcciones', () => {
    const ascending = sortTasks(mockTasks, {
      field: 'priority',
      direction: 'ascending',
    });
    const descending = sortTasks(mockTasks, {
      field: 'priority',
      direction: 'descending',
    });

    expect(ascending.slice(0, 4).map(task => task.priority)).toEqual([
      'low',
      'low',
      'low',
      'low',
    ]);
    expect(descending.slice(0, 3).map(task => task.priority)).toEqual([
      'high',
      'high',
      'high',
    ]);
  });

  it('ordena por el flujo de estado y conserva empates estables', () => {
    const result = sortTasks(mockTasks, {
      field: 'status',
      direction: 'ascending',
    });

    expect(result.slice(0, 4).map(task => task.id)).toEqual([
      'task-001',
      'task-003',
      'task-004',
      'task-006',
    ]);
  });

  it('deriva estadísticas sin crear un segundo origen de verdad', () => {
    const statistics = calculateTaskStatistics(mockTasks);

    expect(statistics).toEqual({
      total: 12,
      byStatus: { pending: 4, in_progress: 4, done: 4 },
      byPriority: { low: 4, medium: 5, high: 3 },
    });
  });

  it('encuentra una tarea por id', () => {
    expect(findTaskById(mockTasks, 'task-008')?.priority).toBe('high');
    expect(findTaskById(mockTasks, 'missing')).toBeUndefined();
  });
});
