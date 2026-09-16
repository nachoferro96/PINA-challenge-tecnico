# Real Plaza Tasks

MVP móvil desarrollado para el challenge técnico de React Native. Presenta tareas operativas con datos locales simulados: permite listar, filtrar, consultar el detalle y revisar estadísticas.

## Ramas

- `main`: entrega evaluable, de solo lectura.
- [`feature/plus`](https://github.com/nachoferro96/PINA-challenge-tecnico/tree/feature/plus): búsqueda, ordenamiento y edición local durante la sesión. Su README describe estas mejoras.

## Requisitos

- Node.js 20 o superior y npm.
- iOS: macOS, Xcode 16.3 o compatible, runtime de iOS y CocoaPods.
- Android: JDK 17, Android Studio/SDK y un emulador o dispositivo iniciado.
- Watchman recomendado en macOS.

React Native está fijado en `0.83.1`; `react-native-screens` usa `4.25.0` por compatibilidad con esa versión.

## Ejecutar

Clonar el repositorio e instalar dependencias:

```bash
npm install
```

### iOS

Instalar Pods una única vez —también después de cambios nativos—:

```bash
bundle install
npm run ios:pods
```

Iniciar Metro en una terminal:

```bash
npm start
```

En otra:

```bash
npm run ios
```

Abrir siempre `ios/RealPlazaTasks.xcworkspace`, nunca el `.xcodeproj`.

### Android

Con Metro ejecutándose en una terminal:

```bash
npm run android
```

Para generar un APK Debug sin abrir un emulador:

```bash
npm run android:build
```

## Alcance de `main`

- 12 tareas mock con todos los estados y prioridades requeridos.
- Filtros combinables por estado y prioridad, incluido el caso sin resultados.
- Detalle de tarea y estadísticas nativas por estado y prioridad.
- Estados explícitos de carga, vacío y error en Lista y Estadísticas.
- Modo claro/oscuro y adaptación al tamaño de texto del sistema.

No incluye backend, autenticación, múltiples usuarios ni CRUD. En particular, `main` no permite agregar ni editar tareas. `feature/plus` permite edición local, pero no altas ni persistencia.

## Estados simulados

En builds Debug, **Probar estados de la interfaz** permite seleccionar normal, carga persistente, vacío o error. El control inicia colapsado y no existe en Release.

| Escenario | Resultado                       |
| --------- | ------------------------------- |
| Normal    | 12 tareas tras 700 ms           |
| Carga     | Esqueletos persistentes         |
| Vacío     | Respuesta exitosa sin tareas    |
| Error     | Mensaje recuperable y reintento |

Seleccionar **Normal** restaura el flujo exitoso.

## Calidad y validación

```bash
npm run check
npm run android:build
```

`npm run check` ejecuta TypeScript, ESLint y 19 pruebas Jest. Se validó `main` en iOS 18.4 con Xcode 16.3 y en Android 35.

## Arquitectura

`TaskRepository` aísla los mocks de la UI. `Context + useReducer` modela las transiciones de carga y filtros; lista y estadísticas se derivan desde las tareas para no duplicar estado.

## Recursos del repositorio

- Skill local para ampliaciones: [`.agents/skills/extend-real-plaza-tasks/SKILL.md`](.agents/skills/extend-real-plaza-tasks/SKILL.md)
- [Guía de `feature/plus`](docs/feature-plus-guide.md)

## Uso de IA

La IA se utilizó para acelerar algunas implementaciones, testing y parte de la documentación. Las decisiones técnicas fueron propias; toda implementación asistida fue revisada cuidadosamente y, cuando fue necesario, ajustada para corregir inferencias o supuestos de los agentes.
