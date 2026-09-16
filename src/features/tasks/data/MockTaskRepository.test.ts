import {MockTaskRepository} from './MockTaskRepository';

describe('MockTaskRepository', () => {
  it('entrega datos demostrativos con latencia configurable', async () => {
    const repository = new MockTaskRepository({latencyMs: 0});

    await expect(repository.getTasks()).resolves.toHaveLength(12);
  });

  it('permite demostrar el estado vacío', async () => {
    const repository = new MockTaskRepository({
      scenario: 'empty',
      latencyMs: 0,
    });

    await expect(repository.getTasks()).resolves.toEqual([]);
  });

  it('permite mantener visible el estado de carga', async () => {
    const repository = new MockTaskRepository({scenario: 'loading'});
    let settled = false;

    repository.getTasks().finally(() => {
      settled = true;
    });
    await Promise.resolve();

    expect(settled).toBe(false);
  });

  it('permite demostrar y recuperar el estado de error', async () => {
    const repository = new MockTaskRepository({
      scenario: 'error',
      latencyMs: 0,
    });

    await expect(repository.getTasks()).rejects.toThrow(
      'La fuente de datos simulada no está disponible.',
    );
  });
});
