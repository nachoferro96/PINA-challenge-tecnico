# Puntos de extensión

## Flujo actual

`App` construye e inyecta `MockTaskRepository` → `TaskProvider` carga y reduce eventos → selectores derivan lista filtrada y estadísticas → pantallas consumen el contexto.

## Ubicaciones

- `src/features/tasks/domain`: tipos e interfaz del repositorio.
- `src/features/tasks/data`: datos mock y futuras implementaciones externas.
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

- ¿El servidor usa los mismos estados o requiere un mapper?
- ¿Quién es dueño de fechas, zona horaria y ordenamiento?
- ¿Una mutación debe ser optimista y cómo se revierte?
- ¿Qué datos pueden cachearse y durante cuánto tiempo?
- ¿La autenticación cambia el dominio a múltiples usuarios?
- ¿El cambio fue probado en iOS, Android o sólo compilado?
