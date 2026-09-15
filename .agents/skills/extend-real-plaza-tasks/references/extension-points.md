# Puntos de extensión

## Flujo actual

`App` construye e inyecta `MockTaskRepository` → `TaskProvider` carga y reduce eventos → selectores derivan lista filtrada y estadísticas → pantallas consumen el contexto.

## Ubicaciones

- `src/features/tasks/domain`: tipos e interfaz del repositorio.
- `src/features/tasks/data`: datos mock y fuentes locales de prueba.
- `src/features/tasks/state`: reducer, contexto y selectores.
- `src/features/tasks/components`: piezas visuales reutilizables.
- `src/features/tasks/screens`: composición y navegación de cada vista.
- `src/shared`: tema y utilidades sin reglas exclusivas de tareas.

## Contratos vigentes

- Estados: `pending`, `inProgress`, `completed`.
- Prioridades: `low`, `medium`, `high`.
- Los datos mock son demostrativos y no representan información real.
- El MVP es de solo lectura.
- La fuente de datos simula latencia y escenarios normal, vacío y error.

## Preguntas antes de crecer

- ¿La feature necesita extender el dominio o sólo agregar un selector?
- ¿Quién es dueño de fechas, zona horaria y ordenamiento local?
- ¿Una mutación debe ser optimista y cómo se revierte en memoria?
- ¿Qué ocurre al cerrar o recargar la app?
- ¿La feature conserva el alcance de una sesión y un único usuario?
- ¿El cambio fue probado en iOS, Android o sólo compilado?
