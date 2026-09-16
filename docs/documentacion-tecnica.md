# Documentación técnica

Este documento explica las decisiones que organizan el MVP de `main`. El objetivo fue resolver el challenge con una base clara, fácil de probar y simple de extender, sin agregar alcance que el brief no pide.

## React Native CLI y TypeScript

Se eligió React Native CLI porque el reto lo solicita y porque permite trabajar con los proyectos nativos de iOS y Android. TypeScript ayuda a mantener como contratos el modelo de tarea, los filtros, las rutas y las acciones del estado.

El costo es tener que preparar Xcode, CocoaPods, Gradle y el SDK de Android. Para este challenge vale la pena: la app se puede compilar y ejecutar en ambas plataformas desde el mismo repositorio.

## Organización por feature

La funcionalidad vive dentro de `src/features/tasks`, separada en `domain`, `data`, `state`, `components` y `screens`. Así todo lo relacionado con tareas queda junto, pero cada parte conserva una responsabilidad concreta.

No se usó una arquitectura más ceremoniosa para un MVP. Si se agregaran otros dominios, cada uno podría seguir el mismo formato sin convertir `src` en una carpeta plana difícil de recorrer.

## Repositorio y datos mock

Las pantallas no conocen el origen de los datos. Dependen del contrato `TaskRepository`; hoy lo implementa `MockTaskRepository`, que entrega las tareas con latencia y permite responder normal, vacío o error.

Esto hace que la interfaz trate los datos como una fuente asíncrona real, aun sin backend. Una integración futura con REST sólo tendría que implementar el mismo contrato, sin reescribir las pantallas ni los selectores.

## Estado global acotado

Se usó Context con `useReducer`. El estado necesario es pequeño: carga, tareas y filtros. El reducer deja las transiciones explícitas y los selectores calculan lista filtrada y estadísticas desde una única fuente de verdad.

Redux o Zustand también eran opciones válidas, pero sumar un store externo no aportaba valor en esta escala. Si hubiera sincronización, varias features que compartieran estado o persistencia, esa decisión se revisaría.

## Navegación y presentación

`native-stack` resuelve Lista, Detalle y Estadísticas. Conserva el comportamiento esperado de back en iOS y Android sin implementar barras de navegación propias.

Las estadísticas usan componentes nativos básicos en vez de una librería de gráficos. El requisito es comparar cantidades por estado y prioridad; para este volumen los contadores, barras y etiquetas son más simples de leer, accesibles y no agregan una dependencia.

## Alcance deliberado

`main` es una aplicación de consulta: lista, filtra, abre detalle y muestra estadísticas. No incorpora backend, autenticación, usuarios ni CRUD porque no forman parte del alcance pedido. La rama `feature/plus` conserva cualquier mejora adicional separada del MVP evaluable.

## Calidad

Desde el inicio se mantuvieron tipos, lint, pruebas unitarias y estados explícitos de carga, vacío y error. Esto no reemplaza una revisión de producto o pruebas end-to-end, pero reduce errores de contrato y evita presentar ceros como datos válidos cuando una carga falla o todavía no terminó.
