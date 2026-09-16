# Guía de `feature/plus`

Esta rama sirve para experimentar con mejoras de producto sin alterar el MVP evaluable de `main`.

## Reglas

- No modificar el alcance de `main`.
- No agregar backend, autenticación ni sincronización remota.
- Mantener los datos mock y el estado en memoria mientras la app está abierta.
- Respetar `TaskRepository`, `TaskContext`, el reducer y los selectores derivados.
- Mantener iOS como plataforma principal y verificar Android en el mismo repositorio.
- Actualizar esta guía si cambia el flujo o el alcance de la rama.

## Crear la rama

Partir siempre de un `main` limpio:

```bash
git switch main
git pull --ff-only
git switch -c feature/plus
```

## Orden recomendado

1. Búsqueda por título, área o responsable. Implementada.
2. Ordenamiento por prioridad o estado, ascendente o descendente. Implementado.
3. Editar tareas durante la sesión, con validación local. Implementado.
4. Acciones rápidas para completar o deshacer cambios.

No conviene implementar todo junto. Cada feature debe tener un objetivo visible, un alcance acotado y una validación reproducible.

## Búsqueda implementada

- El término vive en `TaskFilters` y se actualiza con una acción explícita del reducer.
- El selector combina búsqueda, estado y prioridad sin duplicar la lista en el estado.
- La comparación normaliza mayúsculas y tildes para tolerar entradas naturales en español.
- El campo usa el borrado nativo de iOS y una acción textual en Android.
- Una búsqueda sin coincidencias reutiliza el estado recuperable y limpia todos los criterios con una sola acción.

## Ordenamiento implementado

- Permite ordenar por estado o prioridad en dirección ascendente o descendente.
- Estado ascendente sigue el flujo pendiente → en progreso → completada.
- Prioridad ascendente sigue baja → media → alta; descendente invierte ese orden.
- Los empates conservan el orden original para evitar saltos arbitrarios.

## Edición local implementada

- Se accede desde el detalle y permite cambiar título, descripción, área, responsable, estado y prioridad.
- Todos los campos de texto son obligatorios y se normalizan con `trim` al guardar.
- Fechas, identificador y creación permanecen sin cambios porque no se definieron reglas de calendario para esta ampliación.
- Los cambios actualizan lista, detalle y estadísticas, y duran hasta recargar o cerrar la app.

## Estados de Estadísticas

- Loading anticipa el total y las seis barras mediante esqueletos propios de la pantalla.
- Error explica que no se pudieron calcular las estadísticas y ofrece reintentar.
- Empty distingue una respuesta exitosa sin tareas de una falla de carga.
- El escenario de carga persistente existe sólo en desarrollo para facilitar revisión visual y pruebas manuales.

## Proceso por feature

1. Escribir el comportamiento esperado y el límite de la feature.
2. Revisar el README, esta guía y el skill local.
3. Extender el dominio sólo si el comportamiento lo necesita.
4. Añadir acciones explícitas al reducer y selectores puros para datos derivados.
5. Mantener la UI independiente de la fuente mock.
6. Añadir o actualizar pruebas.
7. Ejecutar `npm run check`.
8. Validar iOS y repetir el smoke test Android.
9. Actualizar esta guía si cambia el alcance o la forma de ejecutar la rama.

## Estado en memoria

Las ediciones de la rama plus deben sobrevivir mientras la app permanezca abierta y mientras se navega entre pantallas. Al terminar o recargar la app, los datos vuelven al mock inicial. No se agrega persistencia local salvo que una decisión posterior lo pida explícitamente.

## Comandos de validación

```bash
npm run check
npm run ios
npm run android
npm run android:build
```
