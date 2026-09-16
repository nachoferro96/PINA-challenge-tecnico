import {
  defaultTaskFilters,
  type Task,
  type TaskFilters,
  type TaskPriority,
  type TaskStatus,
} from '../domain/task';

export type TaskLoadStatus = 'idle' | 'loading' | 'success' | 'error';

export type TaskState = Readonly<{
  tasks: readonly Task[];
  loadStatus: TaskLoadStatus;
  errorMessage: string | null;
  filters: TaskFilters;
}>;

export const initialTaskState: TaskState = {
  tasks: [],
  loadStatus: 'idle',
  errorMessage: null,
  filters: defaultTaskFilters,
};

export type TaskAction =
  | {type: 'loadRequested'}
  | {type: 'loadSucceeded'; tasks: readonly Task[]}
  | {type: 'loadFailed'; message: string}
  | {type: 'statusFilterChanged'; status: TaskStatus | 'all'}
  | {type: 'priorityFilterChanged'; priority: TaskPriority | 'all'}
  | {type: 'filtersCleared'};

export const taskReducer = (
  state: TaskState,
  action: TaskAction,
): TaskState => {
  switch (action.type) {
    case 'loadRequested':
      return {...state, tasks: [], loadStatus: 'loading', errorMessage: null};
    case 'loadSucceeded':
      return {
        ...state,
        tasks: action.tasks,
        loadStatus: 'success',
        errorMessage: null,
      };
    case 'loadFailed':
      return {
        ...state,
        tasks: [],
        loadStatus: 'error',
        errorMessage: action.message,
      };
    case 'statusFilterChanged':
      return {...state, filters: {...state.filters, status: action.status}};
    case 'priorityFilterChanged':
      return {...state, filters: {...state.filters, priority: action.priority}};
    case 'filtersCleared':
      return {...state, filters: defaultTaskFilters};
  }
};
