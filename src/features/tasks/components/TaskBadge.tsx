import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import type {TaskPriority, TaskStatus} from '../domain/task';
import {priorityLabels, statusLabels} from '../domain/taskLabels';
import {radii, useAppTheme} from '../../../shared/theme/theme';

type BadgeKind =
  | {type: 'priority'; value: TaskPriority}
  | {type: 'status'; value: TaskStatus};

export function TaskBadge({kind}: {kind: BadgeKind}) {
  const {colors} = useAppTheme();
  const isPriority = kind.type === 'priority';
  const semanticValue = kind.value;
  const isHighOrPending =
    semanticValue === 'high' || semanticValue === 'pending';
  const isMediumOrProgress =
    semanticValue === 'medium' || semanticValue === 'inProgress';
  const foreground = isHighOrPending
    ? colors.accent
    : isMediumOrProgress
      ? colors.warning
      : colors.success;
  const background = isHighOrPending
    ? colors.accentSoft
    : isMediumOrProgress
      ? colors.warningSoft
      : colors.successSoft;
  const label = isPriority
    ? priorityLabels[kind.value as TaskPriority]
    : statusLabels[kind.value as TaskStatus];

  return (
    <View
      accessibilityLabel={`${isPriority ? 'Prioridad' : 'Estado'}: ${label}`}
      style={[styles.badge, {backgroundColor: background}]}>
      <View style={[styles.marker, {backgroundColor: foreground}]} />
      <Text numberOfLines={1} style={[styles.label, {color: foreground}]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 32,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radii.pill,
  },
  marker: {width: 7, height: 7, borderRadius: 4},
  label: {fontSize: 14, fontWeight: '600'},
});

