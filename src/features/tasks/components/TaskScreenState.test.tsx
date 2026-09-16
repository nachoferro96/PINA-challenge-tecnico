import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';

import {TaskScreenState} from './TaskScreenState';

describe('TaskScreenState', () => {
  it('explica cómo recuperarse de un filtro sin coincidencias', async () => {
    const onAction = jest.fn();
    const screen = await render(
      <TaskScreenState kind="noResults" onAction={onAction} />,
    );

    expect(screen.getByText('No hay coincidencias')).toBeTruthy();
    fireEvent.press(
      screen.getByRole('button', {name: 'Limpiar búsqueda y filtros'}),
    );
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('muestra el mensaje recuperable del repositorio', async () => {
    const screen = await render(
      <TaskScreenState
        kind="error"
        message="Servicio temporalmente no disponible"
        onAction={jest.fn()}
      />,
    );

    expect(screen.getByText('Servicio temporalmente no disponible')).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Reintentar'})).toBeTruthy();
  });
});
