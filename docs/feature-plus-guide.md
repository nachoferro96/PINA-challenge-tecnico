# Guía de `feature/plus`

Esta rama sirve para experimentar con mejoras de producto sin alterar el MVP evaluable de `main`.

## Reglas

- No modificar el alcance de `main`.
- No agregar backend, autenticación ni sincronización remota.
- Mantener los datos mock y el estado en memoria mientras la app está abierta.
- Respetar `TaskRepository`, `TaskContext`, el reducer y los selectores derivados.
- Mantener iOS como plataforma principal y verificar Android en el mismo repositorio.
- Registrar cada cambio en `docs/challenge-log.md` y actualizar esta guía si cambia el flujo.

## Crear la rama

Partir siempre de un `main` limpio:

```bash
git switch main
git pull --ff-only
git switch -c feature/plus
```

## Orden recomendado

1. Búsqueda por título, área o responsable.
2. Ordenamiento por prioridad, fecha o estado.
3. Crear y editar tareas durante la sesión, con validación local.
4. Acciones rápidas para completar o deshacer cambios.

No conviene implementar todo junto. Cada feature debe tener un objetivo visible, una decisión documentada y una validación reproducible.

## Proceso por feature

1. Escribir el comportamiento esperado y el límite de la feature.
2. Revisar `PRODUCT.md`, `DESIGN.md`, `docs/architecture-decisions.md` y el skill local.
3. Extender el dominio sólo si el comportamiento lo necesita.
4. Añadir acciones explícitas al reducer y selectores puros para datos derivados.
5. Mantener la UI independiente de la fuente mock.
6. Añadir o actualizar pruebas.
7. Ejecutar `npm run check`.
8. Validar iOS y repetir el smoke test Android.
9. Registrar resultado, trade-offs y pendientes en la bitácora.

## Estado en memoria

Las ediciones de la rama plus deben sobrevivir mientras la app permanezca abierta y mientras se navega entre pantallas. Al terminar o recargar la app, los datos vuelven al mock inicial. No se agrega persistencia local salvo que una decisión posterior lo pida explícitamente.

## Comandos de validación

```bash
npm run check
npm run ios
npm run android
npm run android:build
```
