import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import type {Task} from '../domain/task';
import {priorityLabels, statusLabels} from '../domain/taskLabels';
import {TaskBadge} from './TaskBadge';
import {formatTaskDate} from '../../../shared/utils/dateFormat';
import {spacing, useAppTheme} from '../../../shared/theme/theme';

export function TaskRow({task, onPress}: {task: Task; onPress: () => void}) {
  const {colors} = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${task.title}. Prioridad ${priorityLabels[task.priority]}. Estado ${statusLabels[task.status]}.`}
      accessibilityHint="Abre el detalle de la tarea"
      onPress={onPress}
      style={({pressed}) => [
        styles.container,
        {borderBottomColor: colors.divider, backgroundColor: pressed ? colors.surface : colors.background},
      ]}>
      <View style={styles.copy}>
        <Text style={[styles.title, {color: colors.text}]}>{task.title}</Text>
        <Text style={[styles.date, {color: colors.textSecondary}]}>
          {formatTaskDate(task.dueAt)}
        </Text>
        <View style={styles.badges}>
          <TaskBadge kind={{type: 'priority', value: task.priority}} />
          <TaskBadge kind={{type: 'status', value: task.status}} />
        </View>
      </View>
      <View style={[styles.chevron, {borderColor: colors.textSecondary}]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 112,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  copy: {flex: 1},
  title: {fontSize: 18, lineHeight: 23, fontWeight: '500', maxWidth: 560},
  date: {fontSize: 15, lineHeight: 20, marginTop: spacing.xs},
  badges: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm},
  chevron: {width: 11, height: 11, borderRightWidth: 2, borderTopWidth: 2, transform: [{rotate: '45deg'}], marginHorizontal: spacing.sm},
});
