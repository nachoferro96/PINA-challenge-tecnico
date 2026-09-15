---
name: extend-real-plaza-tasks
description: Ampliar, mantener o integrar un backend en la aplicación React Native RealPlazaTasks conservando su arquitectura, alcance, estados de interfaz y trazabilidad. Usar al agregar API REST, mutaciones, autenticación, caché, nuevas pantallas, filtros, tests o cambios de plataforma dentro de este repositorio.
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
- Acceder a datos mediante `TaskRepository`; no llamar HTTP desde pantallas, componentes ni reducers.
- Derivar filtros y estadísticas desde las tareas cargadas; no duplicar esos resultados en estado mutable.
- Mantener componentes sin conocimiento del origen mock o remoto.
- Respetar navegación, safe areas, tamaño de texto, modo oscuro y objetivos táctiles de cada plataforma.
- No incorporar una dependencia si una solución nativa pequeña cubre el caso; justificar cada dependencia nueva.

## Integrar un backend

1. Extender `TaskRepository` sólo con operaciones requeridas por el caso de uso.
2. Implementar `HttpTaskRepository` detrás de esa interfaz.
3. Mapear DTOs externos a tipos de dominio en la capa `data`; rechazar datos inválidos allí.
4. Inyectar la implementación en `App.tsx` o en un proveedor de composición, nunca dentro de la UI.
5. Conservar `MockTaskRepository` para pruebas y escenarios demostrativos.
6. Definir timeout, cancelación, errores recuperables y política de reintento antes de incorporar caché.

## Agregar mutaciones

No asumir que CRUD significa cuatro pantallas. Confirmar primero operaciones, reglas de validación, persistencia, concurrencia y recuperación de errores. Modelar acciones del reducer como eventos del dominio y cubrir éxito, error y actualización optimista si corresponde.

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

