import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../../../app/navigation/types';
import {spacing, useAppTheme} from '../../../shared/theme/theme';
import {formatLongTaskDate} from '../../../shared/utils/dateFormat';
import {TaskBadge} from '../components/TaskBadge';
import {useTasks} from '../state/TaskContext';
import {findTaskById} from '../state/taskSelectors';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export function TaskDetailScreen({route}: Props) {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const {state} = useTasks();
  const task = findTaskById(state.tasks, route.params.taskId);

  if (!task) {
    return (
      <View style={[styles.missing, {backgroundColor: colors.background}]}>
        <Text style={[styles.missingTitle, {color: colors.text}]}>Tarea no disponible</Text>
        <Text style={[styles.body, {color: colors.textSecondary}]}>La tarea ya no forma parte del conjunto cargado.</Text>
      </View>
    );
  }

  const details = [
    ['Área', task.area],
    ['Responsable', task.assignee],
    ['Vencimiento', formatLongTaskDate(task.dueAt)],
    ['Creada', formatLongTaskDate(task.createdAt)],
  ] as const;

  return (
    <ScrollView
      style={{backgroundColor: colors.background}}
      contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + spacing.xl}]}>
      <Text accessibilityRole="header" style={[styles.title, {color: colors.text}]}>
        {task.title}
      </Text>
      <View style={styles.badges}>
        <TaskBadge kind={{type: 'priority', value: task.priority}} />
        <TaskBadge kind={{type: 'status', value: task.status}} />
      </View>

      <Text style={[styles.sectionTitle, {color: colors.text}]}>Descripción</Text>
      <Text style={[styles.body, {color: colors.textSecondary}]}>{task.description}</Text>

      <View style={[styles.details, {borderTopColor: colors.divider}]}>
        {details.map(([label, value]) => (
          <View key={label} style={[styles.detailRow, {borderBottomColor: colors.divider}]}>
            <Text style={[styles.detailLabel, {color: colors.textSecondary}]}>{label}</Text>
            <Text style={[styles.detailValue, {color: colors.text}]}>{value}</Text>
          </View>
        ))}
      </View>
      <Text style={[styles.readOnly, {color: colors.textSecondary}]}>
        Vista de solo lectura · datos demostrativos
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.lg},
  title: {fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.5},
  badges: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md},
  sectionTitle: {fontSize: 20, fontWeight: '700', marginTop: spacing.xxl, marginBottom: spacing.xs},
  body: {fontSize: 17, lineHeight: 25},
  details: {marginTop: spacing.xl, borderTopWidth: StyleSheet.hairlineWidth},
  detailRow: {paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth},
  detailLabel: {fontSize: 14, marginBottom: spacing.xxs},
  detailValue: {fontSize: 17, lineHeight: 23},
  readOnly: {fontSize: 13, textAlign: 'center', marginTop: spacing.xl},
  missing: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl},
  missingTitle: {fontSize: 22, fontWeight: '700', marginBottom: spacing.xs},
});
