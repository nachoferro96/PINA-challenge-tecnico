import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {radii, spacing, useAppTheme} from '../../../shared/theme/theme';

type TaskScreenStateProps = {
  kind: 'empty' | 'error' | 'noResults';
  message?: string | null;
  onAction: () => void;
};

export function TaskScreenState({kind, message, onAction}: TaskScreenStateProps) {
  const {colors} = useAppTheme();
  const content = {
    empty: {
      title: 'Todavía no hay tareas',
      body: 'Cuando exista trabajo operativo, aparecerá organizado en esta lista.',
      action: 'Volver a cargar',
    },
    error: {
      title: 'No pudimos cargar las tareas',
      body: message ?? 'Revisá la conexión e intentá nuevamente.',
      action: 'Reintentar',
    },
    noResults: {
      title: 'No hay coincidencias',
      body: 'Probá con otra combinación de estado y prioridad.',
      action: 'Limpiar filtros',
    },
  }[kind];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: colors.text}]}>{content.title}</Text>
      <Text style={[styles.body, {color: colors.textSecondary}]}>{content.body}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onAction}
        style={({pressed}) => [styles.button, {backgroundColor: pressed ? colors.accentSoft : colors.accent}]}>
        <Text style={[styles.buttonText, {color: colors.background}]}>{content.action}</Text>
      </Pressable>
    </View>
  );
}

export function TaskLoadingState() {
  const {colors} = useAppTheme();
  return (
    <View accessibilityLabel="Cargando tareas" style={styles.loadingContainer}>
      {[0, 1, 2, 3, 4].map(index => (
        <View key={index} style={[styles.skeletonRow, {borderBottomColor: colors.divider}]}>
          <View style={[styles.skeletonTitle, {backgroundColor: colors.surfaceStrong}]} />
          <View style={[styles.skeletonMeta, {backgroundColor: colors.surface}]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: 80},
  title: {fontSize: 22, lineHeight: 28, fontWeight: '700', textAlign: 'center'},
  body: {fontSize: 16, lineHeight: 23, textAlign: 'center', marginTop: spacing.xs, maxWidth: 360},
  button: {minHeight: 48, justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: radii.md, marginTop: spacing.lg},
  buttonText: {fontSize: 16, fontWeight: '700'},
  loadingContainer: {paddingTop: spacing.sm},
  skeletonRow: {height: 104, justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth},
  skeletonTitle: {height: 20, width: '68%', borderRadius: 6},
  skeletonMeta: {height: 15, width: '34%', borderRadius: 5, marginTop: spacing.sm},
});
