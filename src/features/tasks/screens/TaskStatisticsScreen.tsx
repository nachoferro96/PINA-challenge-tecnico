import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
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

type FeedbackProps = Readonly<{
  kind: 'error' | 'empty';
  message?: string | null;
  onAction: () => void;
}>;

function StatisticsFeedback({kind, message, onAction}: FeedbackProps) {
  const {colors} = useAppTheme();
  const content =
    kind === 'error'
      ? {
          title: 'No pudimos calcular las estadísticas',
          body:
            message ??
            'Las tareas no se cargaron correctamente. Intentá nuevamente.',
          action: 'Reintentar',
        }
      : {
          title: 'No hay tareas para analizar',
          body: 'Cuando haya tareas cargadas, vas a ver su distribución por estado y prioridad.',
          action: 'Volver a cargar',
        };
  return (
    <View style={styles.feedback}>
      <Text accessibilityRole="header" style={[styles.feedbackTitle, {color: colors.text}]}>
        {content.title}
      </Text>
      <Text style={[styles.feedbackBody, {color: colors.textSecondary}]}>
        {content.body}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onAction}
        style={({pressed}) => [
          styles.feedbackButton,
          {backgroundColor: pressed ? colors.accentSoft : colors.accent},
        ]}>
        <Text style={[styles.feedbackButtonText, {color: colors.background}]}>
          {content.action}
        </Text>
      </Pressable>
    </View>
  );
}

function StatisticsLoadingState() {
  const {colors} = useAppTheme();

  return (
    <View accessibilityLabel="Cargando estadísticas" style={styles.loading}>
      <View style={[styles.loadingTotal, {backgroundColor: colors.surfaceStrong}]} />
      <View style={[styles.loadingLabel, {backgroundColor: colors.surface}]} />
      {[0, 1].map(section => (
        <View key={section} style={styles.loadingSection}>
          <View style={[styles.loadingHeading, {backgroundColor: colors.surfaceStrong}]} />
          {[0, 1, 2].map(row => (
            <View key={row} style={styles.loadingRow}>
              <View style={styles.loadingRowTop}>
                <View style={[styles.loadingName, {backgroundColor: colors.surface}]} />
                <View style={[styles.loadingValue, {backgroundColor: colors.surfaceStrong}]} />
              </View>
              <View style={[styles.loadingTrack, {backgroundColor: colors.surface}]} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export function TaskStatisticsScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const {state, reload} = useTasks();
  const {statistics} = state;

  let content: React.ReactNode;

  if (state.loadStatus === 'idle' || state.loadStatus === 'loading') {
    content = <StatisticsLoadingState />;
  } else if (state.loadStatus === 'error') {
    content = (
      <StatisticsFeedback
        kind="error"
        message={state.errorMessage}
        onAction={reload}
      />
    );
  } else if (state.tasks.length === 0) {
    content = <StatisticsFeedback kind="empty" onAction={reload} />;
  } else {
    content = (
      <>
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

        <Text style={[styles.note, {color: colors.textSecondary}]}>Las estadísticas se calculan desde las tareas cargadas y no se almacenan por separado.</Text>
      </>
    );
  }

  return (
    <ScrollView
      style={{backgroundColor: colors.background}}
      contentContainerStyle={[styles.content, {paddingBottom: insets.bottom + spacing.xl}]}>
      {content}
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
  feedback: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 470,
    paddingHorizontal: spacing.lg,
  },
  feedbackTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  feedbackBody: {
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    maxWidth: 340,
    marginTop: spacing.xs,
  },
  feedbackButton: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    marginTop: spacing.lg,
  },
  feedbackButtonText: {fontSize: 16, fontWeight: '700'},
  loading: {paddingTop: spacing.lg},
  loadingTotal: {width: 84, height: 58, borderRadius: radii.sm},
  loadingLabel: {width: 210, height: 20, borderRadius: 6, marginTop: spacing.xs},
  loadingSection: {marginTop: spacing.xxl},
  loadingHeading: {width: 132, height: 26, borderRadius: 7},
  loadingRow: {marginTop: spacing.lg},
  loadingRowTop: {flexDirection: 'row', justifyContent: 'space-between'},
  loadingName: {width: 116, height: 20, borderRadius: 6},
  loadingValue: {width: 26, height: 24, borderRadius: 6},
  loadingTrack: {height: 9, borderRadius: radii.pill, marginTop: spacing.xs},
});
