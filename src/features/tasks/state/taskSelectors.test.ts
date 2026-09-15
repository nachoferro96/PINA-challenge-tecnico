import {mockTasks} from '../data/mockTasks';
import {calculateTaskStatistics, filterTasks, findTaskById} from './taskSelectors';

describe('task selectors', () => {
  it('combina los filtros de estado y prioridad', () => {
    const result = filterTasks(mockTasks, {
      status: 'completed',
      priority: 'high',
    });

    expect(result).toHaveLength(0);
  });

  it('conserva todas las tareas con filtros abiertos', () => {
    const result = filterTasks(mockTasks, {status: 'all', priority: 'all'});

    expect(result).toHaveLength(mockTasks.length);
  });

  it('deriva estadísticas sin crear un segundo origen de verdad', () => {
    const statistics = calculateTaskStatistics(mockTasks);

    expect(statistics).toEqual({
      total: 12,
      byStatus: {pending: 4, inProgress: 4, completed: 4},
      byPriority: {low: 4, medium: 5, high: 3},
    });
  });

  it('encuentra una tarea por id', () => {
    expect(findTaskById(mockTasks, 'task-008')?.priority).toBe('high');
    expect(findTaskById(mockTasks, 'missing')).toBeUndefined();
  });
});
