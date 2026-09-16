import {mockTasks} from '../data/mockTasks';
import {initialTaskState, taskReducer} from './taskReducer';

describe('taskReducer', () => {
  it('representa la secuencia de carga exitosa', () => {
    const loading = taskReducer(initialTaskState, {type: 'loadRequested'});
    const success = taskReducer(loading, {
      type: 'loadSucceeded',
      tasks: mockTasks,
    });

    expect(loading.loadStatus).toBe('loading');
    expect(success.loadStatus).toBe('success');
    expect(success.tasks).toHaveLength(12);
  });

  it('limpia los datos y conserva el mensaje cuando falla', () => {
    const stateWithData = taskReducer(initialTaskState, {
      type: 'loadSucceeded',
      tasks: mockTasks,
    });
    const failed = taskReducer(stateWithData, {
      type: 'loadFailed',
      message: 'Sin conexión simulada',
    });

    expect(failed.tasks).toEqual([]);
    expect(failed.errorMessage).toBe('Sin conexión simulada');
  });

  it('actualiza y limpia filtros de forma independiente', () => {
    const withStatus = taskReducer(initialTaskState, {
      type: 'statusFilterChanged',
      status: 'pending',
    });
    const withBoth = taskReducer(withStatus, {
      type: 'priorityFilterChanged',
      priority: 'high',
    });
    const withQuery = taskReducer(withBoth, {
      type: 'queryFilterChanged',
      query: 'seguridad',
    });

    expect(withQuery.filters).toEqual({
      query: 'seguridad',
      status: 'pending',
      priority: 'high',
    });
    expect(taskReducer(withQuery, {type: 'filtersCleared'}).filters).toEqual({
      query: '',
      status: 'all',
      priority: 'all',
    });
  });

  it('actualiza una tarea sin mutar las demás', () => {
    const loaded = taskReducer(initialTaskState, {
      type: 'loadSucceeded',
      tasks: mockTasks,
    });
    const updatedTask = {...mockTasks[0], title: 'Título actualizado'};
    const updated = taskReducer(loaded, {
      type: 'taskUpdated',
      task: updatedTask,
    });

    expect(updated.tasks[0].title).toBe('Título actualizado');
    expect(updated.tasks[1]).toBe(mockTasks[1]);
    expect(loaded.tasks[0].title).toBe(mockTasks[0].title);
  });

  it('actualiza el criterio y la dirección de orden', () => {
    const byPriority = taskReducer(initialTaskState, {
      type: 'sortFieldChanged',
      field: 'priority',
    });
    const descending = taskReducer(byPriority, {
      type: 'sortDirectionChanged',
      direction: 'descending',
    });

    expect(descending.sort).toEqual({
      field: 'priority',
      direction: 'descending',
    });
  });
});
