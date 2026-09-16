import {mockTasks} from './mockTasks';
import {taskPriorities, taskStatuses} from '../domain/task';

describe('mockTasks', () => {
  it('respeta los literales del contrato mínimo del brief', () => {
    expect(taskStatuses).toEqual(['pending', 'in_progress', 'done']);
    expect(taskPriorities).toEqual(['low', 'medium', 'high']);
  });

  it('incluye al menos diez tareas válidas y cubre estados y prioridades', () => {
    expect(mockTasks.length).toBeGreaterThanOrEqual(10);

    mockTasks.forEach(task => {
      expect(task).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          description: expect.any(String),
          createdAt: expect.any(String),
        }),
      );
    });

    expect(new Set(mockTasks.map(task => task.status))).toEqual(
      new Set(taskStatuses),
    );
    expect(new Set(mockTasks.map(task => task.priority))).toEqual(
      new Set(taskPriorities),
    );
  });
});
