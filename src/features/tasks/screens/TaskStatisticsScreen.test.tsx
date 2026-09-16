import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';

import {TaskStatisticsScreen} from './TaskStatisticsScreen';

const mockUseTasks = jest.fn();

jest.mock('../state/TaskContext', () => ({
  useTasks: () => mockUseTasks(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, right: 0, bottom: 0, left: 0}),
}));

const emptyStatistics = {
  total: 0,
  byStatus: {pending: 0, inProgress: 0, completed: 0},
  byPriority: {low: 0, medium: 0, high: 0},
};

describe('TaskStatisticsScreen', () => {
  it('anticipa la estructura mientras carga', async () => {
    mockUseTasks.mockReturnValue({
      state: {
        tasks: [],
        loadStatus: 'loading',
        errorMessage: null,
        statistics: emptyStatistics,
      },
      reload: jest.fn(),
    });

    const screen = await render(<TaskStatisticsScreen />);

    expect(screen.getByLabelText('Cargando estadísticas')).toBeTruthy();
  });

  it('explica el error y permite reintentar', async () => {
    const reload = jest.fn();
    mockUseTasks.mockReturnValue({
      state: {
        tasks: [],
        loadStatus: 'error',
        errorMessage: 'Error simulado',
        statistics: emptyStatistics,
      },
      reload,
    });

    const screen = await render(<TaskStatisticsScreen />);

    expect(screen.getByText('No pudimos calcular las estadísticas')).toBeTruthy();
    expect(screen.getByText('Error simulado')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', {name: 'Reintentar'}));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('distingue una respuesta vacía de un error', async () => {
    mockUseTasks.mockReturnValue({
      state: {
        tasks: [],
        loadStatus: 'success',
        errorMessage: null,
        statistics: emptyStatistics,
      },
      reload: jest.fn(),
    });

    const screen = await render(<TaskStatisticsScreen />);

    expect(screen.getByText('No hay tareas para analizar')).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Volver a cargar'})).toBeTruthy();
  });
});
