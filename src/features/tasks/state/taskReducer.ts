import {
  defaultTaskFilters,
  defaultTaskSort,
  type Task,
  type TaskFilters,
  type TaskPriority,
  type TaskSort,
  type TaskSortDirection,
  type TaskSortField,
  type TaskStatus,
} from '../domain/task';

export type TaskLoadStatus = 'idle' | 'loading' | 'success' | 'error';

export type TaskState = Readonly<{
  tasks: readonly Task[];
  loadStatus: TaskLoadStatus;
  errorMessage: string | null;
  filters: TaskFilters;
  sort: TaskSort;
}>;

export const initialTaskState: TaskState = {
  tasks: [],
  loadStatus: 'idle',
  errorMessage: null,
  filters: defaultTaskFilters,
  sort: defaultTaskSort,
};

export type TaskAction =
  | {type: 'loadRequested'}
  | {type: 'loadSucceeded'; tasks: readonly Task[]}
  | {type: 'loadFailed'; message: string}
  | {type: 'taskUpdated'; task: Task}
  | {type: 'queryFilterChanged'; query: string}
  | {type: 'statusFilterChanged'; status: TaskStatus | 'all'}
  | {type: 'priorityFilterChanged'; priority: TaskPriority | 'all'}
  | {type: 'sortFieldChanged'; field: TaskSortField}
  | {type: 'sortDirectionChanged'; direction: TaskSortDirection}
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
    case 'taskUpdated':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.task.id ? action.task : task,
        ),
      };
    case 'queryFilterChanged':
      return {...state, filters: {...state.filters, query: action.query}};
    case 'statusFilterChanged':
      return {...state, filters: {...state.filters, status: action.status}};
    case 'priorityFilterChanged':
      return {...state, filters: {...state.filters, priority: action.priority}};
    case 'sortFieldChanged':
      return {...state, sort: {...state.sort, field: action.field}};
    case 'sortDirectionChanged':
      return {...state, sort: {...state.sort, direction: action.direction}};
    case 'filtersCleared':
      return {...state, filters: defaultTaskFilters};
  }
};
