---
name: extend-real-plaza-tasks
description: Ampliar y mantener la aplicación React Native RealPlazaTasks conservando su arquitectura, alcance, estados de interfaz y trazabilidad. Usar al agregar funcionalidades locales, mutaciones en memoria, nuevas pantallas, filtros, tests o cambios de plataforma dentro de este repositorio.
---

# Extender RealPlazaTasks

## Preparar el cambio

1. Leer `PRODUCT.md`, `DESIGN.md` cuando exista, `README.md` y `docs/architecture-decisions.md`.
2. Leer [references/extension-points.md](references/extension-points.md).
3. Inspeccionar el código vigente; tratar la documentación como intención y el código/pruebas como evidencia ejecutable.
4. Definir qué requisito habilita el cambio y qué queda fuera de alcance.
5. Añadir la decisión y su validación a `docs/challenge-log.md`.

## Conservar las fronteras

- Mantener tipos y reglas de tareas en `features/tasks/domain`.
- Acceder a datos mediante `TaskRepository`; mantener la fuente mock y no incorporar backend.
- Derivar filtros y estadísticas desde las tareas cargadas; no duplicar esos resultados en estado mutable.
- Mantener componentes sin conocimiento del origen mock o remoto.
- Respetar navegación, safe areas, tamaño de texto, modo oscuro y objetivos táctiles de cada plataforma.
- No incorporar una dependencia si una solución nativa pequeña cubre el caso; justificar cada dependencia nueva.

## Mantener la fuente local

1. Extender `TaskRepository` sólo con operaciones locales requeridas por el caso de uso.
2. Conservar `MockTaskRepository` para pruebas y escenarios demostrativos.
3. Mantener las mutaciones en `TaskContext`/reducer y derivar filtros o estadísticas desde el estado.
4. Inyectar la implementación en `App.tsx` o en un proveedor de composición, nunca dentro de la UI.
5. No añadir autenticación, sincronización remota ni persistencia sin una decisión explícita fuera del alcance actual.

## Agregar mutaciones

No asumir que CRUD significa cuatro pantallas. Confirmar primero operaciones, reglas de validación y recuperación de errores en memoria. Modelar acciones del reducer como eventos del dominio y cubrir éxito, error y actualización optimista si corresponde.

## Validar

Ejecutar como mínimo:

```bash
npx tsc --noEmit
npm run lint
npm test -- --runInBand
cd android && ./gradlew assembleDebug
```

Para iOS, ejecutar desde la raíz cuando el runtime/plataforma esté instalado:

```bash
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 bundle exec pod install --project-directory=ios
xcodebuild -workspace ios/RealPlazaTasks.xcworkspace -scheme RealPlazaTasks -configuration Debug -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO build
```

Registrar por separado “compila” y “fue ejecutada en emulador/dispositivo”; no presentarlos como la misma evidencia.
