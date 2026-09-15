import React, {useMemo, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DarkTheme, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AppNavigator} from './src/app/navigation/AppNavigator';
import {
  MockTaskRepository,
  type MockScenario,
} from './src/features/tasks/data/MockTaskRepository';
import {TaskProvider} from './src/features/tasks/state/TaskContext';
import {useAppTheme} from './src/shared/theme/theme';

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [scenario, setScenario] = useState<MockScenario>('normal');
  const {colors, isDark} = useAppTheme();
  const repository = useMemo(
    () => new MockTaskRepository({scenario, latencyMs: 700}),
    [scenario],
  );
  const navigationTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: colors.accent,
        background: colors.background,
        card: colors.background,
        text: colors.text,
        border: colors.divider,
      },
    }),
    [colors, isDark],
  );

  return (
    <TaskProvider repository={repository}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator scenario={scenario} onScenarioChange={setScenario} />
      </NavigationContainer>
    </TaskProvider>
  );
}

export default App;
