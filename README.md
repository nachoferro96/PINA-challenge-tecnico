# Real Plaza Tasks — feature/plus

Rama opcional de mejora sobre el MVP entregable de [`main`](https://github.com/nachoferro96/PINA-challenge-tecnico/tree/main). Conserva los datos mock y el alcance sin backend, pero agrega funcionalidades locales para mostrar cómo podría evolucionar la app.

> Proyecto demostrativo. No utiliza datos, servicios, logotipos ni activos oficiales de Real Plaza.

## Incluido en esta rama

- Búsqueda por título, área o responsable, tolerante a mayúsculas y tildes.
- Ordenamiento por estado o prioridad, ascendente o descendente.
- Edición local de título, descripción, área, responsable, estado y prioridad.
- Actualización consistente de lista, detalle y estadísticas durante la sesión.

No incluye altas, borrado, backend ni persistencia: los cambios se reinician al relanzar la app.

## Requisitos

- Node.js 20 o superior y npm.
- iOS: macOS, Xcode 16.3 o compatible, runtime de iOS y CocoaPods.
- Android: JDK 17, Android Studio/SDK y un emulador o dispositivo iniciado.
- Watchman recomendado en macOS.

React Native está fijado en `0.83.1`; `react-native-screens` usa `4.25.0` por compatibilidad con esa versión.

## Ejecutar

Instalar dependencias:

```bash
npm install
```

### iOS

```bash
bundle install
npm run ios:pods
npm start
```

En otra terminal:

```bash
npm run ios
```

Abrir siempre `ios/RealPlazaTasks.xcworkspace`, nunca el `.xcodeproj`.

### Android

Con Metro ejecutándose:

```bash
npm run android
```

Para generar un APK Debug:

```bash
npm run android:build
```

## Estados simulados

En builds Debug, **Probar estados de la interfaz** permite seleccionar normal, carga persistente, vacío o error. El control inicia colapsado y no existe en Release.

| Escenario | Resultado                       |
| --------- | ------------------------------- |
| Normal    | 12 tareas tras 700 ms           |
| Carga     | Esqueletos persistentes         |
| Vacío     | Respuesta exitosa sin tareas    |
| Error     | Mensaje recuperable y reintento |

Seleccionar **Normal** restaura el flujo exitoso.

## Calidad y recursos

```bash
npm run check
npm run android:build
```

`npm run check` ejecuta TypeScript, ESLint y 25 pruebas Jest. La guía detallada de ampliaciones está en [`docs/feature-plus-guide.md`](docs/feature-plus-guide.md) y el skill local en [`.agents/skills/extend-real-plaza-tasks/SKILL.md`](.agents/skills/extend-real-plaza-tasks/SKILL.md).

## Uso de IA

La IA se utilizó para acelerar algunas implementaciones, testing y parte de la documentación. Las decisiones técnicas fueron propias; toda implementación asistida fue revisada cuidadosamente y, cuando fue necesario, ajustada para corregir inferencias o supuestos de los agentes.
