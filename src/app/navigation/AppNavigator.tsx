import React from 'react';
import {Platform, Pressable, StyleSheet, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation, type NavigationProp} from '@react-navigation/native';

import type {MockScenario} from '../../features/tasks/data/MockTaskRepository';
import {TaskDetailScreen} from '../../features/tasks/screens/TaskDetailScreen';
import {TaskListScreen} from '../../features/tasks/screens/TaskListScreen';
import {TaskStatisticsScreen} from '../../features/tasks/screens/TaskStatisticsScreen';
import {useAppTheme} from '../../shared/theme/theme';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function TasksHeaderButton() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {colors} = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ver estadísticas"
      hitSlop={12}
      onPress={() => navigation.navigate('Statistics')}>
      <Text style={[styles.done, {color: colors.accent}]}>Estadísticas</Text>
    </Pressable>
  );
}

type AppNavigatorProps = {
  scenario: MockScenario;
  onScenarioChange: (scenario: MockScenario) => void;
};

export function AppNavigator({scenario, onScenarioChange}: AppNavigatorProps) {
  const {colors} = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.background},
        headerTintColor: colors.accent,
        headerTitleStyle: {color: colors.text},
        headerShadowVisible: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen
        name="Tasks"
        options={{
          headerShown: Platform.OS === 'ios',
          title: 'Tareas',
          headerLargeTitle: Platform.OS === 'ios',
          headerLargeTitleShadowVisible: false,
          headerRight: Platform.OS === 'ios' ? TasksHeaderButton : undefined,
        }}>
        {props => (
          <TaskListScreen
            {...props}
            scenario={scenario}
            onScenarioChange={onScenarioChange}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{title: 'Detalle'}}
      />
      <Stack.Screen
        name="Statistics"
        component={TaskStatisticsScreen}
        options={{title: 'Estadísticas'}}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  done: {fontSize: 17, fontWeight: '600'},
});
