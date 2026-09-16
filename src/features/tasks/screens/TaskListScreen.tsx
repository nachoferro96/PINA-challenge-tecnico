import React, {useState} from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../../../app/navigation/types';
import type {MockScenario} from '../data/MockTaskRepository';
import type {TaskPriority, TaskStatus} from '../domain/task';
import {priorityLabels, statusLabels} from '../domain/taskLabels';
import {FilterControl} from '../components/FilterControl';
import {SummaryStrip} from '../components/SummaryStrip';
import {TaskRow} from '../components/TaskRow';
import {TaskLoadingState, TaskScreenState} from '../components/TaskScreenState';
import {useTasks} from '../state/TaskContext';
import {radii, spacing, useAppTheme} from '../../../shared/theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Tasks'> & {
  scenario: MockScenario;
  onScenarioChange: (scenario: MockScenario) => void;
};

const statusOptions: readonly {value: TaskStatus | 'all'; label: string}[] = [
  {value: 'all', label: 'Todos'},
  ...(['pending', 'in_progress', 'done'] as const).map(value => ({
    value,
    label: statusLabels[value],
  })),
];

const priorityOptions: readonly {value: TaskPriority | 'all'; label: string}[] = [
  {value: 'all', label: 'Todas'},
  ...(['low', 'medium', 'high'] as const).map(value => ({
    value,
    label: priorityLabels[value],
  })),
];

export function TaskListScreen({
  navigation,
  scenario,
  onScenarioChange,
}: Props) {
  const insets = useSafeAreaInsets();
  const {fontScale} = useWindowDimensions();
  const {colors} = useAppTheme();
  const {state, reload, setStatusFilter, setPriorityFilter, clearFilters} =
    useTasks();
  const [showDemoControls, setShowDemoControls] = useState(false);
  const colorStyles = StyleSheet.create({scenarioLabel: {color: colors.text}});
  const isLoading = state.loadStatus === 'loading';
  const filtersAreActive =
    state.filters.status !== 'all' || state.filters.priority !== 'all';

  const header = (
    <View>
      <View style={styles.topRow}>
        <View>
          {Platform.OS === 'android' ? (
            <Text accessibilityRole="header" style={[styles.heading, {color: colors.text}]}>
              Tareas
            </Text>
          ) : null}
          <Text style={[styles.taskCount, {color: colors.textSecondary}]}>
            {state.statistics.total} tareas
          </Text>
        </View>
        {Platform.OS === 'android' ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('Statistics')}
            style={({pressed}) => [styles.textButton, pressed && {backgroundColor: colors.accentSoft}]}>
            <Text style={[styles.textButtonLabel, {color: colors.accent}]}>Estadísticas</Text>
          </Pressable>
        ) : null}
      </View>

      <SummaryStrip statistics={state.statistics} />

      <View style={[styles.filters, fontScale >= 1.2 && styles.filtersLargeText]}>
        <View style={[styles.filterSlot, fontScale >= 1.2 && styles.filterSlotLargeText]}>
          <FilterControl
            label="Estado"
            value={state.filters.status}
            options={statusOptions}
            onChange={setStatusFilter}
          />
        </View>
        <View style={[styles.filterSlot, fontScale >= 1.2 && styles.filterSlotLargeText]}>
          <FilterControl
            label="Prioridad"
            value={state.filters.priority}
            options={priorityOptions}
            onChange={setPriorityFilter}
          />
        </View>
      </View>

      {__DEV__ ? (
        <View style={styles.demoArea}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowDemoControls(current => !current)}
            hitSlop={10}>
            <Text style={[styles.demoToggle, {color: colors.textSecondary}]}>
              {showDemoControls ? 'Ocultar escenarios' : 'Probar estados de la interfaz'}
            </Text>
          </Pressable>
          {showDemoControls ? (
            <View style={styles.scenarios}>
              {(['normal', 'loading', 'empty', 'error'] as const).map(value => (
                <Pressable
                  key={value}
                  accessibilityRole="radio"
                  accessibilityState={{checked: scenario === value}}
                  onPress={() => onScenarioChange(value)}
                  style={({pressed}) => [
                    styles.scenarioButton,
                    {
                      backgroundColor:
                        scenario === value ? colors.accent : pressed ? colors.surfaceStrong : colors.surface,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.scenarioLabel,
                      scenario === value
                        ? styles.selectedScenarioLabel
                        : colorStyles.scenarioLabel,
                    ]}>
                    {
                      {
                        normal: 'Normal',
                        loading: 'Carga',
                        empty: 'Vacío',
                        error: 'Error',
                      }[value]
                    }
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      style={{backgroundColor: colors.background}}
      contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : 'never'}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Platform.OS === 'ios' ? spacing.md : insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
      data={isLoading || state.loadStatus === 'idle' ? [] : state.filteredTasks}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <TaskRow
          task={item}
          onPress={() => navigation.navigate('TaskDetail', {taskId: item.id})}
        />
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={
        isLoading || state.loadStatus === 'idle' ? (
          <TaskLoadingState />
        ) : state.loadStatus === 'error' ? (
          <TaskScreenState kind="error" message={state.errorMessage} onAction={reload} />
        ) : state.tasks.length === 0 ? (
          <TaskScreenState kind="empty" onAction={reload} />
        ) : filtersAreActive ? (
          <TaskScreenState kind="noResults" onAction={clearFilters} />
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={reload}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {paddingHorizontal: spacing.lg, flexGrow: 1},
  topRow: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md},
  heading: {fontSize: 28, lineHeight: 36, fontWeight: '700', letterSpacing: -0.4},
  taskCount: {fontSize: 17, marginTop: spacing.xxs},
  textButton: {minHeight: 48, justifyContent: 'center', paddingHorizontal: spacing.sm, borderRadius: radii.sm},
  textButtonLabel: {fontSize: 16, fontWeight: '600'},
  filters: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md},
  filtersLargeText: {flexDirection: 'column'},
  filterSlot: {flex: 1},
  filterSlotLargeText: {flex: 0, width: '100%'},
  demoArea: {alignItems: 'flex-start', marginBottom: spacing.md},
  demoToggle: {fontSize: 14, textDecorationLine: 'underline'},
  scenarios: {flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm},
  scenarioButton: {minHeight: 48, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radii.pill},
  scenarioLabel: {fontWeight: '600'},
  selectedScenarioLabel: {color: '#FFFFFF'},
});
