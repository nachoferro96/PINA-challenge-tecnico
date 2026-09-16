import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {radii, spacing, useAppTheme} from '../../../shared/theme/theme';

type Props = Readonly<{
  value: string;
  onChange: (value: string) => void;
}>;

export function SearchControl({value, onChange}: Props) {
  const {colors} = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.caption, {color: colors.textSecondary}]}>Buscar</Text>
      <View style={styles.row}>
        <TextInput
          accessibilityLabel="Buscar tareas"
          accessibilityHint="Busca por título, área o responsable"
          autoCorrect={false}
          clearButtonMode="while-editing"
          onChangeText={onChange}
          placeholder="Título, área o responsable"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          selectionColor={colors.accent}
          style={[
            styles.input,
            {backgroundColor: colors.surface, color: colors.text},
          ]}
          value={value}
        />
        {Platform.OS !== 'ios' && value ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => onChange('')}
            style={({pressed}) => [
              styles.clearButton,
              pressed && {backgroundColor: colors.accentSoft},
            ]}>
            <Text style={[styles.clearLabel, {color: colors.accent}]}>Limpiar</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginBottom: spacing.md},
  caption: {fontSize: 15, marginBottom: spacing.xs},
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  input: {
    flex: 1,
    minHeight: 52,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    fontSize: 17,
  },
  clearButton: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  clearLabel: {fontSize: 16, fontWeight: '600'},
});
