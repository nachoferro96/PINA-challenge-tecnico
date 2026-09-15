import type {Task} from './task';

export interface TaskRepository {
  getTasks(): Promise<readonly Task[]>;
}

