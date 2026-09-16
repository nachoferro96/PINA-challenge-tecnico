import {mockTasks} from '../data/mockTasks';
import {initialTaskState, taskReducer} from './taskReducer';

describe('taskReducer', () => {
  it('representa la secuencia de carga exitosa', () => {
    const stateWithData = taskReducer(initialTaskState, {
      type: 'loadSucceeded',
      tasks: mockTasks,
    });
    const loading = taskReducer(stateWithData, {type: 'loadRequested'});
    const success = taskReducer(loading, {
      type: 'loadSucceeded',
      tasks: mockTasks,
    });

    expect(loading.loadStatus).toBe('loading');
    expect(loading.tasks).toEqual([]);
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

    expect(withBoth.filters).toEqual({status: 'pending', priority: 'high'});
    expect(taskReducer(withBoth, {type: 'filtersCleared'}).filters).toEqual({
      status: 'all',
      priority: 'all',
    });
  });
});
