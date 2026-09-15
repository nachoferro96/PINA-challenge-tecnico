import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {radii, spacing, useAppTheme} from '../../../shared/theme/theme';
import {useTasks} from '../state/TaskContext';

type StatRowProps = {label: string; value: number; total: number; color: string};

function StatRow({label, value, total, color}: StatRowProps) {
  const {colors} = useAppTheme();
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <View
      accessibilityLabel={`${label}: ${value} tareas, ${percentage} por ciento`}
      style={styles.statRow}>
      <View style={styles.statTopLine}>
        <Text style={[styles.statLabel, {color: colors.text}]}>{label}</Text>
        <Text style={[styles.statValue, {color: colors.text}]}>{value}</Text>
      </View>
      <View style={[styles.track, {backgroundColor: colors.surfaceStrong}]}>
        <View style={[styles.fill, {backgroundColor: color, width: `${percentage}%`}]} />
      </View>
      <Text style={[styles.percentage, {color: colors.textSecondary}]}>{percentage}% del total</Text>
    </View>
  );
}

export function TaskStatisticsScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const {state} = useTasks();
  const {statistics} = state;

  return (
    <ScrollView
      style={{backgroundColor: colors.background}}
      contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + spacing.xl}]}>
      <View style={[styles.totalRow, {borderBottomColor: colors.divider}]}>
        <Text style={[styles.totalValue, {color: colors.text}]}>{statistics.total}</Text>
        <Text style={[styles.totalLabel, {color: colors.textSecondary}]}>tareas en el conjunto actual</Text>
      </View>

      <Text accessibilityRole="header" style={[styles.sectionTitle, {color: colors.text}]}>Por estado</Text>
      <StatRow label="Pendientes" value={statistics.byStatus.pending} total={statistics.total} color={colors.accent} />
      <StatRow label="En progreso" value={statistics.byStatus.inProgress} total={statistics.total} color={colors.warning} />
      <StatRow label="Completadas" value={statistics.byStatus.completed} total={statistics.total} color={colors.success} />

      <Text accessibilityRole="header" style={[styles.sectionTitle, {color: colors.text}]}>Por prioridad</Text>
      <StatRow label="Alta" value={statistics.byPriority.high} total={statistics.total} color={colors.accent} />
      <StatRow label="Media" value={statistics.byPriority.medium} total={statistics.total} color={colors.warning} />
      <StatRow label="Baja" value={statistics.byPriority.low} total={statistics.total} color={colors.success} />

      <Text style={[styles.note, {color: colors.textSecondary}]}>
        Las estadísticas se calculan desde las tareas cargadas y no se almacenan por separado.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  totalRow: {paddingVertical: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth},
  totalValue: {fontSize: 52, lineHeight: 58, fontWeight: '800', fontVariant: ['tabular-nums']},
  totalLabel: {fontSize: 17, marginTop: spacing.xxs},
  sectionTitle: {fontSize: 22, fontWeight: '700', marginTop: spacing.xxl, marginBottom: spacing.sm},
  statRow: {marginTop: spacing.md},
  statTopLine: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'},
  statLabel: {fontSize: 17, fontWeight: '600'},
  statValue: {fontSize: 20, fontWeight: '700', fontVariant: ['tabular-nums']},
  track: {height: 9, borderRadius: radii.pill, overflow: 'hidden', marginTop: spacing.xs},
  fill: {height: '100%', borderRadius: radii.pill},
  percentage: {fontSize: 13, marginTop: spacing.xxs},
  note: {fontSize: 14, lineHeight: 20, marginTop: spacing.xxl},
});
