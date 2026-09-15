import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import type {TaskStatistics} from '../state/taskSelectors';
import {spacing, useAppTheme} from '../../../shared/theme/theme';

export function SummaryStrip({statistics}: {statistics: TaskStatistics}) {
  const {colors} = useAppTheme();
  const items = [
    {label: 'Pendientes', value: statistics.byStatus.pending, color: colors.accent},
    {
      label: 'En progreso',
      value: statistics.byStatus.inProgress,
      color: colors.warning,
    },
    {
      label: 'Completadas',
      value: statistics.byStatus.completed,
      color: colors.success,
    },
  ];

  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`${items[0].value} pendientes, ${items[1].value} en progreso y ${items[2].value} completadas`}
      style={styles.container}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 ? (
            <View style={[styles.divider, {backgroundColor: colors.divider}]} />
          ) : null}
          <View style={styles.item}>
            <Text style={[styles.value, {color: item.color}]}>{item.value}</Text>
            <Text style={[styles.label, {color: colors.textSecondary}]}>
              {item.label}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  item: {flex: 1, alignItems: 'center'},
  divider: {width: StyleSheet.hairlineWidth, marginVertical: 4},
  value: {fontSize: 34, lineHeight: 40, fontWeight: '700', fontVariant: ['tabular-nums']},
  label: {fontSize: 14, lineHeight: 20, textAlign: 'center'},
});
