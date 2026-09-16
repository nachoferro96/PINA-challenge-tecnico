import React, {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import type {
  Task,
  TaskPriority,
  TaskSortDirection,
  TaskSortField,
  TaskStatus,
} from '../domain/task';
import type {TaskRepository} from '../domain/TaskRepository';
import {calculateTaskStatistics, filterTasks, sortTasks} from './taskSelectors';
import {initialTaskState, taskReducer} from './taskReducer';

type TaskContextValue = Readonly<{
  state: ReturnType<typeof buildExposedState>;
  reload: () => Promise<void>;
  updateTask: (task: Task) => void;
  setQueryFilter: (query: string) => void;
  setStatusFilter: (status: TaskStatus | 'all') => void;
  setPriorityFilter: (priority: TaskPriority | 'all') => void;
  setSortField: (field: TaskSortField) => void;
  setSortDirection: (direction: TaskSortDirection) => void;
  clearFilters: () => void;
}>;

const TaskContext = createContext<TaskContextValue | null>(null);

const buildExposedState = (state: typeof initialTaskState) => ({
  ...state,
  filteredTasks: sortTasks(filterTasks(state.tasks, state.filters), state.sort),
  statistics: calculateTaskStatistics(state.tasks),
});

type TaskProviderProps = PropsWithChildren<{
  repository: TaskRepository;
}>;

export function TaskProvider({repository, children}: TaskProviderProps) {
  const [taskState, dispatch] = useReducer(taskReducer, initialTaskState);

  const reload = useCallback(async () => {
    dispatch({type: 'loadRequested'});

    try {
      const tasks = await repository.getTasks();
      dispatch({type: 'loadSucceeded', tasks});
    } catch (error) {
      dispatch({
        type: 'loadFailed',
        message:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado al cargar las tareas.',
      });
    }
  }, [repository]);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<TaskContextValue>(
    () => ({
      state: buildExposedState(taskState),
      reload,
      updateTask: task => dispatch({type: 'taskUpdated', task}),
      setQueryFilter: query => dispatch({type: 'queryFilterChanged', query}),
      setStatusFilter: status =>
        dispatch({type: 'statusFilterChanged', status}),
      setPriorityFilter: priority =>
        dispatch({type: 'priorityFilterChanged', priority}),
      setSortField: field => dispatch({type: 'sortFieldChanged', field}),
      setSortDirection: direction =>
        dispatch({type: 'sortDirectionChanged', direction}),
      clearFilters: () => dispatch({type: 'filtersCleared'}),
    }),
    [reload, taskState],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks debe utilizarse dentro de TaskProvider.');
  }

  return context;
}
