import type {Task} from '../domain/task';
import type {TaskRepository} from '../domain/TaskRepository';
import {mockTasks} from './mockTasks';

export type MockScenario = 'normal' | 'empty' | 'error';

type MockTaskRepositoryOptions = Readonly<{
  scenario?: MockScenario;
  latencyMs?: number;
}>;

const wait = (milliseconds: number) =>
  new Promise<void>(resolve => setTimeout(resolve, milliseconds));

export class MockTaskRepository implements TaskRepository {
  private readonly scenario: MockScenario;
  private readonly latencyMs: number;

  constructor({scenario = 'normal', latencyMs = 700}: MockTaskRepositoryOptions = {}) {
    this.scenario = scenario;
    this.latencyMs = latencyMs;
  }

  async getTasks(): Promise<readonly Task[]> {
    await wait(this.latencyMs);

    if (this.scenario === 'error') {
      throw new Error('La fuente de datos simulada no está disponible.');
    }

    return this.scenario === 'empty' ? [] : mockTasks;
  }
}
